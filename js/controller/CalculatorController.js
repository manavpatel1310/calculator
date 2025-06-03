/**
 * CalculatorController.js - Controller Layer
 * Mediates between Model and View, handles user input logic
 * Coordinates all interactions between the Model and View layers
 */

class CalculatorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    /**
     * Initialize the controller
     */
    init() {
        this.bindEvents();
        this.updateView();
        this.updateExpression();
        this.updateHistory();
    }

    /**
     * Bind all events from the view
     */
    bindEvents() {
        // Number input events
        document.addEventListener('numberClick', (e) => {
            this.handleNumberInput(e.detail.number);
        });

        // Operator input events
        document.addEventListener('operatorClick', (e) => {
            this.handleOperatorInput(e.detail.operator);
        });

        // Equals input events
        document.addEventListener('equalsClick', () => {
            this.handleEqualsInput();
        });

        // Clear input events
        document.addEventListener('clearClick', () => {
            this.handleClearInput();
        });

        // Clear entry input events
        document.addEventListener('clearEntryClick', () => {
            this.handleClearEntryInput();
        });

        // Decimal input events
        document.addEventListener('decimalClick', () => {
            this.handleDecimalInput();
        });

        // Clear history events
        document.addEventListener('clearHistoryClick', () => {
            this.handleClearHistoryInput();
        });
    }

    /**
     * Handle number input from user
     * @param {string} number - The number pressed
     */
    handleNumberInput(number) {
        const currentValue = this.model.getCurrentValue().toString();
        
        try {
            if (this.model.isWaitingForNewValue()) {
                // Start new number input
                this.model.setCurrentValue(parseFloat(number));
                this.model.setWaitingForNewValue(false);
            } else {
                // Append to existing number
                const newValue = currentValue === '0' ? number : currentValue + number;
                
                // Prevent numbers that are too long
                if (newValue.length <= 15) {
                    this.model.setCurrentValue(parseFloat(newValue));
                }
            }
            
            this.updateView();
            this.updateExpression();
        } catch (error) {
            this.handleError("Invalid number input");
        }
    }

    /**
     * Handle operator input from user
     * @param {string} operator - The operator pressed (+, -, *, /)
     */
    handleOperatorInput(operator) {
        try {
            // If there's a pending calculation, perform it first
            if (this.model.getOperator() !== null && !this.model.isWaitingForNewValue()) {
                this.handleEqualsInput();
            }

            // Set up for next operation
            this.model.setPreviousValue(this.model.getCurrentValue());
            this.model.setOperator(operator);
            this.model.setWaitingForNewValue(true);
            
            // Update view to show current state
            this.updateView();
            this.updateExpression();
        } catch (error) {
            this.handleError("Invalid operator");
        }
    }

    /**
     * Handle equals input from user
     */
    handleEqualsInput() {
        try {
            // Only calculate if we have a complete expression
            if (this.model.getOperator() === null) {
                return;
            }

            const expression = this.model.buildExpression();
            const result = this.model.calculate();
            
            // Validate result
            if (!this.model.isValidNumber(result)) {
                throw new Error("Invalid calculation result");
            }

            // Add to history before updating model
            this.model.addToHistory(expression, result);

            // Update model with result
            this.model.setCurrentValue(result);
            this.model.setPreviousValue(null);
            this.model.setOperator(null);
            this.model.setWaitingForNewValue(true);
            
            this.updateView();
            this.updateExpression();
            this.updateHistory();
        } catch (error) {
            this.handleError(error.message);
        }
    }

    /**
     * Handle clear input (reset calculator)
     */
    handleClearInput() {
        this.model.reset();
        this.updateView();
        this.updateExpression();
    }

    /**
     * Handle clear entry input (clear current number only)
     */
    handleClearEntryInput() {
        this.model.clearEntry();
        this.updateView();
        this.updateExpression();
    }

    /**
     * Handle clear history input
     */
    handleClearHistoryInput() {
        this.model.clearHistory();
        this.updateHistory();
    }

    /**
     * Handle decimal point input
     */
    handleDecimalInput() {
        const currentValue = this.model.getCurrentValue().toString();
        
        try {
            if (this.model.isWaitingForNewValue()) {
                // Start new decimal number
                this.model.setCurrentValue(0);
                this.model.setWaitingForNewValue(false);
            }
            
            // Add decimal point if not already present
            if (!currentValue.includes('.')) {
                const newValue = currentValue + '.';
                this.model.setCurrentValue(parseFloat(newValue) || 0);
            }
            
            this.updateView();
            this.updateExpression();
        } catch (error) {
            this.handleError("Invalid decimal input");
        }
    }

    /**
     * Handle errors and display them to user
     * @param {string} message - Error message to display
     */
    handleError(message) {
        this.view.updateDisplay(`Error: ${message}`);
        // Reset model after error
        setTimeout(() => {
            this.model.reset();
            this.updateView();
            this.updateExpression();
        }, 2000);
    }

    /**
     * Update the view with current model state
     */
    updateView() {
        const currentValue = this.model.getCurrentValue();
        this.view.updateDisplay(currentValue);
    }

    /**
     * Update the expression display
     */
    updateExpression() {
        if (this.model.getPreviousValue() !== null && this.model.getOperator() !== null) {
            const prev = this.model.getPreviousValue();
            const operator = this.model.getOperatorSymbol(this.model.getOperator());
            const current = this.model.isWaitingForNewValue() ? '' : this.model.getCurrentValue();
            this.view.updateExpression(`${prev} ${operator} ${current}`);
        } else {
            this.view.updateExpression('');
        }
    }

    /**
     * Update the history display
     */
    updateHistory() {
        const history = this.model.getHistory();
        this.view.updateHistory(history);
    }

    /**
     * Get current calculator state (for debugging)
     * @returns {object} Current state of the calculator
     */
    getState() {
        return {
            model: this.model.getState(),
            display: this.view.getDisplayElement().textContent
        };
    }

    /**
     * Perform a complete calculation programmatically
     * @param {number} num1 - First number
     * @param {string} operator - Operator (+, -, *, /)
     * @param {number} num2 - Second number
     * @returns {number} Result of calculation
     */
    calculate(num1, operator, num2) {
        try {
            this.model.reset();
            this.model.setCurrentValue(num1);
            this.handleOperatorInput(operator);
            this.model.setCurrentValue(num2);
            this.model.setWaitingForNewValue(false);
            this.handleEqualsInput();
            return this.model.getCurrentValue();
        } catch (error) {
            throw new Error(`Calculation failed: ${error.message}`);
        }
    }

    /**
     * Enable/disable calculator (for future enhancements)
     * @param {boolean} enabled - Whether calculator should be enabled
     */
    setEnabled(enabled) {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.disabled = !enabled;
        });
    }
}