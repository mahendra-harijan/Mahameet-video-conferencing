import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Alert, IconButton, InputAdornment, Fade, Zoom } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VideocamIcon from '@mui/icons-material/Videocam';
import CloseIcon from '@mui/icons-material/Close';

// Modern dark theme
const modernTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF9839',
      light: '#FFB46E',
      dark: '#FF6B2C',
    },
    secondary: {
      main: '#4f46e5',
      light: '#818cf8',
      dark: '#4338ca',
    },
    background: {
      default: '#0a0e1a',
      paper: 'rgba(15, 19, 34, 0.95)',
    },
    error: {
      main: '#ef4444',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Poppins', 'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700,
      background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          borderRadius: '12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
    },
  },
});

export default function Authentication() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();
  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleAuth = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      if (formState === 0) {
        await handleLogin(username, password);
        setMessage('Login successful! Redirecting...');
        setOpen(true);
        setTimeout(() => {
          navigate('/home');
        }, 600);
      }
      if (formState === 1) {
        if (!name || !username || !password) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        
        let result = await handleRegister(name, username, password);
        setMessage(result || 'Registration successful! Please login');
        setOpen(true);
        setError('');
        setFormState(0);
        setPassword('');
        setUsername('');
        setName('');
      }
    } catch (err) {
      console.log(err);
      let errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={modernTheme}>
      <Grid container component="main" sx={{ minHeight: '100vh', overflowX: 'hidden' }}>
        <CssBaseline />
        
        {/* Left Section - Branding */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: 'relative',
            background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1322 100%)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Animated Background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(255,152,57,0.15) 0%, transparent 50%)',
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'float 6s ease-in-out infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              left: '5%',
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'float 8s ease-in-out infinite reverse',
            }}
          />
          
          <Box
            sx={{
              textAlign: 'center',
              zIndex: 2,
              px: 4,
              animation: 'fadeInUp 0.8s ease-out',
            }}
          >
            <Zoom in={true} timeout={800}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(255,152,57,0.3)',
                    animation: 'logoFloat 3s ease-in-out infinite',
                  }}
                >
                  <VideocamIcon sx={{ fontSize: 48, color: 'white' }} />
                </Box>
              </Box>
            </Zoom>
            
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              MahaMeet
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                mb: 3,
                fontWeight: 400,
              }}
            >
              Connect Beyond Boundaries
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <span>✓ HD Video Calls</span>
                <span>✓ End-to-End Encrypted</span>
                <span>✓ Free Forever</span>
              </Typography>
            </Box>
          </Box>
          
          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translateY(0) translateX(0); }
              50% { transform: translateY(-20px) translateX(10px); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.5; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.05); }
            }
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes logoFloat {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
          `}</style>
        </Grid>
        
        {/* Right Section - Form */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square>
          <Box
            sx={{
              my: { xs: 0, sm: 'auto' },
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', sm: 'center' },
              minHeight: '100vh',
              maxWidth: '450px',
              px: 4,
              py: { xs: 4, sm: 0 },
              overflowY: { xs: 'auto', sm: 'visible' },
              background: 'linear-gradient(135deg, rgba(15, 19, 34, 0.98) 0%, rgba(10, 14, 26, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <Fade in={true} timeout={1000}>
              <Box sx={{ width: '100%' }}>
                <Avatar
                  sx={{
                    m: 1,
                    bgcolor: 'transparent',
                    background: 'linear-gradient(135deg, #FF9839, #FF6B2C)',
                    width: 56,
                    height: 56,
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 20px rgba(255,152,57,0.3)',
                  }}
                >
                  <LockOutlinedIcon sx={{ fontSize: 32 }} />
                </Avatar>
                
                <Typography
                  component="h1"
                  variant="h4"
                  align="center"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                  }}
                >
                  {formState === 0 ? 'Welcome Back' : 'Create Account'}
                </Typography>
                
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    mb: 4,
                  }}
                >
                  {formState === 0
                    ? 'Sign in to continue your video calling experience'
                    : 'Join MahaMeet and start connecting with loved ones'}
                </Typography>
                
                {/* Toggle Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                    p: 0.5,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '14px',
                  }}
                >
                  <Button
                    fullWidth
                    onClick={() => {
                      setFormState(0);
                      setError('');
                    }}
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      backgroundColor: formState === 0 ? 'primary.main' : 'transparent',
                      color: formState === 0 ? 'white' : 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        backgroundColor: formState === 0 ? 'primary.dark' : 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => {
                      setFormState(1);
                      setError('');
                    }}
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      backgroundColor: formState === 1 ? 'primary.main' : 'transparent',
                      color: formState === 1 ? 'white' : 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        backgroundColor: formState === 1 ? 'primary.dark' : 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
                
                <Box component="form" noValidate sx={{ mt: 1 }}>
                  {formState === 1 && (
                    <Fade in={formState === 1}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        value={name}
                        autoFocus
                        onChange={(e) => setName(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Fade>
                  )}
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    value={username}
                    autoFocus={formState === 0}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    value={password}
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  {formState === 0 && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          sx={{
                            color: 'primary.main',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                          }}
                        />
                      }
                      label="Remember me"
                      sx={{ mt: 2 }}
                    />
                  )}
                  
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mt: 2,
                        borderRadius: '12px',
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        color: '#ef4444',
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                  
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    onClick={handleAuth}
                    disabled={isLoading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      fontSize: '1rem',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': isLoading ? {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shimmer 1.5s infinite',
                      } : {},
                    }}
                  >
                    {isLoading
                      ? 'Please wait...'
                      : formState === 0
                      ? 'Sign In'
                      : 'Create Account'}
                  </Button>
                  
                  
                  
                  {formState === 0 && (
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                      <Link
                        href="#"
                        variant="body2"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Forgot password?
                      </Link>
                    </Box>
                  )}
                  
                  {formState === 1 && (
                    <Typography variant="body2" align="center" sx={{ mt: 3, color: 'rgba(255,255,255,0.6)' }}>
                      By signing up, you agree to our{' '}
                      <Link href="#" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  )}
                </Box>
              </Box>
            </Fade>
          </Box>
        </Grid>
      </Grid>
      
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{
            width: '100%',
            borderRadius: '12px',
            backgroundColor: 'rgba(16,185,129,0.95)',
            color: 'white',
            backdropFilter: 'blur(10px)',
          }}
        >
          {message}
        </Alert>
      </Snackbar>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </ThemeProvider>
  );
}