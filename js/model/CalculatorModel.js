/**
 * CalculatorModel.js - Model Layer
 * Handles all data and business logic for the calculator
 * Responsible for arithmetic operations and state management
 */

class CalculatorModel {
    constructor() {
        this.currentValue = 0;
        this.previousValue = null;
        this.operator = null;
        this.waitingForNewValue = false;
        this.history = [];
        this.currentExpression = '';
    }

    /**
     * Basic Arithmetic Operations
     */
    
    add(a, b) {
        return a + b;
    }

    subtract(a, b) {
        return a - b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        if (b === 0) {
            throw new Error("Cannot divide by zero");
        }
        return a / b;
    }

    /**
     * Main calculation method
     * Performs calculation based on current operator and values
     * @returns {number} The result of the calculation
     * @throws {Error} If invalid operator or division by zero
     */
    calculate() {
        if (this.operator === null || this.previousValue === null) {
            return this.currentValue;
        }

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;

        try {
            switch (this.operator) {
                case '+':
                    result = this.add(prev, current);
                    break;
                case '-':
                    result = this.subtract(prev, current);
                    break;
                case '*':
                    result = this.multiply(prev, current);
                    break;
                case '/':
                    result = this.divide(prev, current);
                    break;
                default:
                    throw new Error("Invalid operator");
            }

            // Handle floating point precision issues
            if (result % 1 !== 0) {
                result = parseFloat(result.toFixed(10));
            }

            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Getter and Setter Methods for State Management
     */

    setCurrentValue(value) {
        this.currentValue = value;
    }

    getCurrentValue() {
        return this.currentValue;
    }

    setOperator(operator) {
        this.operator = operator;
    }

    getOperator() {
        return this.operator;
    }

    setPreviousValue(value) {
        this.previousValue = value;
    }

    getPreviousValue() {
        return this.previousValue;
    }

    setWaitingForNewValue(waiting) {
        this.waitingForNewValue = waiting;
    }

    isWaitingForNewValue() {
        return this.waitingForNewValue;
    }

    /**
     * History and Expression Management
     */

    // Add calculation to history
    addToHistory(expression, result) {
        this.history.push({
            expression: expression,
            result: result,
            timestamp: new Date().toLocaleTimeString()
        });
        
        // Keep only last 10 calculations
        if (this.history.length > 10) {
            this.history.shift();
        }
    }

    // Get calculation history
    getHistory() {
        return this.history;
    }

    // Clear history
    clearHistory() {
        this.history = [];
    }

    // Set current expression
    setCurrentExpression(expression) {
        this.currentExpression = expression;
    }

    // Get current expression
    getCurrentExpression() {
        return this.currentExpression;
    }

    // Build expression string
    buildExpression() {
        if (this.previousValue !== null && this.operator !== null) {
            const operatorSymbol = this.getOperatorSymbol(this.operator);
            return `${this.previousValue} ${operatorSymbol} ${this.currentValue}`;
        }
        return this.currentValue.toString();
    }

    // Get operator symbol for display
    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };
        return symbols[operator] || operator;
    }

    /**
     * Utility Methods
     */

    // Reset calculator to initial state
    reset() {
        this.currentValue = 0;
        this.previousValue = null;
        this.operator = null;
        this.waitingForNewValue = false;
        this.currentExpression = '';
    }

    // Clear current entry only
    clearEntry() {
        this.currentValue = 0;
    }

    // Get current state as object (useful for debugging)
    getState() {
        return {
            currentValue: this.currentValue,
            previousValue: this.previousValue,
            operator: this.operator,
            waitingForNewValue: this.waitingForNewValue,
            currentExpression: this.currentExpression,
            historyCount: this.history.length
        };
    }

    // Validate if a number is valid
    isValidNumber(value) {
        return !isNaN(value) && isFinite(value);
    }
}