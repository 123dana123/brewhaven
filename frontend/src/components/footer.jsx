import React from "react";
import '../styles/footer.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-text">
                &copy; 2025 Brew Haven. All Rights Reserved.
            </div>
             <h1>Contact Us</h1>
            
                  <div className="contact-container">
                
                    <div className="contact-info">
                      <p>
                        <LocationOnIcon /> 
                        <a href="https://maps.google.com/?q=742+Street,+Achrafieh" target="_blank" rel="noreferrer">
                          742 Street, Achrafieh
                        </a>
                      </p>
                      <p><PhoneIcon /> +961 70 400 604</p>
                      <p><EmailIcon /> info@brewhaven.com</p>
                      <p>
                        <InstagramIcon />{" "}
                        <a href="https://instagram.com/mycoffee" target="_blank" rel="noreferrer">Instagram</a>
                      </p>
                      <p>
                        <FacebookIcon />{" "}
                        <a href="https://facebook.com/mycoffee" target="_blank" rel="noreferrer">Facebook</a>
                      </p>
                    </div>
                  </div>
        </footer>
    );
}

export default Footer;
