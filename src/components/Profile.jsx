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
  const [isEditingProfile, setIsEditingProfile] = useState(false);

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
    if (!file) {
      toast.error("No file selected!");
      return;
  }
    if (file.size > 300 * 1024) { 
      toast.error("Image is too large! Must be under 300KB.");
      return;
    }
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
      setImage(null);
      setIsEditingProfile(false);
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="max-w-6xl mx-auto px-4 py-6">
            
            {/* Cover Photo Section */}
            <div className="relative mb-6">
              <div className="h-48 md:h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-3xl"></div>
              <div className="absolute inset-0 bg-black/20 rounded-t-3xl"></div>
              <div className="absolute top-4 right-4">
                <button className="bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-200 font-medium">
                  📷 Edit Cover
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 -mt-20 relative z-10">
              
              {/* Profile Info Card */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20">
                  
                  {/* Profile Picture */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 rounded-full border-6 border-white shadow-xl overflow-hidden bg-gradient-to-r from-blue-400 to-purple-400 p-1">
                        <img 
                          src={preview || "profilepic.png"} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover bg-white"
                        />
                      </div>
                      <button 
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg flex items-center justify-center"
                      >
                        ✏️
                      </button>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-400 rounded-full border-4 border-white"></div>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mt-4">
                      {email.split('@')[0]}
                    </h1>
                    <p className="text-gray-500 text-sm">@{email.split("@")[0]}</p>
                    <p className="text-gray-600 text-sm mt-1">{email}</p>
                  </div>

                  {/* Profile Upload Section */}
                  {isEditingProfile && (
                    <div className="mb-6 p-4 bg-gray-50/80 rounded-2xl border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Update Profile Picture</h3>
                      
                      {loading && (
                        <div className="flex items-center space-x-2 text-blue-600 mb-3">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="font-medium">Uploading...</span>
                        </div>
                      )}
                      
                      <label htmlFor="file-upload" className="block w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center rounded-xl cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium">
                        📷 Choose New Image
                      </label>
                      <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      
                      {image && (
                        <div className="flex space-x-2 mt-3">
                          <button 
                            onClick={handleUpload} 
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                          >
                            ✓ Upload
                          </button>
                          <button 
                            onClick={() => {
                              setImage(null);
                              setIsEditingProfile(false);
                            }} 
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">Maximum file size: 300KB</p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                      <div className="text-2xl font-bold text-blue-600">{followers}</div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                      <div className="text-2xl font-bold text-purple-600">{posts.length}</div>
                      <div className="text-sm text-gray-600">Posts</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium">
                      ✏️ Edit Profile
                    </button>
                    <button className="w-full p-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium">
                      ⚙️ Settings
                    </button>
                    <button className="w-full p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium">
                      📊 Analytics
                    </button>
                  </div>
                </div>
              </div>

              {/* Posts Section */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
                  
                  {/* Posts Header */}
                  <div className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">Your Posts</h2>
                        <p className="text-blue-100">Share your thoughts with the world</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{posts.length}</div>
                        <div className="text-sm text-blue-100">Total Posts</div>
                      </div>
                    </div>
                  </div>

                  {/* Posts List */}
                  <div className="max-h-[600px] overflow-y-auto">
                    {posts.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {posts.map((post, index) => (
                          <div key={post._id} className="p-6 hover:bg-gray-50/50 transition-all duration-200 group">
                            <div className="flex space-x-4">
                              <div className="flex-shrink-0">
                                <img 
                                  src={preview || "profilepic.png"} 
                                  alt="Profile" 
                                  className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-gray-900">{post.email.split('@')[0]}</span>
                                    <span className="text-sm text-gray-500">@{post.email.split("@")[0]}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-sm text-gray-500">{timeAgo(post.postedAt)}</span>
                                  </div>
                                  <button
                                    onClick={() => deletePost(post._id)}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all duration-200 p-2 rounded-lg hover:bg-red-50"
                                  >
                                    🗑️
                                  </button>
                                </div>
                                
                                <p className="text-gray-800 leading-relaxed break-words whitespace-pre-wrap mb-4 text-lg">
                                  {post.post}
                                </p>
                                
                                <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
                                  <button
                                    onClick={() => setId(post._id)}
                                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-all duration-200 group/button"
                                  >
                                    <div className="p-2 rounded-full group-hover/button:bg-blue-50 transition-colors duration-200">
                                      <span className="text-lg">💬</span>
                                    </div>
                                    <span className="font-medium">{Array.isArray(post.comments) ? post.comments.length : 0}</span>
                                  </button>
                                  
                                  <button
                                    onClick={() => handleLike(post._id)}
                                    className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-all duration-200 group/button"
                                  >
                                    <div className="p-2 rounded-full group-hover/button:bg-red-50 transition-colors duration-200">
                                      <span className="text-lg">❤️</span>
                                    </div>
                                    <span className="font-medium">{Array.isArray(post.likes) ? post.likes.length : 0}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                        <p className="text-gray-500 mb-6">Start sharing your thoughts with the community!</p>
                        <button 
                          onClick={() => navigate('/home')}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                        >
                          ✏️ Create Your First Post
                        </button>
                      </div>
                    )}
                  </div>

                  {posts.length > 0 && (
                    <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center">
                      <div className="inline-flex items-center space-x-2 text-gray-500 font-medium">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
                        <span>🎉 That's all your posts! 🎉</span>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Login prompt for unauthenticated users
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
          <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-12 max-w-md text-center border border-white/20">
            <div className="text-6xl mb-6">🔐</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Access Your Profile</h2>
            <p className="text-gray-600 mb-8 text-lg">Please sign in to view and manage your profile information.</p>
            <a
              href="/login"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign In Now
            </a>
          </div>
        </div>
      )}
      
      <ToastContainer
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
          color: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        }} 
      />
    </div>
  );
}

export default Profile;