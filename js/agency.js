// Agency Theme JavaScript

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function(){ 
            $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // listen for click event on document and close menu
    $('body').click(function(event){
        if ($(event.target).closest('#mainNav').length) {
            return; //do nothing if event target is within the navigation
        } else {
            // do something if the event target is outside the navigation
             // code for collapsing menu here...
             $('.navbar-collapse').collapse('hide');
        }
    });
    
    //Calculator Script
    $(document).ready(function () {
        $('.btn').click(function () {
            button_check(this.innerText);
        });
        $(document).keyup(function (event) {
            var key = event.key;
            if ($.inArray(key, valid_input_array) >= 0) {
                button_check(key);
            }
        });
    });
    
    var equation_storage = [''];
    var equation_index = 0;
    var operator_array = ['+', '-', '*', '%'];
    var equation_history = [];
    var button_text = null;
    var valid_input_array = ['1', '2', '3','4','5','6','7','8','9','0','.','+','-','*','%','=','Delete', 'Backspace'];
    // the button text will be compared against four/five cases - one to separate numbers, one to separate operators
    // excluding '=', a case for '=', and a case (or two, depending) on C and CE.
    // it should increment the index add an operator and increment the index again to prepare for a new number.
    // store the value of the button pressed.
    function button_check(button) {
        button_text = button;
        //find the operators here.
        if ($.inArray(button_text, operator_array) >= 0) {
            if (equation_storage[0] === '') {
                return;
            }
            //check to see if the index position is a space (since one would be present if an operator had already been pressed)
            if ((equation_storage[equation_index]) === '') {
                //then move the equation index back one
                equation_index--;
                //replace the operator
                equation_storage[equation_index] = button_text;
                updateDisplay();
                //move the equation index to the right again
                equation_index++
            } else {
                add_operator();
                updateDisplay();
            }
        } else if (button_text === '=') {
            //could probably put all of this into an "equals handler".
            //if the equation index is 0 then you cannot press =
            //if the end of the equation ends in a '' which means an operator was pressed before =
            if (equation_storage[0] === undefined) {
                $('.display_screen').text('Ready');
                return;
            }
            if (equation_storage[equation_storage.length - 1] === '') {
                equation_storage.pop();
                //then clone the operation before the operation
                var clone = equation_storage.slice(0, equation_storage.length - 1);
                console.log(clone);
                //clone is checked to see if it is a number
                if (isNaN(clone)) {
                    //if it is not a number it must be an equation
                    var clone_result = a_s_calculate(clone);
                    //add the result onto the end of equation_storage
                    equation_storage.push(clone_result[0]);
                    //if equation_history has an = at the end of it then it will evaluate true
                } else {
                    //if it is a number then it is a sum and must be pushed onto the end of the equation_storage array.
                    equation_storage.push(clone[0]);
                }
            } else if (equation_history[equation_history.length - 1] === '=') {
                //it will grab the last operand and operator and add it to the front of the equation_storage array
                var history_temp = equation_history.splice(-3, 2);
                console.log(history_temp);
                equation_storage = equation_storage.concat(history_temp);
            }
            //duplicate the array
            equation_history = equation_storage.slice();
            equation_history.push('=');
            var evaluation_index = 0;
            m_d_calculate(equation_storage);
            a_s_calculate(equation_storage);
            updateDisplay();
            equation_index = 0;
        } else if (button_text === 'C' || button_text === 'Delete') {
            clear_all();
            updateDisplay()
        } else if (button_text === 'CE' || button_text === 'Backspace') {
            clear_entry();
            updateDisplay();
        } else if (button_text === '.') {
            if ($('.decimal').hasClass('pressed')) {
            } else {
                $('.decimal').addClass('pressed');
                add_integer();
                updateDisplay()
            }
        } else {
            add_integer();
            updateDisplay()
        }
    }
    
    //restores the global variables to their ready positions.
    function clear_all() {
        equation_storage = [''];
        equation_index = 0;
        button_text = null;
        equation_history = [];
        $('div').removeClass('pushed')
    }
    
    //Clear button function
    function clear_entry() {
        equation_storage.pop();
        equation_storage[equation_index] = '';
    }
    
    //function that adds button_text to the equation storage array without moving the index.
    function add_integer() {
        equation_storage[equation_index] += button_text;
    }
    
    //function that preps the operator index of the equation_storage array, moves the index forward, adds the operator, preps the next index,
    //and then moves the index forward.
    function add_operator() {
        equation_storage.push(button_text);
        equation_index+=2;
        equation_storage[equation_index] = '';
        $('div').removeClass('pressed');
        console.log(equation_storage)
    }
    function updateDisplay() {
        $('.display_screen').text(equation_storage.join(' '));
    }
    
    //function that runs when the sorting function encounters an '=' sign.
    function a_s_calculate(operation) {
        function addition(total, num, initial_value) {
            return parseFloat(total) + parseFloat(num)
        }
    
        function subtraction(total, num, initial_value) {
            return total - num
        }
    
        //a loop to run through the array and stop when it finds a + or - operator.
        for (var evaluation_index = 0; evaluation_index< operation.length; evaluation_index++) {
            if (operation[evaluation_index] === '+') {
                //create a temporary array to evaluate the operand pair
                var temp = [];
                //remove the  operator and operand pair to the temp
                temp = (operation.splice(evaluation_index - 1, 3));
                console.log(operation);
                //a loop to run through the temp equation
                for (var i = 0; i < temp.length; i++) {
                    //the loop stops when it encounters a +
                    if (temp[i] === '+') {
                        //the loop removes the operator
                        temp.splice(i, 1);
                        //calculate using reduce
                        var addition_result = temp.reduce(addition);
                        //add the result to the front of the array (addition and subtraction are l-to-r)
                        operation.unshift(addition_result);
                        //reset the equation for loop to evaluate the new equation
                        evaluation_index = 0;
                        console.log(addition_result);
                    }
                }
            } else if (operation[evaluation_index] === '-') {
                //create a temporary array to evaluate the operand pair
                temp = [];
                //remove the  operator and operand pair to the temp
                temp = (operation.splice(evaluation_index - 1, 3));
                console.log(operation);
                //a loop to run through the temp equation
                for (i = 0; i < temp.length; i++) {
                    if (temp[i] === '-') {
                        temp.splice(i, 1);
                        var subtraction_result = temp.reduce(subtraction);
                        operation.unshift(subtraction_result);
                        evaluation_index = 0;
                        console.log(subtraction_result);
                    }
                }
            }
        }
        updateDisplay();
        return operation;
    }
    function m_d_calculate(operation) {
        function multiplication(total, num, initial_value) {
            return total * num
        }
    
        function division(total, num, initial_value) {
            return total / num
        }
    
        for (var evaluation_index = 0; evaluation_index < operation.length; evaluation_index++) {
            if (operation[evaluation_index] === '*') {
                //move the evaluation index to the left
                evaluation_index--;
                //remove the number at evaluation index and add it to the temp
                var multiplication_temp = operation.splice(evaluation_index, 1);
                console.log(multiplication_temp);
                //remove the number to the right of the index and add to the end of the temp
                multiplication_temp.push(operation.splice(evaluation_index + 1, 1)[0]);
                //evaluate the temp using mulitplication reduction
                var multiplication_result = multiplication_temp.reduce(multiplication);
                console.log(multiplication_result);
                //set the value at index to equal the multiplication reduction
                operation[evaluation_index]= multiplication_result;
            } else if (operation[evaluation_index] === '%') {
                //move the evaluation index to the left
                evaluation_index--;
                //remove the number at evaluation index and add it to the temp
                var division_temp = operation.splice(evaluation_index, 1);
                console.log(division_temp);
                //remove the number to the right of the index and add to the end of the temp
                division_temp.push(operation.splice(evaluation_index + 1, 1)[0]);
                //evaluate the temp using divison reduction
                var division_result = division_temp.reduce(division);
                if (division_result === Infinity) {
                    equation_storage = ['Error'];
                    return;
                } else {
                    console.log(division_result);
                    //set the value at index to equal the division reduction
                    operation[evaluation_index]= division_result;
                }
            }
        }
        updateDisplay();
        return operation;
    }
})(jQuery); //end use of strict

