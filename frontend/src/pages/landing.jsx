import React, { useEffect } from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const router = useNavigate();
    
    useEffect(() => {
        // Smooth scroll reveal animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className='landingPageContainer'>
            {/* Background Image with Overlay */}
            <div className="background-wrapper">
                <img src="/background.webp" alt="background" className="background-image" />
                <div className="overlay-gradient"></div>
            </div>

            {/* Animated Background Elements */}
            <div className="bg-animation">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
                <div className="gradient-orb orb-4"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="glass-nav">
                <div className='navHeader'>
                    <div className="logo-wrapper">
                        <div className="modern-logo">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FF9839"/>
                                        <stop offset="100%" stopColor="#FF6B2C"/>
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                <circle cx="24" cy="24" r="22" stroke="url(#logoGradient)" strokeWidth="2" fill="rgba(255, 152, 57, 0.1)"/>
                                <path d="M18 20 L30 20 L24 28 L18 20Z" fill="url(#logoGradient)" opacity="0.9"/>
                                <circle cx="24" cy="20" r="3" fill="white"/>
                                <path d="M24 23 L24 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M20 30 L28 30" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="24" cy="32" r="2" fill="url(#logoGradient)"/>
                            </svg>
                        </div>
                        <div className="brand-text">
                            <h2>Maha<span className="gradient-brand">Meet</span></h2>
                            <span className="tagline">Connect Beyond Boundaries</span>
                        </div>
                    </div>
                </div>
                <div className='navlist'>
                    <button className="nav-btn ghost" onClick={() => router("/join")}>
                        <i className="fas fa-user-friends"></i>
                        <span>Join as Guest</span>
                    </button>
                    <button className="nav-btn ghost" onClick={() => router("/auth")}>
                        <i className="fas fa-user-plus"></i>
                        <span>Register</span>
                    </button>
                    <button className="nav-btn primary" onClick={() => router("/auth")}>
                        <i className="fas fa-sign-in-alt"></i>
                        <span>Login</span>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="landingMainContainer">
                <div className="hero-content animate-on-scroll">
                    <div className="badge">
                        <span className="badge-icon">🎥</span>
                        <span>HD Video Calls • Free • Secure</span>
                    </div>
                    
                    <h1 className="hero-title">
                        <span className="gradient-text">Connect</span> 
                        <br />
                        with your loved Ones
                    </h1>

                    <p className="hero-description">
                        Experience crystal-clear video calls, seamless screen sharing, 
                        and real-time connections with anyone, anywhere in the world.
                    </p>

                    <div className="stats-row">
                        <div className="stat">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">Active Users</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                        
                    </div>

                    <div className="cta-group">
                        <Link to="/auth" className="cta-primary">
                            <span>Get Started Free</span>
                            <i className="fas fa-arrow-right"></i>
                        </Link>
                        <button className="cta-secondary" onClick={() => router("/join")}>
                            <i className="fas fa-play"></i>
                            <span>Quick Demo</span>
                            <br />
                            <br />
                        </button>
                    </div>

                    
                </div>

                
            </div>

            {/* Features Section */}
            <div className="features-section-wrapper">
                <div className="features-section">
                    <div className="section-header">
                        <h2>Why choose <span className="gradient-text">MahaMeet</span>?</h2>
                        <p>Experience the future of communication with our cutting-edge features</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card animate-on-scroll">
                            <div className="feature-icon">
                                <i className="fas fa-crown"></i>
                            </div>
                            <h3>Premium Quality</h3>
                            <p>1080p HD video with adaptive bitrate for smooth calls even on slower connections</p>
                        </div>
                        <div className="feature-card animate-on-scroll">
                            <div className="feature-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <h3>Secure & Private</h3>
                            <p>End-to-end encryption ensures your conversations stay completely private</p>
                        </div>
                        <div className="feature-card animate-on-scroll">
                            <div className="feature-icon">
                                <i className="fas fa-charging-station"></i>
                            </div>
                            <h3>Low Latency</h3>
                            <p>Real-time communication with minimal delay for natural conversations</p>
                        </div>
                        <div className="feature-card animate-on-scroll">
                            <div className="feature-icon">
                                <i className="fas fa-desktop"></i>
                            </div>
                            <h3>Screen Sharing</h3>
                            <p>Share your screen with high resolution for presentations and collaboration</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .landingPageContainer {
                    min-height: 100vh;
                    position: relative;
                    overflow-x: hidden;
                }

                /* Prevent any accidental horizontal scroll on mobile */
                html, body {
                    max-width: 100%;
                    overflow-x: hidden;
                }

                /* Background Image Styles */
                .background-wrapper {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                }

                .background-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                .overlay-gradient {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, 
                        rgba(10, 14, 26, 0.72) 0%,
                        rgba(15, 19, 34, 0.68) 50%,
                        rgba(10, 14, 26, 0.72) 100%);
                }

                /* Animated Background Elements */
                .bg-animation {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }

                .gradient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    animation: float 20s infinite ease-in-out;
                }

                .orb-1 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(255,152,57,0.3), rgba(255,152,57,0));
                    top: -200px;
                    right: -100px;
                    animation-delay: 0s;
                }

                .orb-2 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(79,70,229,0.3), rgba(79,70,229,0));
                    bottom: -100px;
                    left: -100px;
                    animation-delay: -5s;
                }

                .orb-3 {
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(236,72,153,0.25), rgba(236,72,153,0));
                    top: 50%;
                    right: 30%;
                    animation-delay: -10s;
                }

                .orb-4 {
                    width: 350px;
                    height: 350px;
                    background: radial-gradient(circle, rgba(59,130,246,0.25), rgba(59,130,246,0));
                    bottom: 20%;
                    left: 20%;
                    animation-delay: -15s;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -30px) scale(1.1); }
                }

                /* Glass Navigation */
                .glass-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 5%;
                    background: rgba(10, 14, 26, 0.85);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 152, 57, 0.2);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    gap: 12px;
                }

                .logo-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .modern-logo {
                    position: relative;
                    animation: logoFloat 3s ease-in-out infinite;
                    cursor: pointer;
                }

                .modern-logo svg {
                    filter: drop-shadow(0 0 10px rgba(255, 152, 57, 0.3));
                    transition: all 0.3s ease;
                }

                .modern-logo:hover svg {
                    transform: scale(1.05);
                    filter: drop-shadow(0 0 15px rgba(255, 152, 57, 0.5));
                }

                @keyframes logoFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }

                .brand-text {
                    display: flex;
                    flex-direction: column;
                }

                .brand-text h2 {
                    font-size: 1.8rem;
                    font-weight: 800;
                    margin: 0;
                    line-height: 1.2;
                    background: linear-gradient(135deg, #ffffff, #FF9839);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.5px;
                }

                .gradient-brand {
                    background: linear-gradient(135deg, #FF9839, #FF6B2C);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .tagline {
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.6);
                    letter-spacing: 0.5px;
                    margin-top: 2px;
                }

                .navlist {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }

                .nav-btn {
                    padding: 0.6rem 1.2rem;
                    border-radius: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border: none;
                    font-size: 0.9rem;
                    white-space: nowrap;
                }

                .nav-btn.ghost {
                    background: transparent;
                    color: #fff;
                    border: 1px solid rgba(255, 152, 57, 0.3);
                }

                .nav-btn.ghost:hover {
                    border-color: #FF9839;
                    background: rgba(255, 152, 57, 0.1);
                    transform: translateY(-2px);
                }

                .nav-btn.primary {
                    background: linear-gradient(135deg, #FF9839, #FF6B2C);
                    color: white;
                    box-shadow: 0 4px 15px rgba(255, 152, 57, 0.3);
                }

                .nav-btn.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 152, 57, 0.4);
                }

                /* Hero Section */
                .landingMainContainer {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    padding: 4rem 5%;
                    max-width: 1400px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 2;
                    min-height: calc(100vh - 80px);
                }

                .hero-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    justify-content: center;
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 152, 57, 0.15);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 152, 57, 0.3);
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                    width: fit-content;
                    font-size: 0.85rem;
                    color: #FF9839;
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    line-height: 1.2;
                    color: white;
                }

                .gradient-text {
                    background: linear-gradient(135deg, #FF9839, #FF6B2C);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-description {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.85);
                    line-height: 1.6;
                }

                .stats-row {
                    display: flex;
                    gap: 2rem;
                    padding: 1rem 0;
                }

                .stat {
                    display: flex;
                    flex-direction: column;
                }

                .stat-number {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #FF9839;
                }

                .stat-label {
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.75);
                }

                .cta-group {
                    display: flex;
                    gap: 1rem;
                    margin: 1rem 0;
                }

                .cta-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #FF9839, #FF6B2C);
                    border-radius: 12px;
                    color: white;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(255, 152, 57, 0.3);
                }

                .cta-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(255, 152, 57, 0.4);
                }

                .cta-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 1rem 2rem;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 152, 57, 0.3);
                    border-radius: 12px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .cta-secondary:hover {
                    background: rgba(255, 152, 57, 0.2);
                    transform: translateY(-2px);
                }

                .trust-badge {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding-top: 1rem;
                }

                .avatar-group {
                    display: flex;
                    align-items: center;
                }

                .avatar-group img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid #FF9839;
                    margin-right: -10px;
                    object-fit: cover;
                }

                .avatar-more {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 152, 57, 0.2);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    color: #FF9839;
                }

                /* Hero Image - Video Preview */
                .hero-image {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .image-wrapper {
                    position: relative;
                    width: 100%;
                }

                .video-preview {
                    position: relative;
                    animation: floatImage 3s ease-in-out infinite;
                }

                .preview-screen {
                    background: linear-gradient(135deg, rgba(26, 31, 46, 0.95), rgba(15, 19, 34, 0.95));
                    backdrop-filter: blur(10px);
                    border-radius: 32px;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 152, 57, 0.3);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    width: 100%;
                    max-width: 450px;
                    margin: 0 auto;
                }

                .call-ui {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 2rem;
                }

                .call-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1rem;
                    border-radius: 20px;
                }

                .participant-avatar {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #FF9839, #FF6B2C);
                    border-radius: 50%;
                    position: relative;
                    overflow: hidden;
                }

                .participant-avatar::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>') center/40% no-repeat;
                    opacity: 0.7;
                }

                .call-info {
                    flex: 1;
                }

                .caller-name {
                    color: white;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .call-status {
                    font-size: 0.8rem;
                    color: #4ade80;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .call-status::before {
                    content: '';
                    width: 8px;
                    height: 8px;
                    background: #4ade80;
                    border-radius: 50%;
                    display: inline-block;
                    animation: blink 1.5s infinite;
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }

                .call-controls {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                }

                .control-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1.2rem;
                    color: white;
                }

                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.05);
                }

                .control-btn.active {
                    background: rgba(255, 152, 57, 0.3);
                    border: 1px solid #FF9839;
                }

                .control-btn.end-call {
                    background: #ef4444;
                }

                .control-btn.end-call:hover {
                    background: #dc2626;
                }

                .floating-card {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    padding: 0.6rem 1.2rem;
                    border-radius: 50px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                    white-space: nowrap;
                    animation: floatCard 4s ease-in-out infinite;
                    border: 1px solid rgba(255, 152, 57, 0.3);
                    color: white;
                    font-weight: 500;
                }

                .card-1 { top: -20px; left: -20px; animation-delay: 0s; }
                .card-2 { bottom: 60px; right: -30px; animation-delay: 1s; }
                .card-3 { top: 30%; right: -40px; animation-delay: 2s; }

                /* Features Section Wrapper */
                .features-section-wrapper {
                    position: relative;
                    z-index: 2;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(10px);
                    margin-top: 2rem;
                    padding: 3rem 0;
                }

                .features-section {
                    padding: 2rem 5%;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .section-header h2 {
                    font-size: 2.5rem;
                    color: white;
                    margin-bottom: 1rem;
                }

                .section-header p {
                    color: rgba(255, 255, 255, 0.75);
                    font-size: 1.1rem;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .feature-card {
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px);
                    padding: 2rem;
                    border-radius: 24px;
                    text-align: center;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255, 152, 57, 0.1);
                }

                .feature-card:hover {
                    transform: translateY(-10px);
                    border-color: rgba(255, 152, 57, 0.4);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    background: rgba(255, 255, 255, 0.12);
                }

                .feature-icon {
                    width: 70px;
                    height: 70px;
                    background: linear-gradient(135deg, rgba(255, 152, 57, 0.2), rgba(255, 107, 44, 0.2));
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    font-size: 2rem;
                    color: #FF9839;
                }

                .feature-card h3 {
                    color: white;
                    margin-bottom: 1rem;
                    font-size: 1.3rem;
                }

                .feature-card p {
                    color: rgba(255, 255, 255, 0.75);
                    line-height: 1.6;
                }

                /* Animations */
                @keyframes floatImage {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }

                @keyframes floatCard {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .animate-on-scroll {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.6s ease;
                }

                /* Responsive */
                @media (max-width: 968px) {
                    .landingMainContainer {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: 2rem;
                        min-height: auto;
                        padding: 3rem 5%;
                    }
                    
                    .hero-title {
                        font-size: 2.5rem;
                    }
                    
                    .stats-row {
                        justify-content: center;
                    }
                    
                    .cta-group {
                        justify-content: center;
                    }
                    
                    .trust-badge {
                        justify-content: center;
                    }
                    
                    .glass-nav {
                        flex-wrap: wrap;
                    }

                    .navlist {
                        gap: 0.5rem;
                        width: 100%;
                        justify-content: flex-start;
                    }

                    .nav-btn {
                        padding: 0.55rem 0.9rem;
                        border-radius: 10px;
                        font-size: 0.85rem;
                    }

                    .nav-btn i {
                        font-size: 1.1rem;
                    }
                    
                    .floating-card {
                        display: none;
                    }
                    
                    .section-header h2 {
                        font-size: 2rem;
                    }
                    
                    .preview-screen {
                        max-width: 350px;
                    }
                    
                    .features-section-wrapper {
                        margin-top: 0;
                        padding: 2rem 0;
                    }

                    .brand-text .tagline {
                        display: none;
                    }

                    .brand-text h2 {
                        font-size: 1.4rem;
                    }

                    .modern-logo svg {
                        width: 40px;
                        height: 40px;
                    }
                }

                @media (max-width: 480px) {
                    .glass-nav {
                        padding: 0.8rem 4%;
                        gap: 10px;
                    }

                    .navHeader {
                        width: 100%;
                    }

                    .logo-wrapper {
                        justify-content: center;
                    }

                    .navlist {
                        width: 100%;
                        justify-content: center;
                    }

                    .nav-btn {
                        flex: 1 1 30%;
                        justify-content: center;
                        padding: 0.55rem 0.7rem;
                        min-width: 110px;
                    }

                    .nav-btn span {
                        display: inline;
                    }

                    .nav-btn.ghost span {
                        font-size: 0.8rem;
                    }

                    .nav-btn.primary span {
                        font-size: 0.8rem;
                    }
                    
                    .modern-logo svg {
                        width: 35px;
                        height: 35px;
                    }
                    
                    .brand-text h2 {
                        font-size: 1.2rem;
                    }
                    
                    .hero-title {
                        font-size: 2rem;
                    }
                    
                    .preview-screen {
                        max-width: 300px;
                        padding: 1rem;
                    }
                    
                    .participant-avatar {
                        width: 45px;
                        height: 45px;
                    }
                    
                    .control-btn {
                        width: 40px;
                        height: 40px;
                        font-size: 1rem;
                    }
                    
                    .features-grid {
                        gap: 1rem;
                    }
                    
                    .feature-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    )
}