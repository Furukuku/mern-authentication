import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async function() {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const result = await fetch('http://localhost:3001/login', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!result.ok) {
            navigate('/home');
          }
        } catch (err) {
          navigate('/home');
        }
      }
    }());
  }, [navigate]);

  const handleSubmit = (e) =>{
    e.preventDefault();

    (async function() {
      try {
        const result = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password})
        });

        if (result.ok) {
          const res = await result.json();
          localStorage.setItem('token', res.accessToken);
          navigate('/home');
        } else {
          const error = await result.json();
          setErrorMsg(error.error);
          setEmail('');
          setPassword('');
        }
      } catch (err) {
        console.log(err);
      }
    }());
  }

  return (
    <form 
      className="border w-[29rem] mx-auto my-40 p-5 rounded-md"
      onSubmit={handleSubmit}
    >
      <p className="text-2xl font-semibold">Login</p>
      <p className="mb-4 text-zinc-500">Welcome back!</p>
      {errorMsg && (<p 
          className="text-white text-center py-3 px-4 bg-red-300 rounded-md border-2 border-red-400 mb-3"
        >
          {errorMsg} 
          <span 
            className="float-end cursor-pointer"
            onClick={() => setErrorMsg('')}
          >&times;</span>
      </p>)}
      <div className="flex flex-col mb-2">
        <label htmlFor="email" className="font-semibold">Email</label>
        <input 
          id="email"
          type="text" 
          placeholder="sample@email.com" 
          className="border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="password" className="font-semibold">Password</label>
        <input 
          id="password"
          type="password"  
          className="border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center ">
        <p className="text-xs">Don't have an account? <Link to="/register" className="underline">Sign Up</Link></p>
        <button 
          type="submit"
          className="bg-zinc-800 text-white px-4 py-2 rounded-md"
        >
          Login
        </button>
      </div>
    </form>
  )
}

export default LoginCard
