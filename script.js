document.addEventListener("DOMContentLoaded", function () {
    var isRotated = false;
    var isSortedAscending = true;

    function loadSavedTexts() {
        var savedTexts = localStorage.getItem('savedTexts');
        if (savedTexts) {
            document.getElementById('saved-texts').innerHTML = savedTexts;
            reapplyDnDEvents();
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

    document.getElementById('copy-button').addEventListener('click', function () {
        var textInput = document.getElementById('text-input');
        var range = document.createRange();
        range.selectNodeContents(textInput);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('copy');
        sel.removeAllRanges();
    });

    document.getElementById('star-button').addEventListener('click', function () {
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
        newSavedTextDiv.setAttribute('draggable', 'true');

        var dragHandleDiv = document.createElement('div');
        dragHandleDiv.className = 'drag-handle';
        dragHandleDiv.textContent = '⠿'; // Drag handle symbol
        newSavedTextDiv.appendChild(dragHandleDiv);
        
        var spanElement = document.createElement('span');
        spanElement.textContent = displayText;
        spanElement.setAttribute('unselectable', 'on'); // Making text non-selectable
        newSavedTextDiv.appendChild(spanElement);

        var textButtonsDiv = document.createElement('div');
        textButtonsDiv.className = 'text-buttons';
        textButtonsDiv.innerHTML = '<button class="add-text">+</button>' +
                                   '<button class="remove-text">-</button>';
        
         // Append elements in the correct order
        newSavedTextDiv.appendChild(dragHandleDiv); // Drag handle first
        newSavedTextDiv.appendChild(spanElement);
        newSavedTextDiv.appendChild(textButtonsDiv);
        
        // Append the new saved text div to the saved texts container
        savedTexts.appendChild(newSavedTextDiv);
        
        localStorage.setItem('savedTexts', savedTexts.innerHTML);
        reapplyDnDEvents();

        // Ensure the saved texts are shown
        savedTexts.style.display = 'block';
        toggleButton.textContent = '▼'; 
        toggleButton.style.transform = 'rotate(0deg)';
        isRotated = true;
    });

    document.getElementById('toggle-button').addEventListener('click', function() {
        var savedTexts = document.getElementById('saved-texts');

        isRotated = !isRotated;
        savedTexts.style.display = isRotated ? 'block' : 'none';
        this.style.transform = isRotated ? 'rotate(90deg)' : 'rotate(0deg)';
        this.textContent = isRotated ? '▶' : '▶';
    });

    document.addEventListener('click', function(event) {
        var savedTexts = document.getElementById('saved-texts');
        var toggleButton = document.getElementById('toggle-button');
        var sortButton = document.getElementById('sort-button');

        if (!event.composedPath().includes(savedTexts) && !event.composedPath().includes(toggleButton) && event.target !== sortButton) {
            savedTexts.style.display = 'none';
            toggleButton.textContent = '▶';
            isRotated = false;
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
            document.getElementById('toggle-button').textContent = '▶';
            isRotated = false;
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
            var textA = a.innerText.toUpperCase();
            var textB = b.innerText.toUpperCase();
            return isSortedAscending ? textA.localeCompare(textB) : textB.localeCompare(textA);
        });

        container.innerHTML = '';
        savedTexts.forEach(function(text) {
            container.appendChild(text);
        });

        localStorage.setItem('savedTexts', container.innerHTML);
        isSortedAscending = !isSortedAscending; // Toggle sort order
    });

    document.getElementById('clear-button').addEventListener('click', function() {
        document.getElementById('text-input').innerText = ''; // Clear the text input
    });

    function reapplyDnDEvents() {
        var savedTexts = document.querySelectorAll('#saved-texts .saved-text');
        savedTexts.forEach(function(savedText) {
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

    loadSavedTexts();
});
