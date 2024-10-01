document.addEventListener('DOMContentLoaded', function() {

    const languageSelect = document.getElementById('language-select');
    const translateBtn = document.getElementById('translate-btn');

    const sentMsgTranalateBtn=document.getElementById('sent-msg-translate-btn');
   
    sentMsgTranalateBtn.addEventListener('click',()=>{
        const selectedLanguage=languageSelect.value;
        if (chrome && chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                console.log('about to call transform msg');
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: transformSentMessage,
                    args: [selectedLanguage]
                });
            });
        }
    })

    translateBtn.addEventListener('click', () => {
        const selectedLanguage = languageSelect.value;
        if (chrome && chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: transformMessages,
                    args: [selectedLanguage]
                });
            });
        } else {
            console.log('This code only works in Chrome Extension mode.');
        }
    });

});

async function transformSentMessage(selectedLanguage){
    const mainEl = document.querySelector('#main');
    const textareaEl = mainEl?.querySelector('div[contenteditable="true"]');
    
    if (!textareaEl) {
        console.log('There is no opened conversation');
    } else {
        // Focus the input field
        textareaEl.focus();
    
        // Select the current text in the contenteditable div
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(textareaEl);
        selection.removeAllRanges(); // Clear any existing selections
        selection.addRange(range); // Select the entire content
    
        // Get the selected text
        const currentText = selection.toString();

        async function get_translated_text(){
            const response = await fetch('http://localhost:3000/api/translate', {
                method: 'POST',
                body: JSON.stringify({
                    text: currentText,
                    language: selectedLanguage,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            const data = await response.json();
            console.log('Translated Text:', data.translatedText);
            return data.translatedText;
        };
        const translateText=await get_translated_text();

        // Use execCommand to replace the selected text with reversed text
        document.execCommand('insertText', false, translateText);
    
        // Clear the selection
        selection.removeAllRanges(); // Optional: Clear the selection if needed
    }
    
}

async function transformMessages(selectedLanguage) {

    async function get_translated_text(originalText){
        const response = await fetch('http://localhost:3000/api/translate', {
            method: 'POST',
            body: JSON.stringify({
                text: originalText,
                language: selectedLanguage,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        const data = await response.json();
        console.log(data.translatedText);
        return data.translatedText;
    };

    const messageContainers = document.querySelectorAll('div[class*="message"]');

    messageContainers.forEach(async (container) => {
        // Select the text message content within each container
        const textElement = container.querySelector('span.selectable-text span');

        // Ensure it's a text message and not a media message
        if (textElement && textElement.innerText) {

            const originalText = textElement.innerText;

            // Apply transformation function
            const transformedText = await get_translated_text(originalText);

            // Check if transformed div already exists, to avoid duplication
            let existingTransformedDiv = container.querySelector('.transformed-text');
                if(existingTransformedDiv)
                {
                    existingTransformedDiv.remove();
                }
                const transformedDiv = document.createElement('div');
                transformedDiv.classList.add('transformed-text');
                transformedDiv.style.padding = '1px';
                transformedDiv.style.border = '1px solid black'; // Added black border
                transformedDiv.style.color = 'blue';
                transformedDiv.style.fontStyle = 'italic';
                transformedDiv.inert=
                transformedDiv.innerText = `${transformedText}`;

                // Insert the new div just below the original message
                container.appendChild(transformedDiv);
        }
    });
}