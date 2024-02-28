document.addEventListener("DOMContentLoaded", function () {
    var bodyElement = document.body;
    var inputElement = document.getElementById('text-input');
    document.getElementById('toggle-social-media').textContent = '💼';
    bodyElement.style.width = '410px'; // LinkedIn width
    inputElement.style.width = '410px'; // Set input width for LinkedIn
    var isRotated = false;
    var isSortedAscending = true;

    loadSavedTexts();
    setupEventListeners();

    function loadSavedTexts() {
        var savedTextsJSON = localStorage.getItem('savedTexts');
        if (savedTextsJSON) {
            var savedTexts = JSON.parse(savedTextsJSON);
            document.getElementById('twitter-saved').innerHTML = savedTexts.twitter || "";
            document.getElementById('linkedin-saved').innerHTML = savedTexts.linkedin || "";
        }
        reapplyDnDEvents();
    }

    function setupEventListeners() {
        document.getElementById('toggle-social-media').addEventListener('click', toggleSocialMedia);
        document.getElementById('text-input').addEventListener('input', updateCharCount);
        document.getElementById('copy-button').addEventListener('click', copyToClipboard);
        document.getElementById('clear-button').addEventListener('click', clearText);
        document.getElementById('sort-button').addEventListener('click', sortTexts);
    }

    function toggleSocialMedia() {
        if (this.textContent === '🐦') {
            this.textContent = '💼';
            bodyElement.style.width = '410px';
            inputElement.style.width = '410px';
        } else {
            this.textContent = '🐦';
            bodyElement.style.width = '300px';
            inputElement.style.width = '300px';
        }
    }

    function updateCharCount() {
        var text = inputElement.innerText;
        var charCount = text.length;
        var wordCount = text.split(/\s+/).filter(Boolean).length;
        document.getElementById('char-count').textContent = 'Characters: ' + charCount;
        document.getElementById('word-count').textContent = 'Words: ' + wordCount;
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(inputElement.innerText).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    function clearText() {
        inputElement.innerHTML = '';
        updateCharCount();
    }

    function sortTexts() {
        var containerTwitter = document.getElementById('twitter-saved');
        var containerLinkedIn = document.getElementById('linkedin-saved');
        [containerTwitter, containerLinkedIn].forEach(function(container) {
            var items = Array.from(container.querySelectorAll('.saved-text'));
            var sortedItems = items.sort(function(a, b) {
                return isSortedAscending ? 
                    a.textContent.localeCompare(b.textContent) : 
                    b.textContent.localeCompare(a.textContent);
            });
            sortedItems.forEach(function(item) {
                container.appendChild(item);
            });
        });
        isSortedAscending = !isSortedAscending; // Toggle sort direction
    }

    function reapplyDnDEvents() {
        var draggables = document.querySelectorAll('.saved-text');
        draggables.forEach(function(draggable) {
            draggable.setAttribute('draggable', true);
            draggable.addEventListener('dragstart', handleDragStart);
            draggable.addEventListener('dragover', handleDragOver);
            draggable.addEventListener('drop', handleDrop);
            draggable.addEventListener('dragend', handleDragEnd);
        });
    }

    function handleDragStart(e) {
        e.dataTransfer.setData('text/html', this.outerHTML);
        this.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        this.classList.add('over');
    }

    function handleDrop(e) {
        e.stopPropagation(); // Stops the browser from redirecting.
        e.preventDefault();
        var data = e.dataTransfer.getData('text/html');
        var dropZone = e.target.closest('.saved-text');
        if (dropZone && !dropZone.classList.contains('dragging')) {
            dropZone.outerHTML = data;
            dropZone.classList.remove('over');
            reapplyDnDEvents();
        }
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        var over = document.querySelector('.over');
        if (over) over.classList.remove('over');
    }
});
