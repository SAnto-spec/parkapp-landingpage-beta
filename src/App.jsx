import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, MapPin, CreditCard, Smartphone, LayoutDashboard, Calendar, Lock, AlertOctagon,
  ShieldCheck, BookOpen, Users, BarChart3, ShieldAlert, Shield, ArrowRight, CheckCircle2,
  User, Mail, Building2, Play, Sparkles, Menu, X, ChevronRight, Download, Laptop, FileText, Info,
  Copy, Terminal, Search, Database, RefreshCw, Code
} from 'lucide-react';


// ====================================================
// PARKWISE PLATFORM DEV PORTAL API SCHEMAS
// ====================================================
const API_DOCS_DATA = [
  {
    id: 'overview',
    title: 'Overview & Base URLs',
    category: 'Getting Started',
    auth: 'None',
    desc: 'Welcome to the ParkWise Platform API reference portal. The ParkWise REST API powers the mobile apps, guard exit/entry scanners, resident portals, and admin management consoles. All endpoints are versioned under /api/v1 and return JSON-formatted payloads.',
    customHtml: 'overview'
  },
  {
    id: 'authentication',
    title: 'Authentication & Enums',
    category: 'Getting Started',
    auth: 'None',
    desc: 'Protected endpoints require JWT authentication. Obtain an access token via /login/ or /register/ and pass it in the Authorization header as a Bearer credentials object.',
    customHtml: 'authentication'
  },
  {
    id: 'auth-register',
    title: 'Register Resident/Admin',
    category: 'Authentication',
    method: 'POST',
    path: '/api/v1/auth/register/',
    auth: 'Public',
    desc: 'Registers a normal resident user or a society administrator. A resident can optionally submit a society join code (e.g. AB12CD34) to create a pending membership request. An admin must submit society profiles.',
    params: [
      { name: 'email', type: 'string', required: true, desc: 'Unique email address' },
      { name: 'phone', type: 'string', required: true, desc: '10-digit mobile number' },
      { name: 'full_name', type: 'string', required: true, desc: 'Full legal name' },
      { name: 'password', type: 'string', required: true, desc: 'Minimum 8 characters with numbers/symbols' },
      { name: 'role', type: 'string', required: true, desc: 'Must be "user" or "society_admin"' },
      { name: 'society_join_code', type: 'string', required: false, desc: 'For users joining a society (e.g., AB12CD34)' },
      { name: 'flat_number', type: 'string', required: false, desc: 'Flat number identifier (e.g., A-401)' }
    ],
    requestHeaders: { 'Content-Type': 'application/json' },
    requestBody: {
      email: "user@example.com",
      phone: "9876543210",
      full_name: "Example User",
      password: "Password@123",
      role: "user",
      society_join_code: "AB12CD34",
      flat_number: "A-401",
      floor_number: "4"
    },
    responseBody: {
      user: {
        id: "usr_9a8b7c6d",
        email: "user@example.com",
        phone: "9876543210",
        full_name: "Example User",
        role: "user",
        approval_status: "approved",
        society: null,
        society_name: null
      },
      membership_status: "pending_approval",
      tokens: {
        refresh: "eyJhbGciOiJIUzI1NiIsInR5...",
        access: "eyJhbGciOiJIUzI1NiIsInR5..."
      }
    }
  },
  {
    id: 'auth-login',
    title: 'User Login',
    category: 'Authentication',
    method: 'POST',
    path: '/api/v1/auth/login/',
    auth: 'Public',
    desc: 'Exchange credentials (email and password) for valid JWT access and refresh tokens. Access tokens expire after 30 minutes, and refresh tokens can be rotated for up to 7 days.',
    params: [
      { name: 'email', type: 'string', required: true, desc: 'Registered email address' },
      { name: 'password', type: 'string', required: true, desc: 'Account password' }
    ],
    requestHeaders: { 'Content-Type': 'application/json' },
    requestBody: {
      email: "user@example.com",
      password: "Password@123"
    },
    responseBody: {
      refresh: "eyJhbGciOiJIUzI1NiIsInR5...",
      access: "eyJhbGciOiJIUzI1NiIsInR5..."
    }
  },
  {
    id: 'auth-profile',
    title: 'Get/Update Profile',
    category: 'Authentication',
    method: 'PATCH',
    path: '/api/v1/auth/profile/',
    auth: 'Bearer JWT',
    desc: 'Retrieves or partially updates details of the authenticated user. Fields like phone, full_name, flat_number, and floor_number can be patched.',
    params: [
      { name: 'full_name', type: 'string', required: false, desc: 'Updated legal name' },
      { name: 'flat_number', type: 'string', required: false, desc: 'Updated flat identifier' },
      { name: 'floor_number', type: 'string', required: false, desc: 'Updated floor level' }
    ],
    requestBody: {
      full_name: "Updated Name",
      flat_number: "B-202",
      floor_number: "2"
    },
    responseBody: {
      id: "usr_9a8b7c6d",
      email: "user@example.com",
      phone: "9876543210",
      full_name: "Updated Name",
      role: "user",
      flat_number: "B-202",
      floor_number: "2",
      approval_status: "approved"
    }
  },
  {
    id: 'vehicles',
    title: 'Add User Vehicle',
    category: 'Authentication',
    method: 'POST',
    path: '/api/v1/auth/vehicles/',
    auth: 'Bearer JWT',
    desc: 'Registers a personal vehicle (car or bike) under the user account. Soft delete is supported via DELETE method which marks vehicle active status as false.',
    params: [
      { name: 'vehicle_type', type: 'string', required: true, desc: 'Must be "car" or "bike"' },
      { name: 'registration_no', type: 'string', required: true, desc: 'Plate registration number (e.g. MH01AB1234)' },
      { name: 'make_model', type: 'string', required: true, desc: 'Vehicle make and model description (e.g. Hyundai i20)' }
    ],
    requestBody: {
      vehicle_type: "car",
      registration_no: "MH01AB1234",
      make_model: "Hyundai i20"
    },
    responseBody: {
      id: "veh_1a2b3c4d",
      vehicle_type: "car",
      registration_no: "MH01AB1234",
      make_model: "Hyundai i20",
      is_active: true
    }
  },
  {
    id: 'societies-public',
    title: 'Public Society List',
    category: 'Societies & Places',
    method: 'GET',
    path: '/api/v1/societies/public/',
    auth: 'Public',
    desc: 'Returns a list of all active registered housing societies on the ParkWise network along with total capacity and current available slot counters.',
    params: [],
    responseBody: [
      {
        id: "soc_5e4f3g2h",
        name: "Green Heights Society",
        city: "Mumbai",
        pincode: "400001",
        total_slots: 40,
        available_slots: 18
      },
      {
        id: "soc_7x8y9z0w",
        name: "Palace Orchards",
        city: "Mumbai",
        pincode: "400053",
        total_slots: 80,
        available_slots: 34
      }
    ]
  },
  {
    id: 'societies-search',
    title: 'Search Available Parking',
    category: 'Societies & Places',
    method: 'POST',
    path: '/api/v1/societies/search/',
    auth: 'Bearer JWT',
    desc: 'Searches nearby housing societies that have at least one approved slot available for the requested time frame, duration, and vehicle type within a specified radius.',
    params: [
      { name: 'destination_text', type: 'string', required: true, desc: 'Name of destination landmark (e.g. Bandra West)' },
      { name: 'destination_lat', type: 'number', required: true, desc: 'Latitude coordinate of destination' },
      { name: 'destination_lng', type: 'number', required: true, desc: 'Longitude coordinate of destination' },
      { name: 'booking_date', type: 'string', required: true, desc: 'Format YYYY-MM-DD' },
      { name: 'start_time', type: 'string', required: true, desc: 'Format HH:MM:SS' },
      { name: 'duration_minutes', type: 'number', required: true, desc: 'Duration in minutes (Min: 30, Max: 1440)' },
      { name: 'vehicle_type', type: 'string', required: true, desc: 'Must be "car" or "bike"' },
      { name: 'search_radius_km', type: 'number', required: false, desc: 'Default: 10km' }
    ],
    requestBody: {
      destination_text: "Bandra West",
      destination_lat: 19.0600,
      destination_lng: 72.8365,
      booking_date: "2026-05-18",
      start_time: "14:00:00",
      duration_minutes: 120,
      vehicle_type: "car",
      search_radius_km: 10
    },
    responseBody: [
      {
        society_id: "soc_5e4f3g2h",
        society_name: "Green Heights",
        distance_km: 3.4,
        hourly_rate: "50.00",
        available_slots_count: 5,
        latitude: 19.0760,
        longitude: 72.8777
      }
    ]
  },
  {
    id: 'slots-list',
    title: 'List Slots in Society',
    category: 'Parking Slots',
    method: 'GET',
    path: '/api/v1/societies/{society_id}/slots/',
    auth: 'Bearer JWT',
    desc: 'Lists all slots inside a specific housing society. Supports highly active parameters for filtering availability by booking date, start time, and duration.',
    params: [
      { name: 'slot_type', type: 'string', required: false, desc: 'Filter by type: "car" or "bike"' },
      { name: 'state', type: 'string', required: false, desc: 'Filter by state: "available", "reserved", etc.' },
      { name: 'booking_date', type: 'string', required: false, desc: 'Required when testing active availability (YYYY-MM-DD)' },
      { name: 'start_time', type: 'string', required: false, desc: 'Required when testing active availability (HH:MM:SS)' },
      { name: 'duration_minutes', type: 'number', required: false, desc: 'Filter by duration window' }
    ],
    responseBody: [
      {
        id: "slt_4a3b2c1d",
        slot_number: "A-101",
        floor: "1",
        slot_type: "car",
        hourly_rate: "50.00",
        state: "available"
      }
    ]
  },
  {
    id: 'bookings-create',
    title: 'Create Booking Lock',
    category: 'Bookings & QR',
    method: 'POST',
    path: '/api/v1/bookings/',
    auth: 'Bearer JWT',
    desc: 'Creates a 5-minute pre-booking lock on the designated slot. The booking status remains pending_payment until payment verification succeeds.',
    params: [
      { name: 'slot_id', type: 'string', required: true, desc: 'UUID identifier of the target slot' },
      { name: 'vehicle_id', type: 'string', required: true, desc: 'UUID identifier of the user vehicle' },
      { name: 'start_time', type: 'string', required: true, desc: 'ISO 8601 string (e.g. 2026-05-18T14:00:00+05:30)' },
      { name: 'end_time', type: 'string', required: true, desc: 'ISO 8601 string (e.g. 2026-05-18T16:00:00+05:30)' }
    ],
    requestBody: {
      slot_id: "slt_4a3b2c1d",
      vehicle_id: "veh_1a2b3c4d",
      start_time: "2026-05-18T14:00:00+05:30",
      end_time: "2026-05-18T16:00:00+05:30"
    },
    responseBody: {
      id: "bkg_0z9y8x7w",
      booking_number: "BK-20260518-ABC123",
      amount: "100.00",
      status: "pending_payment",
      payment_status: "created",
      lock_expires_at: "2026-05-18T13:15:00Z"
    }
  },
  {
    id: 'payments-initiate',
    title: 'Initiate Checkout Payment',
    category: 'Payments',
    method: 'POST',
    path: '/api/v1/payments/initiate/',
    auth: 'Bearer JWT',
    desc: 'Initiates a payment session via Stripe or Razorpay for a pending booking. Returns the gateway session IDs and direct checkout redirect URLs.',
    params: [
      { name: 'booking_id', type: 'string', required: true, desc: 'UUID of the pending booking' },
      { name: 'gateway', type: 'string', required: true, desc: 'Gateway: "stripe" or "razorpay"' },
      { name: 'embedded', type: 'boolean', required: false, desc: 'Use embedded checkout sheets (Stripe only)' }
    ],
    requestBody: {
      booking_id: "bkg_0z9y8x7w",
      gateway: "stripe",
      embedded: false
    },
    responseBody: {
      id: "pay_1c2d3e4f",
      booking: "bkg_0z9y8x7w",
      payment_type: "booking",
      amount: "100.00",
      currency: "INR",
      provider: "stripe",
      stripe_checkout_session_id: "cs_test_a1b2c3d4",
      status: "created",
      checkout_url: "https://checkout.stripe.com/pay/cs_test_a1b2c3d4"
    }
  },
  {
    id: 'qr-entry',
    title: 'Validate Entry Scan',
    category: 'QR Gate Scans',
    method: 'POST',
    path: '/api/v1/qr/entry/',
    auth: 'Bearer JWT (Guard)',
    desc: 'Submitted by gate guards equipped with can_scan_entry permissions. Decrypts the signed QR token, registers gate entry time, sets booking state to active, and marks slot occupied.',
    params: [
      { name: 'qr_token', type: 'string', required: true, desc: 'Signed, cryptographically secure booking QR token' }
    ],
    requestBody: {
      qr_token: "signed-booking-qr-token-abcde..."
    },
    responseBody: {
      status: "entry_granted",
      booking_id: "bkg_0z9y8x7w",
      booking_number: "BK-20260518-ABC123",
      slot_number: "A-101",
      vehicle_number: "MH01AB1234",
      owner_name: "Example User",
      payment_status: "captured",
      entry_time: "2026-05-18T14:05:00+05:30",
      exit_time: null,
      overstay: false,
      penalty: null
    }
  },
  {
    id: 'penalties-list',
    title: 'List Unpaid Penalties',
    category: 'Penalties',
    method: 'GET',
    path: '/api/v1/penalties/',
    auth: 'Bearer JWT',
    desc: 'Retrieves all unpaid/paid overstay and layout violation penalties assigned to the authenticated user account.',
    params: [
      { name: 'status', type: 'string', required: false, desc: 'Filter by: "unpaid", "paid", "waived"' }
    ],
    responseBody: [
      {
        id: "pnl_4d3e2f1g",
        booking: "bkg_0z9y8x7w",
        amount: "150.00",
        reason: "Overstay violation (32 minutes over layout booking limits)",
        status: "unpaid"
      }
    ]
  }
];

// Custom JSON syntax colorizer helper
function highlightJson(obj) {
  if (!obj) return '';
  const jsonStr = JSON.stringify(obj, null, 2);
  return jsonStr.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

// cURL dynamic code snippet generator
function generateCurl(endpoint) {
  const method = endpoint.method || 'GET';
  const url = `https://api.parkease.com${endpoint.path || ''}`;
  let curl = `<span class="curl-method">curl</span> -X <span class="curl-method">${method}</span> <span class="curl-url">"${url}"</span> \\\n`;
  
  if (endpoint.auth === 'Bearer JWT' || endpoint.auth === 'Bearer JWT (Guard)') {
    curl += `  -H <span class="curl-header">"Authorization: Bearer YOUR_ACCESS_TOKEN"</span> \\\n`;
  }
  
  if (endpoint.requestHeaders) {
    Object.entries(endpoint.requestHeaders).forEach(([key, val]) => {
      curl += `  -H <span class="curl-header">"${key}: ${val}"</span> \\\n`;
    });
  }
  
  if (endpoint.requestBody && Object.keys(endpoint.requestBody).length > 0) {
    curl += `  -d <span class="curl-data">'${JSON.stringify(endpoint.requestBody, null, 2)}'</span>`;
  } else {
    curl = curl.trim().replace(/\\\s*$/, '');
  }
  return curl;
}

// JavaScript Fetch dynamic code snippet generator
function generateJS(endpoint) {
  const method = endpoint.method || 'GET';
  const url = `https://api.parkease.com${endpoint.path || ''}`;
  let jsCode = `<span class="json-key">const</span> response = <span class="json-key">await</span> fetch(<span class="json-string">"${url}"</span>, {\n`;
  jsCode += `  method: <span class="json-string">"${method}"</span>,\n`;
  
  jsCode += `  headers: {\n`;
  if (endpoint.auth === 'Bearer JWT' || endpoint.auth === 'Bearer JWT (Guard)') {
    jsCode += `    <span class="json-string">"Authorization"</span>: <span class="json-string">"Bearer YOUR_ACCESS_TOKEN"</span>,\n`;
  }
  if (endpoint.requestHeaders) {
    Object.entries(endpoint.requestHeaders).forEach(([key, val]) => {
      jsCode += `    <span class="json-string">"${key}"</span>: <span class="json-string">"${val}"</span>,\n`;
    });
  }
  jsCode += `  },\n`;
  
  if (endpoint.requestBody && Object.keys(endpoint.requestBody).length > 0) {
    jsCode += `  body: JSON.stringify(${JSON.stringify(endpoint.requestBody, null, 2).replace(/\n/g, '\n  ')})\n`;
  }
  jsCode += `});\n`;
  jsCode += `<span class="json-key">const</span> data = <span class="json-key">await</span> response.json();`;
  return jsCode;
}

// Python requests dynamic code snippet generator
function generatePython(endpoint) {
  const method = (endpoint.method || 'GET').toLowerCase();
  const url = `https://api.parkease.com${endpoint.path || ''}`;
  let py = `<span class="json-key">import</span> requests\n\n`;
  py += `url = <span class="json-string">"${url}"</span>\n`;
  py += `headers = {\n`;
  if (endpoint.auth === 'Bearer JWT' || endpoint.auth === 'Bearer JWT (Guard)') {
    py += `    <span class="json-string">"Authorization"</span>: <span class="json-string">"Bearer YOUR_ACCESS_TOKEN"</span>,\n`;
  }
  if (endpoint.requestHeaders) {
    Object.entries(endpoint.requestHeaders).forEach(([key, val]) => {
      py += `    <span class="json-string">"${key}"</span>: <span class="json-string">"${val}"</span>,\n`;
    });
  }
  py += `}\n`;
  
  if (endpoint.requestBody && Object.keys(endpoint.requestBody).length > 0) {
    py += `data = ${JSON.stringify(endpoint.requestBody, null, 4).replace(/true/g, 'True').replace(/false/g, 'False').replace(/null/g, 'None')}\n`;
    py += `response = requests.${method}(url, headers=headers, json=data)\n`;
  } else {
    py += `response = requests.${method}(url, headers=headers)\n`;
  }
  py += `print(response.json())`;
  return py;
}

function App() {
  // Navigation & UI States
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Stripe/Supabase Style Portal States
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'docs'
  const [activeDocsSection, setActiveDocsSection] = useState('overview');
  const [apiSearchQuery, setApiSearchQuery] = useState('');
  const [docsCodeTab, setDocsCodeTab] = useState('curl'); // 'curl', 'js', 'py', 'response'
  const [docsCopied, setDocsCopied] = useState(false);


  
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

  if (currentView === 'docs') {
    const activeSectionData = API_DOCS_DATA.find(item => item.id === activeDocsSection);
    const filteredDocsData = API_DOCS_DATA.filter(item => 
      item.title.toLowerCase().includes(apiSearchQuery.toLowerCase()) || 
      item.category.toLowerCase().includes(apiSearchQuery.toLowerCase()) ||
      (item.path && item.path.toLowerCase().includes(apiSearchQuery.toLowerCase()))
    );

    return (
      <div className="dev-portal">
        {/* Portal Header */}
        <nav className="portal-navbar">
          <div className="portal-navbar-container">
            <a href="#" className="navbar-logo" style={{ color: '#ffffff' }} onClick={(e) => { e.preventDefault(); setCurrentView('landing'); }}>
              <QrCode size={28} strokeWidth={2.5} />
              <span style={{ color: '#ffffff' }}>
                Park<span className="text-gradient">Ease</span>
                <span className="portal-header-badge">Developer API Docs</span>
              </span>
            </a>

            <div className="portal-nav-links">
              <a href="#" className="portal-nav-link active" onClick={(e) => e.preventDefault()}>API Reference</a>
              <button 
                className="btn btn-primary portal-back-btn" 
                style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '6px', background: 'var(--grad-primary)' }}
                onClick={() => { playBeep(450, 80); setCurrentView('landing'); }}
              >
                <span className="btn-text-desktop">Back to Landing Page</span>
                <span className="btn-text-mobile">Back</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Portal Layout */}
        <div className="portal-layout">
          {/* 1. Sidebar */}
          <div className="portal-sidebar">
            <div className="portal-sidebar-search-wrapper">
              <Search className="portal-sidebar-search-icon" size={16} />
              <input 
                type="text" 
                className="portal-sidebar-search-input" 
                placeholder="Search endpoints..." 
                value={apiSearchQuery}
                onChange={(e) => setApiSearchQuery(e.target.value)}
              />
            </div>

            {/* Group by category */}
            {Object.entries(
              filteredDocsData.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
              }, {})
            ).map(([category, items]) => (
              <div key={category} className="portal-sidebar-group">
                <div className="portal-sidebar-group-title">{category}</div>
                <div className="portal-sidebar-items">
                  {items.map(item => (
                    <a 
                      key={item.id} 
                      className={`portal-sidebar-item ${activeDocsSection === item.id ? 'active' : ''}`}
                      onClick={() => { playBeep(520, 50); setActiveDocsSection(item.id); }}
                    >
                      <span>{item.title}</span>
                      {item.method && (
                        <span className={`portal-sidebar-item-method ${item.method.toLowerCase()}`}>
                          {item.method}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
            
            {filteredDocsData.length === 0 && (
              <div style={{ padding: '16px', fontSize: '12px', color: '#475569', textAlign: 'center' }}>
                No endpoints found
              </div>
            )}
          </div>

          {/* 2. Middle Pane */}
          <div className="portal-main-pane">
            <div className="portal-mobile-selector">
              <label htmlFor="mobile-endpoint-select">Select API Reference Endpoint:</label>
              <select
                id="mobile-endpoint-select"
                value={activeDocsSection}
                onChange={(e) => { playBeep(520, 50); setActiveDocsSection(e.target.value); }}
              >
                {API_DOCS_DATA.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.method ? `[${item.method}] ` : ''}{item.title}
                  </option>
                ))}
              </select>
            </div>

            {activeSectionData ? (
              <>
                <div className="portal-endpoint-header">
                  <div className="portal-endpoint-title-row">
                    <h1>{activeSectionData.title}</h1>
                    {activeSectionData.method && (
                      <span className={`portal-endpoint-method-badge ${activeSectionData.method.toLowerCase()}`}>
                        {activeSectionData.method}
                      </span>
                    )}
                  </div>
                  
                  {activeSectionData.path && (
                    <div className="portal-endpoint-path-bar">
                      <Terminal size={14} style={{ color: '#7c3aed' }} />
                      <span>{activeSectionData.path}</span>
                    </div>
                  )}

                  {activeSectionData.auth && activeSectionData.auth !== 'None' && (
                    <span className="portal-endpoint-auth-badge">
                      <Lock size={12} style={{ marginRight: '4px' }} />
                      {activeSectionData.auth}
                    </span>
                  )}
                </div>

                <div className="portal-endpoint-desc">
                  {activeSectionData.desc}
                </div>

                {/* Custom HTML blocks */}
                {activeSectionData.customHtml === 'overview' && (
                  <div className="portal-custom-overview">
                    <div className="portal-guide-box">
                      <div className="portal-guide-title">
                        <Database size={18} style={{ color: '#a78bfa' }} />
                        <span>Base Server URLs</span>
                      </div>
                      <table className="portal-params-table" style={{ marginTop: '12px' }}>
                        <thead>
                          <tr>
                            <th>Environment</th>
                            <th>Target URL</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><span className="portal-param-name">Local Host Server</span></td>
                            <td><code>http://127.0.0.1:8000</code></td>
                            <td>Running backend server natively on local developer machine.</td>
                          </tr>
                          <tr>
                            <td><span className="portal-param-name">Android Emulator</span></td>
                            <td><code>http://10.0.2.2:8000</code></td>
                            <td>Used inside Android Virtual Devices (AVD) running on workstation.</td>
                          </tr>
                          <tr>
                            <td><span className="portal-param-name">Physical Device LAN</span></td>
                            <td><code>http://&lt;local-ip&gt;:8000</code></td>
                            <td>For testing real devices over local Wi-Fi router.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="portal-guide-box">
                      <div className="portal-guide-title">
                        <BookOpen size={18} style={{ color: '#a78bfa' }} />
                        <span>Built-in OpenAPI Specs</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
                        The backend comes with pre-integrated OpenAPI specifications and visual playgrounds.
                      </p>
                      <table className="portal-params-table" style={{ marginTop: '12px' }}>
                        <thead>
                          <tr>
                            <th>Method</th>
                            <th>Endpoint Route</th>
                            <th>Specification Output</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><span className="portal-sidebar-item-method get" style={{ fontSize: '10px', padding: '2px 6px' }}>GET</span></td>
                            <td><code>/api/docs/</code></td>
                            <td>Interactive Swagger UI interface mapping all models.</td>
                          </tr>
                          <tr>
                            <td><span className="portal-sidebar-item-method get" style={{ fontSize: '10px', padding: '2px 6px' }}>GET</span></td>
                            <td><code>/api/schema/</code></td>
                            <td>Raw JSON OpenAPI Specification schema output.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSectionData.customHtml === 'authentication' && (
                  <div className="portal-custom-auth">
                    <div className="portal-guide-box">
                      <div className="portal-guide-title">
                        <Lock size={18} style={{ color: '#a78bfa' }} />
                        <span>JWT Authentication Headers</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
                        Pass the raw JWT access token inside the request header as a bearer authentication credential. Access tokens live for 30 minutes.
                      </p>
                      <pre style={{ background: '#05070a', padding: '12px', borderRadius: '6px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', color: '#cbd5e1', marginTop: '12px' }}>
                        Authorization: Bearer YOUR_ACCESS_TOKEN<br />
                        Content-Type: application/json
                      </pre>
                    </div>

                    <div className="portal-guide-box">
                      <div className="portal-guide-title">
                        <Users size={18} style={{ color: '#a78bfa' }} />
                        <span>User Role Specifications</span>
                      </div>
                      <table className="portal-params-table" style={{ marginTop: '12px' }}>
                        <thead>
                          <tr>
                            <th>Role String</th>
                            <th>Assigned Authority</th>
                            <th>Standard Scope</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><span className="portal-param-name">"user"</span></td>
                            <td>Resident / Tenant</td>
                            <td>Manage vehicles, create bookings, settle payments, view personal passes.</td>
                          </tr>
                          <tr>
                            <td><span className="portal-param-name">"society_admin"</span></td>
                            <td>Committee Board</td>
                            <td>Approve resident profiles, register slots, add guard access keys.</td>
                          </tr>
                          <tr>
                            <td><span className="portal-param-name">"guard"</span></td>
                            <td>Gate Security Staff</td>
                            <td>Run entry/exit scanning tools to validate booking QR passes.</td>
                          </tr>
                          <tr>
                            <td><span className="portal-param-name">"super_admin"</span></td>
                            <td>Platform Owner</td>
                            <td>Manage global system dashboard analytics and register new complexes.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Parameters Table */}
                {activeSectionData.params && activeSectionData.params.length > 0 && (
                  <div className="portal-table-section">
                    <div className="portal-table-title">
                      <Database size={16} />
                      <span>Request parameters</span>
                    </div>
                    <table className="portal-params-table">
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Type</th>
                          <th>Requirement</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeSectionData.params.map(param => (
                          <tr key={param.name}>
                            <td>
                              <span className="portal-param-name">{param.name}</span>
                            </td>
                            <td>
                              <span className="portal-param-type-badge">{param.type}</span>
                            </td>
                            <td>
                              {param.required ? (
                                <span className="portal-param-required">required</span>
                              ) : (
                                <span className="portal-param-optional">optional</span>
                              )}
                            </td>
                            <td>{param.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>
                <h3>Select a section or endpoint to get started.</h3>
              </div>
            )}
          </div>

          {/* 3. Right Pane: Code Console */}
          <div className="portal-code-pane">
            {activeSectionData && (
              <>
                <div className="portal-code-box">
                  <div className="portal-code-box-header">
                    <div className="portal-code-box-tabs">
                      <button 
                        className={`portal-code-box-tab ${docsCodeTab === 'curl' ? 'active' : ''}`}
                        onClick={() => setDocsCodeTab('curl')}
                      >
                        cURL
                      </button>
                      <button 
                        className={`portal-code-box-tab ${docsCodeTab === 'js' ? 'active' : ''}`}
                        onClick={() => setDocsCodeTab('js')}
                      >
                        JavaScript
                      </button>
                      <button 
                        className={`portal-code-box-tab ${docsCodeTab === 'py' ? 'active' : ''}`}
                        onClick={() => setDocsCodeTab('py')}
                      >
                        Python
                      </button>
                    </div>

                    <button 
                      className="portal-copy-btn"
                      onClick={() => {
                        let text = '';
                        if (docsCodeTab === 'curl') text = generateCurl(activeSectionData).replace(/<[^>]*>/g, '');
                        if (docsCodeTab === 'js') text = generateJS(activeSectionData).replace(/<[^>]*>/g, '');
                        if (docsCodeTab === 'py') text = generatePython(activeSectionData).replace(/<[^>]*>/g, '');
                        navigator.clipboard.writeText(text);
                        setDocsCopied(true);
                        playBeep(800, 60);
                        setTimeout(() => setDocsCopied(false), 2000);
                      }}
                      title="Copy code to clipboard"
                    >
                      {docsCopied ? <CheckCircle2 size={16} style={{ color: '#34d399' }} /> : <Copy size={16} />}
                    </button>
                  </div>

                  <div className="portal-code-box-body">
                    <pre style={{ margin: 0 }}>
                      <code 
                        dangerouslySetInnerHTML={{
                          __html: docsCodeTab === 'curl' 
                            ? generateCurl(activeSectionData) 
                            : docsCodeTab === 'js' 
                            ? generateJS(activeSectionData) 
                            : generatePython(activeSectionData)
                        }}
                      />
                    </pre>
                  </div>
                </div>

                {activeSectionData.responseBody && (
                  <div className="portal-code-box">
                    <div className="portal-code-box-header">
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Expected JSON Response
                      </span>
                      <button 
                        className="portal-copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(activeSectionData.responseBody, null, 2));
                          setDocsCopied(true);
                          playBeep(800, 60);
                          setTimeout(() => setDocsCopied(false), 2000);
                        }}
                        title="Copy response body"
                      >
                        {docsCopied ? <CheckCircle2 size={16} style={{ color: '#34d399' }} /> : <Copy size={16} />}
                      </button>
                    </div>

                    <div className="portal-code-box-body">
                      <pre style={{ margin: 0 }}>
                        <code 
                          dangerouslySetInnerHTML={{
                            __html: highlightJson(activeSectionData.responseBody)
                          }}
                        />
                      </pre>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

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

          <div className="navbar-actions">
            <button 
              className="btn btn-outline-glow" 
              style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '8px', border: '1px solid var(--color-slate-300)', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ffffff', color: '#1e293b' }}
              onClick={() => { playBeep(520, 80); setCurrentView('docs'); }}
            >
              <Code size={14} />
              <span>API Docs</span>
            </button>
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
          <div className="mobile-drawer">
            <a href="#problems" onClick={(e) => { e.preventDefault(); scrollToSection('problems'); }}>Problems</a>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a>
            <a href="#security" onClick={(e) => { e.preventDefault(); scrollToSection('security'); }}>Security</a>
            <a href="#api-docs" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setCurrentView('docs'); playBeep(520, 80); }}>
              <Code size={16} />
              <span>API Docs</span>
            </a>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '8px', padding: '10px' }}
              onClick={() => { scrollToSection('beta-form'); setMobileMenuOpen(false); }}
            >
              Get Beta Access
            </button>
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
