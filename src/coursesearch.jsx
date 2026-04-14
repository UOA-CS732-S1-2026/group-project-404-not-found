import React, { useState } from "react";
import "./App.css";

export default function CourseSearch() {
  const [levels, setLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semester, setSemester] = useState("");
  const toggleItem = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };
const [currentPage, setCurrentPage] = useState(1);
const pages = [1, 2, 3, 4];
  
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

      <div className="about-section">
        <h1>Find your course</h1>

        <p>Search courses by code, title, instructor or department.</p>

        <div className="search-container">
          <div className="search-box">
            <img src="/searchmark.png" className="search-mark" alt="" />
            <input
              type="text"
              placeholder="Search by course code, title, or instructor..."
              className="search-input"
            />
          </div>

          <button className="search-button">Search</button>
        </div>

        <div className="row">
            <div className="filed">
            <h4>Level</h4>
            <div className="options">
            {["100", "200", "300"].map((item) => (
            <div key={item} className="option">
            {item}
            </div>
           ))}
           </div>
           </div>

  
        <div className="field">
        <h4>Semester</h4>
        <select>
        <option value="">Select Semester</option>
        <option value="S1">Semester 1</option>
        <option value="S2">Semester 2</option>
        </select>
        </div>

 
       <div className="field">
       <label>
       <input type="checkbox" />
       Show only available courses
       </label>
       </div>

    </div>
        
        <div className="field">
          <h4>Department</h4>
          <div className="options">
            {["CS", "Math", "Stats"].map((item) => (
              <div
                key={item}
                className={`option ${departments.includes(item) ? "selected" : ""}`}
                onClick={() => toggleItem(item, departments, setDepartments)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
     
       <div className="search-links">
         <div className="search-left">
         <h3>24 courses found</h3>
         </div>
         <div className="search-right">
         <span>Sorted by</span>
         <select>
         <option value="">Newest first</option>
         <option value="S1">Most popular</option>
         </select>
        </div>
        </div>

          <div className="course-grid">
            <div className="course-card">
              <div className="card-content">
                 <div className="card-text">
                 <h4>COMPSCI 101</h4>
                 <p>Intro to Programming</p>
                 <div className="card text">
                 <p>instructor: Dr.xxx</p>  
                 <p>schedule:Fri 9:00-12:00 Elam</p> 
                 <p>Prerequisites: None</p>
                 </div>
                 </div>
              <img src="/course1.jpg" alt="" />
              </div>
            <button>View Detail</button>
            </div>

            <div className="course-card">
               <div className="card-content">
                 <div className="card-text">
                 <h4>MATHS 120</h4>
                 <p>Discrete Math</p>
                </div>
               <img src="/course2.jpg" alt="" />
              </div>
              <button>View Detail</button>
            </div>

           <div className="course-card">
             <div className="card-content">
               <div className="card-text">
               <h4>STATS 101</h4>
               <p>Statistics Basics</p>
               </div>
             <img src="/course3.jpg" alt="" />
             </div>
            <button>View Detail</button>
            </div>
            </div>
            
            <div className="pagination-wrapper">
            <div className="pagination">
            <button className="page-nav">Prev</button>
            <button className="page active">1</button>
            <button className="page">2</button>
            <button className="page">3</button>
            <button className="page">4</button>
            <button className="page-nav">Next</button>
            </div>
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
)
}