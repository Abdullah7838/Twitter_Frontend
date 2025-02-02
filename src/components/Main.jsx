import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

export default function Main({ email: propEmail, isLogin }) {
    const [post, setPost] = useState("");
    const [email, setEmail] = useState(propEmail || "");
    const [posts, setPosts] = useState([]);
    const [preview, setPreview] = useState({});
    const [profile, setProfile] = useState({});
    const [id, setId] = useState("");
    const [afterLike,setAfterLike] = useState(false);
    const navigate = useNavigate();

useEffect(()=>{
        const fetchAllUsers = async () => {
          try {
              const res = await axios.get('http://localhost:3001/api/admin');
              const data = res.data.data
              const userFound = data.some((user) => user.email === email);
              if(!userFound){
                navigate('/not-found');
                setTimeout(() => {
                    navigate('/signup');
                }, 2000);
              }
          } catch (err) {
              console.log(err);
          }
      };
      fetchAllUsers()
        },[posts,id,afterLike,email]);


useEffect(() => {
        const fetchProfilePhoto = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/get-profile?email=${email}`);
                const data = await response.json();
                if (response.ok) {
                    setProfile(data.profilePhoto);
                } else {
                    console.error("Error:", data.message);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        if (email) {
            fetchProfilePhoto();
        }
    }, [email]);


    const fetchProfileImage = async (email) => {
        try {
            const timestamp = new Date().getTime();
            const response = await fetch(`http://localhost:3001/api/get-profile?email=${email}`);
            const data = await response.json();
            if (response.ok) {
                setPreview(prev => ({
                    ...prev,
                    [email]: data.profilePhoto 
                }));
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get("http://localhost:3001/api/post");
                const postsData = res.data.posts.reverse();
                setPosts(postsData);

                postsData.forEach(post => {
                    if (post.email && !preview[post.email]) {
                        fetchProfileImage(post.email);
                    }
                });
            } catch (error) {
                toast.error("Error fetching posts");
            }
        };

        fetchAllPosts();
    }, [afterLike]);

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
            setAfterLike(!afterLike);
            setPosts(updatedPosts);
        } catch (error) {
            toast.error("Error liking/unliking post");
        }
    };

    const handleAccount = (email) => {
        navigate(`/account/${email}`);
    };

    const handlePost = async () => {
        if (!post.trim()) {
            toast.warning("Please write something");
            return;
        }
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

    useEffect(() => {
        if (id.length > 0) {
            navigate(`/comments/${id}`);
        }
    }, [id])
    return (
        <div className="bg-gray-50 min-h-screen flex justify-center">
            {isLogin ? (
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-5 border-b bg-blue-500 text-white text-center font-semibold text-xl sticky top-0 z-10">
                        Home
                    </div>

                    <div className="p-5 border-b bg-white">
                        <div className="flex items-center space-x-4">
                            <img src={profile} alt="Profile" className="w-12 h-12 rounded-full" />
                            <textarea
                                value={post}
                                onChange={(e) => setPost(e.target.value)}
                                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="What's meme today?"
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <p className="text-sm text-gray-500">{post.length}/280</p>
                            <button
                                onClick={handlePost}
                                className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    <div>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post._id} className="p-5 border-b flex space-x-4">
                                    <img
                                        onClick={() => handleAccount(post.email)}
                                        src={preview[post.email] || "profilepic.png"}
                                        alt="User Profile"
                                        className="w-12 h-12 rounded-full cursor-pointer"
                                    />
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between">
                                            <div>
                                                <span onClick={() => handleAccount(post.email)} className="font-bold text-gray-900 cursor-pointer">
                                                    {post.email.split('@')[0]}
                                                </span>
                                                <span onClick={() => handleAccount(post.email)} className="text-sm text-gray-500 cursor-pointer">
                                                    @{post.email.split("@")[0]} · {timeAgo(post.postedAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-800 mt-2 break-words whitespace-pre-wrap">{post.post}</p>
                                        <div className="mt-3 flex space-x-6 text-gray-500 text-sm">
                                            <button onClick={() => setId(post._id)} className="hover:text-blue-500 text-lg flex items-center space-x-1 cursor-pointer">💬 <span>{(Array.isArray(post.comments) ? post.comments.length : 0)}</span></button>
                                            <button onClick={() => handleLike(post._id)} className="hover:text-red-500 text-lg flex items-center space-x-1 cursor-pointer">
                                            <FontAwesomeIcon icon={faHeart} size="1x" style={{ color: "red" }} />
                                                <span>{(Array.isArray(post.likes) ? post.likes.length : 0)}</span></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 p-5">No posts yet.</p>
                        )}
                    </div>
                    <div className='text-black font-bold text-lg text-center mb-5 mt-5'>The End</div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm text-center">
                        <h2 className="text-xl font-semibold text-gray-800">Please Login to Continue</h2>
                        <p className="text-gray-600 mt-2">Access your account to post and interact with others.</p>
                        <a href="/login" className="mt-4 inline-block bg-blue-500 text-white px-5 py-2 rounded-lg text-lg font-medium transition hover:bg-blue-600 hover:shadow-md">Log in</a>
                    </div>
                </div>
            )}
            <ToastContainer
                position="bottom-left" 
                autoClose={3000} 
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastStyle={{ backgroundColor: "black", color: "white" }} 
            />
        </div>
    );
}
