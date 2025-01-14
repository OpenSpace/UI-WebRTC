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
    const [instanceId, setInstanceId] = useState(null);
    const [processId, setProcessId] = useState(null);
    const [activeSession, setActiveSession] = useState(false);
    const [availableInstances, setAvailableInstances] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const storedSessionId = localStorage.getItem('sessionId');
        const storedInstanceId = localStorage.getItem('instanceId');
        const storedProcessId = localStorage.getItem('processId');
        const serverIP = localStorage.getItem('serverIP');
        const serverPort = localStorage.getItem('serverPort');
        if (storedSessionId && storedInstanceId && serverIP && serverPort) {
            setSessionId(storedSessionId);
            setInstanceId(storedInstanceId);
            setProcessId(storedProcessId);
        } else {
            const newSessionId = uuidv4();
            setSessionId(newSessionId);
            localStorage.setItem('sessionId', newSessionId);
        }
    }, []);

    useEffect(() => {
        // check if the instance is in INITIALIZING or RUNNING state
        const checkInstanceStatus = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}/instances/${instanceId}`);
                const status = response.data.status;
                if (status === 'INITIALIZING' || status === 'RUNNING') {
                    setActiveSession(true);
                } else {
                    setActiveSession(false);
                    localStorage.clear();
                }
            } catch (error) {
                console.error("Error checking instance status", error);
            }
        }

        if (instanceId) {
            checkInstanceStatus();
        }
    }, [instanceId, navigate]);

    useEffect(() => {
        const getServerInfo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}/servers/info`);
                const data = response.data;
                setAvailableInstances(data.availableInstances);
            } catch (error) {
                console.error("Error fetching servers", error);
            }
        }

        getServerInfo();

        // Set an interval to call getServerInfo every 5 seconds
        const intervalId = setInterval(getServerInfo, 5000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const getSessionId = () => {
        const session_id = sessionId || localStorage.getItem('sessionId');
        if (!session_id) {
            throw new Error("No session ID found");
        }

        return session_id;
    }

    const handleJoin = async () => {
        setLoading(true);
        try {
            const session_id = getSessionId();
            console.log("session_id: ", session_id);
            const response = await axios.post(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}/servers/join`, {
                session_id,
            });

            const data = response.data;
            console.log("data: ", data);

            setInstanceId(data.instanceId);
            localStorage.setItem('serverIP', data.serverIP);
            localStorage.setItem('serverPort', data.serverPort);
            localStorage.setItem('instanceId', data.instanceId);
            localStorage.setItem('processId', data.processId);
            const selectedServer = { "serverIP": data.serverIP, "serverPort": data.serverPort, "instanceId": data.instanceId, "processid": data.processId };
            navigate('/stream', { state: { selectedServer } });
        } catch (error) {
            console.error("Error joining server", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRejoin = () => {
        const serverIP = localStorage.getItem('serverIP');
        const serverPort = localStorage.getItem('serverPort');
        const sessionId = localStorage.getItem('sessionId');
        const instanceId = localStorage.getItem('instanceId');
        const processId = localStorage.getItem('processId');
        if (serverIP && serverPort && sessionId && instanceId) {
            const selectedServer = { "serverIP": serverIP, "serverPort": serverPort, "processid": processId };
            navigate('/stream', { state: { selectedServer } });
        }
    };

    return (
        <div style={{
            backgroundImage: `url(${require('../assets/web_background.png')})`,
            backgroundSize: 'cover',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            {/* add logo */}
            <img src={require('../assets/logo.png')} alt="logo" style={{ width: '30%', height: 'auto' }} />
            <Typography
                variant="h4"
                gutterBottom
                sx={{ color: '#c2c2c2', marginBottom: '120px' }}
            >
                Welcome to OpenSpace WebRTC!
            </Typography>

            {activeSession ?
                (
                    <div style={{ textAlign: 'center', margin: '20px' }}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{ color: '#c2c2c2' }}
                        >
                            Hey, You have an existing running instance!
                        </Typography>

                        <Button variant="contained" color="secondary" onClick={handleRejoin}
                            style={{
                                marginTop: '10px',
                                padding: '12px 24px',
                                fontSize: '18px'
                            }}>
                            Click here to ReJoin
                        </Button>
                    </div>
                )
                :
                (
                    <Button variant="contained" color="primary" onClick={handleJoin} disabled={loading}
                        style={{
                            marginTop: '10px',
                            padding: '12px 24px',
                            fontSize: '18px'
                        }}>
                        {loading ? <CircularProgress size={24} /> : (availableInstances > 0 ? "Join" : "No available servers to join")}
                    </Button>
                )
            }

            <Button variant="contained" color="info" onClick={() => setDialogOpen(true)}
                style={{
                    marginTop: '70px',
                    padding: '12px 24px',
                    fontSize: '18px'
                }}>
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

                {/* <DialogContent>
                    {servers.length ? (
                        servers.map(server => (
                            <>
                                {console.log(server.server_id)}
                                <div key={server.server_id} style={{ marginBottom: '10px' }}>
                                    <Typography>{server.name} (Status: {server.status})</Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleJoinServer(server.server_id)}
                                        disabled={server.status !== 'active'}
                                    >
                                        Join
                                    </Button>
                                </div>
                            </>
                        ))
                    ) : (
                        <Typography>No servers available</Typography>
                    )}
                </DialogContent> */}
            </Dialog>
        </div>
    );
};

export default HomePage;
