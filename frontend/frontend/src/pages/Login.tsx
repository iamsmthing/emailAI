import React from 'react';

const Login = () => {
  const googleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button className='bg-slate-800 p-3 text-white rounded-md' onClick={googleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
