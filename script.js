document.addEventListener("DOMContentLoaded", function () {
    var isRotated = false;
    var isSortedAscending = true;
    var autoSaveTimer; // Holds the auto-save timer
    var lastSavedText = ""; // Track the last saved or autosaved text

    function loadSavedTexts() {
        // Use a default value if 'savedTexts' is not found in localStorage
        var savedTextsJSON = localStorage.getItem('savedTexts');
        var savedTexts = savedTextsJSON ? JSON.parse(savedTextsJSON).linkedin : [];
        var linkedinSaved = document.getElementById('linkedin-saved');
        linkedinSaved.innerHTML = ''; // Clear existing items before loading new ones

        savedTexts.forEach(function(textData) {
            var newSavedTextDiv = document.createElement('div');
            newSavedTextDiv.className = 'saved-text';
            newSavedTextDiv.setAttribute('data-id', textData.id); // Set unique identifier
            newSavedTextDiv.setAttribute('data-fulltext', textData.fullText);
            newSavedTextDiv.setAttribute('data-displaytext', textData.displayText);
            newSavedTextDiv.setAttribute('draggable', 'true');

            var spanElement = document.createElement('span');
            spanElement.textContent = textData.displayText;
            // Make text non-selectable for drag, but selectable when editable
            spanElement.classList.add('editable-text');

            var textButtonsDiv = document.createElement('div');
            textButtonsDiv.className = 'text-buttons';
            textButtonsDiv.innerHTML = '<button class="add-text">+</button><button class="remove-text">-</button>';

            newSavedTextDiv.appendChild(spanElement);
            newSavedTextDiv.appendChild(textButtonsDiv);

            linkedinSaved.appendChild(newSavedTextDiv);
        });
        
        reapplyDnDEvents();
    }
});
    // Utility function to append saved text to the UI
    function appendSavedTextToUI(textData) {
        var linkedinSaved = document.getElementById('linkedin-saved');
        var newSavedTextDiv = document.createElement('div');
        newSavedTextDiv.className = 'saved-text';
        newSavedTextDiv.setAttribute('data-id', textData.id);
        newSavedTextDiv.setAttribute('data-fulltext', textData.fullText);
        newSavedTextDiv.setAttribute('data-displaytext', textData.displayText);
        newSavedTextDiv.setAttribute('draggable', 'true');

        var spanElement = document.createElement('span');
        spanElement.textContent = textData.displayText;
        spanElement.classList.add('editable-text');

        var textButtonsDiv = document.createElement('div');
        textButtonsDiv.className = 'text-buttons';
        textButtonsDiv.innerHTML = '<button class="add-text">+</button><button class="remove-text">-</button>';

        newSavedTextDiv.appendChild(spanElement);
        newSavedTextDiv.appendChild(textButtonsDiv);

        linkedinSaved.appendChild(newSavedTextDiv);
    }
    
    function saveText(span, parent) {
        var textId = parent.getAttribute('data-id');
        var savedTextsJSON = localStorage.getItem('savedTexts');
        var savedTexts = savedTextsJSON ? JSON.parse(savedTextsJSON).linkedin : [];
        var index = savedTexts.findIndex(text => text.id === textId);

        if (index !== -1) {
            savedTexts[index].displayText = span.innerText.trim();
            savedTexts[index].fullText = parent.getAttribute('data-fulltext'); // Assuming fullText is stored in data-fulltext attribute
        }

        localStorage.setItem('savedTexts', JSON.stringify({linkedin: savedTexts}));
        loadSavedTexts(); // Refresh the displayed list
    }

    function autoSaveOrUpdate() {
        var textInput = document.getElementById('text-input');
        var fullText = textInput.innerHTML.trim();
        if (!fullText || fullText === lastSavedText) return; // Don't auto-save if empty or unchanged
        var displayText = textInput.innerText.trim().substring(0, 50) + (textInput.innerText.trim().length > 50 ? '...' : '');
        var existingId = textInput.getAttribute('data-current-id'); // Track if current text is being edited

        var savedTextsJSON = localStorage.getItem('savedTexts');
        var savedTexts = savedTextsJSON ? JSON.parse(savedTextsJSON).linkedin : [];
        var newTextId = existingId || Date.now().toString();
        
        var index = existingId ? savedTexts.findIndex(item => item.id === existingId) : -1;
        if (index !== -1) {
            savedTexts[index].fullText = fullText;
            savedTexts[index].displayText = displayText;
        } else {
            savedTexts.push({ id: newTextId, fullText: fullText, displayText: displayText });
            textInput.setAttribute('data-current-id', newTextId);
        }

        localStorage.setItem('savedTexts', JSON.stringify({linkedin: savedTexts}));
        lastSavedText = fullText; // Update the last saved text
        loadSavedTexts(); // Reload saved texts to reflect changes
    }

    function resetAutoSaveTimer() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(autoSaveOrUpdate, 5000);
    }

    document.getElementById('text-input').addEventListener('input', function () {
    // Update character and word count whenever the text changes
    var text = this.innerText.replace(/\s/g, '');
    var charCount = text.length;
    var charCountDisplay = document.getElementById('char-count');
    charCountDisplay.textContent = 'Characters: ' + charCount;

    if (charCount > 3000) {
        charCountDisplay.style.color = 'red';
    } else {
        charCountDisplay.style.color = '';
    }
    updateCharCount();
    resetAutoSaveTimer(); // Reset the auto-save timer on input
});

document.getElementById('text-input').addEventListener('paste', function(e) {
    e.preventDefault();
    var text = e.clipboardData.getData('text/plain');
    document.execCommand("insertHTML", false, text);
    updateCharCount();
    resetAutoSaveTimer();
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

    // Define the applyAnimationDelays function here
    function applyAnimationDelays() {
        var savedTexts = document.querySelectorAll('#saved-texts .saved-text');
        var delayIncrement = 0.065; // Increment delay by 0.1s for each line

        savedTexts.forEach(function(savedText, index) {
            var delay = index * delayIncrement;
            console.log('Element index:', index, 'Delay:', delay + 's'); // Debugging line
            savedText.style.animationDelay = delay + 's';
            savedText.classList.remove('reverse');  // Remove reverse animation class
        });
    }

    function applyReverseAnimationDelays() {
    var savedTexts = document.querySelectorAll('#saved-texts .saved-text');
    var delayIncrement = 0.05;
    var maxDelay = (savedTexts.length - 1) * delayIncrement; // Calculate the maximum delay for the last item

    savedTexts.forEach(function(savedText, index) {
        var delay = (savedTexts.length - index - 1) * delayIncrement;
        savedText.style.animationDelay = delay + 's';
        savedText.classList.add('reverse');  // Apply reverse animation class
        });
    }
    
    document.getElementById('star-button').addEventListener('click', function () {
    var textInput = document.getElementById('text-input');
    var linkedinSaved = document.getElementById('linkedin-saved'); // LinkedIn section
    var toggleButton = document.getElementById('toggle-button');

    var fullText = textInput.innerHTML.trim();
    var displayText = textInput.innerText.trim().substring(0, 50) + (textInput.innerText.trim().length > 50 ? '...' : '');
    var existingId = textInput.getAttribute('data-current-id'); // This line is new

    var savedTextsJSON = localStorage.getItem('savedTexts');
    var savedTexts = savedTextsJSON ? JSON.parse(savedTextsJSON).linkedin : [];

    if (existingId) {
        // Update existing item
        var existingIndex = savedTexts.findIndex(item => item.id === existingId);
        if (existingIndex !== -1) {
            savedTexts[existingIndex].fullText = fullText;
            savedTexts[existingIndex].displayText = displayText;
        }
    } else {
        // This part creates a new item if there's no existingId
        var newTextId = Date.now().toString(); // Simple unique ID using timestamp
        textInput.setAttribute('data-current-id', newTextId); // This line is new
        savedTexts.push({ id: newTextId, fullText: fullText, displayText: displayText });
        
        var newSavedTextDiv = document.createElement('div'); // Keep this part from your original code
        newSavedTextDiv.className = 'saved-text';
        newSavedTextDiv.setAttribute('data-id', newTextId); // This attribute assignment is crucial
        newSavedTextDiv.setAttribute('data-fulltext', fullText);
        newSavedTextDiv.setAttribute('data-displaytext', displayText);
        newSavedTextDiv.setAttribute('draggable', 'true');

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

    // Append the new saved text div to the appropriate container
    console.log("Appending to LinkedIn section"); // Debugging line
    linkedinSaved.appendChild(newSavedTextDiv);

    applyAnimationDelays();
    
    localStorage.setItem('savedTexts', JSON.stringify({linkedin: savedTexts}));
    loadSavedTexts(); // Reload saved texts to reflect changes    reapplyDnDEvents();
    
    // Ensure saved texts are visible and update the toggle button
    var savedTexts = document.getElementById('saved-texts');
    savedTexts.classList.add('visible');
    toggleButton.textContent = '▼'; 
    toggleButton.style.transform = 'rotate(90deg)';
    isRotated = true;
};

    document.getElementById('toggle-button').addEventListener('click', function() {
        var savedTexts = document.getElementById('saved-texts');
        isRotated = !isRotated;

       if (isRotated) {
        savedTexts.classList.add('visible');
        this.textContent = '▼';
        this.style.transform = 'rotate(90deg)';
           applyAnimationDelays();
    } else {
        savedTexts.classList.remove('visible');
        this.textContent = '▶';
        this.style.transform = 'rotate(0deg)';
           applyReverseAnimationDelays();
    }
    });

    document.addEventListener('click', function(event) {
        var savedTexts = document.getElementById('saved-texts');
        var toggleButton = document.getElementById('toggle-button');
        var sortButton = document.getElementById('sort-button');
        var starButton = document.getElementById('star-button');
        
        if (!event.composedPath().includes(savedTexts) && 
        !event.composedPath().includes(toggleButton) && 
        event.target !== sortButton && 
        event.target !== starButton) {
        savedTexts.classList.remove('visible');
        toggleButton.textContent = '▶';
        toggleButton.style.transform = 'rotate(0deg)';
        isRotated = false;
    }
    });

    document.getElementById('saved-texts').addEventListener('click', function(event) {
        var target = event.target;
        var parent = target.closest('.saved-text');
        if (target.classList.contains('remove-text')) {
            var textId = parent.getAttribute('data-id');
            parent.remove();
            var savedTextsJSON = localStorage.getItem('savedTexts');
            var savedTexts = savedTextsJSON ? JSON.parse(savedTextsJSON).linkedin : [];
            var updatedSavedTexts = savedTexts.filter(text => text.id !== textId); // Remove the text from the array
            localStorage.setItem('savedTexts', JSON.stringify({linkedin: updatedSavedTexts})); // Update local storage
            applyAnimationDelays();
        } else if (target.classList.contains('add-text')) {
            var fullText = parent.getAttribute('data-fulltext');
            document.getElementById('text-input').innerHTML = fullText;
            // Hide saved-texts using the 'visible' class instead of directly manipulating style.display
        var savedTexts = document.getElementById('saved-texts');
        savedTexts.classList.remove('visible');

            // Set toggle button and isRotated state accordingly
        var toggleButton = document.getElementById('toggle-button');
        toggleButton.textContent = '▶';
        toggleButton.style.transform = 'rotate(0deg)';
        isRotated = false;

            updateCharCount();
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
            updateLocalStorage();
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
    // Sort function for each section
    function sortSection(sectionId) {
        var section = document.getElementById(sectionId);
        if (section) { // Check if the section exists
            var savedTexts = Array.from(section.getElementsByClassName('saved-text'));
            savedTexts.sort(function(a, b) {
                var textA = a.getAttribute('data-displaytext').toUpperCase();
                var textB = b.getAttribute('data-displaytext').toUpperCase();
                return isSortedAscending ? textA.localeCompare(textB) : textB.localeCompare(textA);
            });

            savedTexts.forEach(function(text) {
                section.appendChild(text);
            });
        }
    }

    // Call sort function for each section
    sortSection('linkedin-saved');
    
    isSortedAscending = !isSortedAscending; // Toggle sort order
    
    // Update the localStorage with the sorted items
    var savedLinkedInTexts = document.getElementById('linkedin-saved').innerHTML;

    localStorage.setItem('savedTexts', JSON.stringify({ twitter: savedTwitterTexts, linkedin: savedLinkedInTexts }));
    
    applyAnimationDelays();
        updateLocalStorage();
});

    document.getElementById('clear-button').addEventListener('click', function() {
        document.getElementById('text-input').innerHTML = ''; // Clear the text input
        updateCharCount(); // Update the character count
        // Reset the color of the character count display
    var charCountDisplay = document.getElementById('char-count');
    charCountDisplay.style.color = ''; // Reset to default color
    });

   function reapplyDnDEvents() {
    var savedTexts = document.querySelectorAll('#linkedin-saved .saved-text');
    savedTexts.forEach(function(savedText) {
        // Remove existing event listeners to avoid duplicates
        savedText.removeEventListener('dragstart', handleDragStart);
        savedText.removeEventListener('dragover', handleDragOver);
        savedText.removeEventListener('drop', handleDrop);

        // Re-add event listeners
        savedText.addEventListener('dragstart', handleDragStart, false);
        savedText.addEventListener('dragover', handleDragOver, false);
        savedText.addEventListener('drop', handleDrop, false);
    });
        applyAnimationDelays();
    }

    function updateCharCount() {
    var textInput = document.getElementById('text-input');
    var text = textInput.textContent || textInput.innerText; // Get the text content or inner text
    var charCount = text.replace(/\s/g, '').length; // Remove all spaces and then get the length
    var wordCount = text.trim().split(/\s+/).filter(function(word) {
    return word.length > 0;
        }).length;  // Count words
    var charCountDisplay = document.getElementById('char-count');
    charCountDisplay.textContent = 'Characters: ' + charCount;
      var wordCountDisplay = document.getElementById('word-count');
    wordCountDisplay.textContent = 'Words: ' + wordCount; 

        // Change color if character count exceeds 3000
    if (charCount > 3000) {
        charCountDisplay.style.color = 'red';
    } else {
        charCountDisplay.style.color = ''; // Reset to default color
    }

}
    function updateLocalStorage() {
    var savedTextsElements = document.querySelectorAll('#linkedin-saved .saved-text');
    var savedTextsData = [];

    savedTextsElements.forEach(function(elem) {
        savedTextsData.push({
            fullText: elem.getAttribute('data-fulltext'),
            displayText: elem.getAttribute('data-displaytext')
        });
    });

    localStorage.setItem('savedTexts', JSON.stringify({ linkedin: savedTextsData }));
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
    e.preventDefault();
    e.stopPropagation();

    var dragElem = document.querySelector('.dragElem');
    if (!dragElem) return;

    var dropTarget = document.getElementById('linkedin-saved'); // Define dropTarget correctly
    var dropPoint = e.target.closest('.saved-text');

    if (dropPoint) {
        var rect = dropPoint.getBoundingClientRect();
        var relY = e.clientY - rect.top;
        if (relY < rect.height / 2) {
            dropPoint.before(dragElem);
        } else {
            dropPoint.after(dragElem);
        }
    } else {
        dropTarget.appendChild(dragElem);
    }

    updateLocalStorage();
    dragElem.classList.remove('dragElem');
            reapplyDnDEvents();
    }
    // JavaScript to add 'clicked' class on mousedown and remove it on mouseup
document.querySelectorAll('#copy-button, #star-button, #toggle-button, #clear-button, .add-text, .remove-text, #sort-button, #toggle-social-media').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.classList.add('clicked');
    });
    button.addEventListener('mouseup', () => {
        button.classList.remove('clicked');
    });
    button.addEventListener('mouseleave', () => {
        button.classList.remove('clicked');
    });
});

    loadSavedTexts();
});
