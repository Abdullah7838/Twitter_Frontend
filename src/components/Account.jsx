import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Bounce } from 'react-toastify';
import { useParams } from "react-router-dom";

function Account({ logout, Uemail, myemail }) {
    const { email } = useParams();
    const [posts, setPosts] = useState([]);
    const [id, setId] = useState("");
    const [followerEmail, SetfollowerEmail] = useState(Uemail);
    const [followers, SetFollowers] = useState([]);
    const [hide1, setHide] = useState('')
    const [hide2, setHide2] = useState('hidden')
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);


useEffect(()=>{
    if(email===myemail){
    navigate('/profile');
    }
})

    useEffect(() => {
        const fetchProfilePhoto = async () => {
            try {
                const timestamp = new Date().getTime(); 
                const response = await fetch(`http://localhost:3001/api/get-profile?email=${email}`);
                const data = await response.json();
                if (response.ok) {
                    setPreview(data.profilePhoto);
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


    useEffect(() => {
        const fetchFollowers = async () => {
            const followers = await axios.post('http://localhost:3001/api/followers', {
                email
            })
            if (followers.length = 0) {
                SetFollowers(0)
            }
            console.log(followers.data.followers)
            SetFollowers(followers.data.followers.length);
        };
        fetchFollowers();
    }, [hide1, hide2])


    const FollowHandle = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/follow', { email, followerEmail });
            setHide('hidden')
            setHide2('')
            toast.success('Following');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                toast.error("Already Following");
            } else {
                toast.error("Something went wrong! Please try again.");
            }
        }
    };

    const UnfollowHandle = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/unfollow', { email, followerEmail });
            setHide('')
            setHide2('hidden')
            toast.success('UnFollowed');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                toast.error("Already UnFollowed");
            } else {
                toast.error("Something went wrong! Please try again.");
            }
        }
    };

   

    // const Logout = () => {
    //   props.logout();
    //   navigate("/login");
    // };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/user/${email}`);
                setPosts(response.data);
                // toast.success("Posts loaded successfully!", {
                //   position: "top-right", 
                //   autoClose: 200, 
                //   hideProgressBar: false, 
                //   closeOnClick: true, 
                //   pauseOnHover: true, 
                //   draggable: true, 
                //   progress: undefined,
                //   theme: "light", 
                //   transition: Bounce, 
                // });
            } catch (error) {
                console.error("Error fetching posts:", error);
                toast.error("Failed to load posts!");
            }
        };

        if (email) {
            fetchPosts();
        }
    }, [email, posts]);

function timeAgo(date) {
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
            //   toast.success(res.data.message);
        } catch (error) {
            toast.error("Error liking/unliking post");
        }
    };

    useEffect(() => {
        if (id.length > 0) {
            navigate(`/comments/${id}`);
        }
    }, [id])

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            {/* Profile Container */}
            <div className="w-full max-w-2xl bg-white shadow-lg">

                {/* Header */}
                <div className="p-4 bg-white flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-gray-900"></h1>
                    {/* <div className="flex space-x-4">
            <button
              onClick={Logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>
            <button
              onClick={() => navigate("/home")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition"
            >
              Home
            </button>
          </div> */}
                </div>

                {/* Email Display */}
                <div className="flex justify-center">
                    {preview && (
                        <div className=" flex justify-start">
                            <img src={preview} alt="Preview" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
                        </div>
                    )}
                    </div>
                <div className="p-1 text-center">
                    <p className="text-lg font-semibold text-gray-700">User: {email.split('@')[0]}</p>
                </div>
                    <div className="border-t pt-2 pb-2  ">
                        <div className="ml-8 mr-8 lg:ml-12 lg:mr-12 flex justify-between items-center">
                            <button onClick={FollowHandle} className={`bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded mb-1 mt-1 cursor-pointer ${hide1}`}>Follow</button>
                            <button onClick={UnfollowHandle} className={`bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded mb-1 mt-1 cursor-pointer ${hide2}`} >Unfollow</button>
                            <p className="text-lg font-semibold text-orange-500">Followers: <strong>{followers}</strong></p>
                            <p className="text-lg font-semibold text-orange-500">Posts: <strong>{posts.length}</strong></p>
                        </div>
                    </div>
                    {/* Posts Section */}
                    <div>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post._id} className="p-4 border-t flex space-x-4 max-h-full overflow-auto">
                                    <img
                                        src={preview}
                                        alt="user"
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="w-full max-w-[90%]">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-gray-900">{post.email.split('@')[0]}</span>
                                            <span className="text-sm text-gray-500">@{post.email.split('@')[0]} · {timeAgo(post.postedAt)}</span>
                                        </div>
                                        <p className="text-gray-800 mt-1 text-lg break-words whitespace-pre-wrap max-w-full overflow-hidden">{post.post}</p>
                                        <div className="mt-2 flex space-x-6 text-gray-500 text-sm">
                                            <button onClick={() => setId(post._id)} className="hover:text-blue-500 text-lg flex items-center space-x-1 cursor-pointer">
                                                💬 <span>{(Array.isArray(post.comments) ? post.comments.length : 0)}</span> </button>
                                            <button onClick={() => handleLike(post._id)} className="hover:text-red-500 text-lg flex items-center space-x-1 cursor-pointer" >
                                                ❤️ <span>{(Array.isArray(post.likes) ? post.likes.length : 0)}</span>                      </button> </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-gray-600">No posts found.</p>
                        )}
                        <div className='text-black font-bold text-lg text-center mb-2 mt-2 border-t'>The End</div>
                    </div>
                </div>

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
            )
}

            export default Account
