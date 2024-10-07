import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import base64
import cv2
import numpy as np

# Import functions from facial_recognition.py
from facial_recognition import (
    load_faces as load_recognition_faces,
    prepare_pca,
    get_test_faces,
    get_eigenfaces,
    recognize_face
)

# Import functions from merge_faces.py
from merge_faces import (
    load_faces as load_merge_faces,
    get_faces,
    get_face,
    merge_faces
)

app = Flask(__name__, static_folder='../client/dist')
CORS(app, origins='*')

# Initialize facial recognition
load_recognition_faces()
prepare_pca()

# Initialize face merging
load_merge_faces()

@app.route('/api/get_test_faces', methods=['GET'])
def api_get_test_faces():
    test_faces = get_test_faces()
    return jsonify(test_faces)

@app.route('/api/get_eigenfaces', methods=['POST'])
def api_get_eigenfaces():
    data = request.json
    person_id = data.get('person_id')
    if not person_id:
        return jsonify({"error": "No person_id provided"}), 400
    
    result = get_eigenfaces(person_id)
    return jsonify(result)

@app.route('/api/recognize_face', methods=['POST'])
def api_recognize_face():
    data = request.json
    person_id = data.get('person_id')
    if not person_id:
        return jsonify({"error": "No person_id provided"}), 400
    
    result = recognize_face(person_id)
    return jsonify(result)

@app.route('/api/get_faces', methods=['GET'])
def api_get_faces():
    faces = get_faces()
    return jsonify({"faces": faces})

@app.route('/api/get_face/<face_name>', methods=['GET'])
def api_get_face(face_name):
    face_image = get_face(face_name)
    if face_image is None:
        return jsonify({"error": "Face not found"}), 404
    return jsonify({"face_image": face_image})

@app.route('/api/merge_faces', methods=['POST'])
def api_merge_faces():
    data = request.json
    face_1 = data.get('face1')
    face_2 = data.get('face2')
    if not face_1 or not face_2:
        return jsonify({"error": "Two faces are required"}), 400
    
    merged_face = merge_faces(face_1, face_2)
    if merged_face is None:
        return jsonify({"error": "Failed to merge faces"}), 500
    return jsonify({"merged_face": merged_face})

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', debug=True, port=port)