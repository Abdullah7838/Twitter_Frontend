import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

function Comments({ email }) {
  const { id } = useParams();  
  const [post, setPost] = useState(null); 
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);  
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postRes = await axios.get(`http://localhost:3001/api/post/${id}`);  
        setPost(postRes.data.post);  

        const commentsRes = await axios.get(`http://localhost:3001/api/comments/${id}`);  
        setComments(commentsRes.data.comments);  
      } catch (error) {
        toast.error("Error fetching post or comments"); 
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handlePostComment = async () => {
    if (comment.trim().length === 0) {
      toast.warning("Please enter a comment.");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3001/api/comments/${id}`, {
        email,  
        comment,
      });

      setComments((prevComments) => [
        ...prevComments,
        { email, comment, commentedAt: new Date().toISOString() }, 
      ]);
      setComment("");  
      toast.success("Comment posted successfully!"); 
    } catch (error) {
      toast.error("Error posting the comment"); 
    }
  };

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">

      {/* Post Section */}
      <div className="border-b pb-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-500 rounded-full"></div> {/* Placeholder for user avatar */}
          <h2 className="text-2xl font-semibold text-gray-800">{post.email.split('@')[0]}'s Post</h2>
        </div>
        <p className="text-lg text-black">{post.post}</p>
      </div>

      {/* Comments Section */}
      <div className="mt-8 mb-20">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>
        <div className="space-y-6 ">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="p-4 bg-gray-200 rounded-lg shadow-sm ">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div> {/* Placeholder for user avatar */}
                  <p className="font-semibold text-gray-900">{comment.email.split('@')[0]}</p>
                </div>
                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No comments yet.</p>
          )}
        </div>

        {/* Post New Comment */}
        <div className="mt-6 flex space-x-4 items-center fixed bottom-4 bg-white">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div> {/* Placeholder for user avatar */}
          <div className="flex-1">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              className="w-lg p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 "
              rows="4"
            />
          </div>
          <button
            onClick={handlePostComment}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
          >
            Post
          </button>
        </div>
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
}

export default Comments;
