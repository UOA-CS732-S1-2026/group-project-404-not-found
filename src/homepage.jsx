import React from "react";
import "./App.css";

export default function Homepage() {
  return (
    <div>
      <div className="navbar">
        <div className="logo">UoA Swap</div>

        <div className="nav-links">
          <a href="#">Material</a>
          <a href="#">Course</a>
          <a href="#">Market Place</a>
          <a href="#" className="login-btn">Log in</a>
        </div>
      </div>

      <div className="about-section">
        <h1>About Us</h1>

        <p>
          UoA Swap is a website focused on building an efficient and user-friendly platform for seamless exchanges.
        </p>

        <button className="login-btn">Get Started</button>
      </div>

      <div>
        <img src="/homepage.jpg" className="full-width-img" alt="" />
      </div>

      <div className="about-section">
        <h2>Material</h2>
      </div>
      
      <div className="about-section">
        <div className="image-row">
        <div className="item">
          <img src="homepagebook.jpg" alt="" />
          <p>Image 1 description</p>
        </div>  

        <div className="item">
          <img src="/homepagebook.jpg" alt="" />
          <p>Image 2 description</p>
        </div>

        <div className="item">
          <img src="/homepagebook.jpg" alt="" />
          <p>Image 3 description</p>
        </div>
      </div>
      </div>

      <div className="container">
        <div className="left">
            <h2>Course</h2>
            <h3>Text 1</h3>
            <p>words</p>
            <h3>Text 2</h3>
            <p>words</p>
            <h3>Text 3</h3>
            <p>words</p>
        </div>

        <div className="right">
            <img src="/homepagebook.jpg" alt="" />
        </div>
      </div>

      <div className="about-section">
        <h2>Market Place</h2>
      </div>

      <div className="image-row">
        <div className="item">
          <img src="/homepagebook.jpg" alt="" />
          <p>Image 1 description</p>
        </div>

        <div className="item">
          <img src="/homepagebook.jpg" alt="" />
          <p>Image 2 description</p>
        </div>
      </div>

      <footer className="footer">

        <div className="footer-left">
          <div className="logo">UoA Swap</div>

          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook"></i>
            </a>

            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="footer-right">
          <div className="column">
            <h4>Resource</h4>
            <a href="#">Material</a>
            <a href="#">Course</a>
            <a href="#">Market Place</a>
          </div>

          <div className="column">
            <h4>Service</h4>
            <a href="#">Events</a>
            <a href="#">Support</a>
          </div>

          <div className="column">
            <h4>Help</h4>
            <a href="#">Contact</a>
            <a href="#">Report</a>
          </div>
        </div>

      </footer>

    </div>
  );
}