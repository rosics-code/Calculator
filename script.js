const display = document.getElementById('display');
let expression = '';
let hasDecimal = false;

function appendNumber(num) {
    // Prevent multiple leading zeros
    if (display.value === '0' && num === '0') {
        return;
    }
    
    // Replace 0 with the first number
    if (display.value === '0' && num !== '.') {
        display.value = num;
        expression = num;
    } else {
        display.value += num;
        expression += num;
    }
}

function appendOperator(op) {
    // Don't allow operator as first character
    if (display.value === '' || display.value === '0') {
        return;
    }
    
    // Prevent multiple operators in a row
    if (/[+\-*/.]$/.test(expression)) {
        return;
    }
    
    // Handle decimal point
    if (op === '.') {
        if (hasDecimal) {
            return;
        }
        display.value += op;
        expression += op;
        hasDecimal = true;
    } else {
        display.value += op;
        expression += op;
        hasDecimal = false;
    }
}

function deleteLast() {
    if (display.value.length > 0) {
        const lastChar = display.value[display.value.length - 1];
        
        hasDecimal = (lastChar === '.') ? true : false;
        
        display.value = display.value.slice(0, -1);
        expression = expression.slice(0, -1);
        
        if (display.value === '') {
            display.value = '0';
            expression = '';
        }
    }
}

function clearDisplay() {
    display.value = '0';
    expression = '';
    hasDecimal = false;
}

function calculate() {
    try {
        // Validate expression
        if (expression === '' || /[+\-*/.]$/.test(expression)) {
            return;
        }
        
        // Evaluate the expression
        const result = eval(expression);
        
        // Round to prevent floating point errors
        const roundedResult = Math.round(result * 100000000) / 100000000;
        
        display.value = roundedResult;
        expression = roundedResult.toString();
        hasDecimal = expression.includes('.');
    } catch (error) {
        display.value = 'Error';
        expression = '';
        hasDecimal = false;
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (/[0-9]/.test(e.key)) {
        appendNumber(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendOperator(e.key);
    } else if (e.key === '.') {
        appendOperator('.');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    } else if (e.key === 'Escape') {
        clearDisplay();
    }
});
