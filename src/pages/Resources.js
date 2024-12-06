import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CoPresentRoundedIcon from '@mui/icons-material/CoPresentRounded';
import PersonalVideoOutlinedIcon from '@mui/icons-material/PersonalVideoOutlined';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom'; // For navigation to OpenSpace view
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Box from '@mui/material/Box';

export default function Resources() {

    const [availableServers, setAvailableServers] = React.useState([]);
    const [inactiveServers, setInactiveServers] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServers = async () => {
            try {
                console.log("Fetching servers...", `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}/servers`);
                const resp = await axios.get(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}/servers`);
                const data = resp.data;

                // Separate servers into active and inactive
                const active = data.filter(server => server.status === 'active');
                const inactive = data.filter(server => server.status === 'inactive');

                setAvailableServers(active);
                setInactiveServers(inactive);
            } catch (error) {
                console.error('Error fetching servers:', error);
            }
        }

        fetchServers();
    }, []);


    const handleJoinServer = async (serverId) => {
        try {
            const session_id = uuidv4();
            const response = await axios.post(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_API_PORT}/servers/join/${serverId}`, {
                session_id,
            });

            const { serverIP, serverPort, sessionId, instanceId } = response.data;
            localStorage.setItem('sessionId', sessionId);
            localStorage.setItem('serverIP', serverIP);
            localStorage.setItem('serverPort', serverPort);
            localStorage.setItem('sessionId', sessionId);
            localStorage.setItem('instanceId', instanceId);
            const selectedServer = { "serverIP": serverIP, "serverPort": serverPort };
            navigate('/stream', { state: { selectedServer } });
        } catch (error) {
            console.error("Error joining specific server", error);
        }
    };

    const calculateTimeDiff = (created) => {
        const diff = new Date() - new Date(created);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return `${hours} hours, ${minutes % 60} minutes, ${seconds % 60} seconds`;
    }

    const showResourceInfo = (resource) => {
        alert(`Total Time Elapsed: ${calculateTimeDiff(resource.created)} \n\nResource Status: ${resource.status}`);
    }

    const renderServerInstanceIcons = (server) => {
        const icons = [];
        const usedResources = server.Instances ?
            server.Instances.filter(instance => instance.status !== 'IDLE') : [];

        if (server.status === 'active') {
            // Add "Used Resource" icons
            for (let i = 0; i < usedResources.length; i++) {
                icons.push(<CoPresentRoundedIcon key={`used-${i}`} color="primary" onClick={() => showResourceInfo(usedResources[i])} />);
            }

            // Add "Available Resource" icons
            for (let i = 0; i < server.available_instances; i++) {
                icons.push(<PersonalVideoOutlinedIcon key={`available-${i}`} color="primary" onClick={() => alert("Click JOIN button to connect with this instance")} />);
            }
        }
        if (server.status === 'inactive') {
            // Add "Available Resource" icons
            for (let i = 0; i < server.available_instances; i++) {
                icons.push(<PersonalVideoOutlinedIcon key={`available-${i}`} color="primary" onClick={() => alert("Can't JOIN since Server is Inactive.")} />);
            }
        }


        return icons;
    };

    return (
        <>
            {/* Available Servers */}
            <Alert severity="success">Available Servers:</Alert>
            <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {availableServers.map((server) => (
                    <ListItem key={server.server_id} disablePadding>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar alt={`Server Avatar ${server.server_id}`} />
                                </ListItemAvatar>
                                <ListItemText primary={`Region: ${server.region}`} secondary={`RAM: ${server.ram}, GPU: ${server.graphics_card}`} />
                                <ListItemText primary={`Instances: ${server.num_instances}`} secondary={`Available: ${server.available_instances}`} />
                                {server.available_instances === 0 ?
                                    <> </>
                                    :
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleJoinServer(server.server_id)}
                                        disabled={loading}
                                        sx={{ ml: 2 }}
                                    >
                                        {loading ? 'Joining...' : 'Join'}
                                    </Button>
                                }


                            </ListItemButton>
                            <Box sx={{ mt: 1, px: 9 }}>
                                {renderServerInstanceIcons(server)}
                            </Box>
                        </Box>
                    </ListItem>
                ))}
            </List>

            {/* Inactive Servers */}
            <Alert severity="info">Inactive Servers:</Alert>
            <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {inactiveServers.map((server) => (
                    <ListItem key={server.server_id} disablePadding>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar alt={`Server Avatar ${server.server_id}`} />
                                </ListItemAvatar>
                                <ListItemText primary={`Region: ${server.region}`} secondary={`RAM: ${server.ram}, GPU: ${server.graphics_card}`} />
                                <ListItemText primary={`Instances: ${server.num_instances}`} secondary={`Available: ${server.available_instances}`} />
                            </ListItemButton>
                            <Box sx={{ mt: 1, px: 9 }}>
                                {renderServerInstanceIcons(server)}
                            </Box>
                        </Box>
                    </ListItem>
                ))}
            </List>

            {/* Legend */}
            <Alert severity="info" sx={{ mt: 2 }}>
                Legend:
                <ul style={{ paddingLeft: '20px' }}>
                    <li>
                        <CoPresentRoundedIcon color="primary" /> Used Resource
                    </li>
                    <br />
                    <li>
                        <PersonalVideoOutlinedIcon color="primary" /> Available Resource
                    </li>
                </ul>
            </Alert>
        </>


    );
}


