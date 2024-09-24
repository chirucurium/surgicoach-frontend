import React, { useState, useRef } from 'react';
import { Box, Typography, Card, CardContent, Button, Select, MenuItem } from '@mui/material';
import Sidebar from './Sidebar';
import { Videocam } from '@mui/icons-material';
import Footer from './Footer';
import Watermark from './Watermark';


const PracticeTasks = () => {
  const [selectedTask, setSelectedTask] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const videoRef = useRef(null);
  const [pc, setPc] = useState(null);
  const [pcId, setPcId] = useState(null);
  let peerConnection;
  

  const handleTaskChange = (e) => {
    setSelectedTask(e.target.value);
  };

  const configuration = {
    iceServers: [
        {urls: 'stun:stun.l.google.com:19302'}
    ]
};


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      peerConnection = new RTCPeerConnection(configuration);
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const ws = new WebSocket('ws://surgaidemo.curium.life:8000/ws');
      
      ws.onopen = function() {
          ws.send(JSON.stringify({
              type: 'offer',
              sdp: peerConnection.localDescription.sdp
          }));
      };

      ws.onmessage = async function(event) {
          const message = JSON.parse(event.data);
          if (message.type === 'answer') {
              const remoteDesc = new RTCSessionDescription(message);
              await peerConnection.setRemoteDescription(remoteDesc);
              setPcId(message.pc_id);
              
          }
      };

      setPc(peerConnection);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (pc) {
      pc.close();
    }
    if (videoRef.current && videoRef.current.srcObject) {

      videoRef.current.srcObject.getTracks().forEach(track => track.stop());

      videoRef.current.srcObject = null;
    }
    console.log(pcId)
    if (pcId) {
        try {
            const response = await fetch(`http://surgaidemo.curium.life:8000/stop-recording/${pcId}`, { method: 'POST' });
            const data = await response.json();
            console.log(data.presigned_url)
            setVideoURL(data.presigned_url);
            // setVideoURL('https://curium-surgicoach.s3.amazonaws.com/recordings/peanut_processed.mp4?AWSAccessKeyId=AKIA5S2HI22XF2QUXNNU&Signature=Cy9YEkRjbm4RXdgHnwjNytlqv%2BI%3D&Expires=1729184145')
            // playbackLink.innerHTML = `<a href="${data.presigned_url}" target="_blank">Click here to play your recorded video</a>`;
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
        finally {
          setPcId(null);
        }
    }

    setIsRecording(false);
  };

  return (
    <>
     <Watermark /> {/* Add Watermark */}
    <Sidebar>
      <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            marginBottom: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            marginTop: '50px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              whiteSpace: 'nowrap',
              minWidth: '150px',
              fontSize: '16px',
            }}
          >
            Select Task
          </Typography>
          <Select
            value={selectedTask}
            onChange={handleTaskChange}
            variant="outlined"
            fullWidth
            sx={{
              flexGrow: 1,
              minWidth: '200px',
            }}
          >
            <MenuItem value="" disabled>
              Select Task
            </MenuItem>
            <MenuItem value="peanut_transfer">Peanut Transfer</MenuItem>
            <MenuItem value="pegs_transfer">Pegs Transfer</MenuItem>
            <MenuItem value="suture">Suture</MenuItem>
          </Select>


          {isRecording ? (
            <Button
              variant="contained"
              color="error"
              onClick={stopRecording}
              sx={{
                fontSize: '1rem',
                padding: '10px 20px',
                minWidth: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1.2',
              }}
            >
              Stop Recording
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={startRecording}
              sx={{
                fontSize: '1rem',
                padding: '10px 20px',
                minWidth: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1.2',
              }}
            >
              Start Recording
            </Button>
          )}
        </Box>

        {/* Outer wrapper for video */}
        <Card sx={{ width: '100%', maxWidth: '80%', height: '80%', boxShadow: 3 }}>
          <CardContent sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              {/* Icon and Title */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Videocam sx={{ fontSize: 40, marginRight: 1 }} />
                <Typography variant="h6">Record Your Activity</Typography>
              </Box>

              {/* Video Section */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: videoURL ? 'black' : 'transparent',
                }}
              >
                <video
                  ref={videoRef}
                  src={videoURL || undefined}  // Use videoURL if available
                  autoPlay={isRecording && !videoURL} // Only autoPlay when recording
                  controls={!!videoURL} // Show controls only for the static video
                  muted={isRecording} // Mute during recording
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                ></video>

                {!isRecording && !videoURL && (
                  <Box
                    sx={{
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: '2px dotted rgba(0, 0, 0, 0.5)',
                      boxSizing: 'border-box',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Videocam
                      sx={{
                        fontSize: 40,
                        color: 'rgba(0, 0, 0, 0.5)',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Sidebar>
    <Footer/>
    </>
  );
};

export default PracticeTasks;