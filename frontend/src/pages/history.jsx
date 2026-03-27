import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Box,
    CardContent,
    Button,
    Typography,
    IconButton,
    Container,
    Grid,
    Chip,
    Paper,
    Fade,
    Zoom,
    Skeleton,
    Alert,
    Snackbar,
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import HistoryIcon from '@mui/icons-material/History';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // Added missing import

export default function History() {
    const { getHistoryOfUser, deleteMeetingHistory } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [filteredMeetings, setFilteredMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    const routeTo = useNavigate();
    const routerNavigate = useNavigate();

    const storedToken = localStorage.getItem('token');
    const storedUserRaw = localStorage.getItem('user');
    const isLoggedIn = (() => {
        if (!storedToken || !storedUserRaw) return false;
        try {
            return Boolean(JSON.parse(storedUserRaw));
        } catch {
            return false;
        }
    })();

    const fetchHistory = useCallback(async () => {
        try {
            setLoading(true);
            const history = await getHistoryOfUser();
            // Sort by date (newest first)
            const sortedHistory = history.sort((a, b) => new Date(b.date) - new Date(a.date));
            setMeetings(sortedHistory);
            setFilteredMeetings(sortedHistory);
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to load meeting history', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, [getHistoryOfUser]);

    const filterMeetings = useCallback(() => {
        let filtered = [...meetings];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(meeting =>
                meeting.meetingCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply date filter
        if (selectedFilter !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);

            filtered = filtered.filter(meeting => {
                const meetingDate = new Date(meeting.date);
                if (selectedFilter === 'today') {
                    return meetingDate >= today;
                } else if (selectedFilter === 'week') {
                    return meetingDate >= weekAgo;
                } else if (selectedFilter === 'month') {
                    return meetingDate >= monthAgo;
                }
                return true;
            });
        }

        setFilteredMeetings(filtered);
    }, [meetings, searchTerm, selectedFilter]);

    useEffect(() => {
        if (!isLoggedIn) {
            routerNavigate('/auth');
            return;
        }
        fetchHistory();
    }, [fetchHistory, isLoggedIn, routerNavigate]);

    useEffect(() => {
        filterMeetings();
    }, [filterMeetings]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setSnackbar({ open: true, message: 'Meeting code copied!', severity: 'success' });
        handleMenuClose();
    };

    const handleJoinMeeting = (code) => {
        routerNavigate(`/${code}`);
        handleMenuClose();
    };

    const handleDeleteMeeting = async (meetingId) => {
        try {
            if (deleteMeetingHistory) {
                await deleteMeetingHistory(meetingId);
            }
            // Remove from local state
            const updatedMeetings = meetings.filter(m => m._id !== meetingId);
            setMeetings(updatedMeetings);
            setSnackbar({ open: true, message: 'Meeting removed from history', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to delete meeting', severity: 'error' });
        }
        handleMenuClose();
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        handleFilterClose();
    };

    const handleMenuOpen = (event, meeting) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedMeeting(meeting);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedMeeting(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getFilterLabel = () => {
        switch (selectedFilter) {
            case 'today': return 'Today';
            case 'week': return 'This Week';
            case 'month': return 'This Month';
            default: return 'All Time';
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1322 100%)',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            {/* Animated Background */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 0
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: '-200px',
                    right: '-100px',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(255,152,57,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'float 20s infinite'
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-100px',
                    left: '-100px',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'float 25s infinite reverse'
                }} />
            </Box>

            {/* Header */}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton 
                                onClick={() => routeTo("/home")}
                                sx={{ 
                                    color: 'white',
                                    '&:hover': { color: '#FF9839', transform: 'translateX(-2px)' },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <HistoryIcon sx={{ color: 'white' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                                        Meeting History
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                        {filteredMeetings.length} {filteredMeetings.length === 1 ? 'meeting' : 'meetings'} found
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton 
                                onClick={() => routeTo("/home")}
                                sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#FF9839' } }}
                            >
                                <HomeIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Container>
            </Paper>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
                {/* Search and Filter Bar */}
                <Fade in={true} timeout={500}>
                    <Box sx={{ mb: 4 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    placeholder="Search by meeting code..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: '#FF9839' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchTerm && (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClearSearch} edge="end">
                                                    <ClearIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            borderRadius: '12px',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.08)'
                                            },
                                            '& fieldset': {
                                                borderColor: 'rgba(255,152,57,0.3)',
                                            }
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleFilterClick}
                                    startIcon={<FilterListIcon />}
                                    endIcon={<KeyboardArrowDownIcon />}
                                    sx={{
                                        borderColor: 'rgba(255,152,57,0.3)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        py: 1.5,
                                        '&:hover': {
                                            borderColor: '#FF9839',
                                            backgroundColor: 'rgba(255,152,57,0.1)'
                                        }
                                    }}
                                >
                                    {getFilterLabel()}
                                </Button>
                                <Menu
                                    anchorEl={filterAnchorEl}
                                    open={Boolean(filterAnchorEl)}
                                    onClose={handleFilterClose}
                                    PaperProps={{
                                        sx: {
                                            background: 'rgba(15, 19, 34, 0.98)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,152,57,0.2)',
                                            borderRadius: '12px',
                                            mt: 1
                                        }
                                    }}
                                >
                                    <MenuItem onClick={() => handleFilterSelect('all')} sx={{ color: 'white' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <HistoryIcon sx={{ fontSize: 20 }} />
                                            <span>All Time</span>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleFilterSelect('today')} sx={{ color: 'white' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 20 }} />
                                            <span>Today</span>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleFilterSelect('week')} sx={{ color: 'white' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AccessTimeIcon sx={{ fontSize: 20 }} />
                                            <span>This Week</span>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem onClick={() => handleFilterSelect('month')} sx={{ color: 'white' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 20 }} />
                                            <span>This Month</span>
                                        </Box>
                                    </MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>

                {/* Meetings Grid */}
                {loading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Skeleton variant="rounded" height={200} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : filteredMeetings.length === 0 ? (
                    <Zoom in={true}>
                        <Box sx={{
                            textAlign: 'center',
                            py: 8,
                            px: 4,
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '24px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                background: 'linear-gradient(135deg, rgba(255,152,57,0.2), rgba(255,107,44,0.2))',
                                borderRadius: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2rem'
                            }}>
                                <HistoryIcon sx={{ fontSize: 40, color: '#FF9839' }} />
                            </Box>
                            <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
                                No meetings found
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                                {searchTerm ? `No results for "${searchTerm}"` : "Your meeting history will appear here"}
                            </Typography>
                            {searchTerm && (
                                <Button
                                    variant="contained"
                                    onClick={handleClearSearch}
                                    sx={{
                                        background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                                        textTransform: 'none',
                                        borderRadius: '12px'
                                    }}
                                >
                                    Clear Search
                                </Button>
                            )}
                        </Box>
                    </Zoom>
                ) : (
                    <Grid container spacing={3}>
                        {filteredMeetings.map((meeting, index) => (
                            <Grid item xs={12} sm={6} md={4} key={meeting._id || index}>
                                <Fade in={true} timeout={500 + index * 100}>
                                    <Card sx={{
                                        background: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(255,152,57,0.1)',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'visible',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            borderColor: 'rgba(255,152,57,0.3)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                        }
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            {/* Menu Button */}
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, meeting)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    right: 12,
                                                    color: 'rgba(255,255,255,0.5)',
                                                    '&:hover': { color: '#FF9839' }
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>

                                            {/* Meeting Code */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <MeetingRoomIcon sx={{ color: '#FF9839', fontSize: 20 }} />
                                                <Typography variant="h6" sx={{
                                                    color: '#FF9839',
                                                    fontFamily: 'monospace',
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem'
                                                }}>
                                                    {meeting.meetingCode}
                                                </Typography>
                                            </Box>

                                            {/* Date and Time */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarTodayIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }} />
                                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                        {formatDate(meeting.date)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AccessTimeIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }} />
                                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                        {formatTime(meeting.date)}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Relative Time Chip */}
                                            <Chip
                                                label={getRelativeTime(meeting.date)}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(255,152,57,0.1)',
                                                    color: '#FF9839',
                                                    fontSize: '0.7rem',
                                                    mt: 1,
                                                    '& .MuiChip-label': { px: 1 }
                                                }}
                                            />

                                            {/* Join Button */}
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() => handleJoinMeeting(meeting.meetingCode)}
                                                sx={{
                                                    mt: 2,
                                                    background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 20px rgba(255,152,57,0.4)'
                                                    }
                                                }}
                                                startIcon={<VideoCallIcon />}
                                            >
                                                Join Meeting
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Action Menu */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        background: 'rgba(15, 19, 34, 0.98)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,152,57,0.2)',
                        borderRadius: '12px',
                        minWidth: 180
                    }
                }}
            >
                <MenuItem onClick={() => selectedMeeting && handleCopyCode(selectedMeeting.meetingCode)}>
                    <ContentCopyIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Copy Code
                </MenuItem>
                <MenuItem onClick={() => selectedMeeting && handleJoinMeeting(selectedMeeting.meetingCode)}>
                    <VideoCallIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Join Meeting
                </MenuItem>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                <MenuItem onClick={() => selectedMeeting && handleDeleteMeeting(selectedMeeting._id)} sx={{ color: '#ef4444' }}>
                    <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Remove from History
                </MenuItem>
            </Menu>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        borderRadius: '12px',
                        backgroundColor: snackbar.severity === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)',
                        color: 'white',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </Box>
    );
}