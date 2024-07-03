import * as React from 'react';
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

export default function CheckboxListSecondary() {
  const [checked, setChecked] = React.useState([]);
  const [confirmExitServer, setConfirmExitServer] = React.useState(null); // Track which server's exit is confirmed
  const [dialogOpen, setDialogOpen] = React.useState(false); // Dialog open/close state
  const [currentJoinedServer, setCurrentJoinedServer] = React.useState(null); // Track currently joined server
  const [serverToJoin, setServerToJoin] = React.useState(null); // Server to join after confirmation

  const [availableServers, setAvailableServers] = React.useState([
    { id: 1, name: 'Server 1', resources: 3, used_resources: 2, isJoined: false },
    { id: 2, name: 'Server 2', resources: 2, used_resources: 1, isJoined: false },
    { id: 3, name: 'Server 3', resources: 1, used_resources: 0, isJoined: false },
    { id: 4, name: 'Server 4', resources: 3, used_resources: 3, isJoined: false },
  ]);

  const [inactiveServers, setInactiveServers] = React.useState([
    { id: 5, name: 'Inactive Server 1', resources: 2, used_resources: 1, isJoined: false },
    { id: 6, name: 'Inactive Server 2', resources: 3, used_resources: 2, isJoined: false },
  ]);

  const handleToggle = (id, index) => () => {
    if (!isToggleable(id, index)) {
      return;
    }

    const newChecked = [...checked];
    const key = `${id}-${index}`;

    const currentIndex = newChecked.indexOf(key);
    if (currentIndex === -1) {
      newChecked.push(key);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleJoin = (server) => () => {
    if (currentJoinedServer && currentJoinedServer.id !== server.id) {
      setServerToJoin(server);
      setConfirmExitServer(currentJoinedServer);
      setDialogOpen(true);
    } else {
      joinServer(server);
    }
  };

  const handleExit = (server) => () => {
    setServerToJoin(null);
    setConfirmExitServer(server);
    setDialogOpen(true);
  };

  const handleConfirmExit = () => {
    if (confirmExitServer) {
      const updatedAvailableServers = availableServers.map((s) =>
        s.id === confirmExitServer.id ? { ...s, isJoined: false } : s
      );
      const updatedInactiveServers = inactiveServers.map((s) =>
        s.id === confirmExitServer.id ? { ...s, isJoined: false } : s
      );
      setAvailableServers(updatedAvailableServers);
      setInactiveServers(updatedInactiveServers);
      setCurrentJoinedServer(null);
    }
    if (serverToJoin) {
      joinServer(serverToJoin);
    }
    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setServerToJoin(null);
    setConfirmExitServer(null);
    setDialogOpen(false);
  };

  const joinServer = (server) => {
    const updatedAvailableServers = availableServers.map((s) =>
      s.id === server.id ? { ...s, isJoined: true } : { ...s, isJoined: false }
    );
    const updatedInactiveServers = inactiveServers.map((s) =>
      s.id === server.id ? { ...s, isJoined: true } : { ...s, isJoined: false }
    );
    setAvailableServers(updatedAvailableServers);
    setInactiveServers(updatedInactiveServers);
    setCurrentJoinedServer(server);
    setChecked([]);
  };

  const isToggleable = (id, index) => {
    const server = [...availableServers, ...inactiveServers].find((server) => server.id === id);
    return !server.isJoined && server.used_resources < server.resources;
  };

  return (
    <>
      <Alert severity="success">Available Servers:</Alert>
      <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {availableServers.map((server) => {
          const labelId = `checkbox-list-secondary-label-${server.id}`;

          const checkboxes = Array.from(Array(server.resources).keys());

          return (
            <ListItem
              key={server.id}
              secondaryAction={
                <div>
                  {checkboxes.map((index) => (
                    <Button
                      key={index}
                      onClick={handleToggle(server.id, index)}
                      disabled={!isToggleable(server.id, index)}
                      sx={{ minWidth: 0 }}
                    >
                      {index < server.used_resources || server.isJoined ? (
                        <CoPresentRoundedIcon color="primary" />
                      ) : (
                        <PersonalVideoOutlinedIcon color="primary" />
                      )}
                    </Button>
                  ))}
                  <Button
                    variant="contained"
                    size="small"
                    color={server.isJoined ? 'error' : 'primary'}
                    sx={{ ml: 2 }}
                    onClick={server.isJoined ? handleExit(server) : handleJoin(server)}
                    disabled={server.used_resources === server.resources}
                  >
                    {server.isJoined ? 'Exit' : 'Join'}
                  </Button>
                </div>
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt={`Avatar n°${server.id}`} />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={server.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Alert severity="info">Inactive Servers:</Alert>
      <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {inactiveServers.map((server) => {
          const labelId = `checkbox-list-secondary-label-${server.id}`;

          const checkboxes = Array.from(Array(server.resources).keys());

          return (
            <ListItem
              key={server.id}
              secondaryAction={
                <div>
                  {checkboxes.map((index) => (
                    <Button
                      key={index}
                      onClick={handleToggle(server.id, index)}
                      disabled={!isToggleable(server.id, index)}
                      sx={{ minWidth: 0 }}
                    >
                      {index < server.used_resources || server.isJoined ? (
                        <CoPresentRoundedIcon color="primary" />
                      ) : (
                        <PersonalVideoOutlinedIcon color="primary" />
                      )}
                    </Button>
                  ))}
                </div>
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt={`Avatar n°${server.id}`} />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={server.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Legend */}
      <Alert severity="info" sx={{ mt: 2 }}>
        Legend:
        <ul style={{ paddingLeft: '20px' }}>
          <lo>
            <CoPresentRoundedIcon color="primary" /> Used Resource
          </lo>
          <br></br>
          <lo>
            <PersonalVideoOutlinedIcon color="primary" /> Available Resource
          </lo>
        </ul>
      </Alert>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Exit and Join</DialogTitle>
        <DialogContent>
          <Typography>
            {serverToJoin ? (
              `Are you sure you want to exit ${confirmExitServer && confirmExitServer.name} and join ${serverToJoin && serverToJoin.name}? Please confirm.`
            ) : (
              `Are you sure you want to exit ${confirmExitServer && confirmExitServer.name}? Please confirm.`
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmExit} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
