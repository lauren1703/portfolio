from flask import Flask, jsonify, request
from flask_cors import CORS
from flask import make_response
import os
import cv2
import numpy as np
from sklearn.decomposition import PCA
import base64
import zipfile
import random
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://laurenahhot-02c159a9b554.herokuapp.com"}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'https://laurenahhot-02c159a9b554.herokuapp.com')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

faces = {}
test_faces = {}
pca = None
removed_person = None
faceshape = None

def load_faces(zip_path="attface.zip"):
    global faces, test_faces, removed_person, faceshape
    zip_path = os.path.join(os.path.dirname(__file__), zip_path)
    with zipfile.ZipFile(zip_path) as facezip:
        all_files = [f for f in facezip.namelist() if f.endswith(".pgm")]
        all_persons = set(f.split("/")[0] for f in all_files)
        
        removed_person = random.choice(list(all_persons))
        
        for filename in all_files:
            person_id = filename.split("/")[0]
            with facezip.open(filename) as image:
                face = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
                if faceshape is None:
                    faceshape = face.shape
                if person_id not in faces:
                    faces[person_id] = []
                    test_faces[person_id] = None
                
                if person_id == removed_person:
                    if test_faces[person_id] is None:
                        test_faces[person_id] = face
                elif test_faces[person_id] is None and random.random() < 0.1:
                    test_faces[person_id] = face
                else:
                    faces[person_id].append(face)

def prepare_pca():
    global pca
    facematrix = []
    for person_faces in faces.values():
        facematrix.extend([face.flatten() for face in person_faces])
    facematrix = np.array(facematrix)
    
    pca = PCA(n_components=50)
    pca.fit(facematrix)

def build_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "https://laurenahhot-02c159a9b554.herokuapp.com")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def build_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "https://laurenahhot-02c159a9b554.herokuapp.com")
    return response

def build_response(data, status_code=200):
    response = make_response(jsonify(data), status_code)
    return response

@app.route('/get_test_faces', methods=['GET', 'OPTIONS'])
def get_test_faces():
    if request.method == "OPTIONS":
        return build_response({})
    
    logging.info("Fetching test faces")
    try:
        test_faces_data = {}
        for person_id, face in test_faces.items():
            if face is not None:
                _, buffer = cv2.imencode('.png', face)
                face_base64 = base64.b64encode(buffer).decode('utf-8')
                test_faces_data[person_id] = face_base64
        
        logging.info(f"Returning {len(test_faces_data)} test faces")
        return build_response(test_faces_data)
    except Exception as e:
        logging.error(f"Error in get_test_faces: {str(e)}")
        return build_response({"error": str(e)}, 500)

@app.route('/get_eigenfaces', methods=['POST', 'OPTIONS'])
def get_eigenfaces():
    if request.method == "OPTIONS":
        return build_response({})
    
    data = request.json
    person_id = data.get('person_id')
    logging.info(f"Generating eigenfaces for person {person_id}")
    
    if person_id not in test_faces:
        logging.error(f"Invalid person ID: {person_id}")
        return build_response({'error': 'Invalid person ID'}, 400)
    
    try:
        query = test_faces[person_id]
        query_weight = pca.transform([query.flatten()])[0]
        
        fig, axes = plt.subplots(4, 4, figsize=(8, 10))
        for i in range(16):
            eigenface = pca.components_[i].reshape(faceshape)
            weighted_eigenface = eigenface * query_weight[i]
            axes[i//4, i%4].imshow(weighted_eigenface, cmap="gray")
            axes[i//4, i%4].axis('off')
        
        plt.tight_layout()
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        eigenfaces_image = base64.b64encode(buf.getvalue()).decode('utf-8')
        plt.close(fig)
        
        logging.info("Eigenfaces generated successfully")
        return build_response({
            'eigenfaces_image': eigenfaces_image,
            'weights_shape': query_weight.shape
        })
    except Exception as e:
        logging.error(f"Error in get_eigenfaces: {str(e)}")
        return build_response({"error": str(e)}, 500)

@app.route('/recognize_face', methods=['POST', 'OPTIONS'])
def recognize_face():
    if request.method == "OPTIONS":
        return build_response({})
    
    data = request.json
    person_id = data.get('person_id')
    
    if person_id not in test_faces:
        return build_response({'error': 'Invalid person ID'}, 400)
    
    try:
        query = test_faces[person_id]
        query_weight = pca.transform([query.flatten()])[0]
        
        all_weights = pca.transform([face.flatten() for person_faces in faces.values() for face in person_faces])

        euclidean_distances = np.linalg.norm(all_weights - query_weight, axis=1)
        best_match_index = np.argmin(euclidean_distances)
        best_match_person = list(faces.keys())[best_match_index // len(faces[list(faces.keys())[0]])]
        best_match_distance = euclidean_distances[best_match_index]
        
        best_match_face = faces[best_match_person][0]
        _, buffer = cv2.imencode('.png', best_match_face)
        best_match_face_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return build_response({
            'best_match': best_match_person,
            'distance': float(best_match_distance),
            'best_match_image': best_match_face_base64
        })
    except Exception as e:
        logging.error(f"Error in recognize_face: {str(e)}")
        return build_response({"error": str(e)}, 500)

def initialize_app():
    global faces, test_faces, pca, removed_person, faceshape
    load_faces()
    prepare_pca()
    logging.info(f"Loaded faces for {len(faces)} people")
    logging.info(f"Removed person: {removed_person}")

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    initialize_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)