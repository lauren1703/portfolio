import React, { useRef, useState } from 'react';
import ContainerContent from './ContainerContent';
import "./inside.scss";

const Inside = () => {
  const counter = useRef(null);
  const barista = useRef(null);
  const croissant = useRef(null);
  const baguette = useRef(null);
  const cake = useRef(null);
  const loaf = useRef(null);
  const inside = useRef(null);
  const hanging_sign = useRef(null); // Use the same name consistently
  const container = useRef(null);
  const [activeItem, setActiveItem] = useState(null); // Track which item is clicked
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSignRotated, setIsSignRotated] = useState(false);


  const handleItemClick = (item) => {
    if (isAnimating) return; // Prevent clicks during animation

    setIsAnimating(true);
    
    if (isContainerOpen) {


      // If container is open, close it first
      setIsContainerOpen(false);
      
      // Wait for close animation to finish
      setTimeout(() => {
        setActiveItem(item);
        setIsContainerOpen(true);
        
        // Animation finished
        setTimeout(() => setIsAnimating(false), 1000);
      }, 1000); // Match this with your animation duration

    } else {
      // If container is closed, open it and rotate the sign
      setActiveItem(item);
      setIsContainerOpen(true);
      setIsSignRotated(true);
      
      // Animation finished
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const handleClose = () => {
    if (isAnimating) return; // Prevent close during animation

    setIsContainerOpen(false);
    setIsSignRotated(false);
    setIsAnimating(true);
    
    // Animation finished
    setTimeout(() => {
      setIsAnimating(false);
      setActiveItem(null);
    }, 1000);
  };


  return (
    <div>
      <div className="inside" ref={inside}>
        <div className="counter" ref={counter}>
          <img src="/counter.png" alt="Counter" />
          <div 
            className="barista" 
            onClick={() => handleItemClick('barista')} 
            ref={barista}>
            <img src="/barista.png" alt="Barista" />
          </div>
          <div className="items">
            <div className="row1">
              <div 
                className="croissant" 
                onClick={() => handleItemClick('croissant')} 
                ref={croissant}>
                <img src="/croissant.png" alt="Croissant" />
              </div>
              <div 
                className="baguette" 
                onClick={() => handleItemClick('baguette')} 
                ref={baguette}>
                <img src="/baguette.png" alt="Baguette" />
              </div>
            </div>
            <div className="row2">
              <div 
                className="cake" 
                onClick={() => handleItemClick('cake')} 
                ref={cake}>
                <img src="/cake.png" alt="Cake" />
              </div>
              <div 
                className="loaf" 
                onClick={() => handleItemClick('loaf')} 
                ref={loaf}>
                <img src="/loaf.png" alt="Loaf" />
              </div>
            </div>
          </div>
        </div>

        <div className={`hanging_sign ${isSignRotated ? 'rotate-out' : '' }`} ref={hanging_sign}>
          <img src="/hanging_sign.png" alt="Hanging Sign" />
        </div>

        <div className={`container ${isContainerOpen ? 'slide-in' : 'slide-out'}`} ref={container}>
          <div className="close-tab" onClick={handleClose}>×</div>
            <div className="content">
            <ContainerContent activeItem={activeItem} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Inside;
