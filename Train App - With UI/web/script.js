// ======================================================
// ELEMENTS
// ======================================================

const fastestButton =
    document.getElementById("fastestButton");

const changesButton =
    document.getElementById("changesButton");

const startInput =
    document.getElementById("start");

const destinationInput =
    document.getElementById("destination");

const swapButton =
    document.getElementById("swapButton");

const result =
    document.getElementById("result");


// ======================================================
// STATIONS
// ======================================================

let stations = [];

async function loadStations() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/stations"
            );

        const data =
            await response.text();

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

    }
    catch (error) {

        console.error(
            "Could not load stations:",
            error
        );

    }
}

loadStations();


// ======================================================
// STATION SUGGESTIONS
// ======================================================

function showSuggestions(input) {

    const oldSuggestions =
        document.querySelector(
            ".station-suggestions"
        );

    if (oldSuggestions) {
        oldSuggestions.remove();
    }

    const search =
        input.value.toLowerCase().trim();

    if (search === "") {
        return;
    }

    const matches =
        stations
            .filter(function(station) {

                return station
                    .toLowerCase()
                    .includes(search);

            })
            .sort(function(a, b) {

                const aStarts =
                    a.toLowerCase()
                        .startsWith(search);

                const bStarts =
                    b.toLowerCase()
                        .startsWith(search);

                if (aStarts && !bStarts) {
                    return -1;
                }

                if (!aStarts && bStarts) {
                    return 1;
                }

                return a.localeCompare(b);

            });


    const limitedMatches =
        matches.slice(0, 8);


    if (limitedMatches.length === 0) {
        return;
    }


    const suggestionBox =
        document.createElement("div");

    suggestionBox.className =
        "station-suggestions";


    let selectedIndex = -1;


    limitedMatches.forEach(
        function(station) {

            const suggestion =
                document.createElement("div");

            suggestion.className =
                "station-suggestion";


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


            suggestion.innerHTML =
                `${beforeMatch}<strong>${matchedText}</strong>${afterMatch}`;


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

        }
    );


    input.parentElement.appendChild(
        suggestionBox
    );


    input.onkeydown =
        function(event) {

            const suggestions =
                suggestionBox.querySelectorAll(
                    ".station-suggestion"
                );


            if (suggestions.length === 0) {
                return;
            }


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


            else if (event.key === "Enter") {

                if (selectedIndex >= 0) {

                    event.preventDefault();

                    input.value =
                        limitedMatches[
                            selectedIndex
                        ];

                    suggestionBox.remove();

                    selectedIndex = -1;

                }

            }


            else if (event.key === "Escape") {

                suggestionBox.remove();

                selectedIndex = -1;

            }

        };
}


// ======================================================
// SELECTED SUGGESTION
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
// INPUT LISTENERS
// ======================================================

startInput.addEventListener(
    "input",
    function() {

        showSuggestions(
            startInput
        );

    }
);


destinationInput.addEventListener(
    "input",
    function() {

        showSuggestions(
            destinationInput
        );

    }
);


// ======================================================
// SWAP STATIONS
// ======================================================

swapButton.addEventListener(
    "click",
    function() {

        const oldStart =
            startInput.value;

        const oldDestination =
            destinationInput.value;


        startInput.value =
            oldDestination;

        destinationInput.value =
            oldStart;

    }
);


// ======================================================
// DISPLAY ROUTE
// ======================================================

function displayRoute(data) {

    const lines =
        data.split("\n");


    let journeyTimeText = "";

    let changesText = "";

    let routeTitle = "";


    const stationsInRoute = [];


    lines.forEach(
        function(line) {

            line =
                line.trim();


            if (line === "") {
                return;
            }


            if (
                line ===
                "*** Fastest Route ***" ||

                line ===
                "*** Fewest Changes ***"
            ) {

                routeTitle =
                    line
                        .replaceAll("*", "")
                        .trim();

                return;

            }


            if (
                line.startsWith(
                    "Overall Journey Time"
                )
            ) {

                journeyTimeText =
                    line;

                return;

            }


            if (
                line.startsWith(
                    "Total Changes"
                )
            ) {

                changesText =
                    line;

                return;

            }


            if (
                line.includes(
                    " on the "
                )
            ) {

                const parts =
                    line.split(
                        " on the "
                    );


                stationsInRoute.push({

                    name: parts[0],

                    line: parts[1]

                });

            }

        }
    );


    // ==================================================
    // ROUTE CONTAINER
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
    // SUMMARY
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
            journeyTimeText
                .replace(
                    "Overall Journey Time (mins):",
                    "Journey:"
                )
                .trim() + " mins";


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
    // NO ROUTE
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
    // ROUTE
    // ==================================================

    const route =
        document.createElement("div");

    route.className =
        "route";


    // ==================================================
    // GROUP SAME-LINE STATIONS
    // ==================================================

    const sections = [];

    let sectionStart = 0;


    while (
        sectionStart <
        stationsInRoute.length
    ) {

        const lineName =
            stationsInRoute[
                sectionStart
            ].line;


        let sectionEnd =
            sectionStart;


        while (
            sectionEnd + 1 <
            stationsInRoute.length &&

            stationsInRoute[
                sectionEnd + 1
            ].line === lineName
        ) {

            sectionEnd++;

        }


        sections.push({

            start:
                sectionStart,

            end:
                sectionEnd,

            line:
                lineName

        });


        sectionStart =
            sectionEnd + 1;

    }


    // ==================================================
    // DISPLAY SECTIONS
    // ==================================================

    sections.forEach(
        function(section, index) {

            const startStation =
                stationsInRoute[
                    section.start
                ];


            const endStation =
                stationsInRoute[
                    section.end
                ];


            // ------------------------------------------
            // START STATION
            // ------------------------------------------

            const startElement =
                createStationElement(
                    startStation
                );


            route.appendChild(
                startElement
            );


            // ------------------------------------------
            // MIDDLE STATIONS
            // ------------------------------------------

            const middleStations =
                stationsInRoute.slice(
                    section.start + 1,
                    section.end
                );


            if (middleStations.length > 0) {

                const sectionElement =
                    createRouteSection(
                        section.line,
                        middleStations
                    );


                route.appendChild(
                    sectionElement
                );

            }


            // ------------------------------------------
            // END / CHANGE STATION
            // ------------------------------------------

            if (
                section.end !==
                stationsInRoute.length - 1
            ) {

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


                // --------------------------------------
                // CHANGE MESSAGE
                // --------------------------------------

                const nextStation =
                    stationsInRoute[
                        section.end + 1
                    ];


                const changeMessage =
                    document.createElement(
                        "div"
                    );


                changeMessage.className =
                    "line-change";


                changeMessage.textContent =
                    "Change from " +
                    section.line +
                    " line to " +
                    nextStation.line +
                    " line";


                route.appendChild(
                    changeMessage
                );

            }

            else {

                // --------------------------------------
                // FINAL DESTINATION
                // --------------------------------------

                const destinationElement =
                    createStationElement(
                        endStation
                    );


                route.appendChild(
                    destinationElement
                );

            }

        }
    );


    routeContainer.appendChild(
        route
    );


    result.innerHTML = "";

    result.appendChild(
        routeContainer
    );
}


// ======================================================
// CREATE STATION
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


    const line =
        document.createElement("div");


    line.className =
        "route-section-line";


    line.classList.add(
        "line-" +
        lineName.toLowerCase()
    );


    // ----------------------------------------------
    // LINE NAME
    // ----------------------------------------------

    const lineText =
        document.createElement("span");


    lineText.textContent =
        lineName +
        " line";


    // ----------------------------------------------
    // STATION COUNT
    // ----------------------------------------------

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


    // ----------------------------------------------
    // ARROW
    // ----------------------------------------------

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


    // ----------------------------------------------
    // HIDDEN STATIONS
    // ----------------------------------------------

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


    // ----------------------------------------------
    // CLICK
    // ----------------------------------------------

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
// LOADING
// ======================================================

function showLoading(message) {

    result.innerHTML = `

        <div class="empty-result">

            <div class="empty-icon">
                🚊
            </div>

            <h2>
                ${message}
            </h2>

            <p>
                Finding the best route...
            </p>

        </div>

    `;
}


// ======================================================
// FASTEST ROUTE
// ======================================================

fastestButton.addEventListener(
    "click",
    async function() {

        const startStation =
            startInput.value.trim();

        const destinationStation =
            destinationInput.value.trim();


        if (
            startStation === "" ||
            destinationStation === ""
        ) {

            result.innerHTML = `

                <div class="empty-result">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h2>
                        Please choose two stations
                    </h2>

                    <p>
                        Enter a starting station
                        and destination.
                    </p>

                </div>

            `;

            return;
        }


        showLoading(
            "Finding fastest route..."
        );


        try {

            const response =
                await fetch(
                    `http://localhost:8080/fastest-route?start=${encodeURIComponent(startStation)}&destination=${encodeURIComponent(destinationStation)}`
                );


            const data =
                await response.text();


            displayRoute(data);

        }


        catch (error) {

            console.error(error);


            result.innerHTML = `

                <div class="empty-result">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h2>
                        Could not connect to server
                    </h2>

                    <p>
                        Make sure the Java server
                        is running.
                    </p>

                </div>

            `;

        }

    }
);


// ======================================================
// FEWEST CHANGES
// ======================================================

changesButton.addEventListener(
    "click",
    async function() {

        const startStation =
            startInput.value.trim();

        const destinationStation =
            destinationInput.value.trim();


        if (
            startStation === "" ||
            destinationStation === ""
        ) {

            result.innerHTML = `

                <div class="empty-result">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h2>
                        Please choose two stations
                    </h2>

                    <p>
                        Enter a starting station
                        and destination.
                    </p>

                </div>

            `;

            return;
        }


        showLoading(
            "Finding route with fewest changes..."
        );


        try {

            const response =
                await fetch(
                    `http://localhost:8080/fewest-changes?start=${encodeURIComponent(startStation)}&destination=${encodeURIComponent(destinationStation)}`
                );


            const data =
                await response.text();


            displayRoute(data);

        }


        catch (error) {

            console.error(error);


            result.innerHTML = `

                <div class="empty-result">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h2>
                        Could not connect to server
                    </h2>

                    <p>
                        Make sure the Java server
                        is running.
                    </p>

                </div>

            `;

        }

    }
);