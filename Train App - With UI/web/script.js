// ==========================================
// METROLINK ROUTE PLANNER
// ==========================================


// ------------------------------------------
// Get HTML elements
// ------------------------------------------

const startInput = document.getElementById("start");
const destinationInput = document.getElementById("destination");

const fastestButton = document.getElementById("fastestButton");
const changesButton = document.getElementById("changesButton");

const swapButton = document.getElementById("swapButton");

const result = document.getElementById("result");


// ------------------------------------------
// Store all stations
// ------------------------------------------

let stations = [];


// ------------------------------------------
// Store autocomplete information
// ------------------------------------------

let activeInput = null;
let selectedSuggestion = -1;


// ------------------------------------------
// Recent searches
// ------------------------------------------

const MAX_RECENT_SEARCHES = 5;


// ==========================================
// LOAD STATIONS
// ==========================================

async function loadStations() {

    try {

        const response = await fetch(
            "http://localhost:8080/stations"
        );

        const text = await response.text();

        stations = text
            .split("\n")
            .map(station => station.trim())
            .filter(station => station !== "")
            .sort();

    }

    catch (error) {

        console.error(
            "Could not load stations:",
            error
        );

    }

}


// ==========================================
// RECENT SEARCHES
// ==========================================


// Get recent searches from browser storage

function getRecentSearches() {

    const saved =
        localStorage.getItem(
            "metrolinkRecentSearches"
        );

    if (!saved) {
        return [];
    }

    try {

        return JSON.parse(saved);

    }

    catch (error) {

        console.error(
            "Could not read recent searches:",
            error
        );

        return [];

    }

}


// Save a new search

function saveRecentSearch(start, destination) {

    if (!start || !destination) {
        return;
    }


    const newSearch = {
        start: start,
        destination: destination
    };


    let searches = getRecentSearches();


    // Remove an existing identical search

    searches = searches.filter(search =>
        !(
            search.start.toLowerCase() ===
            start.toLowerCase()
            &&
            search.destination.toLowerCase() ===
            destination.toLowerCase()
        )
    );


    // Put newest search at the beginning

    searches.unshift(newSearch);


    // Only keep the last 5

    searches = searches.slice(
        0,
        MAX_RECENT_SEARCHES
    );


    localStorage.setItem(
        "metrolinkRecentSearches",
        JSON.stringify(searches)
    );


    displayRecentSearches();

}


// Display recent searches underneath the planner

function displayRecentSearches() {

    const searches =
        getRecentSearches();


    const existing =
        document.getElementById(
            "recentSearches"
        );


    // Remove old list

    if (existing) {
        existing.remove();
    }


    // Nothing to display

    if (searches.length === 0) {
        return;
    }


    const container =
        document.createElement("section");

    container.id =
        "recentSearches";

    container.className =
        "recent-searches";


    const heading =
        document.createElement("div");

    heading.className =
        "recent-heading";


    heading.innerHTML = `
        <div>
            <h2>Recent journeys</h2>
            <p>Your last few searches</p>
        </div>

        <button
            id="clearRecentButton"
            class="clear-recent-button"
            type="button"
        >
            Clear
        </button>
    `;


    container.appendChild(heading);


    const list =
        document.createElement("div");

    list.className =
        "recent-list";


    searches.forEach((search, index) => {

        const item =
            document.createElement("button");

        item.className =
            "recent-item";

        item.type =
            "button";


        item.innerHTML = `

            <div class="recent-route">

                <span class="recent-station">
                    ${escapeHtml(search.start)}
                </span>

                <span class="recent-arrow">
                    →
                </span>

                <span class="recent-station">
                    ${escapeHtml(search.destination)}
                </span>

            </div>

            <span class="recent-icon">
                ↗
            </span>

        `;


        item.addEventListener(
            "click",
            () => {

                startInput.value =
                    search.start;

                destinationInput.value =
                    search.destination;


                // Automatically find the fastest route

                findRoute(
                    "fastest"
                );

            }
        );


        list.appendChild(item);

    });


    container.appendChild(list);


    // Put recent searches after planner

    const planner =
        document.querySelector(
            ".planner-card"
        );


    planner.after(container);


    // Clear button

    const clearButton =
        document.getElementById(
            "clearRecentButton"
        );


    clearButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "metrolinkRecentSearches"
            );

            displayRecentSearches();

        }
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

// Prevent station names from being treated
// as HTML when inserted into the page.

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


// ==========================================
// AUTOCOMPLETE
// ==========================================


function showSuggestions(input) {

    activeInput = input;

    selectedSuggestion = -1;


    const search =
        input.value
            .trim()
            .toLowerCase();


    // Remove existing suggestions

    removeSuggestions();


    if (!search) {
        return;
    }


    // Find matching stations

    const matches =
        stations
            .filter(station =>
                station
                    .toLowerCase()
                    .includes(search)
            )
            .sort((a, b) => {

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

            })
            .slice(0, 8);


    if (matches.length === 0) {
        return;
    }


    const wrapper =
        input.closest(
            ".input-wrapper"
        );


    const dropdown =
        document.createElement("div");

    dropdown.className =
        "suggestions";


    matches.forEach(
        (station, index) => {

            const item =
                document.createElement("div");

            item.className =
                "suggestion";

            item.dataset.index =
                index;


            // Highlight matching text

            const escapedStation =
                escapeHtml(station);

            const escapedSearch =
                escapeHtml(search);


            const regex =
                new RegExp(
                    `(${escapeRegex(escapedSearch)})`,
                    "ig"
                );


            item.innerHTML =
                escapedStation.replace(
                    regex,
                    "<strong>$1</strong>"
                );


            item.addEventListener(
                "mousedown",
                event => {

                    event.preventDefault();

                    input.value =
                        station;

                    removeSuggestions();

                }
            );


            dropdown.appendChild(item);

        }
    );


    wrapper.appendChild(dropdown);

}


// Escape special regex characters

function escapeRegex(text) {

    return text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

}


// Remove autocomplete dropdowns

function removeSuggestions() {

    document
        .querySelectorAll(".suggestions")
        .forEach(dropdown =>
            dropdown.remove()
        );

}


// ==========================================
// KEYBOARD AUTOCOMPLETE
// ==========================================

function handleKeyboard(event) {

    const dropdown =
        activeInput
            ?.closest(".input-wrapper")
            ?.querySelector(".suggestions");


    if (!dropdown) {
        return;
    }


    const items =
        dropdown.querySelectorAll(
            ".suggestion"
        );


    if (event.key === "ArrowDown") {

        event.preventDefault();


        selectedSuggestion++;

        if (
            selectedSuggestion >=
            items.length
        ) {

            selectedSuggestion = 0;

        }

    }


    else if (event.key === "ArrowUp") {

        event.preventDefault();


        selectedSuggestion--;

        if (selectedSuggestion < 0) {

            selectedSuggestion =
                items.length - 1;

        }

    }


    else if (event.key === "Enter") {

        if (
            selectedSuggestion >= 0
            &&
            selectedSuggestion < items.length
        ) {

            event.preventDefault();

            items[
                selectedSuggestion
            ].dispatchEvent(
                new MouseEvent("mousedown")
            );

        }

    }


    else if (event.key === "Escape") {

        removeSuggestions();

    }


    items.forEach(
        (item, index) => {

            item.classList.toggle(
                "selected",
                index === selectedSuggestion
            );

        }
    );

}


// ==========================================
// SWAP STATIONS
// ==========================================

function swapStations() {

    // Add animation class

    startInput.classList.add(
        "swapping"
    );

    destinationInput.classList.add(
        "swapping"
    );

    swapButton.classList.add(
        "rotating"
    );


    // Wait for the animation to begin

    setTimeout(() => {

        const temporary =
            startInput.value;

        startInput.value =
            destinationInput.value;

        destinationInput.value =
            temporary;

    }, 150);


    // Remove animation classes

    setTimeout(() => {

        startInput.classList.remove(
            "swapping"
        );

        destinationInput.classList.remove(
            "swapping"
        );

        swapButton.classList.remove(
            "rotating"
        );

    }, 350);


    removeSuggestions();

}


// ==========================================
// FIND ROUTE
// ==========================================

async function findRoute(type) {

    const start =
        startInput.value.trim();

    const destination =
        destinationInput.value.trim();


    // Make sure both fields have values

    if (!start || !destination) {

        showError(
            "Please enter both a starting station and a destination."
        );

        return;

    }


    // Make sure stations exist

    const startExists =
        stations.some(
            station =>
                station.toLowerCase() ===
                start.toLowerCase()
        );


    const destinationExists =
        stations.some(
            station =>
                station.toLowerCase() ===
                destination.toLowerCase()
        );


    if (!startExists) {

        showError(
            `"${start}" is not a valid station.`
        );

        return;

    }


    if (!destinationExists) {

        showError(
            `"${destination}" is not a valid station.`
        );

        return;

    }


    if (
        start.toLowerCase() ===
        destination.toLowerCase()
    ) {

        showError(
            "Your starting station and destination are the same."
        );

        return;

    }


    // Show loading state

    result.innerHTML = `

        <div class="loading-route">

            <div class="loading-spinner"></div>

            <h2>
                Finding your route...
            </h2>

            <p>
                Asking the Java route planner
                to calculate the best journey.
            </p>

        </div>

    `;


    try {

        let endpoint;


        if (type === "fastest") {

            endpoint =
                "http://localhost:8080/fastest-route";

        }

        else {

            endpoint =
                "http://localhost:8080/fewest-changes";

        }


        const response =
            await fetch(
                endpoint +
                "?start=" +
                encodeURIComponent(start) +
                "&destination=" +
                encodeURIComponent(destination)
            );


        const data =
            await response.text();


        if (!response.ok) {

            throw new Error(
                "Server returned an error."
            );

        }


        // Save search

        saveRecentSearch(
            start,
            destination
        );


        // Display route

        displayRoute(data);

    }


    catch (error) {

        console.error(error);


        showError(
            "Could not connect to the Java server. Make sure Server.java is running."
        );

    }

}


// ==========================================
// ERROR DISPLAY
// ==========================================

function showError(message) {

    result.innerHTML = `

        <div class="error-result">

            <div class="error-icon">
                !
            </div>

            <div>

                <h2>
                    Something went wrong
                </h2>

                <p>
                    ${escapeHtml(message)}
                </p>

            </div>

        </div>

    `;

}


// ==========================================
// DISPLAY ROUTE
// ==========================================

function displayRoute(data) {

    const lines =
        data
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "");


    let title =
        "Journey";


    let journeyTimeText =
        "";


    let changesText =
        "";


    const stationsInRoute = [];


    lines.forEach(line => {

        if (
            line.startsWith("***")
        ) {

            title =
                line
                    .replace(/\*/g, "")
                    .trim();

        }


        else if (
            line.startsWith(
                "Overall Journey Time"
            )
        ) {

            journeyTimeText =
                line
                    .replace(
                        "Overall Journey Time (mins):",
                        "Journey:"
                    )
                    .trim()
                    + " mins";

        }


        else if (
            line.startsWith(
                "Total Changes"
            )
        ) {

            changesText =
                line
                    .replace(
                        "Total Changes:",
                        "Changes:"
                    )
                    .trim();

        }


        else {

            const match =
                line.match(
                    /^(.+?) on the (.+)$/i
                );


            if (match) {

                stationsInRoute.push({

                    station:
                        match[1].trim(),

                    line:
                        match[2]
                            .trim()
                            .toLowerCase()

                });

            }

        }

    });


    if (
        stationsInRoute.length === 0
    ) {

        showError(
            "No route could be found."
        );

        return;

    }


    // --------------------------------------
    // Group consecutive stations by line
    // --------------------------------------

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
            stationsInRoute.length
            &&
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


        // IMPORTANT:
        // Move past the station that belongs
        // to the next section.
        //
        // This prevents duplicate change stations.

        sectionStart =
            sectionEnd + 1;

    }


    // --------------------------------------
    // Build route HTML
    // --------------------------------------

    let routeHTML = `

        <div class="route-container">

            <div class="route-header">

                <div>

                    <span class="route-label">
                        ${escapeHtml(title)}
                    </span>

                    <h2>
                        ${escapeHtml(
                            stationsInRoute[0].station
                        )}
                        →
                        ${escapeHtml(
                            stationsInRoute[
                                stationsInRoute.length - 1
                            ].station
                        )}
                    </h2>

                </div>


                <div class="route-summary">

                    <div class="summary-item">

                        <span class="summary-value">
                            ${escapeHtml(
                                journeyTimeText
                            )}
                        </span>

                    </div>


                    <div class="summary-item">

                        <span class="summary-value">
                            ${escapeHtml(
                                changesText
                            )}
                        </span>

                    </div>

                </div>

            </div>


            <div class="route-body">

    `;


    // --------------------------------------
    // Render each line section
    // --------------------------------------

    sections.forEach(
        (section, sectionIndex) => {

            const firstStation =
                stationsInRoute[
                    section.start
                ];


            const lastStation =
                stationsInRoute[
                    section.end
                ];


            const middleStations =
                stationsInRoute.slice(
                    section.start + 1,
                    section.end
                );


            const lineClass =
                "line-" +
                section.line
                    .replace(/\s+/g, "")
                    .replace(/[^a-z0-9-]/g, "");


            // Start station

            if (sectionIndex === 0) {

                routeHTML += `

                    <div
                        class="route-station ${lineClass}"
                    >

                        <div class="station-dot">
                        </div>

                        <div class="station-name">
                            ${escapeHtml(
                                firstStation.station
                            )}
                        </div>

                    </div>

                `;

            }


            // ----------------------------------
            // Clickable line section
            // ----------------------------------

            if (middleStations.length > 0) {

                routeHTML += `

                    <button
                        class="route-section"
                        type="button"
                        data-section="${sectionIndex}"
                    >

                        <div class="route-section-line ${lineClass}">
                        </div>


                        <div class="route-section-info">

                            <span
                                class="route-section-name"
                            >
                                ${escapeHtml(
                                    section.line
                                )} Line
                            </span>


                            <span
                                class="route-section-stops"
                            >
                                ${middleStations.length + 1}
                                stops
                            </span>

                        </div>


                        <div class="route-expand">
                            +
                        </div>

                    </button>


                    <div
                        class="route-middle-stations"
                        data-middle="${sectionIndex}"
                    >

                `;


                middleStations.forEach(
                    station => {

                        routeHTML += `

                            <div
                                class="route-station middle-station ${lineClass}"
                            >

                                <div class="station-dot">
                                </div>

                                <div class="station-name">
                                    ${escapeHtml(
                                        station.station
                                    )}
                                </div>

                            </div>

                        `;

                    }
                );


                routeHTML += `

                    </div>

                `;

            }


            // ----------------------------------
            // Final/change station
            // ----------------------------------

            routeHTML += `

                <div
                    class="route-station ${lineClass}"
                >

                    <div class="station-dot">
                    </div>

                    <div class="station-name">

                        ${escapeHtml(
                            lastStation.station
                        )}

                    </div>

                </div>

            `;


            // ----------------------------------
            // Line change message
            // ----------------------------------

            if (
                sectionIndex <
                sections.length - 1
            ) {

                const nextSection =
                    sections[
                        sectionIndex + 1
                    ];


                routeHTML += `

                    <div class="line-change">

                        <div class="change-icon">
                            ⇄
                        </div>

                        <div>

                            <strong>
                                Change line
                            </strong>

                            <span>
                                ${escapeHtml(
                                    section.line
                                )}
                                →
                                ${escapeHtml(
                                    nextSection.line
                                )}
                            </span>

                        </div>

                    </div>

                `;

            }

        }
    );


    routeHTML += `

            </div>

        </div>

    `;


    result.innerHTML =
        routeHTML;


    // --------------------------------------
    // Add click events
    // --------------------------------------

    document
        .querySelectorAll(".route-section")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.section;


                    const stations =
                        document.querySelector(
                            `[data-middle="${section}"]`
                        );


                    if (!stations) {
                        return;
                    }


                    const isOpen =
                        stations.classList.contains(
                            "expanded"
                        );


                    if (isOpen) {

                        stations.classList.remove(
                            "expanded"
                        );

                        button.classList.remove(
                            "expanded"
                        );

                    }

                    else {

                        stations.classList.add(
                            "expanded"
                        );

                        button.classList.add(
                            "expanded"
                        );

                    }

                }
            );

        });


    // --------------------------------------
    // Animate route
    // --------------------------------------

    animateRoute();

}


// ==========================================
// ROUTE ANIMATION
// ==========================================

function animateRoute() {

    const routeItems =
        document.querySelectorAll(
            ".route-station, .route-section, .line-change"
        );


    routeItems.forEach(
        (item, index) => {

            item.classList.add(
                "route-animate"
            );


            item.style.animationDelay =
                `${index * 80}ms`;

        }
    );

}


// ==========================================
// BUTTON EVENTS
// ==========================================

fastestButton.addEventListener(
    "click",
    () => {

        findRoute("fastest");

    }
);


changesButton.addEventListener(
    "click",
    () => {

        findRoute("changes");

    }
);


swapButton.addEventListener(
    "click",
    swapStations
);


// ==========================================
// INPUT EVENTS
// ==========================================

startInput.addEventListener(
    "input",
    () => {

        showSuggestions(
            startInput
        );

    }
);


destinationInput.addEventListener(
    "input",
    () => {

        showSuggestions(
            destinationInput
        );

    }
);


startInput.addEventListener(
    "keydown",
    handleKeyboard
);


destinationInput.addEventListener(
    "keydown",
    handleKeyboard
);


// Close autocomplete when clicking elsewhere

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".input-wrapper"
            )
        ) {

            removeSuggestions();

        }

    }
);


// ==========================================
// ENTER TO SEARCH
// ==========================================

startInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
            &&
            startInput.value
            &&
            destinationInput.value
        ) {

            findRoute("fastest");

        }

    }
);


destinationInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
            &&
            startInput.value
            &&
            destinationInput.value
        ) {

            findRoute("fastest");

        }

    }
);


// ==========================================
// START APPLICATION
// ==========================================

loadStations();

displayRecentSearches();
