document.addEventListener("DOMContentLoaded", function () {
    // Function to save the text to local storage
    function saveText(span, parent) {
        span.setAttribute('contenteditable', 'false');
        span.classList.remove('editable');
        var newText = span.innerText.trim();
        if (newText) {
            parent.dataset.displaytext = newText;
        }
        localStorage.setItem('savedTexts', document.getElementById('saved-texts').innerHTML);
    }

    // Event listener for 'text-input' to update character count
    document.getElementById('text-input').addEventListener('input', function () {
        var text = this.innerText.replace(/\s/g, ''); // Replace whitespace characters
        var charCount = text.length;
        var charCountDisplay = document.getElementById('char-count');
        charCountDisplay.textContent = 'Characters: ' + charCount;

        if (charCount > 280) {
            charCountDisplay.style.color = 'red';
        } else {
            charCountDisplay.style.color = '';
        }
    });

    // Event listener for 'copy-button' to copy text to clipboard
    document.getElementById('copy-button').addEventListener('click', function() {
        var textInput = document.getElementById('text-input');
        var range = document.createRange();
        range.selectNodeContents(textInput);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('copy');
        sel.removeAllRanges();
    });

    // Event listener for 'star-button' to create saved text elements
    document.getElementById('star-button').addEventListener('click', function() {
        var textInput = document.getElementById('text-input');
        var savedTexts = document.getElementById('saved-texts');
        savedTexts.style.display = 'block';

        var fullText = textInput.innerHTML;
        var displayText = textInput.innerText.substring(0, 50); // Truncate to 50 characters
        if (textInput.innerText.length > 50) displayText += '...'; // Add ellipsis if truncated

        // Create new saved text elements
        var newSavedTextDiv = document.createElement('div');
        newSavedTextDiv.className = 'saved-text';
        newSavedTextDiv.setAttribute('data-fulltext', fullText);
        newSavedTextDiv.setAttribute('data-displaytext', displayText);

        var spanElement = document.createElement('span');
        spanElement.textContent = displayText;

        var textButtonsDiv = document.createElement('div');
        textButtonsDiv.className = 'text-buttons';
        textButtonsDiv.innerHTML = '<button class="add-text">+</button>' +
                                   '<button class="remove-text">-</button>';

        // Add the new saved text to the top of the saved texts container
        var container = document.getElementById('saved-texts');
        container.insertBefore(newSavedTextDiv, container.firstChild);

        // Make the new saved text draggable
        newSavedTextDiv.setAttribute('draggable', 'true');

        // Append elements
        newSavedTextDiv.appendChild(spanElement);
        newSavedTextDiv.appendChild(textButtonsDiv);

        // Add event listeners for click, blur, and keydown
        newSavedTextDiv.addEventListener('click', function(event) {
            var target = event.target;
            var parent = target.closest('.saved-text');
            if (target.classList.contains('remove-text')) {
                parent.remove();
                localStorage.setItem('savedTexts', document.getElementById('saved-texts').innerHTML);
            } else if (target.classList.contains('add-text')) {
                var fullText = parent.getAttribute('data-fulltext');
                document.getElementById('text-input').innerHTML = fullText;
                document.getElementById('saved-texts').style.display = 'none';
                document.getElementById('toggle-button').textContent = '>';
            } else if (target.tagName === 'SPAN' && !target.classList.contains('text-buttons')) {
                target.setAttribute('contenteditable', 'true');
                target.classList.add('editable');
                target.focus();
            }
        });

        newSavedTextDiv.addEventListener('blur', function(event) {
            if (event.target.tagName === 'SPAN' && event.target.classList.contains('editable')) {
                var parent = event.target.closest('.saved-text');
                saveText(event.target, parent);
            }
        }, true);

        newSavedTextDiv.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                var target = event.target;
                var parent = target.closest('.saved-text');
                if (target.tagName === 'SPAN' && target.classList.contains('editable')) {
                    event.preventDefault();
                    saveText(target, parent);
                }
            }
        });
    });

    // Event listener for 'toggle-button' to toggle display of saved texts
    var isRotated = false;
    document.getElementById('toggle-button').addEventListener('click', function() {
        var savedTexts = document.getElementById('saved-texts');
        savedTexts.style.display = savedTexts.style.display === 'block' ? 'none' : 'block';

        // Toggle rotation 90 degrees clockwise
        isRotated = !isRotated;
        this.style.transform = isRotated ? 'rotate(90deg)' : 'rotate(0deg)';
    });

    // Event listener to close saved texts when clicking outside
    document.addEventListener('click', function(event) {
        var savedTexts = document.getElementById('saved-texts');
        var toggleButton = document.getElementById('toggle-button');
        var withinBoundaries = event.composedPath().includes(savedTexts) || event.composedPath().includes(toggleButton);

        if (!withinBoundaries && savedTexts.style.display === 'block') {
            savedTexts.style.display = 'none';
            toggleButton.textContent = '>';
        }
    });

    // Function to reapply drag-and-drop events
    function reapplyDnDEvents() {
        var savedTexts = document.querySelectorAll('#saved-texts .saved-text');
        [].forEach.call(savedTexts, function (savedText) {
            savedText.removeEventListener('dragstart', handleDragStart);
            savedText.removeEventListener('dragover', handleDragOver);
            savedText.removeEventListener('drop', handleDrop);

            savedText.addEventListener('dragstart', handleDragStart, false);
            savedText.addEventListener('dragover', handleDragOver, false);
            savedText.addEventListener('drop', handleDrop, false);
        });
    }

    // Function to handle the drag start
    function handleDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
        this.classList.add('dragElem');
    }

    // Function to handle the drag over
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary for allowing to drop
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    // Function to handle the drop
    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting
        }

        var dragElem = document.querySelector('.dragElem');
        if (dragElem !== this) {
            // Determine the mouse position relative to the drop target
            var rect = this.getBoundingClientRect();
            var relY = e.clientY - rect.top;

            // Remove the dragged element from its original position
            dragElem.parentNode.removeChild(dragElem);

            // Insert based on the relative position
            if (relY < rect.height / 2) {
                this.parentNode.insertBefore(dragElem, this);
            } else {
                this.parentNode.insertBefore(dragElem, this.nextSibling);
            }

            // Save the new order to localStorage
            var savedTextsContainer = document.getElementById('saved-texts');
            localStorage.setItem('savedTexts', savedTextsContainer.innerHTML);

            reapplyDnDEvents(); // Reapply event listeners to all elements
        }

        dragElem.classList.remove('dragElem');
        return false;
    }

    // Function to add event listeners for drag and drop
    function addDnDEvents(elem) {
        elem.addEventListener('dragstart', handleDragStart, false);
        elem.addEventListener('dragover', handleDragOver, false);
        elem.addEventListener('drop', handleDrop, false);
    }

    // Add drag and drop events to each saved text
    var savedTexts = document.querySelectorAll('#saved-texts .saved-text');
    [].forEach.call(savedTexts, addDnDEvents);

    // Function to sort saved texts alphabetically
    function sortSavedTextsAlphabetically() {
        var items = Array.from(document.querySelectorAll('#saved-texts .saved-text'));
        items.sort(function(a, b) {
            var textA = a.innerText.trim().toUpperCase(); // Get the text and convert to uppercase for case-insensitive comparison
            var textB = b.innerText.trim().toUpperCase();
            return textA.localeCompare(textB); // Compare texts
        });

        // Re-append items in sorted order
        var container = document.getElementById('saved-texts');
        items.forEach(function(item) {
            container.appendChild(item);
        });
    }

    // Event listener for 'sort-button' to sort saved texts alphabetically
    var isAlphabeticallySorted = false;
    document.getElementById('sort-button').addEventListener('click', function() {
        toggleSortOrder();
    });

    // Function to toggle sort order
    function toggleSortOrder() {
        if (isAlphabeticallySorted) {
            // Load custom order from storage
            var savedOrder = localStorage.getItem('savedOrder');
            if (savedOrder) {
                document.getElementById('saved-texts').innerHTML = savedOrder;
                reapplyDnDEvents();
            }
        } else {
            // Save current order and sort alphabetically
            var currentOrder = document.getElementById('saved-texts').innerHTML;
            localStorage.setItem('savedOrder', currentOrder);
            sortSavedTextsAlphabetically();
        }
        isAlphabeticallySorted = !isAlphabeticallySorted;
    }
});
