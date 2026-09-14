const fastestButton =
    document.getElementById("fastestButton");

const changesButton =
    document.getElementById("changesButton");

const startInput =
    document.getElementById("start");

const destinationInput =
    document.getElementById("destination");

const result =
    document.getElementById("result");


// ======================================================
// STATIONS
// ======================================================

let stations = [];


// Get the station list from Java.
async function loadStations() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/stations"
            );


        const data =
            await response.text();


        // Turn the response into an array.
        stations =
            data
                .split("\n")
                .map(function(station) {
                    return station.trim();
                })
                .filter(function(station) {
                    return station !== "";
                })
                .sort();


        console.log(
            "Stations loaded:",
            stations
        );

    } catch (error) {

        console.error(
            "Could not load stations:",
            error
        );
    }
}


// Load the stations when the page starts.
loadStations();


// ======================================================
// STATION SUGGESTIONS
// ======================================================

function showSuggestions(input) {

    // Remove any old suggestion box.
    const oldSuggestions =
        document.querySelector(
            ".station-suggestions"
        );

    if (oldSuggestions) {
        oldSuggestions.remove();
    }


    // Get what the user has typed.
    const search =
        input.value.toLowerCase().trim();


    // Don't show anything if the box is empty.
    if (search === "") {
        return;
    }


    // Find matching stations.
    const matches =
        stations
            .filter(function(station) {

                return station
                    .toLowerCase()
                    .includes(search);

            })
            .sort(function(a, b) {

                const aStarts =
                    a.toLowerCase().startsWith(search);

                const bStarts =
                    b.toLowerCase().startsWith(search);


                if (aStarts && !bStarts) {
                    return -1;
                }

                if (!aStarts && bStarts) {
                    return 1;
                }

                return a.localeCompare(b);
            });


    // Only show the first 8 results.
    const limitedMatches =
        matches.slice(0, 8);


    // Don't create a box if there are no matches.
    if (limitedMatches.length === 0) {
        return;
    }


    // Create the suggestion box.
    const suggestionBox =
        document.createElement("div");

    suggestionBox.className =
        "station-suggestions";


    // Keep track of keyboard selection.
    let selectedIndex = -1;


    // Create each suggestion.
    limitedMatches.forEach(function(station) {

        const suggestion =
            document.createElement("div");

        suggestion.className =
            "station-suggestion";


        // Find where the search appears.
        const stationLower =
            station.toLowerCase();

        const matchStart =
            stationLower.indexOf(search);

        const matchEnd =
            matchStart + search.length;


        const beforeMatch =
            station.substring(
                0,
                matchStart
            );

        const matchedText =
            station.substring(
                matchStart,
                matchEnd
            );

        const afterMatch =
            station.substring(
                matchEnd
            );


        // Highlight the matching text.
        suggestion.innerHTML =
            `${beforeMatch}<strong>${matchedText}</strong>${afterMatch}`;


        // Select station when clicked.
        suggestion.addEventListener(
            "click",
            function() {

                input.value =
                    station;

                suggestionBox.remove();
            }
        );


        suggestionBox.appendChild(
            suggestion
        );
    });


    // Add suggestions underneath input.
    input.parentElement.appendChild(
        suggestionBox
    );


    // ==================================================
    // KEYBOARD NAVIGATION
    // ==================================================

    input.onkeydown = function(event) {

        const suggestions =
            suggestionBox.querySelectorAll(
                ".station-suggestion"
            );


        if (suggestions.length === 0) {
            return;
        }


        // DOWN
        if (event.key === "ArrowDown") {

            event.preventDefault();

            selectedIndex++;


            if (
                selectedIndex >=
                suggestions.length
            ) {

                selectedIndex = 0;
            }


            updateSelectedSuggestion(
                suggestions,
                selectedIndex
            );
        }


        // UP
        else if (event.key === "ArrowUp") {

            event.preventDefault();

            selectedIndex--;


            if (selectedIndex < 0) {

                selectedIndex =
                    suggestions.length - 1;
            }


            updateSelectedSuggestion(
                suggestions,
                selectedIndex
            );
        }


        // ENTER
        else if (event.key === "Enter") {

            if (selectedIndex >= 0) {

                event.preventDefault();


                input.value =
                    limitedMatches[selectedIndex];


                suggestionBox.remove();

                selectedIndex = -1;
            }
        }


        // ESCAPE
        else if (event.key === "Escape") {

            suggestionBox.remove();

            selectedIndex = -1;
        }
    };
}


// ======================================================
// UPDATE SELECTED SUGGESTION
// ======================================================

function updateSelectedSuggestion(
    suggestions,
    selectedIndex
) {

    suggestions.forEach(
        function(suggestion) {

            suggestion.classList.remove(
                "selected"
            );
        }
    );


    if (selectedIndex >= 0) {

        suggestions[
            selectedIndex
        ].classList.add(
            "selected"
        );
    }
}


// ======================================================
// SHOW SUGGESTIONS WHILE TYPING
// ======================================================

startInput.addEventListener(
    "input",
    function() {

        showSuggestions(startInput);

    }
);


destinationInput.addEventListener(
    "input",
    function() {

        showSuggestions(destinationInput);

    }
);


// ======================================================
// DISPLAY ROUTE
// ======================================================

function displayRoute(data) {

    // Split Java's response into separate lines.
    const lines =
        data.split("\n");


    let journeyTimeText = "";
    let changesText = "";
    let routeTitle = "";


    // Every station in the route.
    const stationsInRoute = [];


    // ==================================================
    // READ JAVA RESPONSE
    // ==================================================

    lines.forEach(function(line) {

        line =
            line.trim();


        if (line === "") {
            return;
        }


        // Route title.
        if (
            line === "*** Fastest Route ***" ||
            line === "*** Fewest Changes ***"
        ) {

            routeTitle =
                line
                    .replaceAll("*", "")
                    .trim();

            return;
        }


        // Journey time.
        if (
            line.startsWith(
                "Overall Journey Time"
            )
        ) {

            journeyTimeText =
                line;

            return;
        }


        // Total changes.
        if (
            line.startsWith(
                "Total Changes"
            )
        ) {

            changesText =
                line;

            return;
        }


        // Station.
        if (
            line.includes(
                " on the "
            )
        ) {

            const parts =
                line.split(" on the ");


            stationsInRoute.push({
                name: parts[0],
                line: parts[1]
            });
        }
    });


    // ==================================================
    // CREATE ROUTE CONTAINER
    // ==================================================

    const routeContainer =
        document.createElement("div");

    routeContainer.className =
        "route-container";


    // ==================================================
    // TITLE
    // ==================================================

    const title =
        document.createElement("h2");

    title.textContent =
        routeTitle;

    routeContainer.appendChild(
        title
    );


    // ==================================================
    // JOURNEY SUMMARY
    // ==================================================

    const summary =
        document.createElement("div");

    summary.className =
        "journey-summary";


    if (journeyTimeText !== "") {

        const journeyTime =
            document.createElement("div");

        journeyTime.className =
            "journey-summary-item";

        journeyTime.textContent =
            journeyTimeText;

        summary.appendChild(
            journeyTime
        );
    }


    if (changesText !== "") {

        const totalChanges =
            document.createElement("div");

        totalChanges.className =
            "journey-summary-item";

        totalChanges.textContent =
            changesText;

        summary.appendChild(
            totalChanges
        );
    }


    routeContainer.appendChild(
        summary
    );


    // ==================================================
    // CHECK FOR ROUTE
    // ==================================================

    if (stationsInRoute.length === 0) {

        const message =
            document.createElement("div");

        message.className =
            "journey-info";

        message.textContent =
            "No route found.";

        routeContainer.appendChild(
            message
        );


        result.innerHTML = "";

        result.appendChild(
            routeContainer
        );

        return;
    }


    // ==================================================
    // CREATE ROUTE
    // ==================================================

    const route =
        document.createElement("div");

    route.className =
        "route";


    // --------------------------------------------------
    // FIND LINE SECTIONS
    // --------------------------------------------------

    let sectionStart = 0;


    while (
        sectionStart <
        stationsInRoute.length
    ) {

        const startStation =
            stationsInRoute[
                sectionStart
            ];


        let sectionEnd =
            sectionStart;


        // Continue until the line changes.
        while (
            sectionEnd + 1 <
            stationsInRoute.length &&
            stationsInRoute[
                sectionEnd + 1
            ].line === startStation.line
        ) {

            sectionEnd++;
        }


        const endStation =
            stationsInRoute[
                sectionEnd
            ];


        // --------------------------------------------------
        // START STATION
        // --------------------------------------------------

        const startElement =
            createStationElement(
                startStation
            );


        route.appendChild(
            startElement
        );


        // --------------------------------------------------
        // COLLAPSIBLE SECTION
        // --------------------------------------------------

        if (
            sectionEnd >
            sectionStart
        ) {

            const middleStations =
                stationsInRoute.slice(
                    sectionStart + 1,
                    sectionEnd
                );


            const section =
                createRouteSection(
                    startStation.line,
                    middleStations
                );


            route.appendChild(
                section
            );
        }


        // --------------------------------------------------
        // DESTINATION
        // --------------------------------------------------

        if (
            sectionEnd ===
            stationsInRoute.length - 1
        ) {

            const destinationElement =
                createStationElement(
                    endStation
                );


            route.appendChild(
                destinationElement
            );

            break;
        }


        // --------------------------------------------------
        // CHANGE STATION
        // --------------------------------------------------

        const changeStation =
            createStationElement(
                endStation
            );


        changeStation.classList.add(
            "change-station"
        );


        route.appendChild(
            changeStation
        );


        // Move to the next line section.
        sectionStart =
            sectionEnd + 1;
    }


    routeContainer.appendChild(
        route
    );


    // ==================================================
    // DISPLAY
    // ==================================================

    result.innerHTML = "";

    result.appendChild(
        routeContainer
    );
}


// ======================================================
// CREATE STATION ELEMENT
// ======================================================

function createStationElement(
    stationData
) {

    const station =
        document.createElement("div");

    station.className =
        "route-station";


    station.classList.add(
        "line-" +
        stationData.line.toLowerCase()
    );


    const dot =
        document.createElement("div");

    dot.className =
        "station-dot";


    const information =
        document.createElement("div");

    information.className =
        "station-information";


    const name =
        document.createElement("div");

    name.className =
        "route-station-name";

    name.textContent =
        stationData.name;


    const line =
        document.createElement("div");

    line.className =
        "route-station-line";

    line.textContent =
        stationData.line +
        " line";


    information.appendChild(
        name
    );

    information.appendChild(
        line
    );


    station.appendChild(
        dot
    );

    station.appendChild(
        information
    );


    return station;
}


// ======================================================
// CREATE COLLAPSIBLE ROUTE SECTION
// ======================================================

function createRouteSection(
    lineName,
    middleStations
) {

    const section =
        document.createElement("div");

    section.className =
        "route-section";


    // --------------------------------------------------
    // CLICKABLE LINE
    // --------------------------------------------------

    const line =
        document.createElement("div");

    line.className =
        "route-section-line";


    line.classList.add(
        "line-" +
        lineName.toLowerCase()
    );


    const lineText =
        document.createElement("span");

    lineText.textContent =
        lineName +
        " line";


    const stationCount =
        document.createElement("span");

    stationCount.className =
        "route-station-count";


    stationCount.textContent =
        middleStations.length +
        (
            middleStations.length === 1
                ? " stop"
                : " stops"
        );


    const arrow =
        document.createElement("span");

    arrow.className =
        "route-arrow";

    arrow.textContent =
        "▼";


    line.appendChild(
        lineText
    );

    line.appendChild(
        stationCount
    );

    line.appendChild(
        arrow
    );


    // --------------------------------------------------
    // HIDDEN STATIONS
    // --------------------------------------------------

    const hiddenStations =
        document.createElement("div");

    hiddenStations.className =
        "hidden-stations";


    middleStations.forEach(
        function(stationData) {

            const station =
                createStationElement(
                    stationData
                );


            hiddenStations.appendChild(
                station
            );
        }
    );


    // --------------------------------------------------
    // CLICK TO EXPAND
    // --------------------------------------------------

    line.addEventListener(
        "click",
        function() {

            section.classList.toggle(
                "expanded"
            );
        }
    );


    section.appendChild(
        line
    );

    section.appendChild(
        hiddenStations
    );


    return section;
}


// ======================================================
// FASTEST ROUTE BUTTON
// ======================================================

fastestButton.addEventListener(
    "click",
    async function() {

        const startStation =
            startInput.value;

        const destinationStation =
            destinationInput.value;


        result.textContent =
            "Searching for fastest route...";


        try {

            const response =
                await fetch(
                    `http://localhost:8080/fastest-route?start=${encodeURIComponent(startStation)}&destination=${encodeURIComponent(destinationStation)}`
                );


            const data =
                await response.text();


            displayRoute(data);

        } catch (error) {

            result.textContent =
                "Could not connect to Java server.";

            console.error(error);
        }
    }
);


// ======================================================
// FEWEST CHANGES BUTTON
// ======================================================

changesButton.addEventListener(
    "click",
    async function() {

        const startStation =
            startInput.value;

        const destinationStation =
            destinationInput.value;


        result.textContent =
            "Searching for route with fewest changes...";


        try {

            const response =
                await fetch(
                    `http://localhost:8080/fewest-changes?start=${encodeURIComponent(startStation)}&destination=${encodeURIComponent(destinationStation)}`
                );


            const data =
                await response.text();


            displayRoute(data);

        } catch (error) {

            result.textContent =
                "Could not connect to Java server.";

            console.error(error);
        }
    }
);
