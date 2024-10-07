import React, { useEffect, useRef } from 'react';
import FaceMerger from './FaceMerger';
import FacialRecognition from './FacialRecognition';

const ContainerContent = ({ activeItem }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (activeItem === 'croissant' && videoRef.current) {
      videoRef.current.play();
    }
  }, [activeItem]);

  switch (activeItem) {
    case 'barista':
      return (
        <div className="barista-content">
          <h2>Meet Our Barista</h2>
          <p>Hi! My name is Lauren. I was born in France, but I grew up in Singapore.</p>
          <p>I am a current freshman at Cornell University pursuing computer science and planning on graduating early in 2027.</p>
          <h3>Why a "boulangerie" (bakery)? </h3>
          <p>I code the same way I bake, with love and passion. My portfolio mirrors the experience of a bakery, where each project is a ‘freshly baked’ creation. 
          In the same way I enjoy baking various types of desserts, I'm interested in exploring many different areas of computer science, whether that be machine learning, computer graphics, full-stack development, or more!
          </p>
          <ul>
            <li>Specialty: Baking cakes</li>
            <li>Favorite Drink: Iced matcha latte</li>
            <li>Fun Fact: I run a nail business on campus!</li>
          </ul>
          <p><br></br><a className="resume-button" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            View Resume
          </a></p>
          <h3>Contact Info</h3>
          <ul>
          <li><a href="https://www.linkedin.com/in/lauren-ahhot/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a></li>
            <li>lauren.ahhot@gmail.com / laa237@cornell.edu</li>
          </ul>
        </div>
      );
    case 'croissant':
      return (
        <div className="croissant-content">
          <h2>The Commercial Croissant: Bath Bomb Business Project</h2>
          <div className="demo-container">
            <div className="laptop-container">
              <img src="/laptop.png" alt="Laptop" className="laptop-image" />
              <div className="video-container">
                <video 
                  ref={videoRef}
                  width="100%" 
                  height="100%"
                  controls 
                  muted
                  loop
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
          <div className="links"> 
              <a href="https://whispering-bayou-31777-5fab955f372e.herokuapp.com/" target="_blank" rel="noopener noreferrer">
                Website
              </a>
              <a href="https://github.com/lauren1703/baindemousse" target="_blank" rel="noopener noreferrer">
                Github
              </a>
              <a href="https://www.instagram.com/baindemousse.sg/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>
          
          <p>I founded an online handmade bath bomb business and developed an engaging and aesthetic e-commerce website to boost customer click-through conversion rates.</p>
          <ul>
            <li>Handmade and sold 1300+ bath products, donating $5500+ to charities helping give access to clean water for people in need. </li>
            <li>Created products for Meta and American Express. Invited to showcase products in corporate events such as UOB.</li>
            <li>Featured in 3 online articles, growing to 650+ followers on social media.</li>
            <li>Received Beauty & Wellness Awards by Beauty Insider: Readers' & Bloggers' Choice Awards for Best Body Care</li>
          </ul>
          <p>Languages/Tools:</p>
          <ul>
            <li>Backend: Python with Django</li>
            <li>Frontend: HTML/CSS (Bootstrap)</li>
            <li>Database: PostgreSQL</li>
          </ul>
          <p className="note">Note: email hosting has been deactivated.</p>
        </div>
      );
    case 'baguette':
      return (
        <div className="baguette-content">
          <h2>The Biometric Baguette: Facial Recognition Program</h2>
          <FacialRecognition />
          <a href="https://github.com/lauren1703/facerecognition" target="_blank" rel="noopener noreferrer">
                Github
              </a>
          <p>The program allows users to select a test face and performs facial recognition using eigenfaces. 
            It displays the selected face, the best match from the dataset, and visualizes the eigenfaces used 
            in the recognition process. "Person s15" test face is outside the training set of faces, so it will find the 
            closest matching face instead.</p>
          <p>Languages/Tools:</p>
          <ul>
            <li>Backend: Python with Flask for API development</li>
            <li>Frontend: React.js for the user interface</li>
            <li>Image Processing: OpenCV and NumPy for face manipulation</li>
            <li>Machine Learning: Scikit-learn for Principal Component Analysis (PCA)</li>
            <li>Data Visualization: Matplotlib for eigenface representation</li>
          </ul>
        </div>
      );
    case 'cake':
      return (
        <div className="cake-content">
          <h2>The Mosaic Muffin: Face Merging Program</h2>
          <FaceMerger />
          <a href="https://github.com/lauren1703/facemerger" target="_blank" rel="noopener noreferrer">
                Github
              </a>
          <p>This program, from a collected dataset of headshots, takes distinct eigenfaces and merges them to construct a new face.</p>
          <p>Languages/Tools:</p>
          <ul>
            <li>Backend: Python with Flask for API development</li>
            <li>Frontend: React.js for creating an interactive user interface</li>
            <li>Image Processing: OpenCV and NumPy for face manipulation</li>
            <li>Machine Learning: Scikit-learn for Principal Component Analysis (PCA)</li>
            <li>Data Handling: Base64 encoding for image transfer between frontend and backend</li>
          </ul>
        </div>
      );
    case 'loaf':
      return (
        <div className="loaf-content">
          <h2>Lauren's Lovely Loaf (Upcoming)</h2>
          <p>From sourdough to whole grain, our bread loaves are the heart of our bakery.</p>
          <ul>
            <li>Naturally leavened sourdough</li>
            <li>Variety of whole grain options</li>
            <li>Perfect for sandwiches or simply with butter</li>
          </ul>
        </div>
      );
    default:
      return <p>Select an item to see details</p>;
  }
};

export default ContainerContent;