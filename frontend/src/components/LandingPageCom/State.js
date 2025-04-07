import React from "react";
import CardSlider from "./CardSlider";

const State = () => {
  return (
    <div className="py-28">
      <div className="flex justify-between items-center md:px-0 px-4">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <span className="sm:text-4xl text-logoText text-slate-700 font-bold">
            7M+
          </span>
          <span className="text-slate-600 text-center sm:text-sm text-xs ">
            Active Learners
          </span>
        </div>{" "}
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <span className="sm:text-4xl text-logoText text-slate-700 font-bold">
            10K+
          </span>
          <span className="text-slate-600 text-center  sm:text-sm text-xs">
            Expert Instructors
          </span>
        </div>{" "}
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <span className="sm:text-4xl text-logoText text-slate-700 font-bold">
            93%
          </span>
          <span className="text-slate-600 text-center  sm:text-sm text-xs">
            Career Advancement
          </span>
        </div>
      </div>
      <div className="mt-10 md:px-0 px-4">
        <h3 className="text-slate-700 text-2xl font-semibold pb-5 pt-6">
          Why SkillSphere Works
        </h3>

        <div className="flex md:flex-row flex-col md:gap-0 gap-16 justify-between">
          <ul className="list-disc sm:px-5 ps-10 text-slate-700 flex flex-col gap-5 flex-1 overflow-hidden">
            <li>Learn from industry experts and top professionals.</li>
            <li>
              Access thousands of courses across diverse skill categories.
            </li>
            <li>Personalized learning paths tailored to your career goals.</li>
            <li>
              Interactive workshops and hands-on projects for practical
              experience.
            </li>
            <li>Earn verifiable certificates to showcase your skills.</li>
            <li>Connect with a global community of like-minded learners.</li>
            <li>Flexible learning options that fit your schedule.</li>
          </ul>
          <div className="flex-1 overflow-hidden">
            <CardSlider />
          </div>
        </div>
      </div>
    </div>
  );
};

export default State;
