import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Profile(props) {
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState(props.email);
  const [id, setId] = useState("");
  const [followers, SetFollowers] = useState([]);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setIsLoading] = useState(false);

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
  },[]);

useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload profile photo
  const handleUpload = async () => {
    setIsLoading(true)
    if (!image) {
      toast.error("Please select an image first!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/upload-profile", {
        email: email,
        image: image,
      });
      setIsLoading(false)
      toast.success("Profile photo updated successfully!");
    } catch (error) {
      setIsLoading(false)
      toast.error("Failed to upload profile photo");
    }
  };

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
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
      const followers = await axios.post('http://localhost:3001/api/followers', { email });
      SetFollowers(followers.data.followers.length);
    };
    fetchFollowers();
  }, [email]);

  const Logout = () => {
    props.logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/user/${email}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts!");
      }
    };

    if (email) {
      fetchPosts();
    }
  }, [email,posts]);

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/api/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post!");
    }
  };

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
      const res = await axios.post(`http://localhost:3001/api/likes/${postId}`, { email });

      const updatedPosts = posts.map((p) =>
        p._id === postId ? { ...p, likes: res.data.likesCount } : p
      );
      setPosts(updatedPosts);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error liking/unliking post");
    }
  };

  useEffect(() => {
    if (id.length > 0) {
      navigate(`/comments/${id}`);
    }
  }, [id, navigate]);

  return (
    <div>
      {props.isLogin ? (
        <div className="min-h-screen bg-gray-100 flex justify-center">
          {/* Profile Container */}
          <div className="w-full max-w-2xl bg-white shadow-lg">
            {/* Header */}
            <div className="p-4 border-b bg-white flex justify-center items-center sticky top-0 z-10">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>

            {/* Email Display */}
            <div className="p-4">
              <p className="text-lg font-semibold text-gray-700">Your Email: {email}</p>
            </div>

            {/* Profile Image Upload */}
            <div className="profile-upload p-4 mb-2">
            {preview && (
                <div className="mt-4 flex justify-start">
                  <img src={preview} alt="Preview" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
                </div>
              )}
              <label for="file-upload" className="file-upload-label mt-3">
               Choose Image
              </label>
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleFileChange}
                class="file-upload-input"
                hidden
              />
              {loading && <div className=" bg-black text-red-500">
           <p>Uploading</p>
          </div>
          }
              {/* Conditionally render the "Upload" button */}
              {image && (
                <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 cursor-pointer rounded-lg mt-2 ml-2">
                  Upload
                </button>
              )}
            </div>

            {/* Followers and Posts Display */}
            <div className="p-4 border-t">
              <p className="text-lg font-semibold text-orange-500">Followers: <strong>{followers}</strong></p>
              <p className="text-lg font-semibold text-orange-500">Posts: <strong>{posts.length}</strong></p>
            </div>

            {/* Posts Section */}
            <div className="p-4 text-center border-t">
              <p className="text-lg font-semibold text-black">Your Posts</p>
            </div>
            <div>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="p-4 border-t flex space-x-4 max-h-full overflow-auto">
                    <img src={preview} alt="Profile" className="w-12 h-12 rounded-full" />
                    <div className="w-full max-w-[90%]">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{post.email}</span>
                        <span className="text-sm text-gray-500">
                          @{post.email.split("@")[0]} · {timeAgo(post.postedAt)}
                        </span>
                      </div>
                      <p className="text-gray-800 mt-1 break-words whitespace-pre-wrap overflow-hidden text-ellipsis">
                        {post.post}
                      </p>
                      <div className="mt-2 flex space-x-6 text-gray-500 text-sm">
                        <button
                          onClick={() => setId(post._id)}
                          className="hover:text-blue-500 text-lg flex items-center space-x-1 cursor-pointer"
                        >
                          💬 <span>{Array.isArray(post.comments) ? post.comments.length : 0}</span>
                        </button>
                        <button
                          onClick={() => handleLike(post._id)}
                          className="hover:text-red-500 text-lg flex items-center space-x-1 cursor-pointer"
                        >
                          ❤️ <span>{Array.isArray(post.likes) ? post.likes.length : 0}</span>
                        </button>
                      </div>
                      <button
                        onClick={() => deletePost(post._id)}
                        className="mt-2 text-red-500 font-medium hover:text-red-700 transition cursor-pointer"
                      >
                        Delete Post
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-center text-gray-600">No posts found.</p>
              )}
              <div className="text-black font-bold text-lg text-center mb-2 mt-2 border-t">The End</div>
            </div>
          </div>
        </div>
      ) : (
        // Login prompt for unauthenticated users
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm text-center">
            <h2 className="text-xl font-semibold text-gray-800">Please Login to Continue</h2>
            <p className="text-gray-600 mt-2">Access your account to post and interact with others.</p>
            <a
              href="/login"
              className="mt-4 inline-block bg-blue-500 text-white px-5 py-2 rounded-lg text-lg font-medium transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md"
            >
              Log in
            </a>
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

export default Profile;
