document.addEventListener('DOMContentLoaded', async () => {
    const languageSelect = document.getElementById('language-select');
    const translateBtn = document.getElementById('translate-btn');
    const saveBtn=      document.getElementById('save-language');

    
    const headingID=document.getElementById('heading');

    //function to check local storage and show selected language
    if (chrome && chrome.tabs) {
        const key = 'selectedLanguage';
        chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
            const res=await chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: (key)=>localStorage.getItem(key),
                args:[key]
            });
            if(res[0].result===null)
            {
                headingID.textContent=`No language is selected please select and Save`;
            }
            else
            headingID.textContent=`selected language is:${res[0].result}`;
        });
    }
    


    //function to set language in local storage
    saveBtn.addEventListener('click',()=>{
        const key = 'selectedLanguage';
        const selectedLanguage=languageSelect.value;
            if (chrome && chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
                const res=await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: add_local_storage,
                    args:[key,selectedLanguage]
                });
                headingID.textContent=`selected language is:${res[0].result}`;
            });
        }
    })


    //function to add translate button on page
    if (chrome && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: add_translate_button
            });
        });
    }
        

    //function to run translation of chats
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


//functio that adds selected to local storage
function add_local_storage(key,selectedLanguage)
{
    try {

        localStorage.setItem(key,selectedLanguage);
        console.log(`Stored language ${selectedLanguage} in local storage`);
    } 
    catch (err) {
        console.error('Error setting language in local storage:', err);
    }
return selectedLanguage;
}


function add_translate_button(){
    
    //function to translate the message content has features like alerting no conent, yet add features like white space removal
    async function transformSentMessage(selectedLanguage){
    
        const mainEl = document.querySelector('#main');
        const textareaEl = mainEl?.querySelector('div[contenteditable="true"]');
        
        if (!textareaEl) {
            alert('There is no opened conversation');
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
                let currentText = selection.toString();
                currentText=currentText.trim();
            if(currentText.length<=0)
            {
                alert("text can't be empty");
                return ;
            }
            else{
            

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
        
    }


    // function that adds translate button to the page and attaches a event listner to that button has features like alerting no language selected
    function addCustomDivNextToButton() {
        

        if(!document.getElementById('custom-div'))
        {
        // Find the voice message button container
        const voiceButtonContainer = document.querySelector('div.x123j3cw.xs9asl8.x9f619.x78zum5.x6s0dn4.xl56j7k.x1ofbdpd.x100vrsf.x1fns5xo');
        
        if (!voiceButtonContainer) {
          console.log('Voice message button container not found. Retrying in 1 second...');
          return;
        }
      
        // Create the new div
        const customDiv = document.createElement('button');
        customDiv.id = 'custom-div';
        customDiv.style.cssText = `
          height:45px;
          display: inline-block;
          background-color: #DCF8C6;
          padding: 5px 10px;
          border-radius: 10px;
          font-size: 14px;
          margin-right: 10px;
        `;
        
        customDiv.textContent = 'Translate';
      
        voiceButtonContainer.parentNode.insertBefore(customDiv, voiceButtonContainer);

        sentMsgTranalateBtn=document.getElementById('custom-div');
            if(sentMsgTranalateBtn){
                sentMsgTranalateBtn.addEventListener('click',()=>{
                    const selectedLanguage=localStorage.getItem("selectedLanguage");
                    if(selectedLanguage===null)
                    {
                        alert("please select a language");
                    }
                    else
                    transformSentMessage(selectedLanguage)      
                })
                }
        }
      }

      addCustomDivNextToButton();
}


//function to translate messages features:alert no language
async function transformMessages() {

    const selectedLanguage=localStorage.getItem('selectedLanguage');
    if(selectedLanguage==null)
    {
        alert("please select a language");
        return;
    }
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
        console.log('Translated Text:',data.translatedText);
        return data.translatedText;
    };

    const messageContainers = document.querySelectorAll('div[class*="message"]');

    messageContainers.forEach(async (container) => {
        // Select the text message content within each container
        const textElement = container.querySelector('span.selectable-text span');

        // Ensure it's a text message and not a media message
        if (textElement && textElement.innerText) {

            const originalText = textElement.innerText;

            // Apply translation function
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