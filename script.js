document.addEventListener("DOMContentLoaded", function () {
    var isRotated = false;
    var isSortedAscending = true;
// Define the reapplyDnDEvents function first
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
        newSavedTextDiv.setAttribute('draggable', 'true');

        var dragHandleDiv = document.createElement('div');
        dragHandleDiv.className = 'drag-handle';
        dragHandleDiv.textContent = '⠿'; // Updated drag handle symbol
        newSavedTextDiv.appendChild(dragHandleDiv);
        
        var spanElement = document.createElement('span');
        spanElement.textContent = displayText;
        newSavedTextDiv.appendChild(spanElement);

        var textButtonsDiv = document.createElement('div');
        textButtonsDiv.className = 'text-buttons';
        textButtonsDiv.innerHTML = '<button class="add-text">+</button>' +
                                   '<button class="remove-text">-</button>';
        newSavedTextDiv.appendChild(textButtonsDiv);
        
        document.getElementById('saved-texts').appendChild(newSavedTextDiv);

        localStorage.setItem('savedTexts', savedTexts.innerHTML);
        reapplyDnDEvents();

        savedTexts.style.display = 'block';
        toggleButton.textContent = 'v'; 
        toggleButton.style.transform = 'rotate(90deg)';
        isRotated = true;
    });

    function handleDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
        this.classList.add('dragElem');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e) {
        e.preventDefault();
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
    }

    loadSavedTexts();
});
