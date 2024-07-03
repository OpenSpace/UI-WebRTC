import React, { useState } from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import './index.css';
import MiniDrawer from './MiniDrawer';
import reportWebVitals from './reportWebVitals';
import Login from './Login';
// // Login Component
// const Login = ({ onLogin }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     // Perform authentication logic here (e.g., API call)
//     // For simplicity, let's assume login is successful
//     onLogin();
//   };

//   return (
//     <div className="login-form">
//       <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
//       <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    // Simulated authentication success
    setAuthenticated(true);
  };

  return (
    <React.StrictMode>
      {authenticated ? (
        <MiniDrawer />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </React.StrictMode>
  );
};

// Use createRoot properly
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
