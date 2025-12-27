import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t py-10 bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <div className="space-y-3">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                eHaat
              </h1>
            </Link>
            <p className="text-sm text-gray-400">
              Your trusted online marketplace for quality products at great prices.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Copyright © 2025</p>
              <p>E-Haat Group</p>
              <p>Created by Keshav Jha</p>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="font-semibold uppercase text-sm text-gray-300">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-3">
            <h3 className="font-semibold uppercase text-sm text-gray-300">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h3 className="font-semibold uppercase text-sm text-gray-300">Follow Us</h3>
            <div className="flex flex-col gap-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaFacebook /> Facebook
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaTwitter /> Twitter
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <FaGithub /> Github
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors"
              >
                <FaInstagram /> Instagram
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <FaLinkedin /> LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>All rights reserved. Made with ❤️ for our customers.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
