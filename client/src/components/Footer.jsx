import React from 'react';
import { FaFacebook } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-theme-200 bg-gradient-to-r from-theme-50 to-theme-100">
      <div className="container mx-auto p-6 text-center flex flex-col lg:flex-row lg:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-theme-800 font-medium">
            © All Rights Reserved 2025 Pakiza
          </p>
          <p className="text-theme-600 text-sm">
            Fast Delivery • Quality Products • Best Prices
          </p>
        </div>

        <div className="flex items-center gap-6 justify-center">
          <a
            href="https://web.facebook.com/profile.php?id=61569561023739"
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme-500 hover:text-theme-700 transition-all duration-300 transform hover:scale-110"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://www.instagram.com/codeinnovators788/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme-500 hover:text-theme-700 transition-all duration-300 transform hover:scale-110"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
