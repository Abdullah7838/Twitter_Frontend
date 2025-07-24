import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";


function Admin() {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

useEffect(()=>{
    const fetchAllUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/admin');
            console.log(res.data.data)
            setUsers(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };
    fetchAllUsers()
},[])

    const fetchAllPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:3001/api/posts");
            setPosts([...res.data.data].reverse());
         } catch (err) {
            console.error("Error fetching posts", err);
        } finally {
            setLoading(false);
        }
    };


    const handleAddPost = async () => {
        if (!email || !newPost) {
            alert("Email and post content are required");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3001/api/posts/post", {
                email,
                post: newPost,
            });
            alert(res.data.message);
            fetchAllPosts();
        } catch (err) {
            console.error("Error creating post", err);
        }
    };


    const handleLikePost = async (postId) => {
        try {
            const res = await axios.post(`http://localhost:3001/api/posts/likes/${postId}`, {
                email,
            });
            alert(res.data.message);
            fetchAllPosts();
        } catch (err) {
            console.error("Error liking post", err);
        }
    };

    const fetchComments = async (postId) => {
        setSelectedPostId(postId);
        try {
            const res = await axios.get(`http://localhost:3001/api/comments/${postId}`);
            setComments(res.data.comments);
        } catch (err) {
            console.error("Error fetching comments", err);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:3001/api/comments/${commentId}`);
            toast.success("Comment deleted");
            fetchComments()
        } catch (err) {
            toast.error("Error deleting comment")
            console.error("Error deleting comment:", err);
        }
    };

    const handleAddComment = async () => {
        const comment = prompt("Enter your comment:");
        if (!comment) {
            alert("Comment cannot be empty");
            return;
        }

        try {
            await axios.post(`http://localhost:3001/api/posts/comments/${selectedPostId}`, {
                email,
                comment,
            });
            fetchComments(selectedPostId);
        } catch (err) {
            console.error("Error adding comment", err);
        }
    };

    // Delete a post
    const deletePost = async (postId) => {
        try {
            const res = await axios.delete(`http://localhost:3001/api/${postId}`);
            toast.success(res.data.message);
            fetchAllPosts();
        } catch (err) {
            console.error("Error deleting post", err);
        }
    };

    useEffect(() => {
        fetchAllPosts();
    }, []);

const deleteUser = async (userId) => {
        try {
            const res = await axios.delete(`http://localhost:3001/api/users/${userId}`);
            toast.success('User deleted successfully')
            setUsers(res.data.users);
        } catch (err) {
            console.log(err);
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
        <div className="max-w-4xl mx-auto p-6">
            {/* Admin controls */}
            <div className="mb-6">
                {/* <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 border rounded-lg shadow-sm"
                    />
                    <textarea
                        placeholder="Write your post..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="p-3 border rounded-lg shadow-sm"
                        rows="4"
                    ></textarea>
                    <button
                        onClick={handleAddPost}
                        className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                        Add Post
                    </button>
                </div> */}
            </div>

            <div className="users-section mt-6">
                <h2 className="text-xl font-bold text-center">All Users</h2>
                <div className="users-list">
                    {users.map((user) => (
                        <div key={user._id} className="user-card p-4 flex justify-between items-center border-b">
                            <Link to={`/admin/${user.email}`}>
                            <div className="user-info flex items-center space-x-4">
                                <img
                                    src={user.profilePhoto || 'defaultProfilePic.jpg'}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                <span className="text-sm text-gray-500">@{user.email}</span>
                                <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            </Link>
                            <button
                                onClick={() => deleteUser(user._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete User
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Posts Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Latest Posts</h2>
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className="border rounded-lg p-4 shadow-sm bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <p className="font-medium text-lg">{post.email} · {timeAgo(post.postedAt)}</p>
                                <button
                                    onClick={() => deletePost(post._id)}
                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="text-gray-800 mt-2 break-words whitespace-pre-wrap">{post.post}</p>

                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={() => fetchComments(post._id)}
                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    View Comments
                                </button>
                                <button
                                    onClick={() => handleLikePost(post._id)}
                                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Like / Unlike ({post.likes.length} likes)
                                </button>
                            </div>

                            {/* Comments Section */}
                            {selectedPostId === post._id && (
                                <div className="mt-4">
                                    <h3 className="font-semibold text-lg mb-2">Comments</h3>
                                    <div className="space-y-4">
                                        {comments.map((comment) => (
                                            <div key={comment._id} className="border p-4 rounded-lg shadow-sm">
                                                <p className="text-black font-black">{comment.email}</p>
                                                <p className="text-gray-700">{comment.comment}</p>
                                                <button
                                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                    onClick={() => deleteComment(comment._id)}>Delete Comment</button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleAddComment}
                                            className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                        >
                                            Add Comment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
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
    );
}

export default Admin;
