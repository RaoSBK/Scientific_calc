document.addEventListener("DOMContentLoaded", function () {
    console.log("Document is ready: Scientific Calculator Initialized");

    const display = document.getElementById('calc-display');
    const buttons = document.getElementsByClassName('btn');
    let currentValue = "";
    
    const scientificFunctions = ['sin', 'cos', 'tan', 'log', 'ln', '√'];

    
    display.addEventListener('keydown', function(event) {
        const key = event.key;
        event.preventDefault();
        const allowedEditingKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
        if(allowedEditingKeys.includes(key)){
            return;
        }

        if('0123456789.' .includes(key)){
            event.preventDefault();
            insertAtCursor(key);
        } else {
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


    function insertAtCursor(textToInsert) {
        const cursorPosition = display.selectionStart;

        const textBefore = currentValue.substring(0, cursorPosition);
        const textAfter = currentValue.substring(cursorPosition);

        currentValue = textBefore + textToInsert + textAfter;
        display.value = currentValue;

        const newCursorPosition = cursorPosition + textToInsert.length;
        display.setSelectionRange(newCursorPosition, newCursorPosition);
        display.focus();
    }

    function factorial(num){
        let n= parseFloat(num);
        if(n<0 || !Number.isInteger(n)){
            return "ERROR";
        }

        if(n===0){
            return 1;
        }

        let result = 1;
        for(let i=n; i>0; i--){
            result *= i;
        }
        return result;
    }

    function handleButtonClick(value){
        try {
            if (value === "AC") {
                currentValue = "";
                display.value = currentValue;
            } else if (value === "<") { 
                const newPosition = display.selectionStart - 1;
                if (newPosition >= 0) {
                    display.setSelectionRange(newPosition, newPosition);
                    display.focus();
                }
            } else if (value === ">") { 
                const newPosition = display.selectionStart + 1;
                
                if (newPosition <= currentValue.length) {
                    display.setSelectionRange(newPosition, newPosition);
                    display.focus();
                }
            } else if (value === "CE") {
                currentValue = currentValue.slice(0, -1);
                display.value = currentValue;
            } else if (value === "=") {
                evaluateResult();
            } else if (scientificFunctions.includes(value)) {
                handleScientific(value);
            } else if(value === "X y" || value === "Xy"){
                insertAtCursor('^');
            } else if(value ==="X!"){
                const match = currentValue.match(/(\d+(\.\d+)?)$/);
                if (match){
                    const lastNumber = match[0];
                    const result = factorial(lastNumber);
                    currentValue = currentValue.substring(0, currentValue.length - lastNumber.length)+ result;
                    display.value = currentValue;
                }
            }  else {
                insertAtCursor(value);
            }
        } catch (error) {
            console.error("Calculation Error:", error);
            currentValue = "Error";
            display.value = currentValue;
        }
    }



    function handleScientific(funcName){
        const textToInsert = funcName + '()';
        const cursorPosition = display.selectionStart;

        const textBefore = currentValue.substring(0, cursorPosition);
        const textAfter = currentValue.substring(cursorPosition);

        currentValue = textBefore + textToInsert + textAfter;
        display.value = currentValue;

        const newCursorPosition = cursorPosition + textToInsert.length - 1;
        display.setSelectionRange(newCursorPosition, newCursorPosition);
        display.focus();
    }

    function evaluateResult() {
        const convertedValue = currentValue
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/%/g, "/100")
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/log/g, 'Math.log10')
            .replace(/ln/g, 'Math.log')
            .replace(/√/g, 'Math.sqrt')
            .replace(/\^/g, '**');
        
        
        if(convertedValue.includes('^')){
        }

        const result = eval(convertedValue);
        currentValue = result.toString();
        display.value = currentValue;
    }
});