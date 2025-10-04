document.addEventListener("DOMContentLoaded", function () {
    console.log("Document is ready: Scientific Calculator Initialized");

    const display = document.getElementById('calc-display');
    const buttons = document.getElementsByClassName('btn');
    const historyBtn = document.getElementById('history-btn');
    // ✅ FIX 1: Corrected ID typo 'histroy-panel' to 'history-panel'
    const historyPanel = document.getElementById('history-panel'); 
    let currentValue = "";
    let lastAnswer = 0;
    let history = [];
    let justEvaluated = false;
    const scientificFunctions = ['sin', 'cos', 'tan', 'log', 'ln', '√'];

    display.addEventListener('input', function() {
        currentValue = display.value;
    });

    // ✅ FIX 2: Corrected keyboard listener logic
    display.addEventListener('keydown', function(event) {
        const key = event.key;
        const allowedEditingKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
        if (allowedEditingKeys.includes(key)) {
            // Let the browser handle these important keys
            return;
        }
        if ('0123456789.'.includes(key)) {
            // If it's a number, prevent default and use our function
            event.preventDefault();
            insertAtCursor(key);
        } else {
            // For any other key (letters, operators, etc.), block it
            event.preventDefault();
        }
    });

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.addEventListener('click', function () {
            const value = button.dataset.value || button.innerText.trim();
            handleButtonClick(value);
        });
    }

    historyBtn.addEventListener('click', function() {
        historyPanel.innerHTML = "";
        if (history.length === 0) {
            historyPanel.innerHTML = "<div>No history yet</div>";
        } else {
            for (let i = history.length - 1; i >= 0; i--) {
                const entry = document.createElement('div');
                entry.textContent = history[i];
                entry.addEventListener('click', function() {
                    const result = history[i].split(' = ')[1];
                    currentValue = result;
                    // ✅ FIX 3: Corrected typo 'vlaue' to 'value'
                    display.value = currentValue; 
                    historyPanel.classList.remove('show');
                });
                historyPanel.appendChild(entry);
            }
        }
        historyPanel.classList.toggle('show');
    });

    window.addEventListener('click', function(event) {
        if (!historyPanel.contains(event.target) && event.target !== historyBtn) {
            historyPanel.classList.remove('show');
        }
    });

    // --- All other functions ---

    function handleButtonClick(value) {
        // ✅ FIX 4: Corrected misplaced curly brace for 'justEvaluated' logic
        if (justEvaluated) {
            if ("0123456789".includes(value) || scientificFunctions.includes(value)) {
                currentValue = "";
            }
            justEvaluated = false;
        }
        try {
            if (value === "AC") { currentValue = ""; display.value = currentValue; }
            else if (value === "<") { const pos = display.selectionStart - 1; if (pos >= 0) { display.setSelectionRange(pos, pos); display.focus(); } }
            else if (value === ">") { const pos = display.selectionStart + 1; if (pos <= currentValue.length) { display.setSelectionRange(pos, pos); display.focus(); } }
            else if (value === "CE") {
                const pos = display.selectionStart;
                if (pos > 0) {
                    currentValue = currentValue.substring(0, pos - 1) + currentValue.substring(pos);
                    display.value = currentValue;
                    display.setSelectionRange(pos - 1, pos - 1);
                    display.focus();
                }
            }
            else if (value === "=") { evaluateResult(); }
            else if (scientificFunctions.includes(value)) { handleScientific(value); }
            else if (value === "X y" || value === "Xy") { insertAtCursor('^'); }
            else if (value === "X!") {
                 const match = currentValue.match(/(\d+(\.\d+)?)$/);
                 if (match) {
                     const lastNumber = match[0];
                     const result = factorial(lastNumber);
                     currentValue = currentValue.substring(0, currentValue.length - lastNumber.length) + result;
                     display.value = currentValue;
                 }
            }
            else if (value === "Ans") { insertAtCursor('Ans'); }
            else if (value === "EXP") { insertAtCursor('E'); }
            else { insertAtCursor(value); }
        } catch (error) {
            console.error("Calculation Error:", error);
            currentValue = "Error";
            display.value = currentValue;
        }
    }
    
    function evaluateResult() {
        if (currentValue === "") return;
        const expression = currentValue; 
        let processedValue = currentValue;
        processedValue = processedValue.replace(/(\d+(\.\d+)?)\s*([+\-])\s*(\d+(\.\d+)?)\s*%/g, (match, base, _, op, percent) => {
            return `${base} ${op} (${base} * ${percent} / 100)`;
        });

        const convertedValue = processedValue
            .replace(/×/g, "*").replace(/÷/g, "/")
            .replace(/\^/g, '**').replace(/%/g, "/100")
            .replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E')
            .replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos').replace(/tan/g, 'Math.tan')
            .replace(/log/g, 'Math.log10').replace(/ln/g, 'Math.log').replace(/√/g, 'Math.sqrt')
            .replace(/Ans/g, lastAnswer);
        
        try {
            const result = eval(convertedValue);
            lastAnswer = result;
            currentValue = result.toString();
            display.value = currentValue;
            justEvaluated = true;
            // ✅ FIX 5: Used backticks (`) instead of single quotes (')
            history.push(`${expression} = ${result}`); 
        } catch (error) {
            console.error("Evaluation Error:", error);
            currentValue = "Error";
            display.value = currentValue;
        }
    }
    
    // (insertAtCursor, handleScientific, and factorial functions are unchanged and correct)
    function insertAtCursor(textToInsert) { const cursorPosition = display.selectionStart; const textBefore = currentValue.substring(0, cursorPosition); const textAfter = currentValue.substring(cursorPosition); currentValue = textBefore + textToInsert + textAfter; display.value = currentValue; const newCursorPosition = cursorPosition + textToInsert.length; display.setSelectionRange(newCursorPosition, newCursorPosition); display.focus(); }
    function handleScientific(funcName){ const textToInsert = funcName + '()'; insertAtCursor(textToInsert); const newCursorPosition = display.selectionStart - 1; display.setSelectionRange(newCursorPosition, newCursorPosition); display.focus(); }
    function factorial(num) { let n = parseFloat(num); if (n < 0 || !Number.isInteger(n)) { return "Error"; } if (n === 0) { return 1; } let result = 1; for (let i = n; i > 0; i--) { result *= i; } return result; }
});