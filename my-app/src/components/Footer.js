import React from 'react';
import { FiMail } from 'react-icons/fi';
import { FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} DooDh Vallah. All rights reserved.</p>

      <div className="footer-links">
        {/* Email */}
        <a href="mailto:youremail@example.com" className="footer-icon" title="Email">
          <FiMail />
          <span>navyasai@gmail.com</span>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com/your_instagram_id"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
          title="Instagram"
        >
          <FaInstagram />
          <span>@Navyasai</span>
        </a>

        {/* Twitter */}
        <a
          href="https://twitter.com/your_twitter_id"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
          title="Twitter"
        >
          <FaTwitter />
          <span>@Navyasai</span>
        </a>
      </div>
    </footer>
  );
}
