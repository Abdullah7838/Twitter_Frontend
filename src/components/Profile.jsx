import  { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function Profile(props) {
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState(props.email); 

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
      setPosts(posts.filter(post => post._id !== postId));
      toast.success("Post deleted successfully!"); 
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post!"); 
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-xl font-bold text-center">
        <p>Email: {email}</p>
      </div>

      <div className="mt-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="p-4 border-b">
              <div className="flex items-center space-x-4">
                <img
                  src="profilepic.png"
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-gray-900">{post.email}</p>
                  <p className="text-gray-800">{post.post}</p>
                  <p className="text-sm text-gray-500">Posted on: {new Date(post.postedAt).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => deletePost(post._id)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Delete Post
              </button>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Profile;
