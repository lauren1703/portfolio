from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os
import cv2
import numpy as np
from sklearn.decomposition import PCA
import base64

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

face_names = []
faces = {}

def load_faces(directory='faces'):
    global face_names, faces
    if not os.path.exists(directory):
        print(f"Warning: Directory '{directory}' does not exist.")
        return
    face_names = [f for f in os.listdir(directory) if f.endswith('.jpg')]
    for file in face_names:
        try:
            faces[file] = cv2.resize(cv2.imread(os.path.join(directory, file), cv2.IMREAD_GRAYSCALE), (750,1000))
        except Exception as e:
            print(f"Error loading face {file}: {str(e)}")

@app.route('/', methods=['GET'])
def home():
    return "Face Merging API is running. Available routes: /get_faces, /get_face/<face_name>, /merge_faces"

@app.route('/get_faces', methods=['GET'])
def get_faces():
    return jsonify({'faces': face_names})

@app.route('/get_face/<face_name>', methods=['GET'])
def get_face(face_name):
    if face_name not in faces:
        return jsonify({'error': 'Face not found'}), 404
    
    face_image = faces[face_name]
    _, buffer = cv2.imencode('.png', face_image)
    face_image_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({'face_image': face_image_base64})

@app.route('/merge_faces', methods=['POST', 'OPTIONS'])
def merge_faces():
    if request.method == 'OPTIONS':
        return '', 204
    
    data = request.json
    face_1_name = data['face1']
    face_2_name = data['face2']

    if face_1_name not in faces or face_2_name not in faces:
        return jsonify({'error': 'One or both faces not found'}), 404

    face_1 = faces[face_1_name]
    face_2 = faces[face_2_name]

    # Perform face merging
    selected_faces_matrix = np.stack((face_1.flatten(), face_2.flatten()))
    pca_selected = PCA(n_components=2)
    pca_selected.fit(selected_faces_matrix)
    eigenfaces_selected = pca_selected.components_

    selected_face_1_centered = face_1.flatten() - pca_selected.mean_
    selected_face_2_centered = face_2.flatten() - pca_selected.mean_

    weights_face_1_selected = eigenfaces_selected @ selected_face_1_centered
    weights_face_2_selected = eigenfaces_selected @ selected_face_2_centered

    mixed_weights_selected = (weights_face_1_selected + weights_face_2_selected) / 2

    merged_face_selected = (pca_selected.mean_ + (eigenfaces_selected.T @ mixed_weights_selected)).reshape(face_1.shape)

    # Convert the merged face to a base64 encoded string
    _, buffer = cv2.imencode('.png', merged_face_selected)
    merged_face_base64 = base64.b64encode(buffer).decode('utf-8')

    return jsonify({'merged_face': merged_face_base64})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    load_faces()
    print("Loaded faces:", face_names)
    app.run(debug=True, host='127.0.0.1', port=5000)