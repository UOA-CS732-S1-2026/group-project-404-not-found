import React, { useState } from "react";
import "./App.css";

export default function CourseDetail() {
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
    
      <div className="wrapper">
        <div className="card">
          <div className="card-top">
            <div className="card-left">
            <h2>MATHS 108 - Mathematics for Business</h2>
              <div className="tags">
              <span className="tag">Undergraduate</span>
              <span className="term">Trimester 1 • 2026</span>
              </div>
            <p className="description">
            An introduction to applied mathematics for business students covering calculus fundamentals,
            optimisation, time value of money and statistical methods with practical examples and problem sets
            used in commerce and finance contexts.
            </p>
            </div>

            <div className="card-right">
            <p>Course code: MATHS108</p>
            <p>Instructor: Dr. Ayesha Patel</p>
            </div>
          </div>
        </div>

        <div className="action-footer">
        <div className="select-actions">
        <button className="select-button">Continue Browsing</button>
        <button className="select-button">Share</button>
        <button className="select-button">Save</button>
        </div>
        <span className="updated-text">Updated: 12 Mar</span>
        </div>
        </div>

          <div className="devider">
            <div className="left-column">
                <div className="header-row">  
                <h3>Materials</h3> 
                <span className="updated-text">3 items</span> 
                </div>
                
                <div className="material-item">
                    <div className="material-left">
                <img src="/homepagebook.jpg" className="material-pic" alt="" />      
                <div>
                <h4>Maths 108 Notes.PDF</h4>
                <p className="updated-text">Uploaded 02 Mar 2026 • 1.8 MB • Uploaded by Emily</p>
                </div>
                </div>
                <div className="material-right">
                <a href="/files/xxx.pdf" download className="download-button">
               <img src="/downloadicon.png" className="download-icon" />
               </a>
                </div>
                </div>

                <div className="material-item">
                    <div className="material-left">
                <img src="/homepagebook.jpg" className="material-pic" alt="" />
                <div>
                <h4>Assignment 1 Solutions.DOCX</h4>
                <p className="updated-text">Uploaded 10 Mar 2026 • 240KB • Uploaded by Liam</p>
                </div>
                </div>
                <div className="material-right">
                <a href="/files/xxx.pdf" download className="download-button">
               <img src="/downloadicon.png" className="download-icon" />
               </a>
                </div>
               </div>

                <div className="material-item">
                    <div className="material-left">
                <img src="/homepagebook.jpg" className="material-pic" alt="" />          
                <div>
                <h4>Practice Exam.PDF</h4>
                <p className="updated-text">Uploaded 18 Feb 2026 • 3.2 MB • Uploaded by Course</p>
                </div>
                </div>
                <div className="material-right">
                <a href="/files/xxx.pdf" download className="download-button">
               <img src="/downloadicon.png" className="download-icon" />
               </a>
                </div>
                </div>
                <button className="material-button">Load more items</button>
            </div>


        <div className="right-column">
            <div className="header-row">    
            <h3>Marketplace</h3>
            <span className="updated-text">4 listings</span>
            </div>

                <div className="marketplace-item">
                <img src="/homepagebook.jpg" className="marketplace-pic" alt="" />      
                <div className="marketplace-content"> 
                    <div className="marketplace-title">               
                    <h4>Mathematics for Business - 2nd ed</h4>
                    <h4 className="price">$10.99</h4>
                 </div>
    
              <p className="updated-text">A well-kept textbook with margin notes from previous students.</p>
              <div className="seller-info">
                <div className="seller-left">
              <img src="/account.png" className="seller-pic" alt="" />  
              <p>Seller: Oliver Nguyen</p>
              </div>
              <button class="marketplace-view">View details</button>
              </div>
              </div>
            </div>

            <div className="marketplace-item">
                <img src="/homepagebook.jpg" className="marketplace-pic" alt="" />      
                <div className="marketplace-content"> 
                    <div className="marketplace-title">  
               <h4>Lecture Notes Bundle</h4>
               <h4 className="price">$6.00</h4>
               </div>

               <p className="updated-text">Photocopies of full semester lecture notes.</p>
               <div className="seller-info">
                <div className="seller-left">
                <img src="/account.png" className="seller-pic" alt="" />
               <p>Seller: Priya Sharma</p>
               </div>
               <button class="marketplace-view">View details</button>
               </div>
            </div>
                </div>
            <button className="marketplace-button">Load more listings</button>
            </div>
        </div>
      </div>

)}