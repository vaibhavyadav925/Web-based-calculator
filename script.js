let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Function to append numbers and operators to display
function appendToDisplay(value) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple decimal points
    if (value === '.' && display.value.includes('.')) {
        return;
    }
    
    // Prevent multiple operators in a row
    if (['+', '-', '*', '/'].includes(value) && ['+', '-', '*', '/'].includes(display.value.slice(-1))) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }
    
    display.value += value;
}

// Function to clear the display
function clearDisplay() {
    display.value = '';
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

// Function to delete last character
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Function to calculate and display result
function calculateResult() {
    try {
        let expression = display.value;
        
        // Replace display operators with actual operators
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Check for division by zero
        if (expression.includes('/0')) {
            display.value = 'Error: Division by zero';
            shouldResetDisplay = true;
            return;
        }
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Check if result is valid
        if (isNaN(result) || !isFinite(result)) {
            display.value = 'Error: Invalid operation';
            shouldResetDisplay = true;
            return;
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result;
        shouldResetDisplay = true;
        
    } catch (error) {
        display.value = 'Error: Invalid expression';
        shouldResetDisplay = true;
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and decimal point
    if ((key >= '0' && key <= '9') || key === '.') {
        appendToDisplay(key);
    }
    
    // Operators
    else if (key === '+') {
        appendToDisplay('+');
    }
    else if (key === '-') {
        appendToDisplay('-');
    }
    else if (key === '*') {
        appendToDisplay('*');
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        appendToDisplay('/');
    }
    
    // Calculate result
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    }
    
    // Clear display
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    }
    
    // Delete last character
    else if (key === 'Backspace') {
        deleteLast();
    }
});

// Prevent form submission on Enter key
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});

// Initialize display
display.value = '';
