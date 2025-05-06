import React from "react";
import PublicUserList from "./PublicUserList";

const Explore = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Explore
        </h1>
        <div className="mb-12">
          <PublicUserList />
        </div>
      </div>
    </div>
  );
};

export default Explore;
