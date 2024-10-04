import React, { useEffect, useRef, useState } from 'react';
import "./parallax.scss"
import { handleItemClick } from '../../Inside';

const Parallax = (type) => {
    const cafe = useRef(null);
    const poster = useRef(null);
    const table = useRef(null);
    const leftSide = useRef(null);  // Reference for left side cafe part
    const rightSide = useRef(null); // Reference for right side cafe part
    const leftText = useRef(null);  // Reference for left text ("Welcome to...")
    const rightText = useRef(null);
    const counter = useRef(null);
    const barista = useRef(null);
    const croissant = useRef(null);
    const baguette = useRef(null);
    const cake = useRef(null);
    const loaf = useRef(null);
    const inside = useRef(null);
    const hanging_sign = useRef(null);
    const hangingSign = useRef(null);
    const brownRectangle = useRef(null);
    const [activeItem, setActiveItem] = useState(null); // Track which item is clicked
    const [fadeIn, setFadeIn] = useState(false);

    const maxScale = 2.2; // Maximum scale for the cafe
    const translateOutLimit = 300; // Scroll threshold to fully translate poster and table out of view

    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const scaleFactor = 0.005; // This determines how much the cafe scales per scroll pixel
        const translateAmount = scrollPosition * 2; // Move 2x faster than scroll

        
        if (poster.current && table.current && cafe.current && leftSide.current && rightSide.current && leftText.current && rightText.current) {
            // Phase 1: Translate poster and table out of the screen
            if (scrollPosition <= translateOutLimit) {
                
                poster.current.style.transform = `translateX(-${translateAmount}px) scale(0.7)`;
                table.current.style.transform = `translateX(${translateAmount}px) scale(0.7)`;
                leftText.current.style.transform = `translateX(-${translateAmount}px)`; // Translate left text out
                rightText.current.style.transform = `translateX(${translateAmount}px)`; // Translate right text out
                // Ensure the cafe stays at initial scale during this phase
                cafe.current.style.transform = `scale(1)`;
                // Hide the left and right sides
                leftSide.current.style.opacity = 0;
                leftSide.current.style.visibility = 'hidden';
                rightSide.current.style.opacity = 0;
                rightSide.current.style.visibility = 'hidden';
                inside.current.style.opacity = 0;
                inside.current.style.visibility = 'hidden';
            } 
            // Phase 2: Scale cafe after poster and table are out
            else {
                const scaleValue = Math.min(1 + (scrollPosition - translateOutLimit) * scaleFactor, maxScale);
                console.log(scaleValue);
                // Poster and table are already out, no need to translate them further
                poster.current.style.transform = `translateX(-${window.innerWidth}px) scale(0.7)`;
                table.current.style.transform = `translateX(${window.innerWidth}px) scale(0.7)`;
                leftText.current.style.transform = `translateX(-${window.innerWidth}px)`;
                rightText.current.style.transform = `translateX(${window.innerWidth}px)`;

                // Scale the cafe
                cafe.current.style.transform = `scale(${scaleValue})`;
                
                // Only show left and right sides when cafe is fully zoomed in
                if (scaleValue >= (maxScale)) { // Allow a tolerance for maxScale
                    leftSide.current.style.opacity = 1;
                    leftSide.current.style.visibility = 'visible';
                    rightSide.current.style.opacity = 1;
                    rightSide.current.style.visibility = 'visible';
                    cafe.current.style.opacity = 0;
                    cafe.current.style.visibility = 'hidden';
                    leftSide.current.style.transform = `translateX(-${translateAmount}px)`;
                    rightSide.current.style.transform = `translateX(${translateAmount}px)`;
                    inside.current.style.opacity = 1;
                    inside.current.style.visibility = 'visible';
                } else {
                    // Ensure they are hidden while scaling
                    leftSide.current.style.opacity = 0;
                    leftSide.current.style.visibility = 'hidden';
                    rightSide.current.style.opacity = 0;
                    rightSide.current.style.visibility = 'hidden';
                    cafe.current.style.opacity = 1;
                    cafe.current.style.visibility = 'visible';
                    inside.current.style.opacity = 0;
                    inside.current.style.visibility = 'hidden';
                }
            }
        }

    };

    useEffect(() => {
        // Trigger fade-in after component mounts
        setFadeIn(true);

        // Add scroll listener
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`homepage ${fadeIn ? 'fade-in' : ''}`}>
            <div className="sticky">
                <div className="cafe" ref={cafe}><img src="/cafe.png"></img></div>
                <div className="left-side" ref={leftSide}><img src="/left_cafe.png" alt="Left Cafe Side" /></div>
                <div className="left-text" ref={leftText}>Welcome to...</div>
                <div className="right-side" ref={rightSide}><img src="/right_cafe.png" alt="Right Cafe Side" /></div> 
                <div className="right-text" ref={rightText}>...scroll to <br></br>continue</div>
                <div className="poster" ref={poster}><img src="/poster.png"></img></div>
                <div className="table" ref={table}><img src="/table.png"></img></div>
                <div className="inside" ref={inside}>
                    <div className="counter" ref={counter}>
                        <img src="/counter.png"></img>
                        <div className="barista" ref={barista}><img src="/barista.png"></img></div>
                        <div className="items">
                            <div className="row1">
                                <div className="croissant" 
                                onClick={() => handleItemClick('croissant', setActiveItem, hangingSign, brownRectangle)} 
                                    ref={croissant}><img src="/croissant.png"></img></div>
                                <div className="baguette" ref={baguette}><img src="/baguette.png"></img></div>
                            </div>
                            <div className="row2"> 
                                <div className="cake" ref={cake}><img src="/cake.png"></img></div>
                                <div className="loaf" ref={loaf}><img src="/loaf.png"></img></div>
                            </div>
                        </div>
                    </div>
                    <div className="hanging_sign" ref={hanging_sign}><img src="/hanging_sign.png"></img></div>
                </div>
                <div className="brown-rectangle" ref={brownRectangle}>
                    <p>Details about {activeItem}</p> {/* Show details based on clicked item */}
                </div>
            </div>
        </div>
    );
};

export default Parallax;
