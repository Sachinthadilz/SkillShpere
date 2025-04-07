import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
//import aboutImage from "./path/to/your/image.jpg"; // Add your image path here

const AboutPage = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="md:w-1/2">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="mb-4">
          Welcome to SkillsHere, your premier destination for online education
          and skill development. We believe in empowering learners of all ages
          with accessible, high-quality educational resources. Our mission is to
          bridge the gap between traditional education and practical skills
          needed in today's rapidly evolving job market. With expert-led courses
          and interactive learning experiences, SkillsHere is designed to help
          you grow personally and professionally at your own pace.
        </p>

        <ul className="list-disc list-inside mb-4 text-sm px-6 py-2">
          <li className="mb-2">
            Access to over 1,000 courses taught by industry professionals and
            academics.
          </li>
          <li className="mb-2">
            Learn at your own pace with flexible scheduling and on-demand
            content.
          </li>
          <li className="mb-2">
            Earn verifiable certificates to showcase your new skills to
            employers.
          </li>
          <li className="mb-2">
            Join a global community of learners and collaborate on real-world
            projects.
          </li>
        </ul>
        <div className="flex space-x-4 mt-10">
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaFacebookF size={24} />
          </Link>
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaTwitter size={24} />
          </Link>
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaLinkedinIn size={24} />
          </Link>
          <Link className="text-white rounded-full p-2 bg-customRed  " to="/">
            <FaInstagram size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
