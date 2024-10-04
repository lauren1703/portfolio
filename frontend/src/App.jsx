import React, { useState, useEffect } from 'react';
import { useRef } from "react";
import "./app.scss"
import Homepage from "./components/Homepage";
import Inside from "./components/Inside";

const App = () => {
  const [isInsideVisible, setIsInsideVisible] = useState(false);  
  const [isHomepageVisible, setIsHomepageVisible] = useState(true);
  const doorOpening = 550; 
  const doorOpened = 900;

  const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > doorOpening) {
          setIsInsideVisible(true);
      } 
      else  {
        setIsInsideVisible(false);  
      }
      if (scrollPosition > doorOpened) {
          setIsHomepageVisible(false);
      }
      else if (scrollPosition) {
        setIsHomepageVisible(true);
      }
      
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return <div className="home">
    <div className="sticky">
      <section id="Homepage">
        {isHomepageVisible && <Homepage />}
      </section>
      <section id="Inside">
        {isInsideVisible && <Inside />}
      </section>
    </div>
  </div>;
};

export default App;
