import React from 'react';
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t py-10 bg-Sapphire-Blue text-linen">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">

          {/* Logo & Info */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-linen">e-haat</h1>
            <p className=" text-sm">Copyright © 2025 </p>
            <p className=" text-sm">E-Haat Group </p>
            <p className=" text-sm">Created by Keshav Jha</p>
          </div>

          {/* Product */}
          <div className="space-y-2">
            <h3 className="font-semibold uppercase text-sm">Product</h3>
            <ul className="space-y-1 ">
              <li><a href="#" className="hover:underline">Feature 1</a></li>
              <li><a href="#" className="hover:underline">Feature 2</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <h3 className="font-semibold uppercase  text-sm">Company</h3>
            <ul className="space-y-1 ">
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-2">
            <h3 className="font-semibold uppercase  text-sm">Help</h3>
            <ul className="space-y-1 ">
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Support</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-2">
            <h3 className="font-semibold uppercase  text-sm">Social</h3>
            <div className="flex flex-col gap-2 ">
              <a href="#" className="flex items-center gap-2 hover:text-blue-600"><FaFacebook /> Facebook</a>
              <a href="#" className="flex items-center gap-2 hover:text-blue-400"><FaTwitter /> Twitter</a>
              <a href="#" className="flex items-center gap-2 hover:text-gray-900"><FaGithub /> Github</a>
              <a href="#" className="flex items-center gap-2 hover:text-pink-500"><FaInstagram /> Instagram</a>
              <a href="#" className="flex items-center gap-2 hover:text-blue-700"><FaLinkedin /> LinkedIn</a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
