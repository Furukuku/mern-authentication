import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async function() {
      try {
        const token = localStorage.getItem('token');

        const result = await fetch('http://localhost:3001/home', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (result.ok) {
          const userData = await result.json();
          setUser(userData.user);
        } else {
          console.log(result)
          navigate('/');
        }
      } catch(err) {
        console.log(err);
        navigate('/');
      }
    }());
  }, [navigate]);

  const handleClick = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  
  return (
    <div className="w-3/5 border mx-auto my-28">
      {user ? (
        <>
          <p className="text-center text-4xl mb-5">Welcome back, {user.firstName}!</p>
          <div className="flex justify-center">
            <button
              className="underline"
              onClick={handleClick} 
            >Logout</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Home;
