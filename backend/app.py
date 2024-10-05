from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import logging
import os
import base64
import cv2
import numpy as np
from sklearn.decomposition import PCA
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io

from merge_faces import load_faces as load_merge_faces, get_faces, get_face, merge_faces
from facial_recognition import load_faces as load_recognition_faces, prepare_pca, get_test_faces, get_eigenfaces, recognize_face

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://laurenahhot-02c159a9b554.herokuapp.com"}})

logging.basicConfig(level=logging.INFO)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'https://laurenahhot-02c159a9b554.herokuapp.com')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

def build_response(data, status_code=200):
    response = make_response(jsonify(data), status_code)
    return response

# Routes from merge_faces.py
@app.route('/get_faces', methods=['GET'])
def get_faces_route():
    return build_response({'faces': get_faces()})

@app.route('/get_face/<face_name>', methods=['GET'])
def get_face_route(face_name):
    face_image = get_face(face_name)
    if face_image is None:
        return build_response({'error': 'Face not found'}, 404)
    return build_response({'face_image': face_image})

@app.route('/merge_faces', methods=['POST', 'OPTIONS'])
def merge_faces_route():
    if request.method == "OPTIONS":
        return build_response({})
    data = request.json
    face_1_name = data['face1']
    face_2_name = data['face2']
    merged_face = merge_faces(face_1_name, face_2_name)
    if merged_face is None:
        return build_response({'error': 'Failed to merge faces'}, 400)
    return build_response({'merged_face': merged_face})

# Routes from facial_recognition.py
@app.route('/get_test_faces', methods=['GET', 'OPTIONS'])
def get_test_faces_route():
    if request.method == "OPTIONS":
        return build_response({})
    return build_response(get_test_faces())

@app.route('/get_eigenfaces', methods=['POST', 'OPTIONS'])
def get_eigenfaces_route():
    if request.method == "OPTIONS":
        return build_response({})
    data = request.json
    result = get_eigenfaces(data.get('person_id'))
    if 'error' in result:
        return build_response(result, 400)
    return build_response(result)

@app.route('/recognize_face', methods=['POST', 'OPTIONS'])
def recognize_face_route():
    if request.method == "OPTIONS":
        return build_response({})
    data = request.json
    result = recognize_face(data.get('person_id'))
    if 'error' in result:
        return build_response(result, 400)
    return build_response(result)

def initialize_app():
    load_merge_faces()
    load_recognition_faces()
    prepare_pca()

if __name__ == '__main__':
    initialize_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)