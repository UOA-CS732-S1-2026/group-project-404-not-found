import React, { useState } from "react";
import "./App.css";

export default function MaterialUP() {
  const [year, setYear] = useState("");
  const[department,setDepartment]=useState("");
  const [Type, setType] = useState("");
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
       
        <div className="UP-card">
                <div className="UP-area">
                    <img src="/drag.png" className="UP-upper-pic" alt="" />
                    <span className="UP-upper"> Drag and drop your file here, or click to</span>
                    <span className="UP-upper"> supports PDF, DOCX, PPT, images, videos, Max 50 MB. </span>
                    <div className="UP-method-group">
                    <button className="UP-button"> Choose File</button>
                    <button className="UP-button"> Browse Folders</button>
                    </div>
                    <div className="UP-lower">
                        <img src="/drag.png" className="UP-lower-pic" alt=""/>
                        <div className="UP-file-info">
                        <h4>Advanced Algorithm - Lecture Notes.pdf</h4>
                        <p>2.4 MB • PDF</p>
                        </div>
                        <button className="UP-button">Remove</button>
                    </div>      
                 </div>
                 </div>

             <div className="UP-second-part">
                <div className="UP-box">
                <h3>Material Name</h3>
                <input type="text" placeholder="e.g. Advanced Algorithms - Lecture 5 Notes" className="input-box" />
                </div>    
            
            <div className="UP-box">
                <h3>Course</h3>
                <input type="text" placeholder="e.g. Search by course code or title(e.g., COMP261)" className="input-box" />
                <div className="UP-course-suggestion">
                <button className="UP-course-align" onClick={() => console.log("Selected COMP 261")}>
               <h3>COMP 261 - Data Structures and Algorithms</h3>
               <p>Computer Science 2026</p>
               </button>

               <button className="UP-course-align" onClick={() => console.log("Selected COMP 212")}>
              <h3>COMP 212 - Software Engineering</h3> 
              <p>Computer Science • 2026</p>
              </button>
             </div>
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
             <h3>Department</h3>

             <button className={`UP-button ${department === "CS" ? "selected" : ""}`}
                onClick={() => setDepartment("CS")}
                >
                Computer Science </button>

                <button className={`UP-button ${department === "MATH" ? "selected" : ""}`}onClick={() => setDepartment("MATH")}
                >
                Mathematics </button>

            </div>

            <div className="UP-box">
                 <h3>Type</h3>
                 <button className={`UP-button ${Type === "PDF" ? "selected" : ""}`} onClick={() => setType("PDF")}>
                    PDF
                 </button>
                 <button className={`UP-button ${Type === "DOCX" ? "selected" : ""}`} onClick={() => setType("DOCX")}>
                    DOCX
                 </button>
                 <button className={`UP-button ${Type === "PPT" ? "selected" : ""}`} onClick={() => setType("PPT")}>
                    PPT
                 </button>
                 <button className={`UP-button ${Type === "Other" ? "selected" : ""}`} onClick={() => setType("Other")}>
                    Other
                 </button>
            </div>
            </div>
            
            <div className="UP-tick-part">
            <div className="UP-tick">
              <label>
                <input type="checkbox" /> I confirm this material does not violate copyright and I have the rights to share
                <a href="#">Terms and Conditions</a>
              </label>  
            </div>
              <div className="tick-right">
                <button className="UP-button">Save Draft</button>
                <button className="UP-button">Cancel</button>
                <button className="UP-button">Submit Listing</button>
              </div>
            </div>
        

            <div className="UP-footer">
                <p>UoA Swap • Share and exchange course materials responsibility. © 2026 University of Auckland Student Marketplace </p>
            </div>    
    </div>
    )
}   
