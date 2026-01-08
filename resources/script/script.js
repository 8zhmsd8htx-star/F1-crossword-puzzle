
// Define the 5x5 grid layout using arrays of strings
const gridLayout = [
    ['1', '1', '1', '1', '1'],
    ['1', '0', '1', '0', '1'],
    ['1', '1', '1', '1', '1'],
    ['1', '0', '1', '0', '1'],
    ['1', '1', '1', '1', '1']
];

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
            }

            // append the cell to the grid container
            gridElement.appendChild(cellDiv);
        }
    }
});