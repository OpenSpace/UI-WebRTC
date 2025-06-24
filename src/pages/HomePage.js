import React, { useState, useEffect } from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, IconButton, CircularProgress, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Resources from './Resources';

const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [activeUserInstances, setActiveUserInstances] = useState([]);
    const [availableInstances, setAvailableInstances] = useState([]);

    const navigate = useNavigate();

    // set session id
    useEffect(() => {
        const storedSessionId = localStorage.getItem('session_id');
        if (storedSessionId) {
            setSessionId(storedSessionId);
            fetchInstances(storedSessionId);
        } else {
            const newSessionId = uuidv4();
            setSessionId(newSessionId);
            localStorage.setItem('session_id', newSessionId);
        }
    }, []);

    // get server info
    useEffect(() => {
        const getServerInfo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_HOST}/servers/info`);
                const data = response.data;
                setAvailableInstances(data.availableInstances);
            } catch (error) {
                console.error("Error fetching servers", error);
            }
        }

        getServerInfo();

        // Set an interval to call getServerInfo every 10 seconds
        const intervalId = setInterval(getServerInfo, 10000);

        return () => clearInterval(intervalId);
    }, []);

    //fetch instances related to given session id
    const fetchInstances = async (sessionId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_HOST}/instances/sessions/${sessionId}`);
            console.log('Response data:', response.data);
            console.log('Response data type:', typeof response.data);
            console.log('Is array?', Array.isArray(response.data));
            // Ensure we're setting an array
            setActiveUserInstances(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching instances:', error);
            setActiveUserInstances([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleJoinInstance = (instanceId) => {
        navigate(`/stream/${instanceId}`);
    };

    const [loadingInstances, setLoadingInstances] = useState({});

    const handleTerminateInstance = async (instanceId) => {
        setLoadingInstances((prev) => ({ ...prev, [instanceId]: true }));

        try {
            await axios.put(
                `${process.env.REACT_APP_HOST}/instances/${instanceId}/terminate`
            );

            let isIdle = false;
            while (!isIdle) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before polling again
                
                const response = await axios.get(
                    `${process.env.REACT_APP_HOST}/instances/${instanceId}`
                );

                const { status } = response.data;
                if (status === 'IDLE') {
                    isIdle = true;
                }
            }

            // Refresh instances after termination is complete
            fetchInstances(sessionId);
        } catch (error) {
            console.error('Error terminating instance:', error);
        } finally {
            setLoadingInstances((prev) => ({ ...prev, [instanceId]: false }));
        }
    };

    const handleJoin = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_HOST}/servers/join`, {
                session_id: sessionId,
            });

            const data = response.data;

            const instanceId = data.instanceId
            navigate(`/stream/${instanceId}`);
        } catch (error) {
            console.error("Error joining server", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url(${require('../assets/web_background.png')})`,
                backgroundSize: 'cover',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <img
                src={require('../assets/logo.png')}
                alt="logo"
                style={{ width: '30%', height: 'auto' }}
            />
            <Typography
                variant="h4"
                gutterBottom
                sx={{ color: '#c2c2c2', marginBottom: '120px' }}
            >
                Welcome to OpenSpace WebRTC!
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : activeUserInstances.length > 0 ? (
                <div style={{ textAlign: 'center' }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ color: '#c2c2c2' }}
                    >
                        Join your existing instance:
                    </Typography>
                    <ul>
                        {activeUserInstances.map((instance) => (
                            <li key={instance.instance_id} style={{ margin: '10px 0',  padding: '10px', background: 'gray' }}>
                                <Typography style={{
                                        color: 'white'
                                    }}>
                                    <strong>Instance ID:</strong> {instance.instance_id} |{' '}
                                    <strong>Status:</strong> {instance.status}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleJoinInstance(instance.instance_id)}
                                    style={{
                                        marginTop: '5px',
                                        padding: '8px 16px',
                                        fontSize: '16px',
                                    }}
                                >
                                    Join Instance
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleTerminateInstance(instance.instance_id)}
                                    style={{
                                        marginTop: '5px',
                                        padding: '8px 16px',
                                        fontSize: '16px',
                                        marginLeft: '10px'
                                    }}
                                    disabled={loadingInstances[instance.instance_id]}
                                >
                                    {loadingInstances[instance.instance_id] ? (
                                        <>
                                            <CircularProgress size={20} color="secondary" style={{ marginRight: '8px' }} />
                                            Terminating...
                                        </>
                                    ) : "Terminate"}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <Button variant="contained" color="primary" onClick={handleJoin} disabled={loading}
                    style={{
                        marginTop: '10px',
                        padding: '12px 24px',
                        fontSize: '18px'
                    }}>
                    {loading ? <CircularProgress size={24} /> : (availableInstances > 0 ? "Join" : "No available servers to join")}
                </Button>
            )}

            <Button
                variant="contained"
                color="info"
                onClick={() => setDialogOpen(true)}
                style={{
                    marginTop: '70px',
                    padding: '12px 24px',
                    fontSize: '18px',
                }}
            >
                Custom Resources
            </Button>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Custom Resources
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setDialogOpen(false)}
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
    );
};

export default HomePage;
