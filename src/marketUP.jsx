import React, { useState } from "react";
import "./App.css";

export default function Marketplace() {
  const [year, setYear] = useState("");
  const [itemType, setItemType] = useState("");
    return (
    <div>
      <div className="navbar">
        <div className="logo">UoA Swap</div>

        <div className="nav-links">
          <a href="#">Material</a>
          <a href="#">Course</a>
          <a href="#">Market Place</a>
        </div>

        <div className="user-container">
          <a href="#" className="user-profile">
            <img src="/account.png" className="account" alt="" />
            <div className="user-info">
              <span className="user-name">Ari Mata</span>
              <span className="user-role">Student</span>
            </div>
          </a>

          <a href="#" className="points-badge">
            <img src="/money.jpg" className="account" alt="" />
            <span className="pts-text">1,234 pts</span>
          </a>
        </div>
      </div>

      <div className="UP-container">
        <h2>Create a New Listing</h2>
        <p>Upload images and provide details so other students can find your items</p>
        <div className="UP-separate">
        <div className="UP-left">
         <div className="UP-link">
            <button className="upload-box">
            <img src="/drag.png" className="UP-drag" alt="Drag and Drop" />
            </button>
            <div className="UP-images">
            <img src="/homepagebook.jpg" className="UP-uploaded" alt="" />
            <img src="/homepagebook.jpg" className="UP-uploaded" alt="" />
            <img src="/homepagebook.jpg" className="UP-uploaded" alt="" />
         </div>
        </div>
        </div>

        <div className="UP-right">
            <div className="UP-box">
                <h3>Product Name</h3>
                <input type="text" placeholder="e.g. Calculus II Textbook -- 2nd Edition" className="input-box" />
            </div>    
            
            <div className="UP-box">
                <h3>Price</h3>
                <input type="text" placeholder="e.g. $0.00" className="input-box" />
            </div>

            <div className="UP-box">
                <h3>Description</h3>
                <textarea placeholder="Add condiction,edition,included materials,pickup details..." className="input-box description-box" />    
            </div>

            <div className="UP-box">
                <h3>Year / Semester</h3>    
                <button className={`UP-button ${year === "S1" ? "selected" : ""}`}
                onClick={() => setYear("S1")}
                >
                2026 Semester 1 </button>

                <button className={`UP-button ${year === "S2" ? "selected" : ""}`}onClick={() => setYear("S2")}
                >
                2026 Semester 2  </button>

            </div>

           <div className="UP-box">
             <h3>Related Course</h3>

             <div className="UP-search-box">
             <img src="/searchmark.png" className="UP-search-icon" alt="" />
             <input
              type="text" placeholder="Search by course code, title, or instructor..." className="UP-input-box search-input"/>
             </div>

            <p>Suggestion: MATH102, ECON201, CS101</p>
           </div>

            <div className="UP-box">
                 <h3>Item Type</h3>
                 <button className={`UP-button ${itemType === "Books" ? "selected" : ""}`} onClick={() => setItemType("Books")}>
                    Books
                 </button>
                 <button className={`UP-button ${itemType === "Stationery" ? "selected" : ""}`} onClick={() => setItemType("Stationery")}>
                    Stationery
                 </button>
                 <button className={`UP-button ${itemType === "Electronics" ? "selected" : ""}`} onClick={() => setItemType("Electronics")}>
                    Electronics
                 </button>
                 <button className={`UP-button ${itemType === "Other" ? "selected" : ""}`} onClick={() => setItemType("Other")}>
                    Other
                 </button>
            </div>

            <div className="UP-box">
                <h3>Trading Location</h3>
                <input type="text" placeholder="Campus, city, or online (e.g., 11am Campus / Online pickup" className="input-box" />
            </div>

            <div className="contact-section">
                <h3>Contact</h3> 
                <div className="contact-row">
                    <div className="contact-input-group">
                <img src="/whatsApp.png" className="inner-icon" alt="" />    
                <input type="text" placeholder="WhatsApp number" className="input-icon" />
                </div>  
                <div className="contact-input-group">
                <img src="/email.png" className="inner-icon" alt="" />        
                <input type="text" placeholder="Email address" className="input-icon" />
                </div>
                <div className="contact-input-group">
                <img src="/phone.png" className="inner-icon" alt="" />        
                <input type="text" placeholder="Phone number" className="input-icon" />
                </div>
            </div>  
            </div>

            <div className="UP-tick">
                <div className="tick-left">
              <label>
                <input type="checkbox" /> I have read and agree to the 
                <a href="#">Terms and Conditions</a>
              </label>  
              </div>
              <div className="tick-right">
                <button className="UP-button">Save Draft</button>
                <button className="UP-button">Cancel</button>
                <button className="UP-button">Submit Listing</button>
                </div>
            </div>
        </div>
        </div>
       </div> 
       </div>

 )
 }     
