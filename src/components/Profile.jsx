import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Profile(props) {
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState(props.email);
  const navigate = useNavigate();

  const Logout = () => {
    props.logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/user/${email}`);
        setPosts(response.data);
        toast.success("Posts loaded successfully!");
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts!");
      }
    };

    if (email) {
      fetchPosts();
    }
  }, [email]);

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

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Profile Container */}
      <div className="w-full max-w-2xl bg-white shadow-lg">
        
        {/* Header */}
        <div className="p-4 border-b bg-white flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          <div className="flex space-x-4">
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
          </div>
        </div>

        {/* Email Display */}
        <div className="p-4 text-center">
          <p className="text-lg font-semibold text-gray-700">Email: {email}</p>
        </div>

        {/* Posts Section */}
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="p-4 border-t flex space-x-4 max-h-full overflow-auto">
                <img
                  src="profilepic.png"
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">{post.email}</span>
                    <span className="text-sm text-gray-500">@{post.email.split("@")[0]} · {timeAgo(post.postedAt)}</span>
                  </div>
                  <p className="text-gray-800 mt-1">{post.post}</p>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="mt-2 text-red-500 font-medium hover:text-red-700 transition"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-gray-600">No posts found.</p>
          )}
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
}

export default Profile;
