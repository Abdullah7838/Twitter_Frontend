import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

function UsersAdmin() {
  const { email } = useParams();  // Fetch email from URL params
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);  // Track the selected post for comments
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user information based on email
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/admin`);
        setUser(res.data.data[0])
        // setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    // Fetch all posts for the user
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/user/${email}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchUser();
    fetchPosts();
  }, [email]);

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    setSelectedPostId(postId);
    try {
      const res = await axios.get(`http://localhost:3001/api/comments/${postId}`);
      setComments(res.data.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Handle delete post
  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/api/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));  // Remove the deleted post from the UI
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post!");
    }
  };

  // Handle delete comment
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3001/api/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));  // Remove the deleted comment from the UI
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment!");
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
    <div className="admin-panel">
      {user ? (
        <div className="user-info">
          <h2 className="text-2xl font-bold">User: {user.email}</h2>
          <p className="text-gray-700">Joined: {(new Date(user.createdAt).toLocaleString())}</p>

          <h3 className="mt-4 text-xl">Posts</h3>
          {posts.length > 0 ? (
            <ul className="posts-list">
              {posts.map((post) => (
                <li key={post._id} className="post-item mb-4 p-4 border-b">
                  <span className="text-sm text-gray-500">@{post.email.split('@')[0]} · {timeAgo(post.postedAt)}</span>
                  <p className="text-gray-800 mt-1 text-lg break-words whitespace-pre-wrap max-w-full overflow-hidden"><strong>Content: </strong> {post.post}</p>
                  <div className='border-t'></div>
                  <strong>Comments: </strong><span>{(Array.isArray(post.comments) ? post.comments.length : 0)}</span><br></br>
                 <strong>Likes: </strong><span>{(Array.isArray(post.likes) ? post.likes.length : 0)}</span><br></br>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="bg-red-500 text-white px-4 py-2 mt-2 rounded cursor-pointer"
                  >
                    Delete Post
                  </button>

                  {/* View Comments Button */}
                  <button
                    onClick={() => fetchComments(post._id)}
                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded cursor-pointer ml-2"
                  >
                    View Comments
                  </button>

                  {/* Comments Section */}
                  {selectedPostId === post._id && comments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold">Comments</h4>
                      <ul>
                        {comments.map((comment) => (
                          <li key={comment._id} className="mb-2 p-2 border-t">
                            <p><strong>{comment.email} <p className='text-xs'>{timeAgo(comment.createdAt)}</p> </strong> {comment.comment}</p>
                            <button
                              onClick={() => deleteComment(comment._id)}
                              className="bg-red-500 text-white px-4 py-2 mt-2 rounded cursor-pointer"
                            >
                              Delete Comment
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No posts found for this user.</p>
          )}
        </div>
      ) : (
        <p>Loading user information...</p>
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

export default UsersAdmin;
