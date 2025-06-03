/**
 * CalculatorView.js - View Layer
 * Handles all user interface interactions and display updates
 * Responsible for rendering data and capturing user input
 */

class CalculatorView {
    constructor() {
        this.displayElement = document.getElementById('display');
        this.expressionElement = document.getElementById('expression');
        this.historyElement = document.getElementById('history');
        this.bindEvents();
    }

    /**
     * Update the expression display
     * @param {string} expression - The expression to display
     */
    updateExpression(expression) {
        this.expressionElement.textContent = expression || '';
    }

    /**
     * Update the history display
     * @param {Array} history - Array of calculation history
     */
    updateHistory(history) {
        if (!history || history.length === 0) {
            this.historyElement.innerHTML = '<div style="text-align: center; color: #999;">No calculations yet</div>';
            return;
        }

        const historyHTML = history.map(item => 
            `<div class="history-item">
                <span>${item.expression}</span>
                <span>= ${item.result}</span>
            </div>`
        ).join('');

        this.historyElement.innerHTML = historyHTML;
        
        // Auto-scroll to bottom
        this.historyElement.scrollTop = this.historyElement.scrollHeight;
    }

    /**
     * Clear history display
     */
    clearHistory() {
        this.historyElement.innerHTML = '<div style="text-align: center; color: #999;">No calculations yet</div>';
    }

    /**
     * Update the calculator display
     * @param {number|string} value - The value to display
     */
    updateDisplay(value) {
        if (typeof value === 'string' && value.includes('Error')) {
            // Display error message
            this.displayElement.textContent = value;
            this.displayElement.classList.add('error');
        } else {
            // Remove error styling
            this.displayElement.classList.remove('error');
            
            // Format the number for display
            if (typeof value === 'number') {
                // Handle very large or very small numbers
                if (Math.abs(value) > 999999999999 || (Math.abs(value) < 0.000001 && value !== 0)) {
                    this.displayElement.textContent = value.toExponential(6);
                } else {
                    // Format number with appropriate decimal places
                    this.displayElement.textContent = this.formatNumber(value);
                }
            } else {
                this.displayElement.textContent = value.toString();
            }
        }
    }

    /**
     * Format number for display
     * @param {number} num - Number to format
     * @returns {string} Formatted number string
     */
    formatNumber(num) {
        // Remove trailing zeros and unnecessary decimal points
        return parseFloat(num.toPrecision(12)).toString();
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        this.bindButtonEvents();
        this.bindKeyboardEvents();
    }

    /**
     * Bind click events to calculator buttons (including clear history button)
     */
    bindButtonEvents() {
        // Include both calculator buttons and the clear history button
        const buttons = document.querySelectorAll('.btn, .clear-history-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Add visual feedback
                this.addButtonFeedback(e.target);
                
                const action = e.target.getAttribute('data-action');
                const number = e.target.getAttribute('data-number');
                const operator = e.target.getAttribute('data-operator');

                // Trigger appropriate custom events for the controller
                this.handleButtonClick(action, { number, operator });
            });
        });
    }

    /**
     * Handle button click and trigger appropriate events
     * @param {string} action - The action type
     * @param {object} data - Additional data (number, operator)
     */
    handleButtonClick(action, data) {
        switch (action) {
            case 'number':
                this.triggerEvent('numberClick', { number: data.number });
                break;
            case 'operator':
                this.triggerEvent('operatorClick', { operator: data.operator });
                break;
            case 'equals':
                this.triggerEvent('equalsClick');
                break;
            case 'clear':
                this.triggerEvent('clearClick');
                break;
            case 'clear-entry':
                this.triggerEvent('clearEntryClick');
                break;
            case 'decimal':
                this.triggerEvent('decimalClick');
                break;
            case 'clear-history':
                this.triggerEvent('clearHistoryClick');
                break;
        }
    }

    /**
     * Add visual feedback to button press
     * @param {HTMLElement} button - The button element
     */
    addButtonFeedback(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }

    /**
     * Bind keyboard events for calculator input
     */
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault(); // Prevent default browser behavior
            this.handleKeyPress(e);
        });
    }

    /**
     * Handle keyboard input
     * @param {KeyboardEvent} e - The keyboard event
     */
    handleKeyPress(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.triggerEvent('numberClick', { number: key });
            this.highlightButton(`[data-number="${key}"]`);
        } else if (['+', '-', '*', '/'].includes(key)) {
            this.triggerEvent('operatorClick', { operator: key });
            this.highlightButton(`[data-operator="${key}"]`);
        } else if (key === 'Enter' || key === '=') {
            this.triggerEvent('equalsClick');
            this.highlightButton('[data-action="equals"]');
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            this.triggerEvent('clearClick');
            this.highlightButton('[data-action="clear"]');
        } else if (key === 'Backspace') {
            this.triggerEvent('clearEntryClick');
            this.highlightButton('[data-action="clear-entry"]');
        } else if (key === '.' || key === ',') {
            this.triggerEvent('decimalClick');
            this.highlightButton('[data-action="decimal"]');
        } else if (key === 'Delete') {
            this.triggerEvent('clearHistoryClick');
            this.highlightButton('.clear-history-btn');
        }
    }

    /**
     * Highlight button when keyboard shortcut is used
     * @param {string} selector - CSS selector for the button
     */
    highlightButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.classList.add('btn-active');
            this.addButtonFeedback(button);
            setTimeout(() => {
                button.classList.remove('btn-active');
            }, 150);
        }
    }

    /**
     * Trigger custom events for the controller
     * @param {string} eventName - Name of the event
     * @param {object} data - Event data
     */
    triggerEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { 
            detail: data,
            bubbles: true 
        });
        document.dispatchEvent(event);
    }

    /**
     * Show loading state (for future enhancements)
     */
    showLoading() {
        this.displayElement.textContent = 'Calculating...';
    }

    /**
     * Get display element for direct access if needed
     * @returns {HTMLElement} The display element
     */
    getDisplayElement() {
        return this.displayElement;
    }
}