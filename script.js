<script>
document.getElementById('text-input').addEventListener('input', function () {
                        var text = this.innerText;
                        var wordCount = text.split(/\\s+/).filter(function (word) {
                            return word.length > 0;
                        }).length;
                        document.getElementById('word-count').textContent = 'Words: ' + wordCount;
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
                        savedTexts.style.display = 'block';
                        var truncatedText = textInput.innerText.length > 35 ? textInput.innerText.substring(0, 32) + '...' : textInput.innerText;
                        var newSavedText = '<div class="saved-text" data-fulltext="' + textInput.innerText + '">' +
                                            '<span>' + truncatedText + '</span>' +
                                            '<div class="text-buttons">' +
                                                '<button class="add-text">+</button>' +
                                                '<button class="remove-text">-</button>' +
                                            '</div></div>';
                        savedTexts.innerHTML += newSavedText;
                        localStorage.setItem('savedTexts', savedTexts.innerHTML);
                    });

                    document.getElementById('toggle-button').addEventListener('click', function() {
                        var savedTexts = document.getElementById('saved-texts');
                        var isVisible = savedTexts.style.display === 'block';
                        savedTexts.style.display = isVisible ? 'none' : 'block';
                        this.textContent = isVisible ? '>' : 'v';
                    });

                    document.getElementById('saved-texts').addEventListener('click', function(event) {
                        var target = event.target;
                        var parent = target.closest('.saved-text');
                        if (target.classList.contains('remove-text')) {
                            parent.remove();
                            localStorage.setItem('savedTexts', document.getElementById('saved-texts').innerHTML);
                        } else if (target.classList.contains('add-text')) {
                            var fullText = parent.dataset.fulltext;
                            document.getElementById('text-input').innerText = fullText;
                            document.getElementById('saved-texts').style.display = 'none';
                            document.getElementById('toggle-button').textContent = '>';
                        } else if (target.tagName === 'SPAN') {
                            var newName = prompt('Enter new name:', target.textContent);
                            if (newName !== null) {
                                target.textContent = newName;
                                localStorage.setItem('savedTexts', document.getElementById('saved-texts').innerHTML);
                            }
                        }
                    });

                    document.getElementById('clear-button').addEventListener('click', function() {
                        document.getElementById('text-input').innerText = '';
                    });

                    document.getElementById('text-input').addEventListener('keydown', function(event) {
                        if (event.ctrlKey || event.metaKey) {
                            let handled = false;
                            switch (event.key.toLowerCase()) {
                                case 'b':
                                    document.execCommand('bold');
                                    handled = true;
                                    break;
                                case 'i':
                                    document.execCommand('italic');
                                    handled = true;
                                    break;
                                case 'u':
                                    document.execCommand('underline');
                                    handled = true;
                                    break;
                            }
                            if (handled) {
                                event.preventDefault();
                            }
                        }
                    });

                    var savedTexts = localStorage.getItem('savedTexts');
                    if (savedTexts) {
                        document.getElementById('saved-texts').innerHTML = savedTexts;
                    }
<\/script>
