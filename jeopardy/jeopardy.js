// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;

let categories = [];

async function getCategoryData() {
    const categoryIds = await getCategoryIds();
    categories = await Promise.all(categoryIds.map(getCategory));
    fillTable();
}

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns an array of category ids
 */
async function getCategoryIds() {
    try {
        const response = await axios.get("http://jservice.io/api/categories", {
            params: {
                count: NUM_CATEGORIES
            }
        });
        const categoryIds = response.data.map(category => category.id);
        return categoryIds;
    } catch (error) {
        console.error("Error fetching category IDs:", error);
        return [];
    }
}

/** Return an object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
async function getCategory(catId) {
    try {
        const response = await axios.get(`http://jservice.io/api/category?id=${catId}`);
        const categoryData = {
            title: response.data.title,
            clues: response.data.clues.map(clue => ({
                question: clue.question,
                answer: clue.answer,
                showing: null
            }))
        };
        return categoryData;
    } catch (error) {
        console.error(`Error fetching category data for ID ${catId}:`, error);
        return null;
    }
}

/** Fill the HTML table#jeopardy with the categories and cells for questions.
 *
 * - The <thead> should be filled with a <tr>, and a <td> for each category
 * - The <tbody> should be filled with NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initially, just show a "?" where the question/answer would go.)
 */
function fillTable() {
    const $jeopardyTable = $("#jeopardy");
    const $thead = $jeopardyTable.find("thead");
    const $tbody = $jeopardyTable.find("tbody");

    // Create the header row with category titles
    const $headerRow = $("<tr></tr>");
    categories.forEach(category => {
        $headerRow.append($("<th></th>").text(category.title));
    });
    $thead.append($headerRow);

    // Create the rows for questions and answers
    for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
        const $questionRow = $("<tr></tr>");
        categories.forEach(category => {
            const $cell = $("<td></td>").text("?");
            $cell.on("click", handleClick); // Add a click event listener
            $questionRow.append($cell);
        });
        $tbody.append($questionRow);
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show the question and set .showing to "question"
 * - if currently "question", show the answer and set .showing to "answer"
 * - if currently "answer", ignore click
 */
function handleClick(evt) {
    const $cell = $(evt.target);
    const rowIndex = $cell.parent().index(); // Get the row index
    const colIndex = $cell.index(); // Get the column index
    const category = categories[colIndex];
    const clue = category.clues[rowIndex];

    if (clue.showing === "question") {
        $cell.text(clue.answer);
        clue.showing = "answer";
    } else if (clue.showing === "answer") {
        // Do nothing if the answer is already showing
    } else {
        $cell.text(clue.question);
        clue.showing = "question";
    }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */
function showLoadingView() {
    const $loadingSpinner = $("<div class='spinner'></div>");
    const $restartButton = $("#restart");

    // Add a loading spinner to the page
    $("body").append($loadingSpinner);

    // Disable the "Restart" button during loading
    $restartButton.prop("disabled", true);
}

/** Remove the loading spinner and update the button used to fetch data. */
function hideLoadingView() {
    const $loadingSpinner = $("div.spinner");
    const $restartButton = $("#restart");

    // Remove the loading spinner from the page
    $loadingSpinner.remove();

    // Enable the "Restart" button
    $restartButton.prop("disabled", false);
}

/** Start the game:
 *
 * - get random category Ids
 * - get data for each category
 * - create the HTML table
 */
async function setupAndStart() {
    showLoadingView();
    const categoryIds = await getCategoryIds();
    categories = await Promise.all(categoryIds.map(getCategory));

    // Clear the existing table and reset the categories array
    const $jeopardyTable = $("#jeopardy");
    $jeopardyTable.find("thead").empty();
    $jeopardyTable.find("tbody").empty();
    categories = [];

    fillTable();
    hideLoadingView();
}

/** On click of the start / restart button, set up the game. */
$(document).ready(function () {
    const $restartButton = $("#restart");
    $restartButton.on("click", function () {
        setupAndStart();
    });

    setupAndStart(); // Initial setup
});

/** On page load, add an event handler for clicking clues */
$(document).ready(function () {
    $("#jeopardy tbody td").on("click", handleClick);
});

$(document).ready(function () {
    const $restartButton = $("#restart");
    $restartButton.on("click", function () {
        getCategoryData();
    });

    getCategoryData(); // Initial setup
});