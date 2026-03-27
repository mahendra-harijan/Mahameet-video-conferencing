import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Zoom,
} from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function JoinMeetingPage() {
  const navigate = useNavigate();
  const query = useQuery();

  const initialCode = query.get('code') || '';
  const initialName = query.get('name') || '';

  const [meetingCode, setMeetingCode] = useState(initialCode);
  const [username, setUsername] = useState(initialName);

  const handleJoin = () => {
    const code = meetingCode.trim();
    const name = username.trim();
    if (!code) {
      alert('Please enter a meeting code');
      return;
    }
    if (!name) {
      alert('Please enter your name');
      return;
    }

    navigate(`/${encodeURIComponent(code)}?name=${encodeURIComponent(name)}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1322 100%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Zoom in={true} timeout={500}>
          <Paper
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: '32px',
              background: 'rgba(15, 19, 34, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,152,57,0.3)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 12px 30px rgba(255,152,57,0.25)',
                }}
              >
                <MeetingRoomIcon sx={{ fontSize: 30, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
                  Join Meeting
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Enter meeting code and your name
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Meeting code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MeetingRoomIcon sx={{ color: '#FF9839' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: 'rgba(255,255,255,0.65)' },
              }}
              placeholder="e.g., MAHA-2024"
              sx={{
                mb: 2,
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

            <TextField
              fullWidth
              label="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#FF9839' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: 'rgba(255,255,255,0.65)' },
              }}
              placeholder="Enter your name"
              sx={{
                mb: 3,
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

            <Button
              fullWidth
              variant="contained"
              onClick={handleJoin}
              sx={{
                background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                borderRadius: '12px',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              Join
            </Button>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}
