import java.util.ArrayList;
import java.util.List;



public class Station {
    private final String name; // name of station
    private final ArrayList<Connection> connections; // list of connections the station has

    // constructor
    public Station(String name){
        this.name = name;
        this.connections = new ArrayList<>();
    }

    // getters
    public String getName(){ return name; }
    public List<Connection> getConnections(){ return this.connections; }
    

    //add a connection between the two 
    public void addConnection(String lineColour, String destination, double time){
        this.connections.add(new Connection(lineColour, destination, time));
    }
    
}