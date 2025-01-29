import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
function Login(props) {
    const [email, SetEmail] = useState('');
    const [password, SetPassword] = useState('');
    const navigate = useNavigate();

    const Login = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/api/login', {
                email, password
            });
            props.setEmail(email);
            props.setLogin(true);
            navigate('/home');
        } catch (error) {
            if (error.status === 400) {
                toast.error('Wrong Email or Password');
                return;
             }
            else
                toast.error('Server Error');
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    Welcome Back
                </h2>

                {/* Login Form */}
                <form onSubmit={Login}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">
                            Email
                        </label>
                        <input
                            onChange={(e) => SetEmail(e.target.value)}
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
                            onChange={(e) => SetPassword(e.target.value)}
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="mb-4 flex justify-between items-center">
                        <label className="flex items-center text-gray-600 text-sm">
                            <input type="checkbox" className="mr-2" /> Remember me
                        </label>
                        <a href="#" className="text-blue-500 text-sm hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Log In
                    </button>
                </form>

                <p className="text-gray-600 text-sm text-center mt-4">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-blue-500 font-medium hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
