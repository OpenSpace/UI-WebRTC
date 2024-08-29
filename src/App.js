import React, { useState } from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenSpaceView from './OpenSpaceView';
import Resources from './Resources';
import backgroundImage from './assets/web_background.png'; // Import your background image

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
    <div
      style={{
        // display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        margin: 0,
        padding: 0,
        overflow: 'hidden', // Prevent scrollbars
      }}
    >
      <div
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
            <Typography variant="h4" gutterBottom sx={{ color: '#c2c2c2', marginBottom: '120px' }} >
              Welcome to OpenSpace!
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                size="large"  // Use "small", "medium", or "large"
                style={{ margin: '20px' }}
                onClick={handleJoinClick}
                >
                Join
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              size="small"
              style={{ margin: '10px' }}
              onClick={handleCustomResourcesClick}
            >
              Custom Resources
            </Button>
          </>
        )}
        
        {view === 'openSpace' && (
          <>
            {/* <OpenSpaceView selectedServer="Your Server Info Here" /> */}
            <OpenSpaceView selectedServer="Server 3" />
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
      </div>
    </div>
  );
};

export default App;
