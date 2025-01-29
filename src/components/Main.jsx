import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Link } from "react-router-dom";
export default function Main(props) {
    const [post, SetPost] = useState('');
    const [email, setEmail] = useState('')
    const [posts, SetPosts] = useState([]);

    const Post2 = async () => {
        setEmail(props.email);
        if (post.length <= 2) {
            toast.warning('Text is very less');
            return;
        }
        try {
            const res = await axios.post('http://localhost:3001/api/post', {
                email, post
            });
            toast.success('Posted Sucessfully');
        } catch (error) {
            if (error.status === 400) {
                toast.error('Login expired please Login again');
                return;
            }
            toast.error('Server Error')
        }
    }

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/post');
                const data = res.data;
                SetPosts(data.posts);
            } catch (error) {
                toast.error('Error fetching posts:', error);
            }
        };
        fetchAllPosts();
    }, [post, posts]);

    function timeAgo(date) {
        const now = new Date();
        const diff = now - new Date(date); // Get the difference in milliseconds

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? "s" : ""} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        } else {
            return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center">
            {/* Twitter-like container */}
            <div className="w-full max-w-2xl bg-white shadow-lg">

                {/* Header */}
                <div className="p-4 border-b bg-white sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-gray-900">Home</h1>
                </div>

                <div>
                    <Link to='/profile'><button className="p-2 rounded ml-2 cursor-pointer bg-blue-500 text-white font-bold text-lg mt-2">Open My Profile</button></Link>
                </div>
                {/* Tweets here */}
                <div className="p-4  flex items-start space-x-4">
                    <img
                        src="profilepic.png"
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                    />
                    <textarea
                        onChange={(e) => SetPost(e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Post Now"
                        rows="2"
                    ></textarea>
                </div>
                <button onClick={Post2} className="p-2 rounded ml-2 cursor-pointer bg-blue-500 text-white font-bold text-lg">Post Now</button>



                {/* Another Tweet Example */}
                {posts.map((post) => {
                    return (
                        <div className="p-4 flex space-x-4 border-t mt-2" key={post._id}>
                            <img
                                src="profilepic.png"
                                alt="User Profile"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-gray-900">{post.email}</span>
                                    <span className="text-sm text-gray-500">@{post.email.split('@')[0]} · {timeAgo(post.postedAt)}</span>
                                </div>
                                <p className="text-gray-800 mt-1">{post.post}</p>
                                <div className="mt-2 flex space-x-4 text-gray-500">
                                    <button className="hover:text-blue-500">💬 15</button>
                                    <button className="hover:text-green-500">🔁 8</button>
                                    <button className="hover:text-red-500">❤️ 30</button>
                                </div>
                            </div>
                        </div>
                    );
                })}


            </div>
            <ToastContainer />
        </div>
    );
}
