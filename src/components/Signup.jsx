import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Signup(props) {
const [email,SetEmail] = useState('');
const [password,SetPassword] = useState('');
const navigate = useNavigate();

    const Signup =async(e)=>{
        e.preventDefault();
        console.log(email,password)
        try{
     const res = await axios.post('http://localhost:3001/api/signup',{
        email,password
     });
    //  props.setEmail(email);
     await props.setLogin(email);
     navigate('/home');
    }catch (error) {
        if (error.status === 400) {
            toast.error('User Already exists');
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
          Create an Account
        </h2>

        {/* Signup Form */}
        <form onSubmit={Signup}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              onChange={(e)=>SetEmail(e.target.value)}
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
             onChange={(e)=>SetPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
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
      <ToastContainer />
    </div>
  );
}

export default Signup;
