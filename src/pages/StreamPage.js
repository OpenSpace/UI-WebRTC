import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const StreamPage = () => {
    const { instanceId } = useParams(); // Get instanceId from the route params
    const [instanceStatus, setInstanceStatus] = useState(null);
    const [selectedServer, setSelectedServer] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const iframeRef = useRef(null);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const isSecure = process.env.REACT_APP_IS_SECURE === "true";
    const host = isSecure ? process.env.REACT_APP_HOST_SECURE : process.env.REACT_APP_HOST_NON_SECURE;


    const fetchInstanceDetails = async () => {
        try {
            const response = await axios.get(`
                ${process.env.REACT_APP_HOST_LIVE}/instances/${instanceId}`
            );
            const instance = response.data;
            setInstanceStatus(instance.status);
            setSelectedServer({
                serverIP: instance.Server.ip_address,
                processId: instance.process_id,
            });
        } catch (error) {
            console.error('Error fetching instance details:', error);
        }
    };

    useEffect(() => {
        // Periodically check the instance status
        const intervalId = setInterval(fetchInstanceDetails, 10000);
        fetchInstanceDetails();

        return () => clearInterval(intervalId);
    }, [instanceId]);

    const handleHome = () => {
        navigate('/');
    };

    const handleTerminate = async () => {
        let isIdle = false;
        try {
            setLoading(true);
            await axios.put(`
                ${process.env.REACT_APP_HOST_LIVE}/instances/${instanceId}/terminate`
            );

            // Poll the instance status until it becomes "IDLE"
            while (!isIdle) {
                const response = await axios.get(`
                    ${process.env.REACT_APP_HOST_LIVE}/instances/${instanceId}`
                );

                const { status } = response.data;
                if (status === 'IDLE') {
                    isIdle = true;
                } else {
                    // Wait for a short interval before the next check
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
            }
            setLoading(false);
            handleHome();
        } catch (error) {
            console.error('Error terminating the instance:', error);
        }
    };

    useEffect(() => {
        if (instanceStatus === 'RUNNING') {
            setLoading(false);
        } else if (instanceStatus === 'DEINITIALIZING' || instanceStatus === 'ERROR') {
            handleHome();
        }
    }, [instanceStatus, navigate]);

    const handleFullScreenToggle = () => {
        if (!isFullScreen) {
            iframeRef.current.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
        setIsFullScreen(!isFullScreen);
    };

    // DEINITIALIZING the instance
    if (loading) {
        return (
            <Box
                sx={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#000',
                    color: '#fff',
                    flexDirection: 'column',
                }}
            >
                <CircularProgress color="inherit" />
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                    {instanceStatus === 'INITIALIZING' && 'Initializing instance, please wait...'}
                    {instanceStatus === 'RUNNING' && 'Terminating instance, please wait...'}
                    {!instanceStatus && 'Processing, please wait...'}
                </Typography>
            </Box>
        );
    }    

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
                color: '#c2c2c2',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 1000,
                    display: 'flex',
                    gap: 2,
                }}
            >
                <Button variant="contained" onClick={handleHome}>
                    Home
                </Button>
                <Button variant="contained" color="error" onClick={handleTerminate}>
                    Terminate
                </Button>
            </Box>

            {instanceStatus === 'RUNNING' && selectedServer && (
                <iframe
                    ref={iframeRef}
                    src={`${host}/frontend/#/streaming?id=${selectedServer.processId}`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
                    title="OpenSpace"
                />
            )}

            <Button
                variant="contained"
                onClick={handleFullScreenToggle}
                sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    zIndex: 1000,
                }}
            >
                {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </Button>

            {selectedServer && (
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
                    Streaming: {`${host}/frontend/#/streaming?id=${selectedServer.processId}`}
                </Typography>
            )}
        </Box>
    );
};

export default StreamPage;