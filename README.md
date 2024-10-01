# WhatsApp Translator Extension

A Chrome extension that translates messages on [web.whatsapp.com](https://web.whatsapp.com). The extension allows you to translate both received and sent messages into different languages.

## Prerequisites

- [Node.js](https://nodejs.org/) (Latest version)
- [Python](https://www.python.org/) (Latest version)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/GouthamReddy1216/WhatsApp_translator.git
   ```

2. Navigate to the `server` directory:
   ```bash
   cd WhatsApp_translator/server
   ```

3. Install the necessary Node.js dependencies:
   ```bash
   npm install
   ```

4. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the Translator API (it will run on `localhost:3000`). Ensure nothing else is running on port 3000:
   ```bash
   npm start
   ```

## Loading the Extension in Chrome

1. Open Chrome and type the following in the address bar:
   ```plaintext
   chrome://extensions
   ```

2. Turn on **Developer mode** (top right corner).

3. Click on **Load unpacked** (top left corner) and select the `extension` folder from the cloned repository.

## Usage

1. Open [web.whatsapp.com](https://web.whatsapp.com) and start or open any conversation.

2. Click on the **WhatsApp Translator** extension icon in Chrome.

3. Select the language for translation from the extension menu.

4. Click the **Translate** button, and the messages in the conversation will be translated accordingly.

### Sending Messages in a Different Language

1. Type the message in your original language.

2. From the extension, select the target language and click the **Sent-msg** button. The message will be translated and sent in the selected language.

## Notes

- Ensure that port `3000` is available before starting the translator API.
- The extension will translate both sent and received messages.

---
