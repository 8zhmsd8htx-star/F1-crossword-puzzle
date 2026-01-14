
// Define the grid layout using arrays of strings
const gridLayout = [
    ['1','1','1','1','1','1','1','0','0','0','0','0','0','0','0'], 
    ['0','0','0','0','0','1','0','0','0','0','0','0','0','0','1'], 
    ['1','0','0','0','0','1','0','0','0','0','0','0','0','0','1'], 
    ['1','0','0','0','0','1','0','0','0','0','0','0','0','0','1'], 
    ['1','0','0','0','0','1','0','0','0','0','0','0','0','0','1'], 
    ['1','1','1','1','1','1','0','0','0','0','0','0','0','0','1'], 
    ['1','0','0','0','0','1','1','1','1','1','1','1','0','0','1'], 
    ['1','0','0','1','0','0','0','0','0','0','0','0','0','0','1'], 
    ['1','1','1','1','0','1','1','1','1','1','1','1','1','1','1'], 
    ['1','0','0','1','0','0','0','1','0','0','0','0','0','0','0'], 
    ['1','0','1','1','1','1','1','1','0','0','0','1','0','0','0'], 
    ['1','0','0','1','0','0','0','1','1','1','1','1','0','0','0'], 
    ['1','0','1','1','1','1','1','1','0','0','0','1','0','0','0'], 
    ['0','0','0','0','0','0','0','1','0','0','0','1','0','0','0'], 
];

// Define number cells and their positions
const clueNumbers = {
    '0-0': 1,
    '0-5': 2,
    '1-14': 3,
    '2-0': 4,
    '5-0': 5,
    '6-5': 6,
    '7-3': 7,
    '8-0': 8,
    '8-5': 9,
    '8-7': 10,
    '10-2': 11,
    '10-11': 12,
    '11-7': 13,
    '12-2': 14,
};

// Define clue directions based on their starting positions
const clueDirection = {
    '0-0': 'across',
    '0-5': 'down',
    '1-14': 'down',
    '2-0': 'down',
    '5-0': 'across',
    '6-5': 'across',
    '7-3': 'down',
    '8-0': 'across',
    '8-5': 'across',
    '8-7': 'down',
    '10-2': 'across',
    '10-11': 'down',
    '11-7': 'across',
    '12-2': 'across',
};

// define clue answers
const clueAnswers = {
    1: 'PIASTRI',
    2: 'REDBULL',
    3: 'HAMILTON',
    4: 'SILVERSTONE',
    5: 'VETTEL',
    6: 'LECLERC',
    7: 'STROLL',
    8: 'SOFT',
    9: 'VERSTAPPEN',
    10: 'ROSCOE',
    11: 'BOTTAS',
    12: 'BAKU',
    13: 'CHINA',
    14: 'ALONSO',
};

let currentSelectedCell = { x: 0, y: 0 };
let currentDirection = 'across';

// Function to create the grid in the HTML

// event listener to run the code after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // grab the grid container element
    const gridElement = document.getElementById('grid');

    // function to clear active cells
    const clearActiveCells = () => {
        document
        .querySelectorAll('.cell.active')
        .forEach(cell => cell.classList.remove('active'));
    };

    // iterate over the grid layout to create cells
    for (let row = 0; row < gridLayout.length; row++) {
        for (let col = 0; col < gridLayout[row].length; col++) {
            const value = gridLayout[row][col];
            const cellDiv = document.createElement('div');

            // set cell class based on value
            if (value === '1') {
                cellDiv.classList.add('cell');
		        cellDiv.dataset.x = col;
		        cellDiv.dataset.y = row;

                // add number indicator for certain cells
                const key = `${row}-${col}`;
                if (clueNumbers[key]) {
                    const numberSpan = document.createElement('span');
                    numberSpan.classList.add('cell-number');
                    numberSpan.textContent = clueNumbers[key];
                    cellDiv.appendChild(numberSpan);
                }

                // make letter cells editable
                const input = document.createElement('input');
                input.setAttribute('maxlength', '1');
                input.classList.add('cell-input');

                // allways put caret at the end of input on focus
                input.addEventListener('focus', () => {
                    const len = input.value.length;
                    input.setSelectionRange(len, len);
                });

                cellDiv.appendChild(input);

                // click highlight functionality
                cellDiv.addEventListener('click', () => {
                    clearActiveCells();
                    clearWordHighlights();
                    activateCell(
                        parseInt(cellDiv.dataset.x),
                        parseInt(cellDiv.dataset.y),
                        true
                    );
                });

                // keyboard navigation functionality
                input.addEventListener('keydown', (event) => {
                    const x = parseInt(cellDiv.dataset.x);
                    const y = parseInt(cellDiv.dataset.y);
                    
                    // __________BACKSPACE HANDLING__________

                    if (event.key === 'Backspace') {
                        const currentValue = input.value;
                        if (currentValue !== '') {
                            setTimeout(() => input.setSelectionRange(0, 0), 0); // let the backspace happen first
                    } else {
                        event.preventDefault(); // prevent default backspace behavior

                        let newX = x;
                        let newY = y;

                        if (currentDirection === 'across') {
                            newX = x - 1;
                        } else {
                            newY = y - 1;
                        }

                        const prevCell = getCell(newX, newY);
                        if (prevCell) {
                            const prevInput = prevCell.querySelector('input');
                            prevInput.value = ''; // clear previous cell
                            clearActiveCells();
                            activateCell(newX, newY);
                        }
                    }

                    return;
                }

                    // __________ARROW KEY HANDLING__________
                    let newX = x;
                    let newY = y;

                    switch (event.key) {
                        case 'ArrowUp':
                            currentDirection = 'down'; // vertical
                            newY = y - 1;
                            break;
                        case 'ArrowDown':
                            currentDirection = 'down';
                            newY = y + 1;
                            break;
                        case 'ArrowLeft':
                            currentDirection = 'across'; // horizontal
                            newX = x - 1;
                            break;
                        case 'ArrowRight':
                            currentDirection = 'across';
                            newX = x + 1;
                            break;
                        default:
                            return;
                    }

                    clearActiveCells();
                    clearWordHighlights();
                    event.preventDefault();
                    activateCell(newX, newY);
                });

                // input handling to move to next cell
                input.addEventListener('keyup', (event) => {
                    
                    const x = parseInt(cellDiv.dataset.x);
                    const y = parseInt(cellDiv.dataset.y);

                    if (event.key.length === 1 && event.key.match(/^[a-zA-Z]$/)) {
                        let newX = x;
                        let newY = y;

                        checkWordAtCell(x, y);

                        if (currentDirection === 'across') {
                            newX = x + 1;
                        } else {
                            newY = y + 1;
                        };

                        clearActiveCells();
                        activateCell(newX, newY);
                        clearWordHighlights();
                    }
                });

                } else {
                    cellDiv.classList.add('block');
                    cellDiv.dataset.active = 'false';
            }

            // append the cell to the grid container
            gridElement.appendChild(cellDiv);
        }
    }

    setupClueClicks();

    function setupClueClicks() {
        const clueItems = document.querySelectorAll('#questions li');

        clueItems.forEach((li, index) => {
            const clueNum = index + 1;
            
            // find the corresponding key for the clue number
            const key = Object.keys(clueNumbers).find (k => clueNumbers[k] === clueNum);
            if (!key) return; // skip if no matching key found

            const [rowStr, colStr] = key.split('-');
            const row = parseInt(rowStr, 10);
            const col = parseInt(colStr, 10);

            const direction = clueDirection[key];

            li.addEventListener('click', () => {
                const startX = col;
                const startY = row;

                // highlight the entire word for the clue
                highlightWord(startX, startY, direction);

                // scroll grid into view
                gridElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                clearActiveCells();
                activateCell(startX, startY, true);
            });
        });
    }
});

function activateCell(x, y, useClueDirection = false) {
    let cell = document.querySelector(
        "[data-x='" + x + "'][data-y='" + y + "']"
    );

    let input = cell.querySelector("input");
    cell.classList.add("active");
    input.focus();

    // Determine direction
    const key = `${y}-${x}`;
    const forcedDir = clueDirection[key];
    // if useClueDirection is true and there's a forced direction, use it
    if (useClueDirection && forcedDir) {
        currentDirection = forcedDir;
    } else {
        currentDirection = inferDirection(x, y);
    }

    currentSelectedCell.x = x;
    currentSelectedCell.y = y;
}

function inferDirection(x, y) {
    const hasLeft = hasInputCell(x - 1, y);
    const hasRight = hasInputCell(x + 1, y);
    const hasUp = hasInputCell(x, y - 1);
    const hasDown = hasInputCell(x, y + 1);

    const hasHoriz = hasLeft || hasRight;
    const hasVert = hasUp || hasDown;

    // only for single direction cases
    if (hasHoriz && !hasVert) {
        return 'across';
    }
    
    if (hasVert && !hasHoriz) {
        return 'down';
    }

    // if both directions at intersection, don't change
    return currentDirection;
}

function getCell(x, y) {
    return document.querySelector(
        "[data-x='" + x + "'][data-y='" + y + "']"
    );
}

function hasInputCell(x, y) {
    const cell = getCell(x, y);
    if (!cell) return false;
    const input = cell.querySelector("input");
    return !!input; // return true if input exists
}

// find start of word
function findWordStart(x, y, direction) {
    let dx = 0;
    let dy = 0;

    if (direction === 'across') {
        dx = -1;
        dy = 0;
    } else if (direction === 'down') {
        dx = 0;
        dy = -1;
    } else {
        return { x, y }; // invalid direction
    }

    let currX = x;
    let currY = y;

    while (hasInputCell(currX + dx, currY + dy)) {
        currX += dx;
        currY += dy;
    }

    return { x: currX, y: currY };
}

// collect all cells in a word
function collectWordCells(startX, startY, direction) {
    let dx = 0;
    let dy = 0;

    if (direction === 'across') {
        dx = 1;
        dy = 0;
    } else if (direction === 'down') {
        dx = 0;
        dy = 1;
    } else {
        return []; // invalid direction
    }

    const cells = [];
    let x = startX;
    let y = startY;

    while (hasInputCell(x, y)) {
        const cell = getCell(x, y);
        
        const input = cell.querySelector('input');
        cells.push({ x, y, cell, input });

        x += dx;
        y += dy;
    }

    return cells;
}

// check word answer
function checkWordAtCell(x, y) {
    const direction = currentDirection;

    // find the start of the word
    const start = findWordStart(x, y, direction);
    const startX = start.x;
    const startY = start.y;

    // find clue number at start position
    const key = `${startY}-${startX}`;
    const clueNum = clueNumbers[key];
    if (!clueNum) return; // no clue number found

    const answer = clueAnswers[clueNum];
    if (!answer) return; // no answer found

    // collect all cells in the word
    const cells = collectWordCells(startX, startY, direction);

    // check if match answer length
    if (cells.length !== answer.length) return;

    let filled = true;
    const userLetters = [];

    // collect user input letters
    for (const c of cells) {
        const val = (c.input.value || '').trim().toUpperCase();

        if (val === '') {
            filled = false;
            break;
        }
        userLetters.push(val);
    }

    if (!filled) return; // word not completely filled

    const userAnswer = userLetters.join('');
    const isCorrect = userAnswer === answer.toUpperCase();
    const cssClass = isCorrect ? 'correct-word' : 'incorrect-word';

    // apply correct/incorrect class to each cell
    cells.forEach(c => c.cell.classList.add(cssClass));

    setTimeout(() => {
        cells.forEach(c => c.cell.classList.remove(cssClass));
    }, 500);
}

// clear word highlights
function clearWordHighlights() {
    document
    .querySelectorAll('.cell.word-highlight')
    .forEach(cell => cell.classList.remove('word-highlight'));
}

// highlight word function
function highlightWord(startX, startY, direction) {
    clearWordHighlights();

    let dx = 0;
    let dy = 0;

    if (direction === 'across') {
        dx = 1;
        dy = 0;
    } else if (direction === 'down') {
        dx = 0;
        dy = 1;
    } else {
        return; // invalid direction
    }

    let x = startX;
    let y = startY;

    // highlight cells in the specified direction
    while (hasInputCell(x, y)) {
        const cell = getCell(x, y);
        cell.classList.add('word-highlight');

        x += dx;
        y += dy;
    }
}