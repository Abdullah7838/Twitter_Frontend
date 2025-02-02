import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


function Comments({ email }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mypreview, setmyPreview] = useState(null);
  const [preview, setPreview] = useState({});
  const navigate = useNavigate();


  const fetchProfileImage = async (email) => {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`http://localhost:3001/api/get-profile?email=${email}`);
        const data = await response.json();
        if (response.ok) {
            setPreview(prev => ({
                ...prev,
                [email]: data.profilePhoto // Store the image URL by email
            }));
        } else {
            console.error("Error:", data.message);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
};

  useEffect(() => {
    const fetchMyProfilePhoto = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/get-profile?email=${email}`);
        const data = await response.json();
        if (response.ok) {
          setmyPreview(data.profilePhoto);
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (email) {
      fetchMyProfilePhoto();
    }
  }, [email,comment]);


  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postRes = await axios.get(`http://localhost:3001/api/post/${id}`);
        setPost(postRes.data.post);

        const commentsRes = await axios.get(`http://localhost:3001/api/comments/${id}`);
        setComments(commentsRes.data.comments);
        const postsData = commentsRes.data.comments
        postsData.forEach(post => {
          if (post.email && !preview[post.email]) {
              fetchProfileImage(post.email);
          }
      });
      } catch (error) {
        toast.error("Error fetching comments");

      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
    const timeout = setTimeout(() => {
      if (!post) {
        setError(true);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [id, post]);


  if (error) {
    return <div className="text-red-600 font-bold">ERR_CONNECTION_REFUSED</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }


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
      // toast.success("Comment posted successfully!"); 
    } catch (error) {
      toast.error("Error posting the comment");
    }
  };

  const handleAccount = (email) => {
    navigate(`/account/${email}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">

      {/* Post Section */}
      <div className="border-b pb-6 mb-6 ">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-500 rounded-full"><img src={mypreview} className="w-10 h-10 bg-gray-500 rounded-full"></img></div> {/* Placeholder for user avatar */}
          <h2 className="text-2xl font-semibold text-gray-800">{post.email.split('@')[0]}'s Post</h2>
        </div>
        <p className="text-lg text-black break-words whitespace-pre-wrap">{post.post}</p>
      </div>

      {/* Comments Section */}
      <div className="mt-8 mb-20">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="p-4 bg-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full">
                    <img
                      onClick={() => handleAccount(comment.email)}
                      src={preview[comment.email] || "profilepic.png"}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full cursor-pointer"
                    />
                  </div> {/* Placeholder for user avatar */}
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
        <div className="fixed bottom-4 left-0 right-0 bg-white p-4 flex items-center space-x-4 shadow-lg md:w-full max-w-3xl mx-auto">
        <div className="w-10 h-10 bg-gray-500 rounded-full"><img src={mypreview} className="w-10 h-10 bg-gray-500 rounded-full"></img></div> {/* Placeholder for user avatar */}        <div className="flex-1">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
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

export default Comments;
