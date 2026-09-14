
public class Connection {
    private final String lineColour;
    private final String destination;
    private final double time; // time taken to get from station to destination

    // constructor
    public Connection(String lineColour, String destination, double time){
        this.lineColour = lineColour;
        this.destination = destination;
        this.time = time;
    }

    // getters
    public String getLineColour(){ return lineColour; }
    public String getDestination(){ return destination; }
    public double getTime(){ return time; }
}



