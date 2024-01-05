document.addEventListener("DOMContentLoaded", function () {
    // Load saved texts from localStorage
    function loadSavedTexts() {
        var savedTexts = localStorage.getItem('savedTexts');
        if (savedTexts) {
            document.getElementById('saved-texts').innerHTML = savedTexts;
            reapplyDnDEvents(); // Reapply events to the loaded texts
        }
    }

    function saveText(span, parent) {
        span.setAttribute('contenteditable', 'false');
        span.classList.remove('editable');
        var newText = span.innerText.trim();
        if (newText) {
            parent.dataset.displaytext = newText;
        }
        localStorage.setItem('savedTexts', document.getElementById('saved-texts').innerHTML);
    }

    document.getElementById('text-input').addEventListener('input', function () {
        var text = this.innerText.replace(/\s/g, '');
        var charCount = text.length;
        var charCountDisplay = document.getElementById('char-count');
        charCountDisplay.textContent = 'Characters: ' + charCount;

        if (charCount > 280) {
            charCountDisplay.style.color = 'red';
        } else {
            charCountDisplay.style.color = '';
        }
    });

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

    document.getElementById('star-button').addEventListener('click', function() {
        var textInput = document.getElementById('text-input');
        var savedTexts = document.getElementById('saved-texts');
        var toggleButton = document.getElementById('toggle-button');

        var fullText = textInput.innerHTML;
        var displayText = textInput.innerText.substring(0, 50);
        if (textInput.innerText.length > 50) displayText += '...';

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

        var container = document.getElementById('saved-texts');
        container.insertBefore(newSavedTextDiv, container.firstChild);

        newSavedTextDiv.setAttribute('draggable', 'true');

        newSavedTextDiv.appendChild(spanElement);
        newSavedTextDiv.appendChild(textButtonsDiv);

        savedTexts.appendChild(newSavedTextDiv);

        localStorage.setItem('savedTexts', savedTexts.innerHTML);
        reapplyDnDEvents();

        if (!isRotated) {
        // If not, show the saved texts and adjust the toggle button
        savedTexts.style.display = 'block';
        toggleButton.textContent = 'v'; // Change to reflect the open state
        toggleButton.style.transform = 'rotate(90deg)'; // Rotate the toggle button
        isRotated = true; // Update the isRotated state
    } else {
        // If already displayed, update the list without changing its display state
        localStorage.setItem('savedTexts', savedTexts.innerHTML);
    }

    var isRotated = false;

    document.getElementById('toggle-button').addEventListener('click', function() {
        var savedTexts = document.getElementById('saved-texts');
        
        isRotated = !isRotated; // Toggle the rotated state
    savedTexts.style.display = isRotated ? 'block' : 'none';
    this.style.transform = isRotated ? 'rotate(90deg)' : 'rotate(0deg)';
    this.textContent = isRotated ? 'v' : '>'; // Adjust text content based on state
});

    document.addEventListener('click', function(event) {
        var savedTexts = document.getElementById('saved-texts');
        var toggleButton = document.getElementById('toggle-button');
        var withinBoundaries = event.composedPath().includes(savedTexts) || event.composedPath().includes(toggleButton);

        if (!withinBoundaries && savedTexts.style.display === 'block') {
            savedTexts.style.display = 'none';
            toggleButton.textContent = '>';
        }
    });

    document.getElementById('saved-texts').addEventListener('click', function(event) {
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

    document.getElementById('saved-texts').addEventListener('blur', function(event) {
        if (event.target.tagName === 'SPAN' && event.target.classList.contains('editable')) {
            var parent = event.target.closest('.saved-text');
            saveText(event.target, parent);
        }
    }, true);

    document.getElementById('saved-texts').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            var target = event.target;
            var parent = target.closest('.saved-text');
            if (target.tagName === 'SPAN' && target.classList.contains('editable')) {
                event.preventDefault();
                saveText(target, parent);
            }
        }
    });

document.getElementById('sort-button').addEventListener('click', function() {
        var container = document.getElementById('saved-texts');
        var savedTexts = Array.from(container.getElementsByClassName('saved-text'));
        
        savedTexts.sort(function(a, b) {
            var textA = a.innerText.toUpperCase(); // convert text to uppercase to ensure case-insensitive comparison
            var textB = b.innerText.toUpperCase();
            return textA.localeCompare(textB);
        });

        // Clear the container and append sorted elements
        container.innerHTML = '';
        savedTexts.forEach(function(text) {
            container.appendChild(text);
        });

        // Update local storage after sorting
        localStorage.setItem('savedTexts', container.innerHTML);
    });

    document.getElementById('clear-button').addEventListener('click', function() {
        document.getElementById('text-input').innerText = ''; // Clear the text input
    });

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

    function handleDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
        this.classList.add('dragElem');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        var dragElem = document.querySelector('.dragElem');
        if (dragElem !== this) {
            var rect = this.getBoundingClientRect();
            var relY = e.clientY - rect.top;

            dragElem.parentNode.removeChild(dragElem);

            if (relY < rect.height / 2) {
                this.parentNode.insertBefore(dragElem, this);
            } else {
                this.parentNode.insertBefore(dragElem, this.nextSibling);
            }

            var savedTextsContainer = document.getElementById('saved-texts');
            localStorage.setItem('savedTexts', savedTextsContainer.innerHTML);

            reapplyDnDEvents();
        }

        dragElem.classList.remove('dragElem');
        return false;
    }

    loadSavedTexts(); // Load saved texts when the page loads
});
