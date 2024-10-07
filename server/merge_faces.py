import os
import cv2
import numpy as np
from sklearn.decomposition import PCA
import base64

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

def get_faces():
    return face_names

def get_face(face_name):
    if face_name not in faces:
        return None
    face_image = faces[face_name]
    _, buffer = cv2.imencode('.png', face_image)
    return base64.b64encode(buffer).decode('utf-8')

def merge_faces(face_1_name, face_2_name):
    if face_1_name not in faces or face_2_name not in faces:
        return None

    face_1 = faces[face_1_name]
    face_2 = faces[face_2_name]

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

    _, buffer = cv2.imencode('.png', merged_face_selected)
    return base64.b64encode(buffer).decode('utf-8')