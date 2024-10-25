import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'; // Fixed the import for exit icon
import Typography from '@mui/material/Typography';

const StreamPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedServer } = location.state || {};

    const iframeRef = useRef(null);
    const [isFullScreen, setIsFullScreen] = React.useState(false);

    const handleFullScreenToggle = () => {
        const iframe = iframeRef.current;

        if (!isFullScreen) {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.mozRequestFullScreen) { // Firefox
                iframe.mozRequestFullScreen();
            } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari and Opera
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) { // IE/Edge
                iframe.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }

        // Toggle fullscreen state
        setIsFullScreen((prev) => !prev);
    };

    const handleTerminate = async () => {
        const instanceId = localStorage.getItem('instanceId');
        try {
            await axios.put(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}/instances/${instanceId}/terminate`);
            localStorage.clear();
            navigate('/');
        } catch (error) {
            console.error("Error exiting instance", error);
        }
    };

    const handleHome = () => {
        navigate('/');
    };

    // Listen for fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
                color: '#c2c2c2',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 1000,
                    display: 'flex',
                    gap: 2
                }}
            >
                <Button variant="contained" onClick={handleHome}>
                    Home
                </Button>
                <Button variant="contained" color="error" onClick={handleTerminate}>
                    Terminate
                </Button>
                <Typography
                    sx={{
                        top: 16,
                        right: 100,
                        zIndex: 1000,
                        color: 'white',
                        fontSize: '1.2rem',
                        backgroundColor: '#1976d2',
                        padding: '8px 16px',
                    }}
                >
                    Selected Server: {selectedServer.serverIP}:{selectedServer.serverPort}
                </Typography>
            </Box>

            <iframe
                ref={iframeRef}
                // src={`http://${selectedServer.serverIP}:${selectedServer.serverPort}/frontend/#/streaming`}
                src="http://example.com"
                // src="http://172.24.113.188:4690/frontend/#/streaming"
                width="100%"
                height="100%"
                style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
                title="OpenSpace"
            />

            <Button
                variant="contained"
                onClick={handleFullScreenToggle}
                sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    zIndex: 1000
                }}
            >
                {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </Button>
        </Box>
    );
};

export default StreamPage;
