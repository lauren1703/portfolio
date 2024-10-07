import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './facemerger.scss';

const API_BASE_URL = '/api'; // Update this if your API is hosted elsewhere

const FaceMerger = () => {
  const [faces, setFaces] = useState([]);
  const [face1, setFace1] = useState('');
  const [face2, setFace2] = useState('');
  const [face1Image, setFace1Image] = useState(null);
  const [face2Image, setFace2Image] = useState(null);
  const [mergedFace, setMergedFace] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFaces();
  }, []);

  const fetchFaces = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_faces`);
      setFaces(response.data.faces);
    } catch (error) {
      console.error('Error fetching faces:', error);
      setError('Failed to load faces. Please ensure the server is running and try again.');
    }
  };

  const fetchFaceImage = async (faceName, setFaceImage) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_face/${faceName}`);
      setFaceImage(response.data.face_image);
    } catch (error) {
      console.error('Error fetching face image:', error);
      setError('Failed to load face image. Please ensure the server is running and try again.');
    }
  };

  const handleFace1Change = (e) => {
    setFace1(e.target.value);
    if (e.target.value) {
      fetchFaceImage(e.target.value, setFace1Image);
    } else {
      setFace1Image(null);
    }
  };

  const handleFace2Change = (e) => {
    setFace2(e.target.value);
    if (e.target.value) {
      fetchFaceImage(e.target.value, setFace2Image);
    } else {
      setFace2Image(null);
    }
  };

  const handleMerge = async () => {
    if (!face1 || !face2) {
      setError('Please select two faces to merge');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/merge_faces`, { face1, face2 });
      setMergedFace(response.data.merged_face);
      setError(null);
    } catch (error) {
      console.error('Error merging faces:', error);
      setError('Failed to merge faces. Please ensure the server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="face-recognition-merger">
      <h3>Face Recognition and Merging</h3>
      <div className="controls">
        <select value={face1} onChange={handleFace1Change} className="face-select">
          <option value="">Select Face 1</option>
          {faces.map(face => (
            <option key={face} value={face}>{face}</option>
          ))}
        </select>
        <select value={face2} onChange={handleFace2Change} className="face-select">
          <option value="">Select Face 2</option>
          {faces.map(face => (
            <option key={face} value={face}>{face}</option>
          ))}
        </select>
        <button onClick={handleMerge} className="merge-button" disabled={loading}>
          {loading ? 'Merging...' : 'Merge Faces'}
        </button>
      </div>
      <div className="face-display">
        {face1Image && (
          <div className="face-card">
            <h3>Face 1</h3>
            <img src={`data:image/png;base64,${face1Image}`} alt="Face 1" />
          </div>
        )}
        {face2Image && (
          <div className="face-card">
            <h3>Face 2</h3>
            <img src={`data:image/png;base64,${face2Image}`} alt="Face 2" />
          </div>
        )}
        {mergedFace && (
          <div className="face-card">
            <h3>Merged Face</h3>
            <img src={`data:image/png;base64,${mergedFace}`} alt="Merged Face" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceMerger;