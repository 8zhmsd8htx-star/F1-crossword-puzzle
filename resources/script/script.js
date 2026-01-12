
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

let currentSelectedCell = {
	x: 0,
	y: 0
};

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
                    activateCell(
                        parseInt(cellDiv.dataset.x),
                        parseInt(cellDiv.dataset.y)
                    );
                });

                // keyboard navigation functionality
                input.addEventListener('keydown', (event) => {
                    const x = parseInt(cellDiv.dataset.x);
                    const y = parseInt(cellDiv.dataset.y);

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

                        if (currentDirection === 'across') {
                            newX = x + 1;
                        } else {
                            newY = y + 1;
                        };

                        clearActiveCells();
                        activateCell(newX, newY);
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
});

function activateCell(x, y) {
    let cell = document.querySelector(
        "[data-x='" + x + "'][data-y='" + y + "']"
    );

    let input = cell.querySelector("input");
    cell.classList.add("active");
    input.focus();

    // infer direction based on surrounding cells
    currentDirection = inferDirection(x, y);

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

    // start of word cases
    if (hasRight && !hasLeft && !hasVert) {
        return 'across';
    }
    
    if (hasDown && !hasUp && !hasHoriz) {
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
