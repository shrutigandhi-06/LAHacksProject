from flask import Flask, render_template, request, json, jsonify
from flask_cors import CORS

import gemini

web_site = Flask(__name__)
CORS(web_site)

@web_site.route('/')
def index():
  return render_template('index.html')

@web_site.route('/', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        return 'No selected file'
    file_name = 'images/' + file.filename
    file.save(file_name)
    item_json = gemini.generate(file_name)
    print(item_json)
    return jsonify(item_json)

web_site.run()