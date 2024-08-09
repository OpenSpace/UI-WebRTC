import React, { useState } from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import './index.css';
import MiniDrawer from './MiniDrawer';
import reportWebVitals from './reportWebVitals';
import Login from './Login';

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
