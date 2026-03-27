import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button, Box, Typography, Paper, Avatar, Zoom, Drawer, AppBar, Toolbar, Container, LinearProgress } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import server from '../environment';

const server_url = server;

var connections = {};

// Track which peers already have our local tracks attached (prevents duplicate addTrack calls)
var tracksAddedForPeer = {};

const ensurePeerConnection = (peerId, socketRef, setVideos, videoRef) => {
    if (connections[peerId]) return connections[peerId];

    const pc = new RTCPeerConnection(peerConfigConnections);
    connections[peerId] = pc;

    pc.onicecandidate = function (event) {
        if (event.candidate != null) {
            socketRef.current.emit('signal', peerId, JSON.stringify({ 'ice': event.candidate }));
        }
    };

    pc.ontrack = (event) => {
        const inboundStream = event.streams && event.streams[0] ? event.streams[0] : null;
        if (!inboundStream) return;

        // Upsert by socketId (prevents duplicate tiles when ontrack fires multiple times)
        setVideos((videos) => {
            const existingIndex = videos.findIndex(v => v.socketId === peerId);
            if (existingIndex >= 0) {
                const updated = videos.map(v => (v.socketId === peerId ? { ...v, stream: inboundStream } : v));
                videoRef.current = updated;
                return updated;
            }

            const newVideo = {
                socketId: peerId,
                stream: inboundStream,
                autoplay: true,
                playsinline: true
            };
            const updated = [...videos, newVideo];
            videoRef.current = updated;
            return updated;
        });
    };

    return pc;
};

const attachLocalTracksOnce = (peerId) => {
    if (!window.localStream || !connections[peerId]) return;
    if (tracksAddedForPeer[peerId]) return;
    tracksAddedForPeer[peerId] = true;
    try {
        window.localStream.getTracks().forEach((track) => {
            connections[peerId].addTrack(track, window.localStream);
        });
    } catch (e) {
        console.log(e);
    }
};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" },
        { "urls": "stun:stun1.l.google.com:19302" },
        { "urls": "stun:stun2.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();
    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState(true);
    let [audio, setAudio] = useState(true);
    let [screen, setScreen] = useState(false);
    let [showModal, setModal] = useState(false);
    let [screenAvailable, setScreenAvailable] = useState(false);
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    let [isConnecting, setIsConnecting] = useState(false);
    const videoRef = useRef([]);
    let [videos, setVideos] = useState([]);
    const participantCount = 1 + videos.length;

    const gridColumns = useMemo(() => {
        if (participantCount <= 1) return 1;
        if (participantCount <= 4) return 2;
        if (participantCount <= 6) return 3;
        return 4;
    }, [participantCount]);
    const [userMap, setUserMap] = useState({});

    const queryName = useMemo(() => {
        try {
            return new URLSearchParams(window.location.search).get('name') || '';
        } catch {
            return '';
        }
    }, []);

    const getPermissions = useCallback(async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoAvailable(Boolean(videoPermission));

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioAvailable(Boolean(audioPermission));

            setScreenAvailable(Boolean(navigator.mediaDevices.getDisplayMedia));
        } catch (error) {
            console.log(error);
        }
    }, []);

    const getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log(e));
        } else {
            try {
                if (localVideoref.current && localVideoref.current.srcObject) {
                    let tracks = localVideoref.current.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                }
            } catch (e) { }
        }
    };

    const getDislayMedia = () => {
        if (screen && navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                .then(getDislayMediaSuccess)
                .catch((e) => console.log(e));
        }
    };

    useEffect(() => {
        getPermissions();

        if (queryName.trim()) {
            setUsername(queryName);
            setAskForUsername(false);
        }

        return () => {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [getPermissions, queryName]);

    useEffect(() => {
        if (video !== undefined && audio !== undefined && !askForUsername) {
            getUserMedia();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video, audio, askForUsername]);

    useEffect(() => {
        // Auto-connect when username already available (e.g., passed from join page).
        if (!askForUsername && username.trim()) {
            getMedia();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [askForUsername, username]);

    const getUserMediaSuccess = (stream) => {
        try {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        } catch (e) { console.log(e); }

        window.localStream = stream;
        // Local stream changed; allow re-attaching tracks to peers if needed
        tracksAddedForPeer = {};
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            try {
                window.localStream.getTracks().forEach((track) => {
                    connections[id].addTrack(track, window.localStream);
                });
            } catch (e) { console.log(e); }
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    })
                    .catch(e => console.log(e));
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);
            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { console.log(e); }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            if (localVideoref.current) {
                localVideoref.current.srcObject = window.localStream;
            }

            for (let id in connections) {
                connections[id].addStream(window.localStream);
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                        })
                        .catch(e => console.log(e));
                });
            }
        });
    };

    const getDislayMediaSuccess = (stream) => {
        try {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        } catch (e) { console.log(e); }

        window.localStream = stream;
        // Local stream changed; allow re-attaching tracks to peers if needed
        tracksAddedForPeer = {};
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            try {
                window.localStream.getTracks().forEach((track) => {
                    connections[id].addTrack(track, window.localStream);
                });
            } catch (e) { console.log(e); }
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    })
                    .catch(e => console.log(e));
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);
            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { console.log(e); }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            if (localVideoref.current) {
                localVideoref.current.srcObject = window.localStream;
            }
            getUserMedia();
        });
    };

    const gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);
        if (fromId !== socketIdRef.current) {
            if (!connections[fromId]) {
                ensurePeerConnection(
                    fromId,
                    socketRef,
                    setVideos,
                    videoRef
                );

                attachLocalTracksOnce(fromId);
            }
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }));
                            }).catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }).catch(e => console.log(e));
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    };

    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });
        socketRef.current.on('signal', gotMessageFromServer);
        socketRef.current.on('connect', () => {
            // IMPORTANT: use a stable room id (meeting code) that doesn't change per-user.
            // window.location.href includes query params like ?name= which would split users into different rooms.
            const roomId = window.location.pathname; // e.g. "/MAHA-ABCD"
            // Send both roomId and the user's chosen name so the backend can broadcast a user map.
            socketRef.current.emit('join-call', { roomId, name: username });
            socketIdRef.current = socketRef.current.id;
            socketRef.current.on('chat-message', addMessage);
            socketRef.current.on('user-map', (map) => {
                if (map && typeof map === 'object') {
                    setUserMap(map);
                }
            });
            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
                setUserMap((prev) => {
                    if (!prev || typeof prev !== 'object') return prev;
                    if (!(id in prev)) return prev;
                    const next = { ...prev };
                    delete next[id];
                    return next;
                });
            });
            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    // Don't create a peer connection / tile for yourself
                    if (socketListId === socketIdRef.current) return;
                    ensurePeerConnection(
                        socketListId,
                        socketRef,
                        setVideos,
                        videoRef
                    );

                    if (window.localStream === undefined || window.localStream === null) {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                    }

                    attachLocalTracksOnce(socketListId);
                });
                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;
                        attachLocalTracksOnce(id2);
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }));
                                })
                                .catch(e => console.log(e));
                        });
                    }
                }
            });
        });
    };

    const silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    };

    const black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    };

    const handleVideo = () => {
        setVideo(!video);
        if (localVideoref.current && localVideoref.current.srcObject) {
            const videoTrack = localVideoref.current.srcObject.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !video;
            }
        }
    };

    const handleAudio = () => {
        setAudio(!audio);
        if (localVideoref.current && localVideoref.current.srcObject) {
            const audioTrack = localVideoref.current.srcObject.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audio;
            }
        }
    };

    const handleScreen = () => {
        setScreen(!screen);
    };

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen]);

    const handleEndCall = () => {
        try {
            if (window.localStream) {
                let tracks = window.localStream.getTracks();
                tracks.forEach(track => track.stop());
            }
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        } catch (e) { }
        window.location.href = "/home";
    };

    const handleMessage = (e) => {
        setMessage(e.target.value);
    };

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data, timestamp: new Date() }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    const sendMessage = () => {
        if (message.trim()) {
            socketRef.current.emit('chat-message', message, username);
            setMessage("");
        }
    };

    const connect = () => {
        if (username.trim()) {
            setIsConnecting(true);
            setAskForUsername(false);
            setTimeout(() => {
                getMedia();
                setIsConnecting(false);
            }, 1000);
        }
    };

    const getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };


    return (
        <Box sx={{ height: '100vh', background: '#0a0e1a', position: 'relative', overflow: 'hidden' }}>
            {askForUsername === true ? (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1322 100%)'
                }}>
                    <Zoom in={true}>
                        <Paper sx={{
                            p: 5,
                            borderRadius: '32px',
                            background: 'rgba(15, 19, 34, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,152,57,0.3)',
                            textAlign: 'center',
                            maxWidth: 450,
                            width: '90%'
                        }}>
                            <Box sx={{ mb: 3 }}>
                                <Avatar sx={{
                                    width: 80,
                                    height: 80,
                                    background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                                    margin: '0 auto',
                                    mb: 2
                                }}>
                                    <MeetingRoomIcon sx={{ fontSize: 40 }} />
                                </Avatar>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                                    Join Meeting
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Enter your name to continue
                                </Typography>
                            </Box>

                            <TextField
                                fullWidth
                                label="Your Name"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && connect()}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <PersonIcon sx={{ mr: 1, color: '#FF9839' }} />,
                                    sx: {
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        '& fieldset': { borderColor: 'rgba(255,152,57,0.3)' }
                                    }
                                }}
                                sx={{ mb: 3 }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={connect}
                                disabled={!username.trim() || isConnecting}
                                sx={{
                                    background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                                    borderRadius: '12px',
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    '&:hover': { transform: 'translateY(-2px)' }
                                }}
                            >
                                {isConnecting ? 'Connecting...' : 'Join Meeting'}
                            </Button>

                            {isConnecting && <LinearProgress sx={{ mt: 2, borderRadius: '10px', bgcolor: 'rgba(255,152,57,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#FF9839' } }} />}

                            <Box sx={{ mt: 3 }}>
                                <video ref={localVideoref} autoPlay muted style={{
                                    width: '100%',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,152,57,0.3)'
                                }} />
                            </Box>
                        </Paper>
                    </Zoom>
                </Box>
            ) : (
                <>
                    {/* Video Grid */}
                    <Box sx={{ height: '100vh', position: 'relative', bgcolor: '#000' }}>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: `repeat(${Math.min(gridColumns, 2)}, minmax(0, 1fr))`,
                                md: `repeat(${Math.min(gridColumns, 3)}, minmax(0, 1fr))`,
                                lg: `repeat(${gridColumns}, minmax(0, 1fr))`
                            },
                            gap: 2,
                            p: 2,
                            height: 'calc(100vh - 80px)',
                            overflow: 'auto',
                            justifyContent: 'center',
                            justifyItems: 'center'
                        }}>
                            {/* Local Video */}
                            <Paper elevation={0} sx={{
                                position: 'relative',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                bgcolor: '#1a1f2e',
                                aspectRatio: '16/9',
                                width: '100%',
                                maxWidth: { xs: '100%', sm: 520, md: 520, lg: 520 },
                                minHeight: { xs: 220, sm: 240, md: 260 },
                                '& video': {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }
                            }}>
                                <video ref={localVideoref} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 12,
                                    left: 12,
                                    bgcolor: 'rgba(0,0,0,0.6)',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <FiberManualRecordIcon sx={{ fontSize: 12, color: '#4ade80' }} />
                                    <Typography variant="caption" sx={{ color: 'white' }}>
                                        You {!video && '(Video Off)'} {!audio && '(Muted)'}
                                    </Typography>
                                </Box>
                            </Paper>

                            {/* Remote Videos */}
                            {videos.map((video, index) => (
                                <Paper key={video.socketId} elevation={0} sx={{
                                    position: 'relative',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    bgcolor: '#1a1f2e',
                                    aspectRatio: '16/9',
                                    width: '100%',
                                    maxWidth: { xs: '100%', sm: 520, md: 520, lg: 520 },
                                    minHeight: { xs: 220, sm: 240, md: 260 },
                                    '& video': {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }
                                }}>
                                    <video
                                        ref={ref => {
                                            if (ref && video.stream) {
                                                ref.srcObject = video.stream;
                                            }
                                        }}
                                        autoPlay
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 12,
                                        left: 12,
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: '20px'
                                    }}>
                                            <Typography variant="caption" sx={{ color: 'white' }}>
                                                {userMap[video.socketId] || `Participant ${index + 1}`}
                                        </Typography>
                                    </Box>
                                </Paper>
                            ))}

                            {videos.length === 0 && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    color: 'rgba(255,255,255,0.5)'
                                }}>
                                    <Typography>Waiting for others to join...</Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Control Bar */}
                        <AppBar position="fixed" bottom="0" sx={{
                            top: 'auto',
                            bottom: 0,
                            background: 'rgba(10, 14, 26, 0.95)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
                        }}>
                            <Container maxWidth="md">
                                <Toolbar sx={{ justifyContent: 'center', gap: 2, py: 1 }}>
                                    <IconButton
                                        onClick={handleVideo}
                                        sx={{
                                            bgcolor: video ? 'rgba(255,255,255,0.1)' : '#ef4444',
                                            '&:hover': { bgcolor: video ? 'rgba(255,255,255,0.2)' : '#dc2626' },
                                            border: '1px solid rgba(255,255,255,0.16)',
                                            color: 'white',
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        {video ? <VideocamIcon /> : <VideocamOffIcon />}
                                    </IconButton>

                                    <IconButton
                                        onClick={handleAudio}
                                        sx={{
                                            bgcolor: audio ? 'rgba(255,255,255,0.1)' : '#ef4444',
                                            '&:hover': { bgcolor: audio ? 'rgba(255,255,255,0.2)' : '#dc2626' },
                                            border: '1px solid rgba(255,255,255,0.16)',
                                            color: 'white',
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        {audio ? <MicIcon /> : <MicOffIcon />}
                                    </IconButton>

                                    <IconButton
                                        onClick={handleEndCall}
                                        sx={{
                                            bgcolor: '#ef4444',
                                            '&:hover': { bgcolor: '#dc2626' },
                                            border: '1px solid rgba(255,255,255,0.22)',
                                            color: 'white',
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        <CallEndIcon />
                                    </IconButton>

                                    {screenAvailable && (
                                        <IconButton
                                            onClick={handleScreen}
                                            sx={{
                                                bgcolor: screen ? '#FF9839' : 'rgba(255,255,255,0.1)',
                                                '&:hover': { bgcolor: screen ? '#FF6B2C' : 'rgba(255,255,255,0.2)' },
                                                border: '1px solid rgba(255,255,255,0.16)',
                                                color: 'white',
                                                width: 48,
                                                height: 48
                                            }}
                                        >
                                            {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                                        </IconButton>
                                    )}

                                    <Badge badgeContent={newMessages} color="error" max={99}>
                                        <IconButton
                                            onClick={() => setModal(!showModal)}
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.1)',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                                                border: '1px solid rgba(255,255,255,0.16)',
                                                color: 'white',
                                                width: 48,
                                                height: 48
                                            }}
                                        >
                                            <ChatIcon />
                                        </IconButton>
                                    </Badge>

                                    <IconButton
                                        onClick={toggleFullscreen}
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                                            border: '1px solid rgba(255,255,255,0.16)',
                                            color: 'white',
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        <FullscreenIcon />
                                    </IconButton>

                                </Toolbar>
                            </Container>
                        </AppBar>
                    </Box>

                    {/* Chat Drawer */}
                    <Drawer
                        anchor="right"
                        open={showModal}
                        onClose={() => setModal(false)}
                        PaperProps={{
                            sx: {
                                width: { xs: '100%', sm: 400 },
                                background: 'rgba(15, 19, 34, 0.98)',
                                backdropFilter: 'blur(20px)',
                                borderLeft: '1px solid rgba(255,152,57,0.2)'
                            }
                        }}
                    >
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{
                                p: 2,
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                    Meeting Chat
                                </Typography>
                                <IconButton onClick={() => setModal(false)} sx={{ color: 'white' }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{
                                flex: 1,
                                overflow: 'auto',
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                {messages.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                                        <ChatIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                                        <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            No messages yet
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                                            Start the conversation
                                        </Typography>
                                    </Box>
                                ) : (
                                    messages.map((msg, idx) => (
                                        <Box key={idx} sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: msg.sender === username ? 'flex-end' : 'flex-start'
                                        }}>
                                            <Paper sx={{
                                                maxWidth: '80%',
                                                p: 1.5,
                                                bgcolor: msg.sender === username ? 'rgba(255,152,57,0.2)' : 'rgba(255,255,255,0.1)',
                                                borderRadius: '16px'
                                            }}>
                                                <Typography variant="caption" sx={{ color: '#FF9839', fontWeight: 600, mb: 0.5, display: 'block' }}>
                                                    {msg.sender}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'white', wordBreak: 'break-word' }}>
                                                    {msg.data}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 0.5 }}>
                                                    {msg.timestamp?.toLocaleTimeString() || new Date().toLocaleTimeString()}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    ))
                                )}
                            </Box>

                            <Box sx={{
                                p: 2,
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                gap: 1
                            }}>
                                <TextField
                                    fullWidth
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={handleMessage}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        '& .MuiInputBase-input': { color: 'white' },
                                        '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.45)', opacity: 1 },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,152,57,0.3)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,152,57,0.55)' },
                                            '&.Mui-focused fieldset': { borderColor: '#FF9839' }
                                        }
                                    }}
                                />
                                <IconButton
                                    onClick={sendMessage}
                                    sx={{
                                        bgcolor: '#FF9839',
                                        '&:hover': { bgcolor: '#FF6B2C' },
                                        width: 40,
                                        height: 40
                                    }}
                                >
                                    <SendIcon sx={{ fontSize: 20, color: 'white' }} />
                                </IconButton>
                            </Box>
                        </Box>
                    </Drawer>
                </>
            )}
        </Box>
    );
}