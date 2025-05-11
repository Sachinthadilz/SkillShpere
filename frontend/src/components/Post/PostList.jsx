import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, deletePost, updatePost } from "../../services/postService";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editDescription, setEditDescription] = useState("");
    const [editImage, setEditImage] = useState(null);
    const [editPreview, setEditPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get current user ID from localStorage (adjust if you use context/auth differently)
        const user = JSON.parse(localStorage.getItem("user"));
        setCurrentUserId(user?.userId);
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPosts();
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError("Failed to load posts. Please try again.");
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const toggleMenu = (postId) => {
        setMenuOpen(menuOpen === postId ? null : postId);
        setEditingPostId(null);
    };

    const handleUpdate = (postId, currentDescription, currentImageUrl) => {
        setEditingPostId(postId);
        setEditDescription(currentDescription);
        setEditPreview(currentImageUrl);
        setMenuOpen(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert("File size exceeds 10MB limit.");
                return;
            }
            setEditImage(file);
            setEditPreview(URL.createObjectURL(file));
        }
    };

    const saveUpdate = async (postId) => {
        try {
            const formData = new FormData();
            formData.append("description", editDescription);
            if (editImage) {
                formData.append("image", editImage);
            }

            await updatePost(postId, formData);
            setEditingPostId(null);
            setEditImage(null);
            setEditPreview(null);
            fetchPosts();
        } catch (error) {
            console.error('Failed to update post:', error);
            alert('Error updating post. Check console for details.');
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(postId);
                setMenuOpen(null);
                fetchPosts();
            } catch (error) {
                console.error('Failed to delete post:', error);
                alert('Error deleting post. Check console for details.');
            }
        }
    };

    const handleAddPost = () => {
        navigate("/add-post");
    };

    return (
        <div className="container max-w-2xl mx-auto px-4 py-8">
            {/* Add Post Button */}
            <div className="mb-6">
                <button
                    onClick={handleAddPost}
                    className="bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                >
                    Add Post
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <div className="w-8 h-8 mx-auto border-4 border-indigo-600 dark:border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Loading posts...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-8">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <button
                        onClick={fetchPosts}
                        className="mt-2 bg-indigo-600 text-white py-1.5 px-4 rounded-lg hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Posts List */}
            {!loading && !error && (
                <div className="space-y-6">
                    {Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post) => (
                            <div
                                key={post.postId}
                                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative border border-gray-100"
                            >
                                <div className="flex justify-between items-start">
                                    {editingPostId === post.postId ? (
                                        <div className="w-full">
                                            <textarea
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-sm"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                rows="3"
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="mt-3 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            />
                                            {editPreview && (
                                                <div className="mt-4">
                                                    <img
                                                        src={editPreview}
                                                        alt="Preview"
                                                        className="max-w-full h-auto rounded-lg shadow-md"
                                                    />
                                                </div>
                                            )}
                                            <div className="mt-4 flex space-x-3">
                                                <button
                                                    onClick={() => saveUpdate(post.postId)}
                                                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingPostId(null);
                                                        setEditImage(null);
                                                        setEditPreview(null);
                                                    }}
                                                    className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1">
                                            <p className="text-gray-800 text-lg leading-relaxed">{post.description}</p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {new Date(post.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                    {/* Only show menu if current user is the post owner */}
                                    {!editingPostId && String(post.user?.userId) === String(currentUserId) && (
    <button
        onClick={() => toggleMenu(post.postId)}
        className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
    >
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v.01M12 12v.01M12 18v.01"
            />
        </svg>
    </button>
)}
                                </div>

                                {post.imageUrl && editingPostId !== post.postId && (
                                    <img
                                        src={post.imageUrl}
                                        alt="Post image"
                                        className="mt-4 max-w-full h-auto rounded-lg shadow-md"
                                        onError={(e) => {
                                            console.error(`Failed to load image: ${post.imageUrl}`);
                                            e.target.style.display = "none";
                                        }}
                                    />
                                )}

                                {menuOpen === post.postId && (
                                    <div className="absolute top-12 right-4 bg-white shadow-xl rounded-lg py-2 w-40 z-20 border border-gray-100 animate-fade-in">
                                        <button
                                            onClick={() => handleUpdate(post.postId, post.description, post.imageUrl)}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.postId)}
                                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 hover:text-red-700 transition-colors duration-150"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 text-lg font-medium">No posts available</p>
                    )}
                </div>
            )}
            {console.log("currentUserId:", currentUserId)}
            {console.log("posts:", posts.map(p => ({ postId: p.postId, user: p.user })))}
        </div>
    );
};

export default PostList;