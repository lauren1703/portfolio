import React, { useEffect, useRef, useState } from 'react';
import "./homepage.scss"

const Homepage = () => {
    const cafe = useRef(null);
    const poster = useRef(null);
    const table = useRef(null);
    const leftSide = useRef(null);
    const rightSide = useRef(null);
    const leftText = useRef(null);
    const rightText = useRef(null);

    const maxScale = 2.2;
    const translateOutLimit = 300;

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scaleFactor = 0.005;
            const translateAmount = scrollPosition * 2;

            if (poster.current && table.current && cafe.current && leftSide.current && rightSide.current && leftText.current && rightText.current) {
                if (scrollPosition <= translateOutLimit) {
                    poster.current.style.transform = `translateX(-${translateAmount}px) scale(0.7)`;
                    table.current.style.transform = `translateX(${translateAmount}px) scale(0.7)`;
                    leftText.current.style.transform = `translateX(-${translateAmount}px)`;
                    rightText.current.style.transform = `translateX(${translateAmount}px)`;
                    cafe.current.style.transform = `scale(1)`;
                    leftSide.current.style.opacity = 0;
                    leftSide.current.style.visibility = 'hidden';
                    rightSide.current.style.opacity = 0;
                    rightSide.current.style.visibility = 'hidden';
                } else {
                    const scaleValue = Math.min(1 + (scrollPosition - translateOutLimit) * scaleFactor, maxScale);
                    poster.current.style.transform = `translateX(-${window.innerWidth}px) scale(0.7)`;
                    table.current.style.transform = `translateX(${window.innerWidth}px) scale(0.7)`;
                    leftText.current.style.transform = `translateX(-${window.innerWidth}px)`;
                    rightText.current.style.transform = `translateX(${window.innerWidth}px)`;
                    cafe.current.style.transform = `scale(${scaleValue})`;
                    
                    if (scaleValue >= (maxScale)) {
                        leftSide.current.style.opacity = 1;
                        leftSide.current.style.visibility = 'visible';
                        rightSide.current.style.opacity = 1;
                        rightSide.current.style.visibility = 'visible';
                        cafe.current.style.opacity = 0;
                        cafe.current.style.visibility = 'hidden';
                        leftSide.current.style.transform = `translateX(-${translateAmount}px)`;
                        rightSide.current.style.transform = `translateX(${translateAmount}px)`;
                    } else {
                        leftSide.current.style.opacity = 0;
                        leftSide.current.style.visibility = 'hidden';
                        rightSide.current.style.opacity = 0;
                        rightSide.current.style.visibility = 'hidden';
                        cafe.current.style.opacity = 1;
                        cafe.current.style.visibility = 'visible';
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, );

    return (
        <div className="homepage" >
            <div className="sticky">
                <div className="cafe" ref={cafe}><img src="/cafe.png" alt="Cafe" /></div>
                <div className="left-side" ref={leftSide}><img src="/left_cafe.png" alt="Left Cafe Side" /></div>
                <div className="left-text" ref={leftText}>Welcome to...</div>
                <div className="right-side" ref={rightSide}><img src="right_cafe.png" alt="Right Cafe Side" /></div> 
                <div className="right-text" ref={rightText}>...scroll to <br />continue</div>
                <div className="poster" ref={poster}><img src="/poster.png" alt="Poster" /></div>
                <div className="table" ref={table}><img src="/table.png" alt="Table" /></div>
            </div>
        </div>
    );
};

export default Homepage;