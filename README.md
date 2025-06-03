# Calculator Web Application

A modern, responsive calculator web application built with HTML, CSS, and JavaScript. This calculator provides basic arithmetic operations with a clean and user-friendly interface.

## Features

- Basic arithmetic operations (addition, subtraction, multiplication, division)
- Clean and responsive user interface
- Keyboard support
- Clear and All Clear functionality
- Decimal point operations
- Error handling for invalid operations

## Demo

Try the live demo: [Calculator Web App](https://manavpatel1310.github.io/calculator/)

You can also run it locally by opening the `index.html` file in your web browser.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/manavpatel1310/calculator.git
   cd calculator
   ```

2. No additional installation is required! Simply open `index.html` in your web browser.

## Usage

1. Click the number buttons (0-9) to input numbers
2. Use operation buttons (+, -, ×, ÷) for calculations
3. Press '=' to see the result
4. Press 'C' to clear the current input
5. Press 'AC' to reset the calculator

### Keyboard Support

The calculator also supports keyboard input:
- Numbers (0-9)
- Operators (+, -, *, /)
- Enter key (=)
- Backspace (Clear)
- Escape (All Clear)
- Decimal point (.)

## Project Structure

```
calculator/
├── index.html      # Main HTML file
├── css/            # Stylesheet directory
└── js/             # JavaScript directory
```

## Technical Implementation

The calculator follows the MVC (Model-View-Controller) pattern:

1. Model: Handles the calculation logic and state management
2. View: Manages the user interface and user input
3. Controller: Coordinates between Model and View

Basic Calculation Flow:
```javascript
User inputs: 5 + 3 =
1. View captures "5" button click
2. View triggers 'numberClick' event
3. Controller receives event, updates Model
4. Controller updates View display


Model state after each step:
Input "5": currentValue = 5
Input "+": previousValue = 5, operator = "+", waitingForNewValue = true
Input "3": currentValue = 3, waitingForNewValue = false
Input "=": result = 8, reset for next operation