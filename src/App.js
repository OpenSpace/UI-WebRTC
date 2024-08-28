import React, { useState } from 'react';
import { Button, Container, Typography, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenSpaceView from './OpenSpaceView';
import Resources from './Resources';

const App = () => {
  const [view, setView] = useState('home'); // 'home' or 'openSpace'
  const [isResourcesDialogOpen, setResourcesDialogOpen] = useState(false);

  const handleJoinClick = () => {
    setView('openSpace');
  };

  const handleCustomResourcesClick = () => {
    setResourcesDialogOpen(true);
  };

  const handleCloseResourcesDialog = () => {
    setResourcesDialogOpen(false);
  };

  const handleBackClick = () => {
    setView('home');
  };

  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      {view === 'home' && (
        <>
          <Typography variant="h4" gutterBottom>
            Welcome to OpenSpace
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            style={{ margin: '10px' }}
            onClick={handleJoinClick}
          >
            Join
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            style={{ margin: '10px' }}
            onClick={handleCustomResourcesClick}
          >
            Custom Resources
          </Button>
        </>
      )}
      
      {view === 'openSpace' && (
        <>
          <OpenSpaceView selectedServer="Your Server Info Here" />
          <Button 
            variant="outlined" 
            color="secondary" 
            style={{ margin: '10px' }}
            onClick={handleBackClick}
          >
            Back to Home
          </Button>
        </>
      )}
      
      <Dialog
        open={isResourcesDialogOpen}
        onClose={handleCloseResourcesDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Custom Resources
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseResourcesDialog}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Resources />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default App;
