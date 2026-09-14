import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) throws Exception {

        // ***** CREATING THE TREE *****
        
        // list of all stations
        HashMap<String, Station> allStations = new HashMap<String, Station>();
        
        // line colour that the loop is on when creating all objects
        String lineColour = "None";

        File file = new File("Metrolink_times_linecolour.csv"); //open file
        
        // ***** Open file and create objects of all stations and connections *****
        try (Scanner scanner = new Scanner(file)) { // make sure file path exists
            scanner.nextLine(); // skips the "From ,To ,Time (mins)" line
            while (scanner.hasNextLine()) { // make sure file isnt empty
                String line = scanner.nextLine(); // variable line gets set to the new line
                String[] data = line.split(","); // split line at comma for individual data

                if (data.length<3){ // if length of data = 1, must be colour
                    lineColour = data[0].trim();
                }
                else{ // else must be a station so create instances
                    String source = data[0].trim().toLowerCase();
                    String destination = data[1].trim().toLowerCase();
                    double time = Double.parseDouble(data[2].trim());

                    // if not in AllStations, add Station to AllStations and create object
                    // also check to make sure objects exist before creating a connection
                    if (!allStations.containsKey(source)){ 
                        allStations.put(source, new Station(source));
                    }
                    if (!allStations.containsKey(destination)){ 
                        allStations.put(destination, new Station(destination));
                    }
                    
                    // create connections both ways
                    allStations.get(source).addConnection(lineColour, destination, time); // link source -> destination
                    allStations.get(destination).addConnection(lineColour, source, time); // link destination -> source
                }
                

                     
            }
                
        //if file path does not exist throw an exception
        } catch (FileNotFoundException e) { 
            System.out.println("An error occurred.");
        }
    }
}
