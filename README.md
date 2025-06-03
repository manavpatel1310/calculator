Basic Calculation Flow
javascriptUser inputs: 5 + 3 =
1. View captures "5" button click
2. View triggers 'numberClick' event
3. Controller receives event, updates Model
4. Controller updates View display

Model state after each step:
Input "5": currentValue = 5
Input "+": previousValue = 5, operator = "+", waitingForNewValue = true
Input "3": currentValue = 3, waitingForNewValue = false
Input "=": result = 8, reset for next operation