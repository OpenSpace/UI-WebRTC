import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, TwitterAuthProvider, onAuthStateChanged, fetchSignInMethodsForEmail, linkWithCredential } from "firebase/auth";
import { auth } from './firebase';

const Login = ({ onLogin }) => {
  const providers = {
    google: {
      provider: new GoogleAuthProvider(),
      credentialFromError: GoogleAuthProvider.credentialFromError,
    },
    github: {
      provider: new GithubAuthProvider(),
      credentialFromError: GithubAuthProvider.credentialFromError,
    },
    twitter: {
      provider: new TwitterAuthProvider(),
      credentialFromError: TwitterAuthProvider.credentialFromError,
    },
  };

  const handleLogin = async (providerKey) => {
    const { provider, credentialFromError } = providers[providerKey];

    try {
      const result = await signInWithPopup(auth, provider);
      onLogin();
    } catch (error) {
      console.error("Error:", error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email;
        const credential = credentialFromError(error);
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length > 0) {
          const linkedProviderKey = methods[0].split('.')[0];
          const linkedProvider = providers[linkedProviderKey].provider;
          const linkedResult = await signInWithPopup(auth, linkedProvider);
          await linkWithCredential(linkedResult.user, credential);
          onLogin();
        } else {
          console.log("No other providers");
        }
      } else {
        console.error("Error:", error);
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ 
        marginTop: 30, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 2, 
        maxWidth: 400,
        padding: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        }}>
        <Box
          component="img"
          src="openspace-black-transparent.png"
          alt="OpenSpace Logo"
          sx={{ width: '120px', height: 'auto', mb: 2 }}
        />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" sx={{ mt: 1, width: '100%' }}>
          {Object.keys(providers).map((key) => (
            <Button
              key={key}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => handleLogin(key)}
            >
              Sign in with {key.charAt(0).toUpperCase() + key.slice(1)} 🚀
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;