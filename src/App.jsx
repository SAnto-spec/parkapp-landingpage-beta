import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, MapPin, CreditCard, Smartphone, LayoutDashboard, Calendar, Lock, AlertOctagon,
  ShieldCheck, BookOpen, Users, BarChart3, ShieldAlert, Shield, ArrowRight, CheckCircle2,
  User, Mail, Building2, Play, Sparkles, Menu, X, ChevronRight, Download, Laptop, FileText, Info
} from 'lucide-react';

function App() {
  // Navigation & UI States
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  
  // Interactive Dashboard States (Hero)
  const [slots, setSlots] = useState([
    { id: 'A1', status: 'occupied', type: 'Resident', vehicle: 'MH-12-PQ-8834' },
    { id: 'A2', status: 'available', type: 'Visitor', vehicle: '' },
    { id: 'A3', status: 'occupied', type: 'Resident', vehicle: 'MH-12-KL-4491' },
    { id: 'A4', status: 'available', type: 'Resident', vehicle: '' },
    { id: 'B1', status: 'available', type: 'Visitor', vehicle: '' },
    { id: 'B2', status: 'booked', type: 'Visitor', vehicle: 'KA-03-MM-1928' },
    { id: 'B3', status: 'occupied', type: 'Resident', vehicle: 'MH-14-AA-1002' },
    { id: 'B4', status: 'available', type: 'Reserved', vehicle: '' },
    { id: 'C1', status: 'booked', type: 'Resident', vehicle: 'DL-01-XY-5521' },
    { id: 'C2', status: 'available', type: 'Visitor', vehicle: '' },
    { id: 'C3', status: 'available', type: 'Resident', vehicle: '' },
    { id: 'C4', status: 'occupied', type: 'Visitor', vehicle: 'MH-12-RS-9981' },
  ]);

  const [logs, setLogs] = useState([
    { time: '16:54', text: 'Vehicle <strong>MH-12-PQ-8834</strong> verified at Gate 1.' },
    { time: '16:51', text: 'Slot <strong>B-2</strong> reserved for visitor Guest Amit.' },
    { time: '16:47', text: 'Resident <strong>Sarah Patel</strong> checked in via App.' },
    { time: '16:40', text: 'Razorpay payment of <strong>₹120</strong> settled for B-2.' },
    { time: '16:32', text: 'Security alarm cleared for unassigned Slot C-4.' },
  ]);

  // Simulated live logging feed timer
  useEffect(() => {
    const logPool = [
      { text: 'Vehicle <strong>MH-14-ZZ-7001</strong> scanned & verified at Gate 2.' },
      { text: 'Slot <strong>A-4</strong> status toggled to RESERVED by Admin.' },
      { text: 'Visitor check-in request approved for Slot <strong>B-1</strong>.' },
      { text: 'Razorpay payout of <strong>₹450</strong> finalized for private leases.' },
      { text: 'Biometric authorization approved for Resident <strong>Dr. Raj</strong>.' },
      { text: 'Automated penalty flagged for vehicle <strong>DL-01-XY-5521</strong> (Overstay).' },
      { text: 'Guard Ramesh completed secure patrol scan at Slot Area B.' },
    ];

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setLogs(prev => [
        { time: timeStr, text: randomLog.text },
        ...prev.slice(0, 4)
      ]);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  // Toggle Slot Booking in Hero Dashboard
  const handleSlotClick = (id) => {
    setSlots(prev => prev.map(slot => {
      if (slot.id === id) {
        if (slot.status === 'available') {
          // Play a small click noise
          playBeep(600, 80);
          return { ...slot, status: 'booked', vehicle: 'MH-12-TEMP', type: 'Resident' };
        } else if (slot.status === 'booked') {
          playBeep(450, 80);
          return { ...slot, status: 'available', vehicle: '', type: 'Visitor' };
        } else {
          // Occupied
          playBeep(300, 150);
          alert(`Slot ${slot.id} is occupied by vehicle ${slot.vehicle}. Automated safety sensor verification is active.`);
          return slot;
        }
      }
      return slot;
    }));
  };

  // Dynamic Dashboard metrics
  const totalSlots = slots.length;
  const occupiedCount = slots.filter(s => s.status === 'occupied').length;
  const bookedCount = slots.filter(s => s.status === 'booked').length;
  const availableCount = slots.filter(s => s.status === 'available').length;
  const occupancyRate = Math.round(((occupiedCount + bookedCount) / totalSlots) * 100);

  // How It Works Sandbox States
  const [sandboxStep, setSandboxStep] = useState(1);
  const [sandboxVehicle, setSandboxVehicle] = useState('Car 🚗');
  const [sandboxName, setSandboxName] = useState('Rohan Sharma');
  const [sandboxVehicleNo, setSandboxVehicleNo] = useState('MH-12-AB-1234');
  const [sandboxSlot, setSandboxSlot] = useState('Slot B-3');
  const [sandboxQrGenerated, setSandboxQrGenerated] = useState(false);
  const [sandboxScanning, setSandboxScanning] = useState(false);
  const [sandboxScanned, setSandboxScanned] = useState(false);

  // Sandbox visual slots
  const sandboxSlots = ['Slot A-1', 'Slot A-2', 'Slot B-3', 'Slot B-4', 'Slot C-1', 'Slot C-2', 'Slot D-3', 'Slot D-4'];

  const resetSandbox = () => {
    setSandboxStep(1);
    setSandboxQrGenerated(false);
    setSandboxScanning(false);
    setSandboxScanned(false);
  };

  // Beta Access Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [societyName, setSocietyName] = useState('');
  const [parkingCapacity, setParkingCapacity] = useState(120);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  // Confetti Particle state
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);

  // Scroll detection for navbar blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Web Audio API beep synthesizer for premium interactive sounds
  const playBeep = (freq = 520, duration = 100) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration / 1000);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
      // AudioContext blocked or unsupported
    }
  };

  // Step click in How it Works Sandbox
  const handleStepClick = (step) => {
    if (step === 2 && !sandboxQrGenerated) {
      // Auto-generate QR if clicking Step 2 from 1
      setSandboxQrGenerated(true);
      playBeep(700, 100);
    }
    if (step === 3 && !sandboxQrGenerated) {
      // Force QR generation
      setSandboxQrGenerated(true);
    }
    setSandboxStep(step);
  };

  // Handle Scan QR Simulation
  const triggerScanSimulation = () => {
    if (sandboxScanning || sandboxScanned) return;
    setSandboxScanning(true);
    playBeep(400, 80);
    
    // Simulate guard scanning
    setTimeout(() => {
      setSandboxScanning(false);
      setSandboxScanned(true);
      // Play high success chime
      playBeep(880, 150);
      setTimeout(() => playBeep(1046, 200), 100);
      // Trigger canvas confetti explosion
      triggerConfetti();
    }, 2200);
  };

  // Simple, solid Canvas Confetti Engine
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Resize canvas
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    const ctx = canvas.getContext('2d');
    const colors = ['#4f46e5', '#7c3aed', '#c084fc', '#06b6d4', '#3b82f6', '#10b981', '#f59e0b'];
    
    // Create particles
    const localParticles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 90; i++) {
      localParticles.push({
        x: centerX,
        y: centerY - 20,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 14 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        gravity: 0.28
      });
    }

    let animationFrameId;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      
      localParticles.forEach(p => {
        if (p.opacity > 0.01) {
          active = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.rotation += p.rotationSpeed;
          p.opacity -= 0.014;
          
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          // Draw rect particles
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      
      if (active) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    
    render();
  };

  // Form Submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !societyName) {
      alert('Please fill out all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    playBeep(600, 100);
    
    // Simulate API registration call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Generate a realistic ticket key
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const codeStr = `PE-BETA-${randNum}-X`;
      setGeneratedTicketId(codeStr);
      
      // Play awesome chime
      playBeep(523, 100);
      setTimeout(() => playBeep(659, 100), 100);
      setTimeout(() => playBeep(784, 150), 200);
      setTimeout(() => playBeep(1046, 250), 300);
      
      // Trigger confetti on the ticket card container after rendering
      setTimeout(() => {
        triggerConfetti();
      }, 200);
    }, 1500);
  };

  // Smooth scroll helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Mock print ticket function
  const handleDownloadTicket = () => {
    playBeep(900, 80);
    alert(`Downloading virtual beta pass for ${fullName}...\nTicket ID: ${generatedTicketId}\nShow this to your society committee members for immediate verification!`);
  };

  return (
    <>
      <div className="tech-bg"></div>
      
      {/* Dynamic Glow Orbs for ambient modern startup background */}
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>
      <div className="glow-orb glow-orb-3"></div>

      {/* ====================================================
         1. FLOATING NAVIGATION BAR
         ==================================================== */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <a href="#" className="navbar-logo" onClick={() => scrollToSection('top')}>
            <QrCode size={28} strokeWidth={2.5} />
            <span>Park<span className="text-gradient">Ease</span></span>
          </a>

          <ul className="navbar-links">
            <li><a href="#problems" onClick={(e) => { e.preventDefault(); scrollToSection('problems'); }}>Problems</a></li>
            <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
            <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a></li>
            <li><a href="#security" onClick={(e) => { e.preventDefault(); scrollToSection('security'); }}>Security</a></li>
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="btn btn-primary" 
              style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}
              onClick={() => scrollToSection('beta-form')}
            >
              Get Beta Access
            </button>
            <button 
              className="mobile-nav-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <a href="#problems" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '600' }} onClick={(e) => { e.preventDefault(); scrollToSection('problems'); }}>Problems</a>
            <a href="#features" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '600' }} onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
            <a href="#how-it-works" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '600' }} onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a>
            <a href="#security" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '600' }} onClick={(e) => { e.preventDefault(); scrollToSection('security'); }}>Security</a>
          </div>
        )}
      </nav>

      {/* ====================================================
         2. HERO SECTION WITH INTERACTIVE MOCKUPS
         ==================================================== */}
      <section className="hero-section" id="top">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="badge badge-glow">
                <Sparkles size={14} />
                <span>ParkEase Beta Portal Now Active</span>
              </div>
              
              <h1>Smart Parking for <br /><span className="text-gradient">Modern Societies</span></h1>
              
              <p className="subheadline">
                Secure QR-based parking, visitor management, slot booking, and payments in one intelligent platform.
              </p>
              
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => scrollToSection('beta-form')}>
                  Get Beta Access
                  <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
                <button className="btn btn-outline-glow" onClick={() => setDemoModalOpen(true)}>
                  <Play size={16} fill="currentColor" style={{ marginRight: '8px', color: '#7c3aed' }} />
                  Watch Demo
                </button>
              </div>

              <div className="hero-trust-metrics">
                <div className="trust-metric-item">
                  <h4>&lt; 2s</h4>
                  <p>Gate Scan Latency</p>
                </div>
                <div className="trust-metric-item">
                  <h4>100%</h4>
                  <p>Secure JWT Passes</p>
                </div>
                <div className="trust-metric-item">
                  <h4>98%</h4>
                  <p>Slot Utilization</p>
                </div>
              </div>
            </div>

            {/* Interactive Dashboard / App Mockup Column */}
            <div className="hero-mockup-wrapper">
              <div className="dashboard-mockup">
                {/* Header bar */}
                <div className="dashboard-header">
                  <div className="dashboard-header-left">
                    <div className="window-dots">
                      <div className="window-dot window-dot-red"></div>
                      <div className="window-dot window-dot-yellow"></div>
                      <div className="window-dot window-dot-green"></div>
                    </div>
                    <span className="dashboard-title">
                      <Laptop size={14} style={{ color: '#6366f1' }} />
                      ParkEase Society Admin Console
                    </span>
                  </div>
                  <div className="dashboard-header-right">
                    <span className="mockup-status-pulse">
                      <span className="pulse-dot"></span>
                      Gate-1 Active
                    </span>
                  </div>
                </div>

                <div className="dashboard-body">
                  {/* Sidebar icons */}
                  <div className="dashboard-sidebar">
                    <div className="sidebar-icon active"><LayoutDashboard size={18} /></div>
                    <div className="sidebar-icon"><Users size={18} /></div>
                    <div className="sidebar-icon"><Calendar size={18} /></div>
                    <div className="sidebar-icon"><CreditCard size={18} /></div>
                  </div>

                  {/* Main panels */}
                  <div className="dashboard-main">
                    {/* Live metrics stats */}
                    <div className="dashboard-stats">
                      <div className="stat-item">
                        <span className="stat-item-label">Available Slots</span>
                        <span className="stat-item-value text-gradient-cyan">{availableCount} / {totalSlots}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-item-label">Booked Slots</span>
                        <span className="stat-item-value" style={{ color: '#f59e0b' }}>{bookedCount}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-item-label">Occupancy Rate</span>
                        <span className="stat-item-value" style={{ color: '#6366f1' }}>{occupancyRate}%</span>
                      </div>
                    </div>

                    {/* Interactive Slots & Real-time Logs grid */}
                    <div className="dashboard-layout-grid">
                      <div className="dashboard-slots-panel">
                        <div className="panel-header-title">
                          <span>Live Layout Mapping</span>
                          <span className="panel-header-subtitle">Click to Simulate Booking</span>
                        </div>
                        <div className="slots-grid-mockup">
                          {slots.map(slot => (
                            <div 
                              key={slot.id} 
                              className={`slot-node ${slot.status}`}
                              onClick={() => handleSlotClick(slot.id)}
                              title={`Slot ${slot.id} - ${slot.status.toUpperCase()} (${slot.type})`}
                            >
                              <span className="slot-node-status"></span>
                              <span className="slot-node-name">{slot.id}</span>
                              <span className="slot-node-type">{slot.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="dashboard-logs-panel">
                        <div className="panel-header-title">Live Gate Events</div>
                        <div className="logs-feed-mockup">
                          {logs.map((log, index) => (
                            <div key={index} className="log-row">
                              <span className="log-time">{log.time}</span>
                              <span className="log-text" dangerouslySetInnerHTML={{ __html: log.text }}></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating mobile phone overlay */}
              <div className="hero-phone-mockup">
                <div className="phone-screen">
                  <div className="phone-header">
                    <span className="phone-logo">ParkEase</span>
                    <span style={{ fontSize: '8px', color: '#64748b' }}>Resident App</span>
                  </div>
                  
                  <div className="phone-ticket-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <span className="phone-ticket-label">Active Pass</span>
                        <h4 className="phone-ticket-title">Resident Slot A-3</h4>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="phone-ticket-label">Vehicle</span>
                        <p className="phone-ticket-value">MH-12-KL-4491</p>
                      </div>
                    </div>
                  </div>

                  <div className="phone-qr-area">
                    {/* Simulated SVG QR */}
                    <svg viewBox="0 0 100 100" className="phone-qr-svg">
                      <rect width="100" height="100" fill="#ffffff"/>
                      <path d="M10,10 h20 v20 h-20 z M70,10 h20 v20 h-20 z M10,70 h20 v20 h-20 z M30,30 h10 v10 h-10 z M60,60 h10 v10 h-10 z M40,20 h10 v20 h-10 z M20,45 h20 v10 h-20 z M50,70 h15 v15 h-15 z M70,40 h15 v15 h-15 z M80,80 h10 v10 h-10 z" fill="#0f172a"/>
                      {/* Secure locks signature indicator inside QR */}
                      <circle cx="50" cy="50" r="10" fill="#6366f1" opacity="0.9" />
                      <circle cx="50" cy="50" r="5" fill="#ffffff" />
                    </svg>
                    <span className="phone-qr-valid">
                      <ShieldCheck size={10} />
                      Signed JWT Pass
                    </span>
                  </div>

                  <div style={{ 
                    marginTop: 'auto', 
                    background: '#f8fafc', 
                    padding: '8px', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(15,23,42,0.04)',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '7px', display: 'block', color: '#64748b' }}>CO-OWNER RENTAL SHARES</span>
                    <span style={{ fontSize: '9px', fontWeight: '800', color: '#10b981' }}>Lease: Active (₹24/hr)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
         3. PROBLEM SECTION
         ==================================================== */}
      <section className="problem-section" id="problems">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Broken Status Quo</span>
            <h2>Why Traditional Parking Plagues Societies</h2>
            <p>Paper registers, unauthorized intrusions, and constant arguments. Managing parking shouldn't feel like a full-time dispute job.</p>
          </div>

          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon-wrapper">
                <ShieldAlert size={20} />
              </div>
              <h3>Unauthorized Parking</h3>
              <p>Non-residents and delivery agents occupying private resident slots, leading to immediate building friction and arguments.</p>
            </div>

            <div className="problem-card">
              <div className="problem-icon-wrapper">
                <BookOpen size={20} />
              </div>
              <h3>Manual Registers</h3>
              <p>Guards maintaining messy hand-written paper notebooks. No instant searching, audit logs, or active verification.</p>
            </div>

            <div className="problem-card">
              <div className="problem-icon-wrapper">
                <Users size={20} />
              </div>
              <h3>Parking Conflicts</h3>
              <p>Frequent disputes between co-residents when emergency cars block common driveways or allotted parking slots.</p>
            </div>

            <div className="problem-card">
              <div className="problem-icon-wrapper">
                <CreditCard size={20} />
              </div>
              <h3>Delayed Payments</h3>
              <p>Clunky visitor cash processing. Guards lack digital billing terminals, creating transaction delays and revenue leakage.</p>
            </div>

            <div className="problem-card">
              <div className="problem-icon-wrapper">
                <BarChart3 size={20} />
              </div>
              <h3>Poor Utilization</h3>
              <p>Private slot allocations sit completely empty for hours while visitors struggle to find open, safe spaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
         4. FEATURES SECTION (GRID WITH ICONS)
         ==================================================== */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Intelligent Abstractions</span>
            <h2>Seamless Gate &amp; Space Governance</h2>
            <p>ParkEase bundles military-grade gate access, digital ledgers, and resident apps into a single, cohesive hub.</p>
          </div>

          <div className="features-grid">
            <div className="glass-card feature-card">
              <div className="feature-icon-box">
                <QrCode size={22} />
              </div>
              <h3>QR-Based Entry</h3>
              <p>Time-bounded secure QR passes generated on resident apps. Guests tap-and-go with dynamic authorization.</p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-box">
                <MapPin size={22} />
              </div>
              <h3>Real-Time Booking</h3>
              <p>Interactive graphical bird's-eye mapping. Tap any available common slot and reserve in 1-click.</p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-box">
                <ShieldCheck size={22} />
              </div>
              <h3>Razorpay Integrations</h3>
              <p>Flawless payment gateways. Settle visitor hourly fees, booking rentals, or active security penalties instantly.</p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-box">
                <Smartphone size={22} />
              </div>
              <h3>Guard Scanner App</h3>
              <p>Guards verify codes via a robust Android/iOS mobile application. Zero expensive physical hardware needed.</p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-box">
                <LayoutDashboard size={22} />
              </div>
              <h3>Society Admin Desk</h3>
              <p>Interactive console for management committees. Oversee gate audits, resident registers, and occupancy curves.</p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-box">
                <Calendar size={22} />
              </div>
              <h3>Slot Scheduling</h3>
              <p>Lease out your allocated slot when traveling. Monetize empty slots and open them up to guests.</p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-box">
                <Lock size={22} />
              </div>
              <h3>Secure JWT Passes</h3>
              <p>All passes are cryptographically signed. Prevents counterfeiting, screen-shot cloning, and unauthorized playbacks.</p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-box">
                <AlertOctagon size={22} />
              </div>
              <h3>Penalty Detection</h3>
              <p>Automated timers flag overstaying vehicles. Sends immediate WhatsApp push reports to violators and guards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
         5. HOW IT WORKS SECTION (3-STEP TIMELINE & SANDBOX)
         ==================================================== */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Interactive Sandbox</span>
            <h2>Step-by-Step Experience</h2>
            <p>Interact with our active simulation to see how ParkEase safeguards gateways in under two seconds.</p>
          </div>

          <div className="sandbox-container">
            {/* Step-by-Step Selection */}
            <div className="sandbox-instructions">
              <div 
                className={`step-card ${sandboxStep === 1 ? 'active' : ''}`}
                onClick={() => handleStepClick(1)}
              >
                <div className="step-number">1</div>
                <div className="step-text">
                  <h3>Book Slot</h3>
                  <p>Resident reserves a slot on the app. Choose vehicle type and select an available parking bay.</p>
                </div>
              </div>

              <div 
                className={`step-card ${sandboxStep === 2 ? 'active' : ''}`}
                onClick={() => handleStepClick(2)}
              >
                <div className="step-number">2</div>
                <div className="step-text">
                  <h3>Generate QR</h3>
                  <p>Our secure engine compiles a cryptographically signed QR pass with active time nonces.</p>
                </div>
              </div>

              <div 
                className={`step-card ${sandboxStep === 3 ? 'active' : ''}`}
                onClick={() => handleStepClick(3)}
              >
                <div className="step-number">3</div>
                <div className="step-text">
                  <h3>Guard Verification</h3>
                  <p>Guards scan the QR code. Access is granted instantly, logging the transaction details.</p>
                </div>
              </div>
            </div>

            {/* Sandbox Live Visual Demonstration */}
            <div className="glass-card sandbox-visual-card">
              <div className="visual-sandbox-header">
                Interactive Simulator — Stage {sandboxStep}
              </div>

              {/* STAGE 1: BOOKING SIMULATOR */}
              {sandboxStep === 1 && (
                <div className="stage-book-content">
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Select Vehicle &amp; Desired Bay:</span>
                  
                  <div className="booking-selectors">
                    {['Car 🚗', 'Bike 🏍️'].map(v => (
                      <button 
                        key={v}
                        className={`booking-select-btn ${sandboxVehicle === v ? 'active' : ''}`}
                        onClick={() => { setSandboxVehicle(v); playBeep(640, 60); }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>

                  <div className="sandbox-slot-visual-grid">
                    {sandboxSlots.map((slot, index) => {
                      // Let's make some slots pre-occupied for realistic design
                      const isPreOccupied = index === 1 || index === 4 || index === 6;
                      const isSelected = sandboxSlot === slot;
                      
                      return (
                        <div 
                          key={slot}
                          className={`sandbox-slot-node ${isPreOccupied ? 'occupied' : isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            if (!isPreOccupied) {
                              setSandboxSlot(slot);
                              playBeep(580, 80);
                            }
                          }}
                        >
                          {slot.replace('Slot ', '')}
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    className="btn btn-primary"
                    style={{ marginTop: '16px', width: '100%', maxWidth: '280px' }}
                    onClick={() => {
                      setSandboxQrGenerated(true);
                      setSandboxStep(2);
                      playBeep(700, 100);
                    }}
                  >
                    Confirm Booking &amp; Generate QR
                  </button>
                </div>
              )}

              {/* STAGE 2: QR GENERATION */}
              {sandboxStep === 2 && (
                <div className="stage-qr-content">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Guest Name"
                        value={sandboxName}
                        onChange={(e) => setSandboxName(e.target.value)}
                        style={{ paddingLeft: '12px', height: '38px', fontSize: '13px' }}
                      />
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Vehicle No"
                        value={sandboxVehicleNo}
                        onChange={(e) => setSandboxVehicleNo(e.target.value)}
                        style={{ paddingLeft: '12px', height: '38px', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div className="sandbox-qr-box">
                    <svg viewBox="0 0 100 100" className="sandbox-qr-svg">
                      <rect width="100" height="100" fill="#ffffff"/>
                      <path d="M10,10 h20 v20 h-20 z M70,10 h20 v20 h-20 z M10,70 h20 v20 h-20 z M35,35 h15 v15 h-15 z M60,60 h10 v10 h-10 z M30,55 h10 v10 h-10 z M55,30 h10 v10 h-10 z M80,80 h10 v10 h-10 z M25,45 h15 v10 h-15 z M75,45 h10 v20 h-10 z M45,75 h20 v10 h-20 z" fill="#0f172a"/>
                      <circle cx="50" cy="50" r="8" fill="#7c3aed" />
                      <circle cx="50" cy="50" r="4" fill="#ffffff" />
                    </svg>
                    <span className="sandbox-qr-info">{sandboxSlot} — {sandboxVehicle}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '280px' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setSandboxStep(1)}
                      style={{ flex: 1, padding: '10px' }}
                    >
                      Back
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setSandboxStep(3)}
                      style={{ flex: 1, padding: '10px' }}
                    >
                      Proceed to Gate
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: GATE SCAN SIMULATOR */}
              {sandboxStep === 3 && (
                <div className="stage-guard-content">
                  <canvas ref={canvasRef} className="confetti-canvas-overlay"></canvas>
                  
                  {!sandboxScanned ? (
                    <>
                      <div className="scanner-cam-simulation">
                        <div className="scanner-laser-line"></div>
                        <svg viewBox="0 0 100 100" className={`scanner-qr-ghost ${sandboxScanning ? 'scanned' : ''}`}>
                          <rect width="100" height="100" fill="#ffffff"/>
                          <path d="M10,10 h20 v20 h-20 z M70,10 h20 v20 h-20 z M10,70 h20 v20 h-20 z M35,35 h15 v15 h-15 z M60,60 h10 v10 h-10 z" fill="#0f172a"/>
                        </svg>
                      </div>
                      
                      <div className={`scanner-status-text ${sandboxScanning ? 'verifying' : ''}`}>
                        {sandboxScanning ? '🔒 Decrypting JWT Nonce Signature...' : 'System Ready. Waiting for Scan.'}
                      </div>

                      <button 
                        className="btn btn-primary"
                        style={{ width: '100%', maxWidth: '240px' }}
                        onClick={triggerScanSimulation}
                        disabled={sandboxScanning}
                      >
                        {sandboxScanning ? 'Reading Cryptokey...' : 'Scan Guest QR Pass'}
                      </button>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <div className="checkmark-circle-animate">
                        <ShieldCheck size={36} />
                      </div>
                      
                      <div className="scanner-status-text verified">
                        ✓ GATE PASS VERIFIED
                      </div>

                      <div style={{ 
                        background: 'rgba(16, 185, 129, 0.06)', 
                        border: '1px solid rgba(16, 185, 129, 0.2)', 
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '13px',
                        color: '#065f46',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        width: '260px'
                      }}>
                        <div><strong>Guest Name:</strong> {sandboxName}</div>
                        <div><strong>Vehicle:</strong> {sandboxVehicleNo} ({sandboxVehicle})</div>
                        <div><strong>Bay Allocated:</strong> {sandboxSlot}</div>
                        <div><strong>Gate Action:</strong> Gate-1 Open Signal Sent</div>
                      </div>

                      <button 
                        className="btn btn-outline-glow"
                        onClick={resetSandbox}
                        style={{ width: '100%', minWidth: '180px' }}
                      >
                        Reset Simulator
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
         6. SECURITY ARCHITECTURE SHOWCASE
         ==================================================== */}
      <section className="security-section" id="security">
        <div className="container">
          <div className="security-grid">
            <div className="security-illustrations">
              <div className="security-radial-decor"></div>
              <div className="security-shield-card">
                <Shield size={68} strokeWidth={1.5} />
                <h4>Shield Protocol Active</h4>
                <p>
                  <CheckCircle2 size={12} />
                  ISO 27001 Cryptography
                </p>
              </div>
            </div>

            <div className="security-info-panel">
              <div className="section-header" style={{ textAlign: 'left', margin: '0 0 40px 0' }}>
                <span className="section-tag">Fortress Architecture</span>
                <h2>Military-Grade Gate Integrity</h2>
                <p>We treat every entry as a secure ledger transaction. No fake passes, no replay duplicates, no unauthorized logins.</p>
              </div>

              <div className="security-list">
                <div className="security-list-item">
                  <div className="security-item-icon">
                    <Lock size={18} />
                  </div>
                  <div className="security-item-text">
                    <h3>Tamper-Proof QR Codes</h3>
                    <p>Each parking ticket is signed cryptographically utilizing JSON Web Tokens. Modifying parking details locally invalidates the ticket signature instantly.</p>
                  </div>
                </div>

                <div className="security-list-item">
                  <div className="security-item-icon">
                    <Smartphone size={18} />
                  </div>
                  <div className="security-item-text">
                    <h3>Anti-Replay Expirations</h3>
                    <p>Pass QR codes cycle every 45 seconds to prevent static screenshot capturing and gate playback exploitation.</p>
                  </div>
                </div>

                <div className="security-list-item">
                  <div className="security-item-icon">
                    <Users size={18} />
                  </div>
                  <div className="security-item-text">
                    <h3>Secure Biometric Access</h3>
                    <p>Resident mobile apps require FaceID or fingerprint checks before processing booking handovers or lease revenue withdrawals.</p>
                  </div>
                </div>

                <div className="security-list-item">
                  <div className="security-item-icon">
                    <CreditCard size={18} />
                  </div>
                  <div className="security-item-text">
                    <h3>Instant Payment Verification</h3>
                    <p>Our direct hooks securely check Razorpay ledgers at scanning time. Passes only unlock if payment verification nonces return success.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
         7. BETA ACCESS REGISTRATION FORM
         ==================================================== */}
      <section className="beta-section" id="beta-form">
        <div className="container">
          <div className="beta-form-container">
            <div className="glass-card beta-form-box">
              <canvas ref={canvasRef} className="confetti-canvas-overlay"></canvas>
              
              {!isSubmitted ? (
                <>
                  <div className="badge badge-glow" style={{ margin: '0 auto 16px auto', display: 'flex', width: 'fit-content' }}>
                    <Sparkles size={13} />
                    <span>Free Premium Trial Available</span>
                  </div>
                  <h3>Get Beta Access to ParkEase</h3>
                  <p className="form-desc">Register your society today. Setup is fully automated and takes less than 10 minutes.</p>

                  <form className="beta-form" onSubmit={handleFormSubmit}>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label className="form-label">
                          <User size={13} />
                          Full Name
                        </label>
                        <div className="form-input-wrapper">
                          <User className="form-input-icon" size={16} />
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. Ramesh Kumar" 
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <Mail size={13} />
                          Email Address
                        </label>
                        <div className="form-input-wrapper">
                          <Mail className="form-input-icon" size={16} />
                          <input 
                            type="email" 
                            className="form-input" 
                            placeholder="name@society.com" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Building2 size={13} />
                        Society / Premises Name
                      </label>
                      <div className="form-input-wrapper">
                        <Building2 className="form-input-icon" size={16} />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. Green Valley Residency" 
                          required
                          value={societyName}
                          onChange={(e) => setSocietyName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group slider-container">
                      <div className="slider-val-box">
                        <span className="form-label" style={{ padding: 0 }}>
                          <BarChart3 size={13} style={{ marginRight: '6px' }} />
                          Society Parking Capacity
                        </span>
                        <span style={{ color: '#4f46e5', fontWeight: '800' }}>{parkingCapacity} Vehicles</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="800" 
                        step="10"
                        className="capacity-slider" 
                        value={parkingCapacity}
                        onChange={(e) => setParkingCapacity(Number(e.target.value))}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ height: '48px', marginTop: '10px' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Securing Portal Registration...' : 'Submit Beta Access Request'}
                    </button>
                  </form>
                </>
              ) : (
                /* Success Ticket visual display */
                <div className="ticket-wrapper">
                  <div className="virtual-ticket">
                    <div className="ticket-header">
                      <span className="ticket-header-logo">
                        <QrCode size={22} />
                        ParkEase Pass
                      </span>
                      <span className="ticket-badge">
                        ✓ VIP ACCESS
                      </span>
                    </div>

                    <div className="ticket-body">
                      <div className="ticket-info">
                        <div className="ticket-field">
                          <span className="ticket-label">Holder Name</span>
                          <span className="ticket-val">{fullName}</span>
                        </div>

                        <div className="form-group-row" style={{ gap: '20px' }}>
                          <div className="ticket-field">
                            <span className="ticket-label">Society Premise</span>
                            <span className="ticket-val" style={{ fontSize: '14px' }}>{societyName}</span>
                          </div>
                          <div className="ticket-field">
                            <span className="ticket-label">Setup Capacity</span>
                            <span className="ticket-val" style={{ fontSize: '14px' }}>{parkingCapacity} Bays</span>
                          </div>
                        </div>

                        <div className="ticket-field">
                          <span className="ticket-label">Beta Register Email</span>
                          <span className="ticket-val" style={{ fontSize: '13px', color: '#cbd5e1' }}>{email}</span>
                        </div>
                      </div>

                      <div className="ticket-qr-area">
                        {/* Custom vector QR code matching names */}
                        <svg viewBox="0 0 100 100" className="ticket-qr-svg">
                          <rect width="100" height="100" fill="#ffffff"/>
                          <path d="M10,10 h20 v20 h-20 z M70,10 h20 v20 h-20 z M10,70 h20 v20 h-20 z M35,35 h30 v10 h-30 z M45,45 h15 v20 h-15 z M70,70 h20 v20 h-20 z M30,55 h10 v10 h-10 z" fill="#0f172a"/>
                          <rect x="42" y="42" width="16" height="16" rx="4" fill="#c084fc" />
                        </svg>
                        <span className="ticket-qr-id">{generatedTicketId.substring(0, 15)}</span>
                      </div>
                    </div>

                    <div className="ticket-footer">
                      <span>Generated: {new Date().toLocaleDateString()}</span>
                      <span>ParkEase Onboarding Portal v1.0</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button className="btn btn-primary" onClick={handleDownloadTicket}>
                      <Download size={16} style={{ marginRight: '8px' }} />
                      Download Beta Pass
                    </button>
                    <button className="btn btn-secondary" onClick={() => setIsSubmitted(false)}>
                      Register Another Society
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
         8. DEMO MODAL POPUP DIALOG (INTERACTIVE WALKTHROUGH)
         ==================================================== */}
      {demoModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }} onClick={() => setDemoModalOpen(false)}>
          <div style={{
            width: '100%',
            maxWidth: '700px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Play size={16} fill="#4f46e5" style={{ color: '#4f46e5' }} />
                ParkEase Platform Video Walkthrough
              </span>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setDemoModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Simulated interactive video body */}
            <div style={{
              background: '#0f172a',
              height: '380px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                Platform Demo: Resident App &amp; Admin Panel
              </div>

              {/* Vector/CSS UI simulator representing app onboarding */}
              <div style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
                animation: 'scale-up-bounce 0.8s ease forwards'
              }}>
                <div style={{
                  width: '120px',
                  height: '220px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ fontWeight: '800', color: '#c084fc', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '4px' }}>Resident Portal</div>
                  <div style={{ background: '#7c3aed', padding: '6px', borderRadius: '4px' }}>🚗 Book Guest Slot</div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                    <svg viewBox="0 0 100 100" style={{ width: '40px', height: '40px', margin: '0 auto 4px auto' }}>
                      <rect width="100" height="100" fill="#ffffff" />
                      <rect x="10" y="10" width="30" height="30" fill="#0f172a" />
                      <rect x="60" y="60" width="30" height="30" fill="#0f172a" />
                    </svg>
                    Send QR Pass
                  </div>
                </div>

                <div style={{ fontSize: '24px', color: '#a78bfa' }}>➔</div>

                <div style={{
                  width: '120px',
                  height: '220px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px',
                  fontSize: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ fontWeight: '800', color: '#06b6d4', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '4px' }}>Guard Scanner</div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', height: '80px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                    📷 Scan QR Code
                  </div>
                  <div style={{ background: '#10b981', padding: '6px', borderRadius: '4px', color: '#ffffff', textAlign: 'center', fontWeight: '800' }}>✓ ACCESS APPROVED</div>
                </div>
              </div>
            </div>

            {/* Modal footer controls */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(15, 23, 42, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} />
                No physical hardware requires setup. Works on guard smartphones.
              </span>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => { setDemoModalOpen(false); scrollToSection('beta-form'); }}>
                Get Beta Access Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
         9. FOOTER SECTION
         ==================================================== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="footer-logo" onClick={() => scrollToSection('top')}>
                <QrCode size={26} strokeWidth={2.5} />
                <span>Park<span style={{ color: '#c084fc' }}>Ease</span></span>
              </a>
              <p className="footer-desc">
                High-performance, secure QR-based smart parking solutions engineered specifically for modern residential housing societies and multi-tenant commercial structures.
              </p>
              <div className="footer-socials">
                {/* Social media mock button icons */}
                {['𝕏', 'in', '🖨️', '💬'].map((s, idx) => (
                  <a key={idx} href="#" className="social-badge" onClick={(e) => e.preventDefault()}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{s}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-col">
              <h4>Platform</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>QR Gates</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Slot Allocations</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Guard Scanner App</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Razorpay Vault</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setDemoModalOpen(true); }}>Watch Walkthrough</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>API Documentation</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Integrations</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Beta Release Log</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>About</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => e.preventDefault()}>Our Mission</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Contact Sales</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} ParkEase Platforms Inc. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Security Audits</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
