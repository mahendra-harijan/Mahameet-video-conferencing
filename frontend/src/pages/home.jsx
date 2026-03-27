import React, { useContext, useState, useEffect } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField, Avatar, Menu, MenuItem, Divider, Box, Typography, Chip, Fade, Zoom, Paper, InputAdornment, Container, Grid, Card, CardContent, LinearProgress } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import HistoryIcon from '@mui/icons-material/History';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [recentMeetings, setRecentMeetings] = useState([]);
    const [isJoining, setIsJoining] = useState(false);
    const [copied, setCopied] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [newMeetingName, setNewMeetingName] = useState("");
    const [createdOpen, setCreatedOpen] = useState(false);
    const [createdMeetingCode, setCreatedMeetingCode] = useState("");
    const [createdMeetingName, setCreatedMeetingName] = useState("");
    const [createdCopied, setCreatedCopied] = useState(false);

    const { addToUserHistory } = useContext(AuthContext);

    const [authSnapshot, setAuthSnapshot] = useState({
        token: localStorage.getItem('token'),
        user: (() => {
            try {
                const raw = localStorage.getItem('user');
                return raw ? JSON.parse(raw) : null;
            } catch {
                return null;
            }
        })()
    });

    const isLoggedIn = Boolean(authSnapshot.token && authSnapshot.user);

    useEffect(() => {
        const refreshAuthSnapshot = () => {
            setAuthSnapshot({
                token: localStorage.getItem('token'),
                user: (() => {
                    try {
                        const raw = localStorage.getItem('user');
                        return raw ? JSON.parse(raw) : null;
                    } catch {
                        return null;
                    }
                })()
            });
        };

        // Keep header in sync after login/logout within the same tab
        window.addEventListener('focus', refreshAuthSnapshot);

        // Get user details
        if (authSnapshot.user) {
            setUserName(authSnapshot.user.name || authSnapshot.user.username || "User");
            setUserEmail(authSnapshot.user.email || `${authSnapshot.user.username || 'user'}@example.com`);
        } else {
            setUserName("Guest");
            setUserEmail("");
        }
        
        // Load recent meetings from localStorage
        const loadRecentMeetings = () => {
            const history = localStorage.getItem("meetingHistory");
            if (history) {
                const parsedHistory = JSON.parse(history);
                setRecentMeetings(parsedHistory.slice(0, 5));
            } else {
                // Demo meetings
                setRecentMeetings([
                    { id: 1, code: "MEET-ABC123", date: "Today, 2:30 PM", duration: "45 min" },
                    { id: 2, code: "TEAM-DEV789", date: "Yesterday, 11:00 AM", duration: "1 hour" },
                    { id: 3, code: "FAMILY-JAN", date: "Jan 15, 2024", duration: "30 min" }
                ]);
            }
        };
        loadRecentMeetings();

        return () => {
            window.removeEventListener('focus', refreshAuthSnapshot);
        };
    }, [authSnapshot.user]);

    const handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) {
            alert("Please enter a meeting code");
            return;
        }

        if (!userName.trim()) {
            alert("Please enter your name");
            return;
        }
        
        setIsJoining(true);
        try {
            await addToUserHistory(meetingCode);
            // Save to localStorage
            const history = localStorage.getItem("meetingHistory");
            const meetingHistory = history ? JSON.parse(history) : [];
            meetingHistory.unshift({
                id: Date.now(),
                code: meetingCode,
                date: new Date().toLocaleString(),
                duration: "0 min"
            });
            localStorage.setItem("meetingHistory", JSON.stringify(meetingHistory.slice(0, 10)));
            
            setTimeout(() => {
                navigate(`/join?code=${encodeURIComponent(meetingCode)}&name=${encodeURIComponent(userName)}`);
            }, 500);
        } catch (error) {
            console.error("Error joining meeting:", error);
            setIsJoining(false);
        }
    };

    const handleCreateNewMeeting = () => {
        if (!isLoggedIn) {
            alert('Please login to create a new meeting');
            navigate('/auth');
            return;
        }
        setNewMeetingName("");
        setCreateOpen(true);
    };

    const generateMeetingCode = () => {
        const prefix = "MAHA";
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${random}`;
    };

    const handleCreateMeetingConfirm = () => {
        const meetingName = newMeetingName.trim();
        if (!meetingName) {
            alert('Please enter a meeting name');
            return;
        }
        if (!userName.trim()) {
            alert('Please enter your name');
            return;
        }

        const newMeetingCode = generateMeetingCode();
        // Save to localStorage for history/UX purposes
        const history = localStorage.getItem("meetingHistory");
        const meetingHistory = history ? JSON.parse(history) : [];
        meetingHistory.unshift({
            id: Date.now(),
            code: newMeetingCode,
            name: meetingName,
            date: new Date().toLocaleString(),
            duration: "0 min"
        });
        localStorage.setItem("meetingHistory", JSON.stringify(meetingHistory.slice(0, 10)));

        setCreateOpen(false);
        setCreatedMeetingCode(newMeetingCode);
        setCreatedMeetingName(meetingName);
        setCreatedCopied(false);
        setCreatedOpen(true);
    };

    const handleCopyCreatedCode = async () => {
        try {
            await navigator.clipboard.writeText(createdMeetingCode);
            setCreatedCopied(true);
            setTimeout(() => setCreatedCopied(false), 1500);
        } catch (e) {
            console.error('Copy failed', e);
            alert('Copy failed. Please copy manually.');
        }
    };

    const handleStartCreatedMeeting = () => {
        if (!createdMeetingCode) return;
        setCreatedOpen(false);
        navigate(`/${encodeURIComponent(createdMeetingCode)}?name=${encodeURIComponent(userName)}`);
    };

    const handleCopySampleCode = () => {
        const sampleCode = "MAHA-2024";
        navigator.clipboard.writeText(sampleCode);
        setCopied(true);
        setMeetingCode(sampleCode);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("meetingHistory");
        navigate("/auth");
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleQuickJoin = (code) => {
        setMeetingCode(code);
        setTimeout(() => handleJoinVideoCall(), 100);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1322 100%)',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            {/* Animated Background Elements */}
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
                <Box sx={{ position: 'absolute', top: '-200px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,152,57,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 20s infinite' }} />
                <Box sx={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 25s infinite reverse' }} />
                <Box sx={{ position: 'absolute', top: '50%', right: '20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 18s infinite' }} />
            </Box>

            {/* Navigation */}
            <Paper elevation={0} sx={{ 
                background: 'rgba(10, 14, 26, 0.95)', 
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,152,57,0.2)',
                borderRadius: 0,
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
                            <Box sx={{ 
                                width: 48, 
                                height: 48, 
                                background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 20px rgba(255,152,57,0.3)'
                            }}>
                                <VideoCallIcon sx={{ fontSize: 28, color: 'white' }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
                                    Maha<span style={{ color: '#FF9839' }}>Meet</span>
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                    Connect Beyond Boundaries
                                </Typography>
                            </Box>
                        </Box>

                        {/* Navigation Links */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {isLoggedIn && (
                                <Button 
                                    variant="text" 
                                    startIcon={<HistoryIcon />}
                                    onClick={() => navigate("/history")}
                                    sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#FF9839' } }}
                                >
                                    History
                                </Button>
                            )}
                            
                            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                                <Avatar sx={{ 
                                    bgcolor: '#FF9839',
                                    width: 40,
                                    height: 40,
                                    transition: 'all 0.3s',
                                    '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 20px rgba(255,152,57,0.5)' }
                                }}>
                                    {(userName || 'G').charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                            
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: {
                                        mt: 1.5,
                                        background: 'rgba(15, 19, 34, 0.98)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,152,57,0.2)',
                                        borderRadius: '16px',
                                        minWidth: 280
                                    }
                                }}
                            >
                                <MenuItem sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                        <Avatar sx={{ bgcolor: '#FF9839', width: 48, height: 48 }}>{(userName || 'G').charAt(0).toUpperCase()}</Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>{userName}</Typography>
                                            {isLoggedIn ? (
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{userEmail}</Typography>
                                            ) : (
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Guest</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </MenuItem>
                                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                <MenuItem disabled sx={{ opacity: 1 }}>
                                    <AccountCircleIcon sx={{ mr: 1.5, fontSize: 20, color: 'rgba(255,255,255,0.7)' }} />
                                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                        {isLoggedIn ? (authSnapshot.user?.id || authSnapshot.user?._id || authSnapshot.user?.username || 'User') : 'Guest'}
                                    </Typography>
                                </MenuItem>
                                {isLoggedIn && (
                                    <MenuItem onClick={() => { navigate("/history"); handleMenuClose(); }}>
                                        <HistoryIcon sx={{ mr: 1.5, fontSize: 20 }} />
                                        Meeting History
                                    </MenuItem>
                                )}
                                {isLoggedIn && (
                                    <MenuItem onClick={handleLogout}>
                                        <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: '#ef4444' }} />
                                        <Typography sx={{ color: '#ef4444' }}>Logout</Typography>
                                    </MenuItem>
                                )}
                            </Menu>
                        </Box>
                    </Box>
                </Container>
            </Paper>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
                <Grid container spacing={6} alignItems="center">
                    {/* Left Content */}
                    <Grid item xs={12} md={6}>
                        <Fade in={true} timeout={800}>
                            <Box>
                                <Chip 
                                    icon={<VideoCallIcon sx={{ fontSize: 16 }} />}
                                    label="HD Video Calls • Free • Secure"
                                    sx={{
                                        bgcolor: 'rgba(255,152,57,0.15)',
                                        color: '#FF9839',
                                        border: '1px solid rgba(255,152,57,0.3)',
                                        borderRadius: '50px',
                                        mb: 3,
                                        '& .MuiChip-icon': { color: '#FF9839' }
                                    }}
                                />
                                
                                <Typography variant="h1" sx={{ 
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    fontWeight: 800,
                                    color: 'white',
                                    lineHeight: 1.2,
                                    mb: 2
                                }}>
                                    Premium Video Calls
                                    <br />
                                    <span style={{ background: 'linear-gradient(135deg, #FF9839, #FF6B2C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        Made Simple
                                    </span>
                                </Typography>
                                
                                <Typography variant="body1" sx={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    fontSize: '1.1rem',
                                    lineHeight: 1.6,
                                    mb: 4
                                }}>
                                    Experience crystal-clear video calls with MahaMeet. 
                                    Join meetings instantly or create your own. No downloads, 
                                    no hassle – just pure connection.
                                </Typography>

                                {/* Stats */}
                                <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ color: '#FF9839', fontWeight: 700 }}>10K+</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Active Users</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" sx={{ color: '#FF9839', fontWeight: 700 }}>99.9%</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Uptime</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" sx={{ color: '#FF9839', fontWeight: 700 }}>150+</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Countries</Typography>
                                    </Box>
                                </Box>

                                {/* Join Input */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Meeting code"
                                        value={meetingCode}
                                        onChange={e => setMeetingCode(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleJoinVideoCall()}
                                        placeholder="e.g., MAHA-2024"
                                        variant="outlined"
                                        disabled={isJoining}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MeetingRoomIcon sx={{ color: '#FF9839' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiInputBase-input': { color: 'white' },
                                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#FF9839' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '20px',
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                '& fieldset': { borderColor: 'rgba(255,152,57,0.25)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255,152,57,0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#FF9839' },
                                            },
                                            '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Your name"
                                        value={userName}
                                        onChange={e => setUserName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleJoinVideoCall()}
                                        placeholder="Enter your name"
                                        variant="outlined"
                                        disabled={isJoining}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircleIcon sx={{ color: '#FF9839' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiInputBase-input': { color: 'white' },
                                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#FF9839' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '20px',
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                '& fieldset': { borderColor: 'rgba(255,152,57,0.25)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255,152,57,0.5)' },
                                                '&.Mui-focused fieldset': { borderColor: '#FF9839' },
                                            },
                                            '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                                        }}
                                    />

                                    <Button
                                        variant="contained"
                                        onClick={handleJoinVideoCall}
                                        disabled={!meetingCode.trim() || !userName.trim() || isJoining}
                                        sx={{
                                            background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                                            borderRadius: '16px',
                                            py: 1.5,
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(255,152,57,0.4)'
                                            }
                                        }}
                                    >
                                        {isJoining ? 'Joining...' : 'Join Meeting'}
                                    </Button>
                                </Box>
                                
                                {isJoining && <LinearProgress sx={{ mt: 1, borderRadius: '10px', bgcolor: 'rgba(255,152,57,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#FF9839' } }} />}

                                {/* Action Buttons */}
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleCreateNewMeeting}
                                        startIcon={<VideoCallIcon />}
                                        sx={{
                                            borderColor: 'rgba(255,152,57,0.5)',
                                            color: '#FF9839',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            '&:hover': {
                                                borderColor: '#FF9839',
                                                background: 'rgba(255,152,57,0.1)'
                                            }
                                        }}
                                    >
                                        New Meeting
                                    </Button>
                                    <Button
                                        variant="text"
                                        onClick={handleCopySampleCode}
                                        startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                                        sx={{
                                            color: 'rgba(255,255,255,0.7)',
                                            textTransform: 'none',
                                            '&:hover': {
                                                color: '#FF9839',
                                                background: 'rgba(255,152,57,0.1)'
                                            }
                                        }}
                                    >
                                        {copied ? 'Copied!' : 'Try Sample Code'}
                                    </Button>
                                </Box>

                                <Dialog
                                    open={createOpen}
                                    onClose={() => setCreateOpen(false)}
                                    PaperProps={{
                                        sx: {
                                            background: 'rgba(15, 19, 34, 0.98)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,152,57,0.2)',
                                            borderRadius: '20px',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    <DialogTitle sx={{ fontWeight: 700 }}>New Meeting</DialogTitle>
                                    <DialogContent>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                                            Enter a meeting name. A meeting code will be generated.
                                        </Typography>
                                        <TextField
                                            autoFocus
                                            fullWidth
                                            label="Meeting name"
                                            value={newMeetingName}
                                            onChange={(e) => setNewMeetingName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCreateMeetingConfirm()}
                                            variant="outlined"
                                            inputProps={{
                                                style: { color: 'white' },
                                            }}
                                            InputLabelProps={{
                                                style: { color: 'rgba(255,255,255,0.65)' },
                                            }}
                                            placeholder="e.g., Team Standup"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                    borderRadius: '16px',
                                                    '& fieldset': { borderColor: 'rgba(255,152,57,0.25)' },
                                                    '&:hover fieldset': { borderColor: 'rgba(255,152,57,0.5)' },
                                                    '&.Mui-focused fieldset': { borderColor: '#FF9839' },
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': { color: '#FF9839' },
                                                '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                                            }}
                                        />
                                    </DialogContent>
                                    <DialogActions sx={{ px: 3, pb: 2 }}>
                                        <Button onClick={() => setCreateOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleCreateMeetingConfirm}
                                            sx={{
                                                background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontWeight: 700,
                                            }}
                                        >
                                            Create
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                                <Dialog
                                    open={createdOpen}
                                    onClose={() => setCreatedOpen(false)}
                                    PaperProps={{
                                        sx: {
                                            background: 'rgba(15, 19, 34, 0.98)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,152,57,0.2)',
                                            borderRadius: '20px',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    <DialogTitle sx={{ fontWeight: 800 }}>Meeting Created</DialogTitle>
                                    <DialogContent>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                                            Share this code so others can join:
                                        </Typography>

                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: '16px',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,152,57,0.25)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 2,
                                                mb: 1.5
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                                                    {createdMeetingName || 'New meeting'}
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 900, letterSpacing: '0.04em' }}>
                                                    {createdMeetingCode}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                onClick={handleCopyCreatedCode}
                                                startIcon={createdCopied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                                                sx={{
                                                    borderColor: 'rgba(255,152,57,0.5)',
                                                    color: createdCopied ? '#10b981' : '#FF9839',
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    '&:hover': {
                                                        borderColor: '#FF9839',
                                                        background: 'rgba(255,152,57,0.1)'
                                                    }
                                                }}
                                            >
                                                {createdCopied ? 'Copied' : 'Copy'}
                                            </Button>
                                        </Paper>

                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            Tip: You can paste this code on the Join page.
                                        </Typography>
                                    </DialogContent>
                                    <DialogActions sx={{ px: 3, pb: 2 }}>
                                        <Button onClick={() => setCreatedOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                            Close
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleStartCreatedMeeting}
                                            sx={{
                                                background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontWeight: 800,
                                            }}
                                        >
                                            Start Meeting
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                                {/* Trust Badge */}
                               
                            </Box>
                        </Fade>
                    </Grid>

                    {/* Right Content - Video Preview */}
                    <Grid item xs={12} md={6}>
                        <Zoom in={true} timeout={1000}>
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{
                                    position: 'absolute',
                                    top: -20,
                                    right: -20,
                                    background: 'rgba(255,152,57,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    zIndex: 2
                                }}>
                                    <Box sx={{ width: 8, height: 8, bgcolor: '#4ade80', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                                    <Typography variant="caption">Live Demo</Typography>
                                </Box>
                                
                                <Card sx={{
                                    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95), rgba(15, 19, 34, 0.95))',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '32px',
                                    border: '1px solid rgba(255,152,57,0.3)',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    animation: 'float 3s ease-in-out infinite'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <Avatar sx={{ width: 64, height: 64, background: 'linear-gradient(135deg, #FF9839, #FF6B2C)' }}>
                                                <VideoCallIcon sx={{ fontSize: 32 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>Active Call</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{ width: 8, height: 8, bgcolor: '#4ade80', borderRadius: '50%' }} />
                                                    <Typography variant="caption" sx={{ color: '#4ade80' }}>Connected</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                                            {[1,2,3].map((i) => (
                                                <Avatar key={i} sx={{ width: 80, height: 80, border: '2px solid #FF9839' }}>
                                                    <AccountCircleIcon sx={{ fontSize: 50 }} />
                                                </Avatar>
                                            ))}
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                            <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                                                <i className="fas fa-microphone"></i>
                                            </IconButton>
                                            <IconButton sx={{ bgcolor: 'rgba(255,152,57,0.3)', border: '1px solid #FF9839', '&:hover': { bgcolor: 'rgba(255,152,57,0.4)' } }}>
                                                <i className="fas fa-video"></i>
                                            </IconButton>
                                            <IconButton sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}>
                                                <i className="fas fa-phone-slash"></i>
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Zoom>
                    </Grid>
                </Grid>
            </Container>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 2 }}>
                        Why Choose <span style={{ color: '#FF9839' }}>MahaMeet</span>?
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, mx: 'auto' }}>
                        Experience the future of communication with our cutting-edge features
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {[
                        { icon: <VideoCallIcon />, title: 'HD Quality', desc: '1080p HD video with adaptive bitrate for smooth calls' },
                        { icon: <SecurityIcon />, title: 'End-to-End Encrypted', desc: 'Your conversations stay completely private and secure' },
                        { icon: <SpeedIcon />, title: 'Low Latency', desc: 'Real-time communication with minimal delay' },
                        { icon: <PeopleIcon />, title: '100 Participants', desc: 'Host large meetings with up to 100 participants' },
                        { icon: <ScheduleIcon />, title: 'Record Meetings', desc: 'Record and save important conversations' },
                        { icon: <LinkIcon />, title: 'Easy Sharing', desc: 'Share meeting links with one click' }
                    ].map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Fade in={true} timeout={1000 + index * 100}>
                                <Card sx={{
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(255,152,57,0.1)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        borderColor: 'rgba(255,152,57,0.3)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                    }
                                }}>
                                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                        <Box sx={{
                                            width: 70,
                                            height: 70,
                                            background: 'linear-gradient(135deg, rgba(255,152,57,0.2), rgba(255,107,44,0.2))',
                                            borderRadius: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 1.5rem',
                                            color: '#FF9839'
                                        }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                            {feature.desc}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Recent Meetings Section */}
            {recentMeetings.length > 0 && (
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4, pb: 8 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HistoryIcon sx={{ color: '#FF9839' }} />
                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>Recent Meetings</Typography>
                        </Box>
                        <Button 
                            variant="text" 
                            onClick={() => navigate("/history")}
                            sx={{ color: '#FF9839', textTransform: 'none' }}
                        >
                            View All
                        </Button>
                    </Box>
                    
                    <Grid container spacing={2}>
                        {recentMeetings.map((meeting, index) => (
                            <Grid item xs={12} sm={6} md={4} key={meeting.id || index}>
                                <Card sx={{
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateX(8px)',
                                        background: 'rgba(255,152,57,0.1)'
                                    }
                                }} onClick={() => handleQuickJoin(meeting.code)}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body2" sx={{ color: '#FF9839', fontFamily: 'monospace', fontWeight: 600 }}>
                                                {meeting.code}
                                            </Typography>
                                            <Chip 
                                                label={meeting.duration || "Quick Join"}
                                                size="small"
                                                sx={{ bgcolor: 'rgba(255,152,57,0.1)', color: '#FF9839' }}
                                            />
                                        </Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            {meeting.date}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            )}

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </Box>
    )
}

export default withAuth(HomeComponent);