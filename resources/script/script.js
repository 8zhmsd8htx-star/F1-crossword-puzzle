
// Define the 5x5 grid layout using arrays of strings
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

                cellDiv.appendChild(input);

                // click highlight functionality
                cellDiv.addEventListener('click', () => {
                    clearActiveCells();
                    cellDiv.classList.add('active');
                    input.focus();
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