import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Signup(props) {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [usernameAvailable, setUsernameAvailable] = useState(true);
const [usernameError, setUsernameError] = useState('');
const navigate = useNavigate();

    // Check username availability when username changes
    useEffect(() => {
        const checkUsername = async () => {
            if (username.length < 3) {
                setUsernameError('Username must be at least 3 characters');
                return;
            }
            
            if (username.includes('.')) {
                setUsernameError('Username cannot contain dots (.)');
                setUsernameAvailable(false);
                return;
            }
            
            try {
                const response = await axios.get(`http://localhost:3001/api/check-username/${username}`);
                setUsernameAvailable(response.data.available);
                setUsernameError(response.data.available ? '' : response.data.message);
            } catch (error) {
                console.error('Error checking username:', error);
            }
        };
        
        if (username.length > 0) {
            checkUsername();
        } else {
            setUsernameError('');
            setUsernameAvailable(true);
        }
    }, [username]);

    const Signup = async(e) => {
        e.preventDefault();
        
        if (!usernameAvailable || username.length < 3) {
            toast.error(usernameError || 'Please choose a valid username');
            return;
        }
        
        try {
            const res = await axios.post('http://localhost:3001/api/signup', {
                username,
                email,
                password
            });
            
            // Store both email and username in local storage
            localStorage.setItem('username', res.data.username);
            await props.setLogin(email);
            navigate('/home');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message || 'Registration failed');
                return;
            } else {
                toast.error('Server Error');
            }
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Create an Account
        </h2>

        {/* Signup Form */}
        <form onSubmit={Signup}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${usernameAvailable ? 'focus:ring-blue-400' : 'focus:ring-red-400 border-red-300'}`}
              placeholder="Choose a username"
              required
              minLength="3"
            />
            {usernameError && (
              <p className="text-red-500 text-xs mt-1">{usernameError}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
             onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-600 text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 font-medium hover:underline">
            Log in
          </a>
        </p>
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

export default Signup;
