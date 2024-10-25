// import React, { useRef } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import FullscreenIcon from '@mui/icons-material/Fullscreen';
// import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/Fullscreen';

const OpenSpaceView = ({ selectedServer }) => {
  const iframeRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const handleFullScreenToggle = () => {
    const iframe = iframeRef.current;
    if (!isFullScreen) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) { /* Firefox */
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) { /* IE/Edge */
        iframe.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <>Selected Server: {selectedServer}</>
      <iframe 
        ref={iframeRef}
        src="https://example.com"
        width="100%" 
        height="700px" 
        style={{ border: 'none' }}
        title="OpenSpace"
      />
      <Button 
        variant="contained" 
        onClick={handleFullScreenToggle}
        sx={{ 
          position: 'absolute', 
          top: 36, 
          right: 16, 
          zIndex: 1000 
        }}
      >
        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </Button>
    </Box>
  );
};

// const OpenSpaceView = () => {
//   const iframeRef = useRef(null);
//   const [isFullScreen, setIsFullScreen] = React.useState(false);

//   let selectedServer = "Server 2";
//   const handleFullScreenToggle = () => {
//     const iframe = iframeRef.current;
//     if (!isFullScreen) {
//       if (iframe.requestFullscreen) {
//         iframe.requestFullscreen();
//       } else if (iframe.mozRequestFullScreen) { /* Firefox */
//         iframe.mozRequestFullScreen();
//       } else if (iframe.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
//         iframe.webkitRequestFullscreen();
//       } else if (iframe.msRequestFullscreen) { /* IE/Edge */
//         iframe.msRequestFullscreen();
//       }
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       } else if (document.mozCancelFullScreen) { /* Firefox */
//         document.mozCancelFullScreen();
//       } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
//         document.webkitExitFullscreen();
//       } else if (document.msExitFullscreen) { /* IE/Edge */
//         document.msExitFullscreen();
//       }
//     }
//     setIsFullScreen(!isFullScreen);
//   };

//   return (
//     <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
//         <>Selected Server: {selectedServer}</>
//       <iframe 
//         ref={iframeRef}
//         src="https://example.com"
//         width="100%" 
//         height= '700px' //"100%" 
//         style={{ border: 'none' }}
//         title="OpenSpace"
//       />
//       <Button 
//         variant="contained" 
//         onClick={handleFullScreenToggle}
//         sx={{ 
//           position: 'absolute', 
//           top: 36, 
//           right: 16, 
//           zIndex: 1000 
//         }}
//       >
//         {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
//       </Button>
//     </Box>
//   );
// };

export default OpenSpaceView;
