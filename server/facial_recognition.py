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

faces = {}
test_faces = {}
pca = None
removed_person = "s15"  
faceshape = None

def load_faces(zip_path="attface.zip"):
    global faces, test_faces, removed_person, faceshape
    with zipfile.ZipFile(zip_path) as facezip:
        all_files = [f for f in facezip.namelist() if f.endswith(".pgm")]
        
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
                elif test_faces[person_id] is None and len(faces[person_id]) == 9:  # Use the 10th image as test
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

def get_test_faces():
    logging.info("Fetching test faces")
    test_faces_data = {}
    for person_id, face in test_faces.items():
        if face is not None:
            _, buffer = cv2.imencode('.png', face)
            face_base64 = base64.b64encode(buffer).decode('utf-8')
            test_faces_data[person_id] = face_base64
    
    logging.info(f"Returning {len(test_faces_data)} test faces")
    return test_faces_data

def get_eigenfaces(person_id):
    logging.info(f"Generating eigenfaces for person {person_id}")
    
    if person_id not in test_faces:
        logging.error(f"Invalid person ID: {person_id}")
        return {'error': 'Invalid person ID'}
    
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
    return {
        'eigenfaces_image': eigenfaces_image,
        'weights_shape': query_weight.shape
    }

def recognize_face(person_id):
    if person_id not in test_faces:
        return {'error': 'Invalid person ID'}
    
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
    
    return {
        'best_match': best_match_person,
        'distance': float(best_match_distance),
        'best_match_image': best_match_face_base64,
        'is_removed_person': person_id == removed_person  # New field
    }