import os
import google.generativeai as genai
from IPython.display import Image, display

os.environ["GOOGLE_API_KEY"] = "AIzaSyCHV5W3DA4pOle9QRFmchYNL5PDYxPJrtk"
def generate(file_name):
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
    model = genai.GenerativeModel('gemini-pro-vision')

    image = Image(file_name)

    prompt = "Identify this item and tell me how I should recycle it. Respond in JSON with two fields: item, recycling bin color based on US, and upcycling ideas."

    response = model.generate_content([prompt, image], stream=True)
    response.resolve()
    return response.text

# Press the green button in the gutter to run the script.
if __name__ == '_main_':
    generate()