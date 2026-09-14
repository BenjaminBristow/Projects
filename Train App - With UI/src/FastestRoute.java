import java.util.Comparator;
import java.util.HashMap;
import java.util.PriorityQueue;

public class FastestRoute {

    static HashMap<String, Double> FRTotalTime = new HashMap<>(); // total time to get here
    static HashMap<String, String> FRPrevStation = new HashMap<>(); // previous station name
    static HashMap<String, String> FRPrevLineColour = new HashMap<>(); // colour of the line to get here
    static int totalChanges;

    // new way of storing values within the priority queue (station|line so we can track state properly)
    private static String makeKey(String station, String line) {
        return station + "|" + line;
    }

    static public String print(StringBuilder sb, String currentKey) {
        totalChanges = 0;
        sb.append("*** Fastest Route *** \n");

        // recursively rebuild path backwards from destination (bit messy but works lol)
        printRecursion(sb, currentKey, "");

        sb.append("Overall Journey Time (mins): ").append(FRTotalTime.get(currentKey)).append("\n");
        sb.append("Total Changes: ").append(totalChanges).append("\n");

        return sb.toString();
    }

    static private void printRecursion(StringBuilder sb, String currentKey, String lineUsedByChild) {

        String stationName = currentKey.split("\\|")[0]; // just station name (ignore line part)

        // where did we come from to get here
        String prevKey = FRPrevStation.get(currentKey);
        String arrivedOn = FRPrevLineColour.get(currentKey);

        // keep going back until we hit start node
        if (!prevKey.equals("None")) {
            printRecursion(sb, prevKey, arrivedOn);
        }

        // first station in path (start of journey)
        if (arrivedOn.equals("None")) {
            sb.append(stationName).append(" on the ").append(lineUsedByChild).append("\n");
        }
        // if line changes between steps then we print a changeover message
        else if (!lineUsedByChild.equals("") && !arrivedOn.equals(lineUsedByChild)) {
            sb.append(stationName).append(" on the ").append(arrivedOn).append("\n");
            sb.append("** Change line to ").append(lineUsedByChild).append(" *** \n");
            sb.append(stationName).append(" on the ").append(lineUsedByChild).append("\n");
            totalChanges += 1;
        }
        // normal step, just continue same line
        else {
            sb.append(stationName).append(" on the ").append(arrivedOn).append("\n");
        }
    }

    static public String run(String sourceStation, String destinationStation,
                             HashMap<String, Station> allStations) {

        // clear everything so old runs don’t mess with new ones (this one used to annoy me a lot lol)
        FRTotalTime.clear();
        FRPrevStation.clear();
        FRPrevLineColour.clear();

        // priority queue sorted by fastest total time so far
        PriorityQueue<String> priorityQueue = new PriorityQueue<>(new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                return Double.compare(
                        FRTotalTime.getOrDefault(a, Double.POSITIVE_INFINITY),
                        FRTotalTime.getOrDefault(b, Double.POSITIVE_INFINITY)
                );
            }
        });

        // initialise start node (no line yet so "None")
        String startKey = makeKey(sourceStation, "None");

        FRTotalTime.put(startKey, 0.0);
        FRPrevStation.put(startKey, "None");
        FRPrevLineColour.put(startKey, "None");

        priorityQueue.add(startKey);

        // main loop (classic Dijkstra vibe)
        while (!priorityQueue.isEmpty()) {

            String currentKey = priorityQueue.poll();
            System.out.println(currentKey);
            String[] parts = currentKey.split("\\|");
            String currentStation = parts[0];
            String arrivalLine = parts[1];

            // if we hit destination we can stop early (Dijkstra guarantees this is optimal)
            if (currentStation.equals(destinationStation)) {
                StringBuilder sb = new StringBuilder("");
                return print(sb, currentKey);
            }

            // look at all connections from current station
            for (Connection connection : allStations.get(currentStation).getConnections()) {

                String nextStation = connection.getDestination();
                String departingLine = connection.getLineColour();

                String nextKey = makeKey(nextStation, departingLine);

                // base time = time so far + travel time
                double newTime = FRTotalTime.getOrDefault(currentKey, Double.POSITIVE_INFINITY) + connection.getTime();

                // if we switch lines, add small penalty (represents awkward changeover time)
                if (!arrivalLine.equals("None") && !arrivalLine.equals(departingLine)) {
                    newTime += 2;
                }

                // only update if we found a better (faster) route to this state
                if (newTime < FRTotalTime.getOrDefault(nextKey, Double.POSITIVE_INFINITY)) {

                    FRTotalTime.put(nextKey, newTime);
                    FRPrevStation.put(nextKey, currentKey);
                    FRPrevLineColour.put(nextKey, departingLine);

                    priorityQueue.add(nextKey); // re-check this path later if needed
                }
            }
        }

        // if we get here something went wrong or no route exists
        return "No Route Found";
    }
}