import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PostList from './components/PostList'; // Adjust path if necessary
import PostForm from './components/PostForm'; // Adjust path if necessary

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/add-post" element={<PostForm />} />
      </Routes>
    </div>
  );
};

export default App;