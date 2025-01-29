import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Main({ email: propEmail, isLogin }) {
    const [post, setPost] = useState("");
    const [email, setEmail] = useState(propEmail || "");
    const [posts, setPosts] = useState([]);
    const [id, setId] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        if (propEmail) setEmail(propEmail);
    }, [propEmail]);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get("http://localhost:3001/api/post");
                setPosts(res.data.posts);
            } catch (error) {
                toast.error("Error fetching posts");
            }
        };
        fetchAllPosts();
    }, [posts]);

    const handleLike = async (postId) => {
        try {
            const res = await axios.post(`http://localhost:3001/api/likes/${postId}`, {
                email,
            });

            const updatedPosts = posts.map((p) =>
                p._id === postId
                    ? { ...p, likes: res.data.likesCount }
                    : p
            );
            setPosts(updatedPosts);
            toast.success(res.data.message);
        } catch (error) {
            toast.error("Error liking/unliking post");
        }
    };

    // Post a new message
    const handlePost = async () => {
        if (post.length <= 2) {
            toast.warning("Text is too short");
            return;
        }
        if (post.length >= 280) {
            toast.warning("Text is too Long");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3001/api/post", {
                email,
                post,
            });

            toast.success("Posted Successfully!");
            setPosts((prevPosts) => [
                { _id: res.data.post._id, email, post, postedAt: new Date().toISOString(), likes: [] },
                ...prevPosts,
            ]);
            setPost("");
        } catch (error) {
            toast.error(error.response?.status === 400 ? "Login expired, please login again" : "Server Error");
        }
    };

    // Convert timestamp to "x minutes ago"
    function timeAgo(date) {
        if (!date) return "Just now";
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }

useEffect(()=>{
    if(id.length>0){
    navigate(`/comments/${id}`); 
    } 
},[id])
    return (
        <div>
            {isLogin ? (
                <div className="bg-gray-100 min-h-screen flex justify-center">
                    {/* Container */}
                    <div className="w-full max-w-2xl bg-white shadow-lg">
                        {/* Header */}
                        <div className="p-4 border-b bg-white sticky top-0 z-10 flex justify-between items-center">
                            <h1 className="text-xl font-bold text-gray-900">Home</h1>
                            <Link to="/profile">
                                <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition">
                                    Profile
                                </button>
                            </Link>
                        </div>

                        {/* Post Input Box */}
                        <div className="p-4 border-b bg-white">
                            <div className="flex space-x-4">
                                <img src="profilepic.png" alt="Profile" className="w-12 h-12 rounded-full" />
                                <textarea
                                    value={post}
                                    onChange={(e) => setPost(e.target.value)}
                                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="What's meme today?"
                                    rows="2"
                                ></textarea>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-gray-500">{post.length}/280</p>
                                <button
                                    onClick={handlePost}
                                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
                                >
                                    Tweet
                                </button>
                            </div>
                        </div>

                        {/* Posts Feed */}
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post._id} className="p-4 border-b flex space-x-4 ">
                                    <img src="profilepic.png" alt="User Profile" className="w-12 h-12 rounded-full" />
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between">
                                            <div>
                                                <span className="font-bold text-gray-900">{post.email.split('@')[0]}</span>
                                                <span className="text-sm text-gray-500"> @{post.email.split("@")[0]} · {timeAgo(post.postedAt)}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-800 mt-1 break-words whitespace-pre-wrap">{post.post}</p>
                                        <div className="mt-2 flex space-x-6 text-gray-500 text-sm">
                                        <button onClick={()=>setId(post._id)} className="hover:text-blue-500 text-lg flex items-center space-x-1">
                                                💬 <span>{(Array.isArray(post.comments) ? post.comments.length : 0)}</span> 
                                            </button>
                                            <button
                                                onClick={() => handleLike(post._id)}
                                                className="hover:text-red-500 text-lg flex items-center space-x-1"
                                            >
                                                ❤️ <span>{(Array.isArray(post.likes) ? post.likes.length : 0)}</span>                      </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 p-4">No posts yet.</p>
                        )}
                    </div>
                </div>
            ) : (
                // Login prompt for unauthenticated users
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
                    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm text-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Please Login to Continue
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Access your account to post and interact with others.
                        </p>
                        <a
                            href="/login"
                            className="mt-4 inline-block bg-blue-500 text-white px-5 py-2 rounded-lg text-lg font-medium transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md"
                        >
                            Log in
                        </a>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}
