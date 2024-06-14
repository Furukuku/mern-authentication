import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SignUpCard = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });
  const [errorMsgs, setErrorMsgs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    (async function() {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const result = await fetch('http://localhost:3001/register', {
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

  function handleChangeValue(value, field) {
    setUser({
      ...user,
      [field]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    (async function() {
      try {
        const result = await fetch('http://localhost:3001/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });

        if (result.ok) {
          navigate('/');
        } else {
          const errors = await result.json();
          setUser({...user, password: '', passwordConfirmation: ''})
          setErrorMsgs(errors);
        }
      } catch(err) {
        console.log(err);
      }
    }());
  }

  return (
    <form 
      className="border w-[29rem] mx-auto my-20 p-5 rounded-md"
      onSubmit={handleSubmit}
    >
      <p className="text-2xl font-semibold">Sign Up</p>
      <p className="mb-4 text-zinc-500">Create your future here!</p>
      <div className="flex flex-col mb-2">
        <label htmlFor="fname" className="font-semibold">First Name</label>
        <input 
          id="fname"
          type="text" 
          placeholder="John" 
          className="border rounded px-3 py-2"
          value={user.firstName}
          onChange={e => handleChangeValue(e.target.value, 'firstName')}
        />
        {errorMsgs.firstName && <p className="text-xs text-red-500 px-1">{errorMsgs.firstName}.</p>}
      </div>
      <div className="flex flex-col mb-2">
        <label htmlFor="lname" className="font-semibold">Last Name</label>
        <input 
          id="lname"
          type="text" 
          placeholder="Doe" 
          className="border rounded px-3 py-2"
          value={user.lastName}
          onChange={e => handleChangeValue(e.target.value, 'lastName')}
        />
        {errorMsgs.lastName && <p className="text-xs text-red-500 px-1">{errorMsgs.lastName}</p>}
      </div>
      <div className="flex flex-col mb-2">
        <label htmlFor="email" className="font-semibold">Email</label>
        <input 
          id="email"
          type="text" 
          placeholder="john@email.com" 
          className="border rounded px-3 py-2"
          value={user.email}
          onChange={e => handleChangeValue(e.target.value, 'email')}
        />
        {errorMsgs.email && <p className="text-xs text-red-500 px-1">{errorMsgs.email}</p>}
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="password" className="font-semibold">Password</label>
        <input 
          id="password"
          type="password"  
          className="border rounded px-3 py-2"
          value={user.password}
          onChange={e => handleChangeValue(e.target.value, 'password')}
        />
        {errorMsgs.password && <p className="text-xs text-red-500 px-1">{errorMsgs.password}</p>}
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="passwordConfirm" className="font-semibold">Confirm password</label>
        <input 
          id="passwordConfirm"
          type="password"  
          className="border rounded px-3 py-2"
          value={user.passwordConfirmation}
          onChange={e => handleChangeValue(e.target.value, 'passwordConfirmation')}
        />
        {errorMsgs.passwordConfirmation && <p className="text-xs text-red-500 px-1">{errorMsgs.passwordConfirmation}</p>}
      </div>
      <div className="flex justify-between items-center ">
        <p className="text-xs">Already have an account? <Link to="/" className="underline">Login</Link></p>
        <button 
          type="submit"
          className="bg-zinc-800 text-white px-4 py-2 rounded-md"
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}

export default SignUpCard;
