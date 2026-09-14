## Getting Started

This is a website that you can run that you can plug any .csv file into given its in the correct format

I've attached a test .csv file for Manchester's Trains but it can be whatever you want

It'll work out either the quickest path or least changeovers depending on what button you press in the UI

It comes with:
    - a proper UI menu
    - a dropdown menu when typing in stations
    - auto complete feature for the stations
    - the result is condensed via the train routes but can be expanded upon click
    - data validation methods 


## Running the Server

Open up Train App/src/Server.java and run that file 

You should see an output of:

Stations loaded: 99       
Server running at http://localhost:8080

-> (99 is the amount of stations in my testfile so if you upload your own it could be different)


## Using your own .csv file

Just upload the file into the same location

Change line 18 in Main.java 'File file = new File("Metrolink_times_linecolour.csv");' to the new file name youve added