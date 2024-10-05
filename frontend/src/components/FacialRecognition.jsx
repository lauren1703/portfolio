import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './facialrecognition.scss';

const API_BASE_URL = 'https://laurenahhot-02c159a9b554.herokuapp.com/';

const FacialRecognition = () => {
  const [testFaces, setTestFaces] = useState({});
  const [selectedFace, setSelectedFace] = useState('');
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [eigenfaces, setEigenfaces] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestFaces();
  }, []);

  useEffect(() => {
    if (selectedFace) {
      fetchEigenfaces(selectedFace);
    }
  }, [selectedFace]);

  const fetchTestFaces = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/get_test_faces`);
      console.log("Fetched test faces:", response.data);
      setTestFaces(response.data);
    } catch (error) {
      console.error('Error fetching test faces:', error);
      setError('Failed to load test faces. Please ensure the server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEigenfaces = async (personId) => {
    setLoading(true);
    try {
      console.log("Fetching eigenfaces for person:", personId);
      const response = await axios.post(`${API_BASE_URL}/get_eigenfaces`, { person_id: personId });
      console.log("Fetched eigenfaces:", response.data);
      setEigenfaces(response.data);
    } catch (error) {
      console.error('Error fetching eigenfaces:', error);
      setError('Failed to load eigenfaces. Please ensure the server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFaceChange = (event) => {
    const newSelectedFace = event.target.value;
    console.log("Selected face changed to:", newSelectedFace);
    setSelectedFace(newSelectedFace);
    setRecognitionResult(null);
  };

  const handleRecognize = async () => {
    if (!selectedFace) {
      setError('Please select a face first');
      return;
    }

    setLoading(true);
    try {
      console.log("Recognizing face:", selectedFace);
      const response = await axios.post(`${API_BASE_URL}/recognize_face`, {
        person_id: selectedFace
      });
      console.log("Recognition result:", response.data);
      setRecognitionResult(response.data);
      setError(null);
    } catch (error) {
      console.error('Error recognizing face:', error);
      setError('Failed to recognize face. Please ensure the server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="facial-recognition">
      <h3>Facial Recognition</h3>
      <select onChange={handleFaceChange} value={selectedFace}>
        <option value="">Select a face</option>
        {Object.entries(testFaces).map(([id, face]) => (
          <option key={id} value={id}>Person {id}</option>
        ))}
      </select>
      <button onClick={handleRecognize} disabled={loading}>
        {loading ? 'Processing...' : 'Recognize Face'}
      </button>
      {error && <p className="error">{error}</p>}
      <div className="face-comparison">
        {selectedFace && testFaces[selectedFace] && (
          <div className="selected-face">
            <h4>Selected Face</h4>
            <img src={`data:image/png;base64,${testFaces[selectedFace]}`} alt={`Person ${selectedFace}`} />
          </div>
        )}
        {recognitionResult && (
          <div className="recognition-result">
            <h4>Recognition Result</h4>
            <p>Best Match: Person {recognitionResult.best_match}</p>
            <p>Distance: {recognitionResult.distance.toFixed(2)}</p>
            <img src={`data:image/png;base64,${recognitionResult.best_match_image}`} alt="Best match face" />
          </div>
        )}
      </div>
      {eigenfaces && (
        <div className="eigenfaces">
          <h4>Eigenfaces for Selected Image</h4>
          <img src={`data:image/png;base64,${eigenfaces.eigenfaces_image}`} alt="Eigenfaces" />
          <p>Shape of the weight vector: {eigenfaces.weights_shape[0]}</p>
        </div>
      )}
    </div>
  );
};

export default FacialRecognition;