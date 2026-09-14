import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;

import java.net.InetSocketAddress;

import java.util.HashMap;
import java.util.Scanner;


public class Server {

    // Store all of the stations loaded from the CSV.
    // This can be accessed by every method in this class.
    private static HashMap<String, Station> allStations;


    public static void main(String[] args) throws IOException {

        // --------------------------------------------------
        // LOAD ALL STATIONS
        // --------------------------------------------------

        allStations =
            new HashMap<String, Station>();


        String lineColour = "None";


        // Open the CSV file.
        File file =
            new File("Metrolink_times_linecolour.csv");


        try (Scanner scanner = new Scanner(file)) {

            // Skip the header row.
            scanner.nextLine();


            while (scanner.hasNextLine()) {

                // Read one row.
                String line =
                    scanner.nextLine();


                // Split the row using commas.
                String[] data =
                    line.split(",");


                // Some rows only contain a line colour.
                if (data.length < 3) {

                    lineColour =
                        data[0].trim();
                }


                // Otherwise this row contains
                // a station connection.
                else {

                    String source =
                        data[0].trim().toLowerCase();


                    String destination =
                        data[1].trim().toLowerCase();


                    double time =
                        Double.parseDouble(
                            data[2].trim()
                        );


                    // Create the source station if
                    // it doesn't already exist.
                    if (!allStations.containsKey(source)) {

                        allStations.put(
                            source,
                            new Station(source)
                        );
                    }


                    // Create the destination station if
                    // it doesn't already exist.
                    if (!allStations.containsKey(destination)) {

                        allStations.put(
                            destination,
                            new Station(destination)
                        );
                    }


                    // Add the connection from source
                    // to destination.
                    allStations
                        .get(source)
                        .addConnection(
                            lineColour,
                            destination,
                            time
                        );


                    // Add the connection in the opposite
                    // direction as well.
                    allStations
                        .get(destination)
                        .addConnection(
                            lineColour,
                            source,
                            time
                        );
                }
            }

        } catch (FileNotFoundException e) {

            System.out.println(
                "Could not find the CSV file."
            );
        }


        // Tell us how many stations were loaded.
        System.out.println(
            "Stations loaded: " +
            allStations.size()
        );


        // --------------------------------------------------
        // CREATE WEB SERVER
        // --------------------------------------------------

        HttpServer server =
            HttpServer.create(
                new InetSocketAddress(8080),
                0
            );


        // --------------------------------------------------
        // TEST ENDPOINT
        // --------------------------------------------------

        server.createContext(
            "/test",
            Server::handleTest
        );


        // --------------------------------------------------
        // FASTEST ROUTE ENDPOINT
        // --------------------------------------------------

        server.createContext(
            "/fastest-route",
            Server::handleFastestRoute
        );


        // --------------------------------------------------
        // FEWEST CHANGES ENDPOINT
        // --------------------------------------------------

        server.createContext(
            "/fewest-changes",
            Server::handleFewestChanges
        );

        // --------------------------------------------------
        // STATIONS ENDPOINT
        // --------------------------------------------------

        server.createContext(
            "/stations",
            Server::handleStations
        );


        // Start the server.
        server.start();


        System.out.println(
            "Server running at http://localhost:8080"
        );
    }


    // ======================================================
    // TEST ENDPOINT
    // ======================================================

    private static void handleTest(
        HttpExchange exchange
    ) throws IOException {

        String response =
            "Java server is working!";


        // Allow the website to communicate
        // with the Java server.
        exchange.getResponseHeaders().add(
            "Access-Control-Allow-Origin",
            "*"
        );


        exchange.sendResponseHeaders(
            200,
            response.getBytes().length
        );


        OutputStream output =
            exchange.getResponseBody();


        output.write(
            response.getBytes()
        );


        output.close();
    }


    // ======================================================
    // FASTEST ROUTE ENDPOINT
    // ======================================================

    private static void handleFastestRoute(
        HttpExchange exchange
    ) throws IOException {

        System.out.println(
            "FASTEST ROUTE REQUEST RECEIVED"
        );


        // Get the query from the URL.
        //
        // Example:
        //
        // ?start=altrincham&destination=piccadilly%20station
        String query =
            exchange.getRequestURI().getQuery();


        // Split the query into:
        //
        // start=altrincham
        // destination=piccadilly station
        String[] parts =
            query.split("&");


        String sourceStation =
            parts[0].split("=")[1];


        String destinationStation =
            parts[1].split("=")[1];


        System.out.println(
            "Start: " + sourceStation
        );


        System.out.println(
            "Destination: " + destinationStation
        );


        // Check that the starting station exists.
        System.out.println(
            "Connections from " +
            sourceStation +
            ": " +
            allStations
                .get(sourceStation)
                .getConnections()
                .size()
        );


        // Run the existing fastest route algorithm.
        String response =
            FastestRoute.run(
                sourceStation,
                destinationStation,
                allStations
            );


        // Allow the website to communicate
        // with the Java server.
        exchange.getResponseHeaders().add(
            "Access-Control-Allow-Origin",
            "*"
        );


        exchange.sendResponseHeaders(
            200,
            response.getBytes().length
        );


        OutputStream output =
            exchange.getResponseBody();


        output.write(
            response.getBytes()
        );


        output.close();
    }


    // ======================================================
    // FEWEST CHANGES ENDPOINT
    // ======================================================

    private static void handleFewestChanges(
        HttpExchange exchange
    ) throws IOException {

        System.out.println(
            "FEWEST CHANGES REQUEST RECEIVED"
        );


        // Get the query from the URL.
        //
        // Example:
        //
        // ?start=altrincham&destination=piccadilly%20station
        String query =
            exchange.getRequestURI().getQuery();


        // Split the query into:
        //
        // start=altrincham
        // destination=piccadilly station
        String[] parts =
            query.split("&");


        String sourceStation =
            parts[0].split("=")[1];


        String destinationStation =
            parts[1].split("=")[1];


        System.out.println(
            "Start: " + sourceStation
        );


        System.out.println(
            "Destination: " + destinationStation
        );


        // Check that the starting station exists.
        System.out.println(
            "Connections from " +
            sourceStation +
            ": " +
            allStations
                .get(sourceStation)
                .getConnections()
                .size()
        );


        // Run the existing FewestChanges algorithm.
        //
        // We are not changing the algorithm.
        // We are simply passing the station names
        // and station data into it.
        String response =
            FewestChanges.run(
                sourceStation,
                destinationStation,
                allStations
            );


        // Allow the website to communicate
        // with the Java server.
        exchange.getResponseHeaders().add(
            "Access-Control-Allow-Origin",
            "*"
        );


        exchange.sendResponseHeaders(
            200,
            response.getBytes().length
        );


        OutputStream output =
            exchange.getResponseBody();


        output.write(
            response.getBytes()
        );


        output.close();
    }

    // ======================================================
// STATIONS ENDPOINT
// ======================================================

private static void handleStations(
    HttpExchange exchange
) throws IOException {

    // Build a list of all station names.
    StringBuilder response =
        new StringBuilder();

    for (String stationName : allStations.keySet()) {

        response
            .append(stationName)
            .append("\n");
    }


    // Allow the website to communicate
    // with the Java server.
    exchange.getResponseHeaders().add(
        "Access-Control-Allow-Origin",
        "*"
    );


    String responseText =
        response.toString();


    exchange.sendResponseHeaders(
        200,
        responseText.getBytes().length
    );


    OutputStream output =
        exchange.getResponseBody();


    output.write(
        responseText.getBytes()
    );


    output.close();
    }
}

