import React from "react";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineSecurity } from "react-icons/md";
import { PiCertificateBold } from "react-icons/pi";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import BrandItem from "./BrandItem";

const Brands = () => {
  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-10 pt-20 md:px-0 px-5">
      <BrandItem
        title="Industry-Leading Partners"
        text="SkillSphere partners with Fortune 500 companies and industry leaders to deliver courses designed by professionals who know what employers are looking for. Learn skills directly relevant to today's job market and stay ahead of industry trends."
        icon={MdOutlineWorkspacePremium}
      />{" "}
      <BrandItem
        title="Global Learning Community"
        text="Join a diverse community of learners from over 190 countries. Exchange ideas, collaborate on projects, and build a professional network that extends across borders. Our platform supports 15+ languages, making quality education accessible worldwide."
        icon={AiOutlineGlobal}
      />{" "}
      <BrandItem
        title="Secure Learning Environment"
        text="Your data and learning progress are protected by enterprise-grade security. Our platform uses advanced encryption and follows strict privacy policies to ensure your personal information remains confidential as you focus on developing your skills."
        icon={MdOutlineSecurity}
      />{" "}
      <BrandItem
        title="Learn Anytime, Anywhere"
        text="Access your courses on any device, anytime, anywhere. Our mobile-friendly platform and offline viewing options ensure your learning never stops. Download course materials for travel and sync your progress when you reconnect."
        icon={PiCertificateBold}
      />{" "}
      <BrandItem
        title="Career Advancement Services"
        text="Beyond courses, SkillSphere offers resume reviews, interview preparation, and career coaching from industry professionals. Our career services help you translate your new skills into job opportunities and professional growth."
        icon={MdOutlineBusinessCenter}
      />{" "}
      <BrandItem
        title="Expert Instructors"
        text="Learn from the best in every field. Our instructors include award-winning professors, industry veterans, bestselling authors, and recognized thought leaders who bring real-world expertise directly to your learning experience."
        icon={FaChalkboardTeacher}
      />
    </div>
  );
};

export default Brands;
