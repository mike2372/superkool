import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Camera, 
  CheckCircle, 
  Plus, 
  ShoppingBag, 
  Trash2, 
  ChevronRight, 
  RefreshCw, 
  CheckSquare, 
  Square,
  FilePenLine,
  Image as ImageIcon,
  Check,
  QrCode,
  Eye,
  Copy
} from 'lucide-react';
import { Job, PartItem } from '../types';
import { MAP_IMAGE_URL } from '../data';
import CustomerReceipt from './CustomerReceipt';

interface TechJobDetailProps {
  job: Job | null;
  onBack: () => void;
  onUpdateJob: (updatedJob: Job) => void;
}

export default function TechJobDetail({ job, onBack, onUpdateJob }: TechJobDetailProps) {
  if (!job) {
    return (
      <div className="p-8 text-center bg-[#F4F1EE] min-h-screen flex flex-col items-center justify-center font-sans">
        <p className="text-slate-500 font-medium font-serif italic text-base">Please select a valid job to view details.</p>
        <button 
          onClick={onBack} 
          className="mt-4 bg-[#1A1A1A] hover:bg-[#E03C31] text-white px-5 py-2.5 rounded-none text-xs uppercase tracking-widest font-mono font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Live state clone for parts
  const [parts, setParts] = useState<PartItem[]>(job.parts);
  const [beforePhotos, setBeforePhotos] = useState<string[]>(job.beforePhotos);
  const [afterPhotos, setAfterPhotos] = useState<string[]>(job.afterPhotos);
  
  // Custom part form states
  const [showAddPart, setShowAddPart] = useState(false);
  const [customPartName, setCustomPartName] = useState('');
  const [customPartPrice, setCustomPartPrice] = useState('25.00');
  const [showMap, setShowMap] = useState(false);
  const [simulatedCustomerReceipt, setSimulatedCustomerReceipt] = useState(false);

  // Device Camera capturing state handlers
  const [cameraTarget, setCameraTarget] = useState<'before' | 'after' | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Manage physical webcam stream automatically on dialog request
  useEffect(() => {
    if (!cameraTarget) {
      setCameraError(null);
      return;
    }
    
    let activeStream: MediaStream | null = null;
    
    async function initCamera() {
      try {
        setCameraError(null);
        // Request back-facing or first available lens unit
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        }).catch(() => {
          return navigator.mediaDevices.getUserMedia({ video: true });
        });

        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      } catch (err: any) {
        console.warn("Could not activate device camera feed:", err);
        setCameraError(err?.message || "Webcam request was rejected or is physically busy. Please use simulated preview generation or device file upload trigger below.");
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [cameraTarget]);

  // Signature canvas states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Initialize canvas size and events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust for HighDPI / Retina screens
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.strokeStyle = '#1A1A1A'; // Charcoal drawing ink matching key print look
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [job.id]);

  // Construct a reactive representation of the current work state for summary handoff
  const liveJobForReceipt: Job = {
    ...job,
    parts: parts,
    beforePhotos: beforePhotos,
    afterPhotos: afterPhotos,
    clientSignature: hasSigned ? 'verified' : undefined
  };

  if (simulatedCustomerReceipt) {
    return (
      <CustomerReceipt 
        job={liveJobForReceipt} 
        onClose={() => setSimulatedCustomerReceipt(false)} 
      />
    );
  }

  // Handle signatures drawing
  const getCoordinates = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e.nativeEvent);
    if (!coords) return;

    isDrawing.current = true;
    setHasSigned(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const coords = getCoordinates(e.nativeEvent);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  // Toggle checks on parts
  const handleTogglePart = (partId: string) => {
    const next = parts.map(p => {
      if (p.id === partId) {
        return { ...p, checked: !p.checked };
      }
      return p;
    });
    setParts(next);
  };

  // Remove a part
  const handleRemovePart = (partId: string) => {
    setParts(parts.filter(p => p.id !== partId));
  };

  // Add custom parts
  const handleAddCustomPartForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPartName.trim()) return;
    const cleanPrice = parseFloat(customPartPrice) || 0.0;
    
    const newPart: PartItem = {
      id: `p-custom-${Date.now()}`,
      name: customPartName.trim(),
      description: 'Custom added part',
      price: cleanPrice,
      checked: true,
      isCustom: true
    };

    setParts([...parts, newPart]);
    setCustomPartName('');
    setCustomPartPrice('15.00');
    setShowAddPart(false);
  };

  // Capture current preview frame directly from HTML5 video element onto state vectors
  const handleCameraCapture = () => {
    if (!videoRef.current) return;
    try {
      const videoEl = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth || 640;
      canvas.height = videoEl.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        
        if (cameraTarget === 'before') {
          setBeforePhotos(prev => [...prev, dataUrl]);
        } else if (cameraTarget === 'after') {
          setAfterPhotos(prev => [...prev, dataUrl]);
        }
        
        setCameraTarget(null);
      }
    } catch (err: any) {
      alert(`Visual frame lock failed: ${err?.message || err}`);
    }
  };

  // Process mobile/system native file selection as custom Data URL
  const handleFileCaptureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (cameraTarget === 'before') {
            setBeforePhotos(prev => [...prev, reader.result as string]);
          } else if (cameraTarget === 'after') {
            setAfterPhotos(prev => [...prev, reader.result as string]);
          }
          setCameraTarget(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Robust simulation fallback with matching high-resolution context visuals
  const handleSimulateCustomCapture = () => {
    const beforeStash = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA-_C5LKy6EHHxHVOa0IL-XvULHlDJFH1KIH1GDEmkeZDOtMON-VWEtn3lR5-kGPlphukYbpsND21_UaSwijR_X0mVZZ7GTEBAX3pCguZhSYaQafTaubA5h6FQUHyJNviYphnOjPDGYwXR_yurIdnvxodjDxfz-BE1OJuR9sSzQP0OVkdE2-9WrFarbCL2mJURCzZFj-gHs-lMBN7V1JVwgmyKUc455NEWJMgiTHk-kiiXCsw5kPjnkMzf7sxvd1vtrBg4UUSUlXc8',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHXj9Q0V4jCsnH9qB9r50gK18R5vCq2Xh0rN4Vb683G8g2d2DURV8xJ62J_9Z2L0n9zU3'
    ];
    const afterStash = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCknIP5Au2iTKmqcEV_fsen32Kfs6KHnFPl3U83bTaumJ7uYaz7UX9XPgyew2qlG9xUSITYaQt0m5unhUrb-aRPmCA2QOuTmi-uvMLW3J9E-4yE3TuWO2fZj8IeRNtsKiuwoiX1fZZi-uGO0ghzILvvn463TNEIEbpztQopoWsU6QQ8D48rcCRUDvk9CSKWqZF8ap8T7FiRP1py81WxqEaikuPM8XWV8cHn1wIv7S6OfbgB72L8MRH4tV5lI7Ssu6UWH2vLtbWSjwM'
    ];

    if (cameraTarget === 'before') {
      const photo = beforeStash[Math.floor(Math.random() * beforeStash.length)];
      setBeforePhotos(prev => [...prev, photo]);
    } else {
      const photo = afterStash[Math.floor(Math.random() * afterStash.length)];
      setAfterPhotos(prev => [...prev, photo]);
    }
    setCameraTarget(null);
  };

  // Submit complete job updates
  const handleCompleteJobAction = () => {
    if (!hasSigned) {
      alert('Please obtain client signature representation below to confirm satisfactory completion.');
      return;
    }

    const canvas = canvasRef.current;
    const signatureStr = canvas ? canvas.toDataURL() : 'signed';

    const completed: Job = {
      ...job,
      status: 'completed',
      parts: parts,
      beforePhotos: beforePhotos,
      afterPhotos: afterPhotos,
      clientSignature: signatureStr,
    };

    onUpdateJob(completed);
    alert(`Success! Job #${job.id} has been fully completed. Client sign-off cached and registered.`);
    onBack();
  };

  // Calculate live summary
  const subtotalParts = parts.filter(p => p.checked).reduce((sum, p) => sum + p.price, 0);
  const finalTotalAmount = job.amount + subtotalParts;

  return (
    <div className="bg-[#F4F1EE] min-h-screen pb-32 relative select-none font-sans">
      {/* Subtle backing grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 relative z-10">
        
        {/* Back Link Row */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#1A1A1A]/10">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all bg-transparent border border-[#1A1A1A]/30 px-4 py-2 rounded-none cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E03C31]" />
            Back to Queue
          </button>
          
          <span className="text-[10px] font-mono text-slate-400 font-medium tracking-widest uppercase">
            Inspection Record: #{job.id}
          </span>
        </div>

        {/* Content Columns split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Main service card and GPS navigations */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Status & Title Card */}
            <section className="bg-[#F4F1EE] border border-[#1A1A1A]/15 p-6 rounded-none relative">
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
              <span className="bg-[#E03C31] text-white px-2.5 py-0.5 rounded-none text-[8px] font-mono font-bold uppercase tracking-widest mb-4 inline-block">
                Assigned Active Shift
              </span>
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mt-2">
                <div>
                  <h2 className="text-2xl font-serif italic text-[#1A1A1A] font-bold">
                    {job.title}
                  </h2>
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mt-1">
                    Client Name: {job.clientName}
                  </p>
                </div>
                
                <div className="sm:text-right">
                  <p className="text-xl font-mono font-black text-[#E03C31]">{job.timeRange.split(' - ')[0] || '14:30 PM'}</p>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">ETA: 15 MINS</p>
                </div>
              </div>
            </section>

            {/* Address & GPS Maps */}
            <section className="bg-[#F4F1EE] border border-[#1A1A1A]/15 p-6 rounded-none relative">
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#1A1A1A] text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/45">Location Coordinates</h3>
                    <p className="text-xs font-serif italic text-slate-700 leading-relaxed mt-1 whitespace-pre-line">
                      {job.address}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 shrink-0">
                  <button 
                    id="tech-show-map-btn"
                    onClick={() => {
                      setShowMap(!showMap);
                    }}
                    className={`px-5 py-2.5 rounded-none text-[10px] uppercase font-mono tracking-widest font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center border ${
                      showMap 
                        ? 'bg-[#E03C31] text-white border-[#E03C31]' 
                        : 'bg-transparent text-[#1A1A1A] border-[#1A1A1A]/30 hover:bg-[#1A1A1A]/5'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {showMap ? 'Hide Plan Map' : 'Show Map'}
                  </button>

                  <button 
                    id="tech-launch-gps-btn"
                    onClick={() => alert(`Launching external GPS navigation system to address: ${job.address}`)}
                    className="bg-[#1A1A1A] hover:bg-[#E03C31] text-white px-5 py-2.5 rounded-none text-[10px] uppercase font-mono tracking-widest font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center border border-black"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-current" />
                    Launch GPS
                  </button>
                </div>
              </div>

              {/* Map Layout & Navigation routing simulation */}
              {showMap ? (
                <div className="mt-6 border border-[#1A1A1A]/15 overflow-hidden bg-white animate-fade-in">
                  <div className="bg-[#1A1A1A] text-white px-4 py-2 text-[9px] font-mono uppercase tracking-widest flex items-center justify-between">
                    <span>Route simulation • Active guidance mode</span>
                    <span className="text-[#E03C31] font-bold">DISPATCH SECTOR OK</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12">
                    {/* Visual Segment */}
                    <div className="md:col-span-7 h-52 relative group border-r border-[#1A1A1A]/15">
                      <img 
                        alt="Site aerial maps" 
                        className="w-full h-full object-cover select-none grayscale group-hover:grayscale-0 transition-all duration-700" 
                        src={MAP_IMAGE_URL} 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-[#E03C31]/5 group-hover:bg-transparent transition-colors"></div>
                      <div className="absolute bottom-4 left-4 bg-[#F4F1EE] px-3 py-1.5 rounded-none border border-[#1A1A1A]/20 text-[9px] font-mono uppercase tracking-widest text-[#1A1A1A] flex items-center gap-1.5 shadow-md font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#E03C31] animate-ping"></span>
                        PLANNER TARGET LOCATED
                      </div>
                    </div>

                    {/* Routing metrics & text waypoints simulation */}
                    <div className="md:col-span-5 bg-[#F4F1EE]/30 p-4 flex flex-col justify-between font-mono text-[9px] uppercase tracking-wider">
                      <div>
                        <div className="border-b border-[#1A1A1A]/10 pb-2 mb-3">
                          <p className="text-[10px] font-bold text-[#E03C31]">Waypoint Navigation</p>
                          <p className="text-[8px] text-slate-400 normal-case mt-0.5">Optimized schedule routing</p>
                        </div>

                        <div className="space-y-3 normal-case leading-relaxed text-slate-700">
                          <div className="flex gap-2">
                            <span className="font-bold text-[#1A1A1A]">1.</span>
                            <span>Exit primary specialist HQ onto North-South Expressway. (1.5 km)</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-bold text-[#1A1A1A]">2.</span>
                            <span>Converge on regional flyover intersection. (3.8 km)</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-bold text-[#E03C31]">3.</span>
                            <span>Arrive at client site: <strong className="font-bold text-[#1A1A1A]">{job.clientName}</strong>.</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10 flex justify-between items-center text-[8px] text-slate-400">
                        <span>ETA: ~12-15 MINS</span>
                        <span>DISTANCE: 5.3 KM</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Tiny collapsed helper badge to invite interaction */
                <button 
                  onClick={() => setShowMap(true)}
                  className="mt-4 w-full bg-[#EBE7E2]/40 hover:bg-[#EBE7E2]/80 border border-dashed border-[#1A1A1A]/15 py-3 text-center text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-[#1A1A1A] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#E03C31]" />
                  Click "Show Map" to simulate directions & routes
                </button>
              )}
            </section>

            {/* Before / After Photo Evidence checklists */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Before Photos */}
              <div className="bg-[#F4F1EE] p-6 rounded-none border border-[#1A1A1A]/15 relative">
                <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#E03C31]" />
                  Pre-Service Evidence
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setCameraTarget('before')}
                    className="aspect-square bg-transparent hover:bg-black/5 rounded-none border border-dashed border-[#1A1A1A]/30 hover:border-[#E03C31] flex flex-col items-center justify-center transition-all cursor-pointer text-[#1A1A1A]/60 hover:text-[#E03C31]"
                  >
                    <Camera className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-mono uppercase tracking-wider">Snap Before</span>
                  </button>

                  {beforePhotos.map((url, i) => (
                    <div key={i} className="aspect-square bg-[#EBE7E2] rounded-none overflow-hidden border border-[#1A1A1A]/10 relative group">
                      <img alt="Pre-service condition" className="w-full h-full object-cover grayscale opacity-80" src={url} referrerPolicy="no-referrer" />
                      <button 
                        onClick={() => setBeforePhotos(beforePhotos.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-[#E03C31] text-white rounded-none flex items-center justify-center text-[10px] cursor-pointer"
                        title="Remove photo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* After Photos */}
              <div className="bg-[#F4F1EE] p-6 rounded-none border border-[#1A1A1A]/15 relative">
                <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#E03C31]" />
                  Completion Evidence
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setCameraTarget('after')}
                    className="aspect-square bg-transparent hover:bg-black/5 rounded-none border border-dashed border-[#1A1A1A]/30 hover:border-[#E03C31] flex flex-col items-center justify-center transition-all cursor-pointer text-[#1A1A1A]/60"
                  >
                    <Camera className="w-4 h-4 mb-1 text-current" />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-current">Add Finish</span>
                  </button>

                  {afterPhotos.length === 0 ? (
                    <div className="aspect-square bg-[#EBE7E2]/50 rounded-none border border-[#1A1A1A]/10 flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon className="w-6 h-6 opacity-30 text-[#1A1A1A]" />
                      <span className="text-[8px] mt-1 font-mono tracking-widest uppercase text-slate-400">Post Service</span>
                    </div>
                  ) : (
                    afterPhotos.map((url, i) => (
                      <div key={i} className="aspect-square bg-[#EBE7E2] rounded-none overflow-hidden border border-[#1A1A1A]/10 relative group">
                        <img alt="Post-service finish" className="w-full h-full object-cover" src={url} referrerPolicy="no-referrer" />
                        <button 
                          onClick={() => setAfterPhotos(afterPhotos.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-5 h-5 bg-[#E03C31] text-white rounded-none flex items-center justify-center text-[10px] cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </section>
          </div>

          {/* RIGHT COLUMN: Parts tally, custom parts builder, live invoice and signature signing pad */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* Parts & Supplies Checklist Card */}
            <section className="bg-[#F4F1EE] border border-[#1A1A1A]/15 p-6 rounded-none relative">
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-800 mb-4 flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
                <span>Parts &amp; Supplies Used</span>
                <span className="text-[9px] bg-white border border-[#1A1A1A]/20 py-0.5 px-2 rounded-none font-bold">
                  {parts.filter(p => p.checked).length} Items
                </span>
              </h3>
              
              <div className="space-y-2 mt-4">
                {parts.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleTogglePart(p.id)}
                    className="w-full flex items-start text-left p-3 rounded-none bg-[#EBE7E2]/50 hover:bg-[#EBE7E2] border border-[#1A1A1A]/10 transition-all cursor-pointer group"
                  >
                    <div className="pt-0.5 shrink-0">
                      {p.checked ? (
                        <CheckSquare className="w-4 h-4 text-[#E03C31]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2 font-mono">
                        <p className={`text-xs font-bold truncate leading-tight ${p.checked ? 'text-slate-800 font-sans' : 'text-slate-400 font-sans'}`}>
                          {p.name}
                        </p>
                        <p className="text-[10px] font-bold text-[#1A1A1A] shrink-0">
                          RM {p.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{p.description}</p>
                    </div>

                    {p.isCustom && (
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePart(p.id);
                        }}
                        className="ml-2 text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                        title="Delete custom part"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </button>
                ))}
              </div>

              {showAddPart ? (
                <form onSubmit={handleAddCustomPartForm} className="mt-4 p-4 border border-[#1A1A1A]/20 bg-[#EBE7E2] rounded-none space-y-3">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-slate-600">Add custom component</div>
                  
                  <div>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Copper Pipe Tape" 
                      value={customPartName}
                      onChange={(e) => setCustomPartName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#1A1A1A]/20 rounded-none focus:outline-[#E03C31] font-mono"
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400">RM</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        required 
                        value={customPartPrice}
                        onChange={(e) => setCustomPartPrice(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-[#1A1A1A]/20 rounded-none focus:outline-[#E03C31] font-mono"
                      />
                    </div>
                    
                    <button type="submit" className="bg-[#1A1A1A] text-white px-3 py-1 text-[10px] uppercase font-mono tracking-wider hover:bg-[#E03C31] transition-colors">
                      Add
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddPart(false)} 
                      className="bg-transparent text-slate-600 px-3 py-1 text-[10px] uppercase font-mono tracking-wider border border-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setShowAddPart(true)}
                  className="w-full mt-4 py-2 border border-dashed border-[#1A1A1A]/20 hover:border-[#E03C31] text-[#1A1A1A]/50 hover:text-white hover:bg-[#1A1A1A] transition-all rounded-none text-[10px] uppercase font-mono tracking-widest font-bold flex items-center justify-center gap-1.5 cursor-pointer bg-transparent"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Custom Part
                </button>
              )}
            </section>

            {/* Client Signature Pad Card */}
            <section className="bg-[#F4F1EE] border border-[#1A1A1A]/15 p-6 rounded-none relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A] flex items-center gap-1.5">
                  <FilePenLine className="w-4 h-4 text-[#E03C31]" />
                  Client Sign-Off
                </span>
                
                <button 
                  onClick={clearCanvas}
                  className="text-[9px] uppercase tracking-widest font-mono text-[#E03C31] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Clear Pad
                </button>
              </div>

              {/* Pad Frame */}
              <div className="relative h-40 bg-[#EBE7E2]/60 rounded-none border border-[#1A1A1A]/20 overflow-hidden cursor-crosshair">
                <canvas 
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full block touch-none"
                />

                {!hasSigned && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-[#1A1A1A]/40 gap-1.5 text-center px-4">
                    <FilePenLine className="w-6 h-6 opacity-30 text-[#1A1A1A]" />
                    <span className="text-[9px] font-mono text-[#1A1A1A]/40 uppercase tracking-widest leading-normal">
                      Acquire Customer Touch Signature
                    </span>
                    <span className="text-[8px] text-[#1A1A1A]/30 font-mono">Accepts touch or cursor gestures</span>
                  </div>
                )}
              </div>

              <div className="text-[9.5px] text-slate-500 leading-normal mt-3 font-serif italic">
                By entering feedback, client certifies the aircon treatments are carried out safely and completely.
              </div>
            </section>

            {/* Verifiable Customer Summary QR Code / Handoff Portal */}
            <section className="bg-[#F4F1EE] border border-[#1A1A1A]/15 p-6 rounded-none relative">
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A] mb-3 font-extrabold flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#E03C31]" />
                Customer Handoff Portal
              </h3>
              
              <div className="flex flex-col items-center gap-4 text-center mt-4">
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                  Provide this QR Code to the client. Scanning logs them into their read-only service history summary instantly.
                </p>

                {/* QR Code Frame */}
                <div className="bg-white p-3 border border-[#1A1A1A]/10 shadow-sm relative group select-all">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=165x165&data=${encodeURIComponent(`${window.location.origin}${window.location.pathname}?jobId=${job.id}&view=customer-receipt`)}`}
                    alt="Service Verification QR Code"
                    className="w-36 h-36 object-contain"
                  />
                  <div className="absolute inset-0 bg-[#E03C31]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="w-full space-y-2">
                  <button 
                    id="simulate-scan-receipt-btn"
                    onClick={() => setSimulatedCustomerReceipt(true)}
                    className="w-full bg-[#1A1A1A] hover:bg-[#E03C31] text-white py-2.5 rounded-none font-mono text-[10px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#1a1a1a]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Simulate Customer Scan
                  </button>

                  <button
                    onClick={() => {
                      const link = `${window.location.origin}${window.location.pathname}?jobId=${job.id}&view=customer-receipt`;
                      navigator.clipboard.writeText(link);
                      alert(`Customer summary link copied!:\n${link}`);
                    }}
                    className="w-full bg-transparent hover:bg-black/5 text-[#1A1A1A] py-2 rounded-none font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer border border-[#1A1A1A]/20 flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3 h-3" />
                    Copy Summary Link
                  </button>
                </div>
              </div>
            </section>

            {/* Invoice live-calculated total card and Completion Trigger */}
            <div className="bg-[#1A1A1A] text-white rounded-none p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent blur-2xl pointer-events-none"></div>
              
              <div className="space-y-2 pb-4 mb-4 border-b border-white/10 font-mono text-[11px] uppercase tracking-wider text-slate-300">
                <div className="flex justify-between items-center bg-white/5 p-2 mb-2">
                  <span className="text-[9px] text-[#F4F1EE]/60 font-serif italic">Assigned Shift Label</span>
                  <span className="font-bold text-[#E03C31]">#{job.id}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Base Diagnostics Rate:</span>
                  <span className="font-bold text-white">RM {job.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Supplies Check-off:</span>
                  <span className="font-bold text-white">RM {subtotalParts.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-6">
                <span className="text-xs uppercase font-mono tracking-widest text-[#F4F1EE]/60">Live Commission Total</span>
                <span className="text-2xl font-mono font-black text-[#E03C31]">RM {finalTotalAmount.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleCompleteJobAction}
                className="w-full bg-[#E03C31] hover:bg-[#c93026] text-white py-3 rounded-none font-mono text-xs uppercase tracking-widest font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
              >
                <Check className="w-5 h-5 font-black" />
                Declare Work Complete
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Real-time Hardware Camera Capture & Fallback dialog */}
      {cameraTarget && (
        <div id="camera-capture-dialog" className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-[#F4F1EE] text-[#1A1A1A] max-w-lg w-full rounded-none border-2 border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col relative">
            
            {/* Header banner */}
            <div className="bg-[#1A1A1A] text-white px-5 py-3 flex justify-between items-center select-none font-mono text-[10px] uppercase tracking-widest border-b border-[#1A1A1A]">
              <span className="flex items-center gap-2 font-bold">
                <Camera className="w-4 h-4 text-[#E03C31]" />
                Active Lens: {cameraTarget === 'before' ? 'Pre-Service' : 'Completion'} Inspection
              </span>
              <button 
                id="close-camera-modal-btn"
                onClick={() => setCameraTarget(null)}
                className="text-[#E03C31] hover:text-white transition-colors cursor-pointer text-xl font-bold select-none px-2 py-1 leading-none"
                title="Exit Camera Preview"
              >
                ×
              </button>
            </div>

            {/* Viewport Core stream */}
            <div className="p-6 flex flex-col gap-4">
              <div className="aspect-video bg-black relative border border-[#1A1A1A]/30 overflow-hidden flex items-center justify-center text-white/50 text-xs text-center">
                {cameraError ? (
                  <div className="p-4 text-center space-y-2 select-text font-serif">
                    <p className="text-[#E03C31] italic font-bold text-sm">Iframe Web Sandbox Limitation</p>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider leading-relaxed">{cameraError}</p>
                    <p className="text-[9.5px] text-[#E03C31] font-mono uppercase bg-red-950/20 p-2 mt-2 rounded">
                      Direct webcam sandbox stream blocked inside standard code containers. File loaders & simulations are fully supported.
                    </p>
                  </div>
                ) : (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                    <div className="absolute top-3 left-3 bg-[#E03C31] text-white text-[8px] font-mono tracking-widest font-extrabold px-2 py-0.5 uppercase flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Device Live Streaming
                    </div>
                  </>
                )}
              </div>

              <div className="font-mono text-[9px] uppercase text-[#1A1A1A]/60 tracking-wider">
                Select Photo capture mechanism:
              </div>

              {/* Buttons panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {/* Real Snapshot Capture */}
                <button
                  id="snap-camera-btn"
                  type="button"
                  disabled={!!cameraError}
                  onClick={handleCameraCapture}
                  className={`py-3 rounded-none font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    cameraError 
                      ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-[0.4]' 
                      : 'bg-[#E03C31] text-white border-[#E03C31] hover:bg-black hover:border-black'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Take Snap Photo
                </button>

                {/* Simulated Capture / Instant Fallback */}
                <button
                  id="simulate-camera-btn"
                  type="button"
                  onClick={handleSimulateCustomCapture}
                  className="bg-transparent hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-[#1A1A1A]/40 hover:border-[#1A1A1A] py-3 rounded-none font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Simulate Live Image
                </button>
              </div>

              {/* Native device file / Camera roll input */}
              <div className="border-t border-[#1A1A1A]/10 pt-4 mt-2">
                <label className="block text-center cursor-pointer bg-[#EBE7E2]/60 hover:bg-[#EBE7E2] border border-dashed border-[#1A1A1A]/20 py-2.5 px-4 rounded-none transition-all group">
                  <span className="text-[9px] font-mono uppercase tracking-widest font-semibold text-[#1A1A1A]/60 group-hover:text-[#1A1A1A] flex items-center justify-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#E03C31]" />
                    Upload System Storage / Roll
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    onChange={handleFileCaptureChange}
                    className="hidden" 
                  />
                </label>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
