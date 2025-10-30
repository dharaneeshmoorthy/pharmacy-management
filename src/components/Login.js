import React from 'react';

function Login({ handleLogin }) {
  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Pharmacy Login</h2>
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <p>Default: admin/admin</p>
      </form>
    </div>
  );
}

export default Login;