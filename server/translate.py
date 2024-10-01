import sys
import json
from googletrans import Translator

translator = Translator()

def translate_api(text_input, language_code):
    translated = translator.translate(text_input, language_code)
    return translated.text

if __name__ == "__main__":
    # Get the data passed from Node.js
    data = json.loads(sys.argv[1])
    current_text = data[0]
    selected_language = data[1]
    
    # Perform the translation
    translated_text = translate_api(current_text, selected_language)

    sys.stdout.reconfigure(encoding='utf-8')
    # Send the translated text back to Node.js
    print(translated_text)
