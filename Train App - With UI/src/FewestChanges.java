import java.util.Comparator;
import java.util.HashMap;
import java.util.PriorityQueue;

public class FewestChanges {

    static HashMap<String, Double> FCTotalTime = new HashMap<>(); // total time to get here
    static HashMap<String, String> FCPrevStation = new HashMap<>(); // previous station name
    static HashMap<String, String> FCPrevLineColour = new HashMap<>(); // colour of the line to get here
    static HashMap<String, Integer> FCTotalChanges = new HashMap<>(); // total changes to get here
    
    static public String print(StringBuilder sb, String currentStation) {
        sb.append("*** Fewest Changes *** \n");
        printRecursion(sb, currentStation, "");
        sb.append("Overall Journey Time (mins): ").append(String.valueOf(FCTotalTime.get(currentStation))).append("\n");
        sb.append("Total Changes: ").append((FCTotalChanges.get(currentStation))).append("\n");
        return sb.toString();
    }
    
    static private void printRecursion(StringBuilder sb, String currentStation, String lineUsedByChild) {
        String stationName = currentStation.split("\\|")[0]; // get station name from station|line
        // find the station we came from
        String prevStation = FCPrevStation.get(currentStation);
        // find the line we used to arrive at this current station
        String arrivedOn = FCPrevLineColour.get(currentStation);

        // keep diving back until we hit the start of the path
        if (!prevStation.equals("None")){
            // pass our arrival line back so the previous station knows its "leaving" line
            printRecursion(sb, prevStation, arrivedOn);
        }

        //unravelling begins
        // if there's no arrival line, we are at the very beginning (Victoria)
        if (arrivedOn.equals("None")) {
            sb.append(stationName).append(" on the ").append(lineUsedByChild).append("\n");
        }
        // if the line we arrived on is different to the line the next station needs, it's a transfer!
        else if (!lineUsedByChild.equals("") && !arrivedOn.equals(lineUsedByChild)) {
            sb.append(currentStation).append(" on the ").append(arrivedOn).append("\n");
            sb.append("** Change line to ").append(lineUsedByChild).append(" *** \n");
            sb.append(stationName).append(" on the ").append(lineUsedByChild).append("\n");
        }
        // otherwise just a normal station or the final destination
        else {
            sb.append(stationName).append(" on the ").append(arrivedOn).append("\n");
        }
    }

    // new way of storing values within the priority queue
    private static String makeKey(String station, String line) {
        return station + "|" + line;
    }

    static public String run(String sourceStation, String destinationStation, HashMap<String, Station> allStations) {
        StringBuilder sb = new StringBuilder("");
        String bestKey = null; 

        // ** initialise all hashmaps

        // clear all hashmaps of previous data
        FCTotalTime.clear();
        FCPrevStation.clear();
        FCPrevLineColour.clear();
        FCTotalChanges.clear();
        
        // create priority queue
        // it stores the station name as a string but then uses the string to search in the hashmap for its total changes and sorts it through that
        // stored as "station|line" for each item in the queue
        // storing like this allows me to use multiple routes from the same station to stop them being overwritten from same changes but slower even though later on it wouldve had less changes
        PriorityQueue<String> priorityQueue = new PriorityQueue<>(new Comparator<String>() {
            @Override
            public int compare(String station1, String station2) {
                int changeCompare = Integer.compare(FCTotalChanges.getOrDefault(station1, Integer.MAX_VALUE), FCTotalChanges.getOrDefault(station2, Integer.MAX_VALUE)); // compares the times in the hashmaps wth each other
                // if changeCompare != 0 , meaning they are different, retun changecompare
                if (changeCompare != 0) { return changeCompare; }
                // else compare via the time to sort by quickest time
                else{ return Double.compare(FCTotalTime.getOrDefault(station1, Double.POSITIVE_INFINITY), FCTotalTime.getOrDefault(station2, Double.POSITIVE_INFINITY)); }
            }
        });

        // initilaise start node
        String startKey = makeKey(sourceStation, "None");
        FCTotalTime.put(startKey, 0.0);
        FCTotalChanges.put(startKey, 0);
        FCPrevStation.put(startKey, "None");
        FCPrevLineColour.put(startKey, "None");
        priorityQueue.add(startKey);
        
        //infinite loop until destination is found or priority queue is empty 
        while (!priorityQueue.isEmpty()){
            
            // ** breaking down the key
            String currentKey = priorityQueue.poll();
            String[] parts = currentKey.split("\\|");
            String currentStation = parts[0];
            String arrivalLine = parts[1];   

            // break out of the while the polled station is the destination
            // destination cant be polled off pq unless all other stations with smaller total changes are searched
            if (currentStation.equals(destinationStation)){
                // if we havent found the best route yet, this is the next best route
                if (bestKey == null) {
                    bestKey = currentKey;  
                // else compare the two routes found to see which one is better     
                } else {
                    int currentChanges = FCTotalChanges.get(currentKey);
                    int bestChanges = FCTotalChanges.get(bestKey);

                    if (currentChanges < bestChanges) {
                        bestKey = currentKey;
                    } 
                    else if (currentChanges == bestChanges) {
                        double currentTime = FCTotalTime.get(currentKey);
                        double bestTime = FCTotalTime.get(bestKey);

                        if (currentTime < bestTime) {
                            bestKey = currentKey;
                        }
                    }
                }
            }
            else {
                // for every connection, update its values with how to get there in the hashmap table
                for (Connection connection : allStations.get(currentStation).getConnections()) {
                    String nextStation = connection.getDestination();
                    String departingLine = connection.getLineColour();
                    String nextKey = makeKey(nextStation, departingLine);
                    double newTime;
                    int newTotalChanges;

                    // ** detecting a changeover
                    // are the lines not the start line and not the same? if yes then a change happened
                    if (!arrivalLine.equals("None") && !departingLine.equals(arrivalLine)) {
                        newTime = FCTotalTime.get(currentKey) + connection.getTime() + 2; // work out new time for next station: time to get here + connection time + 2 min change over penalty
                        newTotalChanges = FCTotalChanges.get(currentKey) + 1; // work out next stations total changes
                    }
                    else{
                        newTime = FCTotalTime.get(currentKey) + connection.getTime();
                        newTotalChanges = FCTotalChanges.get(currentKey);
                    }

                    // ** updating values of next station hashmaps if they have less changeovers
                    // we only add the station IF its better and needs relooking into
                    if (newTotalChanges<FCTotalChanges.getOrDefault(nextKey, Integer.MAX_VALUE)){ 
                        FCTotalTime.put(nextKey, newTime); 
                        FCPrevStation.put(nextKey, currentKey); 
                        FCPrevLineColour.put(nextKey, departingLine);  
                        FCTotalChanges.put(nextKey, newTotalChanges); 
                        priorityQueue.add(nextKey); 
                    }
                    // ** updating values of next station hashmaps if they have equal changeovers but a faster time
                    else if (newTotalChanges == FCTotalChanges.getOrDefault(nextKey, Integer.MAX_VALUE) && newTime < FCTotalTime.getOrDefault(nextKey, Double.POSITIVE_INFINITY)){ 
                        FCTotalTime.put(nextKey, newTime); 
                        FCPrevStation.put(nextKey, currentKey); 
                        FCPrevLineColour.put(nextKey, departingLine);  
                        FCTotalChanges.put(nextKey, newTotalChanges);
                        priorityQueue.add(nextKey);  
                    }

                    
                }
            }
        }
        if (bestKey == null) { return "Route Not Found"; }
        else { return print(sb, bestKey); }
    }
}