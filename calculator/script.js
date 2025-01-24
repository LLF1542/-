class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.history = [];
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('不能除以0！');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        // 添加到历史记录
        this.addToHistory(`${prev} ${this.operation} ${current}`, computation);

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    addToHistory(expression, result) {
        this.history.unshift({ expression, result });
        if (this.history.length > 20) {
            this.history.pop();
        }
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyList = document.querySelector('.history-list');
        historyList.innerHTML = '';
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            `;
            historyList.appendChild(historyItem);
        });
    }

    updateDisplay() {
        const displayElement = document.querySelector('.display');
        const currentOperandElement = document.querySelector('.current-operand');
        const previousOperandElement = document.querySelector('.previous-operand');

        currentOperandElement.textContent = this.currentOperand;
        
        if (this.operation != null) {
            previousOperandElement.textContent = `${this.previousOperand} ${this.operation}`;
            displayElement.classList.add('has-operator');
        } else {
            previousOperandElement.textContent = '';
            displayElement.classList.remove('has-operator');
        }
    }
}

const calculator = new Calculator();

// 数字按钮事件
document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
        calculator.updateDisplay();
    });
});

// 运算符按钮事件
document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.action === 'equals') {
            calculator.compute();
        } else {
            calculator.chooseOperation(button.textContent);
        }
        calculator.updateDisplay();
    });
});

// 特殊按钮事件
document.querySelectorAll('.special').forEach(button => {
    button.addEventListener('click', () => {
        switch (button.dataset.action) {
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.delete();
                break;
            case 'percent':
                calculator.chooseOperation('%');
                break;
        }
        calculator.updateDisplay();
    });
}); 