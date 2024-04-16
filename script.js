document.addEventListener("DOMContentLoaded", function () {
  var isRotated = false;
  var isSortedAscending = true;

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
    localStorage.setItem(
      "savedTexts",
      document.getElementById("saved-texts").innerHTML
    );
  }

  document.getElementById("text-input").addEventListener("input", function () {
    // Update character and word count whenever the text changes
    updateCharCount();
    var text = this.innerText.replace(/\s/g, "");
    var charCount = text.length;
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
  
  function openSavedList() {
  var savedTexts = document.getElementById("saved-texts");
  savedTexts.classList.add("visible");
  var toggleButton = document.getElementById("toggle-button");
  toggleButton.textContent = "▶️";
  toggleButton.style.transform = "rotate(90deg)";
  isRotated = true; // Assuming isRotated is a global variable you are managing
}
  
  document.getElementById("star-button").addEventListener("click", function () {
  var textInput = document.getElementById("text-input");
  var linkedinSaved = document.getElementById("linkedin-saved"); // LinkedIn section
  var toggleButton = document.getElementById("toggle-button");

  // Ensure the textInput is not empty
  var fullText = textInput.innerHTML.trim();
  var displayText = textInput.innerText.trim();
  if (fullText.length === 0) {
    console.log("No text to save"); // Optionally provide user feedback
    return; // Exit the function if there is no text to save
  }
  displayText = displayText.length > 50 ? displayText.substring(0, 50) + "..." : displayText;

  // Create and append the new saved text element
  var newSavedTextDiv = document.createElement("div");
  newSavedTextDiv.className = "saved-text";
  newSavedTextDiv.setAttribute("data-fulltext", fullText);
  newSavedTextDiv.setAttribute("data-displaytext", displayText);
  newSavedTextDiv.setAttribute("draggable", "true");

  var dragHandleDiv = document.createElement("div");
  dragHandleDiv.className = "drag-handle";
  dragHandleDiv.textContent = "⠿";
  newSavedTextDiv.appendChild(dragHandleDiv);

  var spanElement = document.createElement("span");
  spanElement.textContent = displayText;
  spanElement.setAttribute("unselectable", "on");
  newSavedTextDiv.appendChild(spanElement);

  var textButtonsDiv = document.createElement("div");
  textButtonsDiv.className = "text-buttons";
  textButtonsDiv.innerHTML = '<button class="add-text">+</button><button class="remove-text">-</button>';
  newSavedTextDiv.appendChild(textButtonsDiv);

  linkedinSaved.appendChild(newSavedTextDiv);

  applyAnimationDelays();
  localStorage.setItem("savedTexts", document.getElementById("saved-texts").innerHTML);
  reapplyDnDEvents();
  updateLocalStorage();

  // Show the saved texts
  openSavedList();
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

    if (
      !event.composedPath().includes(savedTexts) &&
      !event.composedPath().includes(toggleButton) &&
      event.target !== sortButton &&
      event.target !== starButton
    ) {
      savedTexts.classList.remove("visible");
      toggleButton.textContent = "▶️";
      toggleButton.style.transform = "rotate(0deg)";
      isRotated = false;
    }
  });

  document
    .getElementById("saved-texts")
    .addEventListener("click", function (event) {
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

    applyAnimationDelays();
    updateLocalStorage();
  });

  document
    .getElementById("clear-button")
    .addEventListener("click", function () {
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
    var charCount = text.replace(/\s/g, "").length; // Remove all spaces and then get the length
    var wordCount = text
      .trim()
      .split(/\s+/)
      .filter(function (word) {
        return word.length > 0;
      }).length; // Count words
    var charCountDisplay = document.getElementById("char-count");
    charCountDisplay.textContent = "Characters: " + charCount;

    // Change color if character count exceeds 280
    if (charCount > 3000) {
      charCountDisplay.style.color = "red";
    } else {
      charCountDisplay.style.color = ""; // Reset to default color
    }

    var wordCountDisplay = document.getElementById("word-count");
    wordCountDisplay.textContent = "Words: " + wordCount;
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
});
