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

  const handleTaskChange = (e) => {
    setSelectedTask(e.target.value);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const peerConnection = new RTCPeerConnection();
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const response = await fetch('http://52.90.24.44:8000/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sdp: peerConnection.localDescription.sdp,
          type: peerConnection.localDescription.type
        })
      });


      const answer = await response.json();
      await peerConnection.setRemoteDescription(answer);

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

    try {
      await fetch('http://52.90.24.44:8000/stop', { method: 'POST' });
    } catch (error) {
      console.error('Error stopping recording:', error);
    }


    setVideoURL('https://curium-surgicoach.s3.amazonaws.com/recordings/peanut_processed.mp4?AWSAccessKeyId=AKIA5S2HI22XF2QUXNNU&Signature=Cy9YEkRjbm4RXdgHnwjNytlqv%2BI%3D&Expires=1729184145');

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
                  src={undefined}  // Use videoURL if available
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