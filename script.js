document.addEventListener("DOMContentLoaded", function () {
  var isRotated = false;
  var isSortedAscending = true;

  // Make sure the text-input starts empty and cursor positioned at the start
  var textInput = document.getElementById("text-input");
  textInput.innerHTML = ""; // Ensures it starts empty
  
  function loadSavedTexts() {
    var savedTextsJSON = localStorage.getItem("savedTexts");
    if (savedTextsJSON) {
      var savedTexts = JSON.parse(savedTextsJSON);
      if (savedTexts.linkedin) {
        document.getElementById("linkedin-saved").innerHTML =
          savedTexts.linkedin;
      }
      reapplyDnDEvents();
    }
  }

function saveText(span, parent) {
    span.setAttribute("contenteditable", "false");
    span.classList.remove("editable");
    var newText = span.innerText.trim();
    if (newText) {
        parent.dataset.displaytext = newText;
    }
    updateLocalStorage(); // Call updateLocalStorage to handle saving consistently
}
  
  function standardizeLineBreaks(text) {
  // Check if there are any line breaks at all
  if (!text.includes("\n")) {
    return text; // No line breaks, return the text as is
  }
  // Replace only existing line breaks with a single `\n`
  return text.replace(/\r?\n|\r/g, "\n");
}

  function convertLineBreaksToBR(text) {
  return text.replace(/\n/g, "<br>");
}
  
function handleShortcutInput() {
    var textInput = document.getElementById("text-input");
    var sel = window.getSelection();

    if (!sel.rangeCount) return;  // Exit if no selection is made

    var range = sel.getRangeAt(0);
    var startNode = range.startContainer;
    var startOffset = range.startOffset;

        const replacements = {
          ' -> ': ' → ',
        ' <- ': ' ← ',
        ' => ': ' ⇒ ',
        ' <= ': ' ⇐ ',
        ' == ': ' ≡ ',
    // Regular expressions adjusted for matching and capturing groups for replacement
        '(^|\\s)->(\\s|$)': '$1→$2',
        '(^|\\s)<-(\\s|$)': '$1←$2',
        '(^|\\s)=>(\\s|$)': '$1⇒$2',
        '(^|\\s)<=\\s': '$1⇐$2',
        '(^|\\s)==(\\s|$)': '$1≡$2',
        '(^|\\s)!=\\s': '$1≠$2',
        '(^|\\s)>=(\\s|$)': '$1≥$2',
        '(^|\\s)<=\\s': '$1≤$2',
        '(^|\\s)\\+\\+(\\s|$)': '$1⧺$2',
        '(^|\\s)--(\\s|$)': '$1⧻$2',
        '(^|\\s)&&\\s': '$1∧$2',
        '(^|\\s)\\|\\|\\s': '$1∨$2',
        '(^|\\s)\\.\\.\\.(\\s|$)': '$1…$2',
    '(^|\\s)\\(c\\)(\\s|$)': '©',
    '(^|\\s)\\(r\\)(\\s|$)': '®',
    '(^|\\s)\\(tm\\)(\\s|$)': '™',
    '(^|\\s)\\(p\\)(\\s|$)': '℗',
    '(^|\\s)1/4(\\s|$)': '¼',
    '(^|\\s)1/2(\\s|$)': '½',
    '(^|\\s)3/4(\\s|$)': '¾',
    '(^|\\s)1/3(\\s|$)': '⅓',
    '(^|\\s)2/3(\\s|$)': '⅔',
    '(^|\\s)1/8(\\s|$)': '⅛',
    '(^|\\s)3/8(\\s|$)': '⅜',
    '(^|\\s)5/8(\\s|$)': '⅝',
    '(^|\\s)7/8(\\s|$)': '⅞',
    '(^|\\s)ohm(\\s|$)': 'Ω',
    '(^|\\s)deg(\\s|$)': '°',
    '(^|\\s)squared(\\s|$)': '²',
    '(^|\\s)cubed(\\s|$)': '³',
    // Adding emoji shortcuts
    ':)': '😊',
    ':(': '😞',
    ':D': '😄',
    'xD': '😆',
    ';)': '😉',
    ':P': '😛',
    ':\'(': '😢',
    ':*': '😘',
    '>:(': '😠',
    'o_O': '😳',
    'B)': '😎',
    ':O': '😮',
    ':-/': '😕',
    ':thumbsup:': '👍',
    ':heart:': '❤️',
    ':exclamation:': '❗',
    ':question:': '❓',
    ':grey_exclamation:': '❕',
    ':grey_question:': '❔',
    ':fire:': '🔥',
    ':poop:': '💩',
    ':thumbsup:': '👍',
    ':thumbsdown:': '👎',
    ':ok_hand:': '👌',
    ':punch:': '👊',
    ':fist:': '✊',
    ':v:': '✌',
    ':wave:': '👋',
    ':hand:': '✋',
    ':open_hands:': '👐',
    ':point_up:': '☝',
    ':point_down:': '👇',
    ':point_left:': '👈',
    ':point_right:': '👉',
    ':raised_hands:': '🙌',
    ':pray:': '🙏',
    ':point_up_2:': '👆',
    ':clap:': '👏',
    ':zap:': '⚡',
    ':recycle:': '♻️',
    ':check_mark:': '✅',
    ':cross_mark:': '❌',
    ':star:': '⭐',
    ':sparkles:': '✨',
    ':arrow_right:': '➡️',
    ':arrow_left:': '⬅️',
    ':arrow_up:': '⬆️',
    ':arrow_down:': '⬇️',
    ':arrow_forward:': '▶️',
    ':arrow_backward:': '◀️',
    ':arrow_up_small:': '🔼',
    ':arrow_down_small:': '🔽',
    ':double_arrow_up:': '⏫',
    ':double_arrow_down:': '⏬',
    ':double_exclamation:': '‼️',
    ':exclamation_question:': '⁉️',
    ':red_circle:': '🔴',
    ':blue_circle:': '🔵',
    ':green_circle:': '🟢',
    ':yellow_circle:': '🟡',
    ':purple_circle:': '🟣',
    ':brown_circle:': '🟤',
    ':black_circle:': '⚫',
    ':white_circle:': '⚪',
    ':red_square:': '🟥',
    ':blue_square:': '🟦',
    ':green_square:': '🟩',
    ':yellow_square:': '🟨',
    ':purple_square:': '🟪',
    ':brown_square:': '🟫',
    ':black_large_square:': '⬛',
    ':white_large_square:': '⬜',
    ':black_medium_square:': '◼️',
    ':white_medium_square:': '◻️',
    ':black_medium_small_square:': '◾',
    ':white_medium_small_square:': '◽',
    ':black_small_square:': '▪️',
    ':white_small_square:': '▫️',
    ':large_orange_diamond:': '🔶',
    ':large_blue_diamond:': '🔷',
    ':small_orange_diamond:': '🔸',
    ':small_blue_diamond:': '🔹',
    ':red_triangle_up:': '🔺',
    ':red_triangle_down:': '🔻'
    };
 // Helper function to process text nodes and apply replacements
    function processTextNode(node) {
        let nodeValue = node.nodeValue;
        let modifiedText = nodeValue;
        let adjustment = 0;

        Object.keys(replacements).forEach(pattern => {
            const regex = new RegExp(pattern, 'g');
            modifiedText = modifiedText.replace(regex, (match, p1, p2) => {
                let position = regex.lastIndex - match.length;
                if (position !== -1) {
                    let replacementText = replacements[pattern].replace('$1', p1).replace('$2', p2);
                    if (startNode === node && startOffset > position) {
                        adjustment += replacementText.length - match.length;
                    }
                }
                return replacements[pattern].replace('$1', p1).replace('$2', p2);
            });
        });

        if (nodeValue !== modifiedText) {
            node.nodeValue = modifiedText;
            if (startNode === node) {
                startOffset += adjustment;
            }
        }
    }

    // Traverse and apply changes to all text nodes
    var walker = document.createTreeWalker(
        textInput,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    walker.currentNode = range.startContainer;
    // Process forward from the cursor
    while (walker.currentNode) {
        processTextNode(walker.currentNode);
        walker.nextNode();
    }

    // Process backward from the cursor
    walker.currentNode = range.startContainer;
    while (walker.currentNode) {
        processTextNode(walker.currentNode);
        walker.previousNode();
    }

    // Restore the cursor position
    try {
        range.setStart(startNode, startOffset);
        range.setEnd(startNode, startOffset);
        sel.removeAllRanges();
        sel.addRange(range);
    } catch (e) {
        console.error("Error adjusting the cursor position:", e);
    }
}

  document.getElementById("text-input").addEventListener("paste", function(event) {
    event.preventDefault(); // Prevent the default paste action
    var text = (event.clipboardData || window.clipboardData).getData('text/plain');
     // Standardize line breaks while preserving existing ones
    var standardizedText = standardizeLineBreaks(text);
    var normalizedText = text.normalize("NFKD"); // Normalize unicode to ASCII equivalent where possible

    // Insert text at the current cursor position
    document.execCommand('insertHTML', false, standardizedText.replace(/\n/g, '<br>')); // Insert standardized text with line breaks converted to <br>

    // Apply uniform style if needed
    this.style.fontSize = "14px"; // Set a consistent font size
});

  document.getElementById("text-input").addEventListener("input", function () {
    // Debounce input to handle rapid typing
    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {
        handleShortcutInput(); // Process after a short delay to batch updates
    }, 20);
    // Update character and word count whenever the text changes
    updateCharCount();
    var text = this.innerText; // Get all text including spaces
    var charCount = text.length; // Count all characters including spaces
    var charCountDisplay = document.getElementById("char-count");
    charCountDisplay.textContent = "Characters: " + charCount;

    if (charCount > 3000) {
      charCountDisplay.style.color = "red";
    } else {
      charCountDisplay.style.color = "";
    }
  });
  
  document.getElementById("copy-button").addEventListener("click", function () {
    var textInput = document.getElementById("text-input");
    var range = document.createRange();
    range.selectNodeContents(textInput);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand("copy");
    sel.removeAllRanges();
  });

  // Define the applyAnimationDelays function here
  function applyAnimationDelays() {
    var savedTexts = document.querySelectorAll("#saved-texts .saved-text");
    var delayIncrement = 0.065; // Increment delay by 0.1s for each line

    savedTexts.forEach(function (savedText, index) {
      var delay = index * delayIncrement;
      console.log("Element index:", index, "Delay:", delay + "s"); // Debugging line
      savedText.style.animationDelay = delay + "s";
      savedText.classList.remove("reverse"); // Remove reverse animation class
    });
  }

  function applyReverseAnimationDelays() {
    var savedTexts = document.querySelectorAll("#saved-texts .saved-text");
    var delayIncrement = 0.05;
    var maxDelay = (savedTexts.length - 1) * delayIncrement; // Calculate the maximum delay for the last item

    savedTexts.forEach(function (savedText, index) {
      var delay = (savedTexts.length - index - 1) * delayIncrement;
      savedText.style.animationDelay = delay + "s";
      savedText.classList.add("reverse"); // Apply reverse animation class
    });
  }


document.getElementById("star-button").addEventListener("click", function () {
    var textInput = document.getElementById("text-input");
    var linkedinSaved = document.getElementById("linkedin-saved");
    var toggleButton = document.getElementById("toggle-button");

    var fullText = textInput.innerHTML.trim();
    var displayText = textInput.innerText.trim().substring(0, 50);

    if (fullText.length === 0) {
        console.log("No text to save");
        return; // Exit the function if there is no text to save
    }
    if (textInput.innerText.length > 50) displayText += "...";

    // Create a new container for dynamic content
    var newContent = document.createElement("div");
    newContent.className = "saved-text-container";
    newContent.innerHTML = `
        <div class="saved-text" draggable="true" data-fulltext="${fullText}" data-displaytext="${displayText}">
            <div class="drag-handle">⠿</div>
            <span unselectable="on">${displayText}</span>
            <div class="text-buttons">
                <button class="add-text">+</button>
                <button class="remove-text">-</button>
            </div>
        </div>
    `;

  event.stopPropagation();

  // Add a slight delay (e.g., 10ms) before showing the list
  setTimeout(function() {
    document.getElementById("saved-texts").classList.add("visible");
  }, 10);
  
    linkedinSaved.appendChild(newContent); // Append new content without touching existing children
    document.getElementById("saved-texts").classList.add("visible");
    applyAnimationDelays();
    updateLocalStorage(); // Assumes this function updates the entire localStorage and logs actions

    // Ensure saved texts are visible and update the toggle button
    var savedTexts = document.getElementById("saved-texts");
    savedTexts.classList.add("visible");
    toggleButton.textContent = "▶️";
    toggleButton.style.transform = "rotate(90deg)";
});


  document.getElementById("toggle-button").addEventListener("click", function () {
      var savedTexts = document.getElementById("saved-texts");
      savedTexts.classList.toggle("visible"); // Toggle the visibility class based on current state

      // Update toggle button text and icon based on visibility
  if (savedTexts.classList.contains("visible")) {
    this.textContent = "▶️";
    this.style.transform = "rotate(90deg)";
        applyAnimationDelays();
      } else {
        savedTexts.classList.remove("visible");
        this.textContent = "▶️";
        this.style.transform = "rotate(0deg)";
        applyReverseAnimationDelays();
        // Use updateLocalStorage to save changes
        updateLocalStorage();
      }
    });
  
  document.getElementById("toggle-feature-switch").addEventListener('change', function() {
    // Create a new tooltip element
    var temporaryTooltip = document.createElement('div');
    temporaryTooltip.className = 'tooltip';
    temporaryTooltip.textContent = "Thank you! We are working on this function.";
    document.body.appendChild(temporaryTooltip);

    // Position the tooltip near the switch
    var switchRect = this.nextElementSibling.getBoundingClientRect(); // Use nextElementSibling to get the slider
    temporaryTooltip.style.left = (switchRect.left + switchRect.width/2 - 50) + 'px'; // Center the tooltip horizontally
    temporaryTooltip.style.top = (switchRect.bottom + 10) + 'px'; // 10px below the bottom of the toggle
    temporaryTooltip.style.display = 'block';

    // Automatically remove the tooltip after 3 seconds
    setTimeout(function() {
        if (temporaryTooltip.parentNode) {
            temporaryTooltip.parentNode.removeChild(temporaryTooltip);
        }
    }, 3000); // 3000 milliseconds = 3 seconds
});

  document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'b') {
    event.preventDefault();
    var selection = window.getSelection();
    // Proceed only if there's an actual text selection
    if (selection.rangeCount > 0 && selection.toString().length > 0) {
      var range = selection.getRangeAt(0);
      var span = document.createElement('span');
      var selectedText = range.extractContents(); // Extracts the selected content

      // Toggle between normal and bold by checking if the existing selection is already bold
      if (range.commonAncestorContainer.parentElement.classList.contains('bold-text')) {
        span.className = 'normal-text';
        span.appendChild(selectedText);
        range.insertNode(span);
      } else {
        span.className = 'bold-text';
        span.appendChild(selectedText);
        range.insertNode(span);
      }

      // This clears any selection, ensuring the style isn't applied again inadvertently
      window.getSelection().removeAllRanges();
    }
  }
});

  
  document.addEventListener("click", function (event) {
    var savedTexts = document.getElementById("saved-texts");
    var toggleButton = document.getElementById("toggle-button");
    var sortButton = document.getElementById("sort-button");
    var starButton = document.getElementById("star-button");

    // Check if the clicked target is the sort button
    if (event.target === sortButton) return;

    if (
      !event.composedPath().includes(savedTexts) &&
      !event.composedPath().includes(toggleButton) &&
      !event.composedPath().includes(sortButton) &&
      event.target !== starButton
    ) {
      savedTexts.classList.remove("visible");
      toggleButton.textContent = "▶️";
      toggleButton.style.transform = "rotate(0deg)";
      isRotated = false;
    }
  });


  document.getElementById("saved-texts").addEventListener("click", function (event) {
      var target = event.target;
      var parent = target.closest(".saved-text");
      if (target.classList.contains("remove-text")) {
        parent.remove();
        localStorage.setItem(
          "savedTexts",
          document.getElementById("saved-texts").innerHTML
        );
        applyAnimationDelays();
        updateLocalStorage();
      } else if (target.classList.contains("add-text")) {
        var fullText = parent.getAttribute("data-fulltext");
        document.getElementById("text-input").innerHTML = fullText;
        // Hide saved-texts using the 'visible' class instead of directly manipulating style.display
        var savedTexts = document.getElementById("saved-texts");
        savedTexts.classList.remove("visible");

        // Set toggle button and isRotated state accordingly
        var toggleButton = document.getElementById("toggle-button");
        toggleButton.textContent = "▶️";
        toggleButton.style.transform = "rotate(0deg)";
        isRotated = false;

        updateCharCount();
      } else if (
        target.tagName === "SPAN" &&
        !target.classList.contains("text-buttons")
      ) {
        target.setAttribute("contenteditable", "true");
        target.classList.add("editable");
        target.focus();
      }
    });

  document.getElementById("saved-texts").addEventListener(
    "blur",
    function (event) {
      if (
        event.target.tagName === "SPAN" &&
        event.target.classList.contains("editable")
      ) {
        var parent = event.target.closest(".saved-text");
        saveText(event.target, parent);
        updateLocalStorage();
      }
    },
    true
  );

  document
    .getElementById("saved-texts")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        var target = event.target;
        var parent = target.closest(".saved-text");
        if (
          target.tagName === "SPAN" &&
          target.classList.contains("editable")
        ) {
          event.preventDefault();
          saveText(target, parent);
        }
      }
    });

  document.getElementById("sort-button").addEventListener("click", function () {
    // Sort function for each section
    function sortSection(sectionId) {
      var section = document.getElementById(sectionId);
      if (section) {
        // Check if the section exists
        var savedTexts = Array.from(
          section.getElementsByClassName("saved-text")
        );
        savedTexts.sort(function (a, b) {
          var textA = a.getAttribute("data-displaytext").toUpperCase();
          var textB = b.getAttribute("data-displaytext").toUpperCase();
          return isSortedAscending
            ? textA.localeCompare(textB)
            : textB.localeCompare(textA);
        });

        savedTexts.forEach(function (text) {
          section.appendChild(text);
        });
        // Use updateLocalStorage to save changes
        updateLocalStorage();
      }
    }

    // Call sort function for each section
    sortSection("linkedin-saved");

    isSortedAscending = !isSortedAscending; // Toggle sort order

    // Update the localStorage with the sorted items
    var savedLinkedInTexts =
      document.getElementById("linkedin-saved").innerHTML;

    localStorage.setItem(
      "savedTexts",
      JSON.stringify({
        linkedin: savedLinkedInTexts,
      })
    );
    document.getElementById("saved-texts").classList.add("visible");
    document.getElementById("toggle-button").style.transform = "rotate(90deg)";
    applyAnimationDelays();
    updateLocalStorage();
  });

  document.getElementById("clear-button").addEventListener("click", function () {
      document.getElementById("text-input").innerText = ""; // Clear the text input
      updateCharCount(); // Update the character count
      // Reset the color of the character count display
      var charCountDisplay = document.getElementById("char-count");
      charCountDisplay.style.color = ""; // Reset to default color
    });

  function reapplyDnDEvents() {
    var savedTexts = document.querySelectorAll("#saved-texts .saved-text");
    savedTexts.forEach(function (savedText) {
      savedText.removeEventListener("dragstart", handleDragStart);
      savedText.removeEventListener("dragover", handleDragOver);
      savedText.removeEventListener("drop", handleDrop);
      savedText.addEventListener("dragstart", handleDragStart, false);
      savedText.addEventListener("dragover", handleDragOver, false);
      savedText.addEventListener("drop", handleDrop, false);
    });
    applyAnimationDelays();
  }

  function updateCharCount() {
    var textInput = document.getElementById("text-input");
    var text = textInput.textContent || textInput.innerText; // Get the text content or inner text
    var charCount = text.length; // Count all characters including spaces
    var wordCount = text.trim().split(/\s+/).filter(function (word) {
        return word.length > 0;
    }).length; // Count words accurately by splitting on any whitespace sequence

    var charCountDisplay = document.getElementById("char-count");
    charCountDisplay.textContent = "Characters: " + charCount; // Update display with total character count including spaces

    var wordCountDisplay = document.getElementById("word-count");
    if (wordCountDisplay) { // Check if word count display exists and update it
        wordCountDisplay.textContent = "Words: " + wordCount; // Update word count
    }

    // Change color if character count exceeds 3000
    if (charCount > 3000) {
        charCountDisplay.style.color = "red"; // Highlight with red if over limit
    } else {
        charCountDisplay.style.color = ""; // Reset to default color
    }
}
  
  function updateLocalStorage() {
    var linkedinTexts = document.getElementById("linkedin-saved").innerHTML;
    var savedData = { linkedin: linkedinTexts };
    localStorage.setItem("savedTexts", JSON.stringify(savedData));
  }

  function handleDragStart(e) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.outerHTML);
    this.classList.add("dragElem");
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = "move";
    return false;
  }

  function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  var dragElem = document.querySelector(".dragElem");
  if (!dragElem) return;

  var dropPoint = e.target.closest(".saved-text");
  var dropTarget = document.getElementById("saved-texts"); // Ensure the drop target is correctly identified

  if (dropPoint) {
    var rect = dropPoint.getBoundingClientRect();
    var relY = e.clientY - rect.top;
    if (relY < rect.height / 2) {
      dropPoint.parentNode.insertBefore(dragElem, dropPoint);
    } else {
      var nextSibling = dropPoint.nextElementSibling;
      dropPoint.parentNode.insertBefore(dragElem, nextSibling);
    }
  } else {
    dropTarget.appendChild(dragElem);
  }

  updateLocalStorage();
  dragElem.classList.remove("dragElem");
  reapplyDnDEvents();
}
  // JavaScript to add 'clicked' class on mousedown and remove it on mouseup
  document
    .querySelectorAll(
      "#copy-button, #star-button, #toggle-button, #clear-button, .add-text, .remove-text, #sort-button, #toggle-social-media"
    )
    .forEach((button) => {
      button.addEventListener("mousedown", () => {
        button.classList.add("clicked");
      });
      button.addEventListener("mouseup", () => {
        button.classList.remove("clicked");
      });
      button.addEventListener("mouseleave", () => {
        button.classList.remove("clicked");
      });
    });

  loadSavedTexts();

  // Create tooltip element
    var tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    // Function to show tooltip
    function showTooltip(event) {
        tooltip.textContent = event.target.getAttribute('data-tooltip'); // Set text from data attribute
        tooltip.style.display = 'block';
        tooltip.style.left = event.pageX + 10 + 'px'; // Position tooltip near the mouse
        tooltip.style.top = event.pageY + 10 + 'px';
    }

    // Function to hide tooltip
    function hideTooltip() {
        tooltip.style.display = 'none';
    }

    // Adding tooltips to buttons
    var buttons = [
        {id: 'copy-button', text: 'Copy to clipboard'},
        {id: 'clear-button', text: 'Clear the text'},
        {id: 'star-button', text: 'Save the text'},
        {id: 'toggle-button', text: 'Open saved texts'},
        {id: 'sort-button', text: 'Sort saved texts'}
    ];

    buttons.forEach(function(button) {
        var btn = document.getElementById(button.id);
        if (btn) {
            btn.setAttribute('data-tooltip', button.text);
            btn.addEventListener('mouseenter', showTooltip);
            btn.addEventListener('mouseleave', hideTooltip);
        }
    });
  
  document.getElementById("clear-all-button").addEventListener("click", function () {
  localStorage.removeItem("savedTexts");  // Clear saved texts from localStorage
  // You can add additional code to reset other UI elements if needed
});

});
