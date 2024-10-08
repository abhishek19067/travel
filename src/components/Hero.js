import React from "react";
import "./HeroStyles.css"; // Specific styles for hero component

const Hero = ({ cName, heroImg, title, btnClass, buttonText, url }) => {
  return (
    <div className={cName}>
      <img src={heroImg} alt="Hero Background" />
      <div className="hero-text">
        <h1>{title}</h1>
        {btnClass !== "hide" && (
          <a href={url} className="btn">
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

export default Hero;
