import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import CustomerBooking from './components/CustomerBooking';
import TechDashboard from './components/TechDashboard';
import TechJobDetail from './components/TechJobDetail';
import TechEarnings from './components/TechEarnings';
import CustomerReceipt from './components/CustomerReceipt';
import { Job, ViewScreen } from './types';
import { INITIAL_JOBS } from './data';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  Wallet, 
  Settings, 
  Home, 
  User, 
  Layers, 
  Wrench,
  Sparkles,
  RefreshCw,
  Bell
} from 'lucide-react';

interface ToastData {
  id: string;
  jobId: string;
  clientName: string;
  jobTitle: string;
  amount: number;
  timestamp: string;
}

function ToastItem({ 
  toast, 
  onDismiss 
}: { 
  toast: ToastData; 
  onDismiss: (id: string) => void; 
  key?: string;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      id={toast.id}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="pointer-events-auto bg-[#1A1A1A] text-[#F4F1EE] border-l-4 border-[#E03C31] p-4 shadow-2xl relative select-none w-full max-w-sm"
    >
      <div className="flex gap-3">
        <div className="pt-0.5 text-[#E03C31] shrink-0">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[8px] font-mono tracking-[0.15em] text-[#E03C31] font-bold uppercase">
              System Update • Dispatch Success
            </span>
            <span className="text-[8px] font-mono text-[#F4F1EE]/40">
              {toast.timestamp}
            </span>
          </div>
          
          <h4 className="text-xs font-serif font-bold italic text-white leading-snug">
            Job #{toast.jobId} Completed
          </h4>
          
          <p className="text-[10px] text-[#F4F1EE]/80 mt-1 font-sans leading-relaxed">
            Registered aircon specialist completed work profile for <strong className="text-white font-bold">{toast.clientName}</strong> (<span className="italic font-serif">{toast.jobTitle}</span>) successfully.
          </p>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/10 font-mono text-[9px]">
            <span className="text-[#F4F1EE]/60">
              Settlement: <strong className="text-white">RM {toast.amount.toFixed(2)}</strong>
            </span>
            <span className="text-emerald-500 font-bold uppercase tracking-wider">
              Cleared Ok
            </span>
          </div>
        </div>

        <button 
          id={`dismiss-${toast.id}`}
          onClick={() => onDismiss(toast.id)}
          className="text-white/40 hover:text-white transition-colors cursor-pointer text-sm font-bold h-6 w-6 flex items-center justify-center p-0 rounded-none border border-transparent select-none shrink-0"
          title="Dismiss Announcement"
          type="button"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [role, setRole] = useState<'customer' | 'technician'>('technician');
  const [currentView, setCurrentView] = useState<ViewScreen>('tech-dashboard');
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>('SK-9021');

  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showSuccessToast = (job: Job) => {
    const newToast: ToastData = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      jobId: job.id,
      clientName: job.clientName,
      jobTitle: job.title,
      amount: job.amount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts(prev => [newToast, ...prev]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Find currently selected job
  const selectedJob = jobs.find(j => j.id === selectedJobId) || null;

  const [standaloneReceiptJob, setStandaloneReceiptJob] = useState<Job | null>(null);

  // Parse URL parameter on boot to load specific read-only customer reports
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewQuery = params.get('view');
    const jobIdQuery = params.get('jobId');
    if (viewQuery === 'customer-receipt' && jobIdQuery) {
      const matched = jobs.find(j => j.id === jobIdQuery);
      if (matched) {
        setStandaloneReceiptJob(matched);
      }
    }
  }, [jobs]);

  // Handle addition of custom bookings from customer portal
  const handleAddBooking = (newBooking: {
    serviceType: string;
    unitSelected: string;
    totalAmount: number;
    selectedDate: string;
    selectedTime: string;
  }) => {
    // Generate new simulated job in the list!
    const newJobId = `SK-${Math.floor(1000 + Math.random() * 9000)}`;
    const freshJob: Job = {
      id: newJobId,
      title: `${newBooking.serviceType} (${newBooking.unitSelected.split(' - ')[0]})`,
      type: newBooking.serviceType.includes('Chemical') 
        ? 'Chemical Wash' 
        : newBooking.serviceType.includes('Gas') 
          ? 'Gas Refill' 
          : 'Standard Service',
      clientName: 'Ah San (You)',
      address: 'Simulated Residence, Georgetown, Penang',
      timeRange: `${newBooking.selectedTime} - ${newBooking.selectedTime.includes('AM') ? '12:30 PM' : '05:00 PM'}`,
      dateStr: newBooking.selectedDate,
      amount: newBooking.totalAmount - 10.0,
      siteImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcN3OTnIvI-GeowOX4NP7EXKWyUTFtybHZSRrsJVj8m07RQen68jS2YDyeqZr4IdL7WfHIOGc4pCBxtGhzivXYoyc1oYxYw-qW_ONI2v834AW0UIEs4u-wZ1dYl66zpeTVxN83UEFY92nSvY1dSW_2_D8qyeyF_cx6RfwAiRyijk486N7dHZKGmy5R3z8Yx7RLyBupe0UTn_YkGI26_vqxAarcHy4qcJjyygRRtaHDfOWJX42wf02tdr6KFgWxkx-NIbk66Q1nqyQ',
      status: 'pending_start',
      beforePhotos: [],
      afterPhotos: [],
      parts: []
    };

    setJobs([freshJob, ...jobs]);
  };

  // Live state callback when job is completed by technician
  const handleUpdateJob = (updatedJob: Job) => {
    const previousJob = jobs.find(j => j.id === updatedJob.id);
    if (previousJob && previousJob.status === 'pending_start' && updatedJob.status === 'completed') {
      showSuccessToast(updatedJob);
    }
    setJobs(jobs.map(j => (j.id === updatedJob.id ? updatedJob : j)));
  };

  // Helper title override for custom header states
  let activeTitle = 'SuperKool Penang';
  if (currentView === 'tech-job-detail' && selectedJob) {
    activeTitle = `Job #${selectedJob.id}`;
  }

  // Helper trigger navigation from header
  const handleBackNavigation = () => {
    if (currentView === 'tech-job-detail') {
      setCurrentView('tech-dashboard');
    }
  };

  if (standaloneReceiptJob) {
    return (
      <CustomerReceipt
        job={standaloneReceiptJob}
        onClose={() => {
          setStandaloneReceiptJob(null);
          window.history.replaceState({}, document.title, window.location.pathname);
        }}
        standalone
      />
    );
  }

  return (
    <div className="bg-[#F4F1EE] text-[#1A1A1A] font-sans min-h-screen select-none">
      
      {/* Global Header */}
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        role={role}
        onRoleChange={setRole}
        titleOverride={currentView === 'tech-job-detail' ? activeTitle : undefined}
        onBack={currentView === 'tech-job-detail' ? handleBackNavigation : undefined}
      />

      {/* Primary Layout container with desktop sidebar */}
      <div className="flex pt-16 min-h-[calc(100vh-64px)]">
        
        {/* DESKTOP SIDEBAR: Only visible for Technician on screen width lg */}
        {role === 'technician' && (
          <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] z-40 bg-[#F4F1EE] border-r border-[#1A1A1A]/10 w-72 p-6 shrink-0 justify-between">
            {/* Top Navigation */}
            <div className="space-y-4">
              <div className="flex flex-col mb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-[#1A1A1A]/40 mb-1">Navigation</span>
                <span className="font-serif italic text-base text-[#1A1A1A]">Technician Edition</span>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setCurrentView('tech-dashboard')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-none text-left text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer border ${
                    currentView === 'tech-dashboard' || currentView === 'tech-job-detail'
                      ? 'bg-[#1A1A1A] text-white border-black' 
                      : 'text-[#1A1A1A]/70 border-transparent hover:bg-black/5 hover:text-[#1A1A1A]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-current shrink-0" />
                  Job Dashboard
                </button>
                
                <button
                  onClick={() => {
                    setCurrentView('tech-dashboard');
                    alert('Schedule view toggled: Calendar is loaded with daily dispatch!');
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-none text-left text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 border border-transparent hover:bg-black/5 hover:text-[#1A1A1A] transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  Schedule Calendar
                </button>

                <button
                  onClick={() => alert('Parts Inventory lists: 4x Inverter Compressors, r32 coolant, antibacterial spray kits.')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-none text-left text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 border border-transparent hover:bg-black/5 hover:text-[#1A1A1A] transition-all cursor-pointer"
                >
                  <Package className="w-4 h-4 shrink-0" />
                  Tools Inventory
                </button>

                <button
                  onClick={() => setCurrentView('tech-earnings')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-none text-left text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer border ${
                    currentView === 'tech-earnings'
                      ? 'bg-[#1A1A1A] text-white border-black' 
                      : 'text-[#1A1A1A]/70 border-transparent hover:bg-black/5 hover:text-[#1A1A1A]'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-current shrink-0" />
                  Earnings History
                </button>
              </nav>
            </div>

            {/* Bottom settings button */}
            <div className="pt-4 border-t border-[#1A1A1A]/10">
              <button
                onClick={() => alert(`Settings page: Connected as field-engineer ${role}`)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/40 hover:text-[#1A1A1A]/80 hover:bg-black/5 rounded-none transition-all cursor-pointer"
              >
                <Settings className="w-4 h-4 shrink-0" />
                Portal Settings
              </button>
            </div>
          </aside>
        )}

        {/* CUSTOMER PORTAL DESKTOP SIDE BAR */}
        {role === 'customer' && (
          <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] z-40 bg-[#F4F1EE] border-r border-[#1A1A1A]/10 w-72 p-6 shrink-0 justify-between">
            <div className="space-y-4">
              <div className="flex flex-col mb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-[#1A1A1A]/40 mb-1">Client Area</span>
                <span className="font-serif italic text-base text-[#1A1A1A]">Customer Portal</span>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setCurrentView('customer-booking')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-none text-left text-[11px] uppercase tracking-wider font-bold bg-[#E03C31] text-white cursor-pointer"
                >
                  <Home className="w-4 h-4 text-current shrink-0" />
                  Book Service
                </button>
                <button
                  onClick={() => {
                    const clientPending = jobs.filter(j => j.clientName.includes('Ah San'));
                    alert(`You have ${clientPending.length} active service booking profiles.`);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-none text-left text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 hover:bg-black/5 hover:text-[#1A1A1A] transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  My Bookings
                </button>
              </nav>
            </div>
            <div className="pt-4 border-t border-[#1A1A1A]/10 text-center text-[10px] text-[#1A1A1A]/60 font-mono tracking-widest uppercase p-3 bg-[#EBE7E2]">
              📍 Penang Branch
            </div>
          </aside>
        )}

        {/* MAIN DATA CANVAS */}
        <main className={`flex-1 min-h-screen ${role === 'technician' || role === 'customer' ? 'lg:pl-72' : ''}`}>
          {/* Active component picker */}
          {role === 'technician' ? (
            <>
              {currentView === 'tech-dashboard' && (
                <TechDashboard 
                  jobs={jobs} 
                  onSelectJob={setSelectedJobId} 
                  onViewChange={setCurrentView} 
                />
              )}
              {currentView === 'tech-job-detail' && (
                <TechJobDetail 
                  job={selectedJob} 
                  onBack={() => setCurrentView('tech-dashboard')} 
                  onUpdateJob={handleUpdateJob} 
                />
              )}
              {currentView === 'tech-earnings' && (
                <TechEarnings 
                  jobs={jobs} 
                  onSelectJob={setSelectedJobId} 
                  onViewChange={setCurrentView} 
                />
              )}
            </>
          ) : (
            <CustomerBooking onAddBooking={handleAddBooking} />
          )}
        </main>

      </div>

      {/* MOBILE BOTTOM NAV BAR: Sticky on screen sizes md & down */}
      {role === 'technician' ? (
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-around items-center py-2 bg-[#F4F1EE]/95 backdrop-blur-md rounded-none shadow-2xl border border-[#1A1A1A]/15">
          <button 
            onClick={() => setCurrentView('tech-dashboard')}
            className={`flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
              currentView === 'tech-dashboard' || currentView === 'tech-job-detail'
                ? 'text-[#E03C31] font-bold font-mono' 
                : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] uppercase tracking-wider">Home</span>
          </button>

          <button 
            onClick={() => {
              setRole('customer');
              setCurrentView('customer-booking');
            }}
            className="flex flex-col items-center justify-center p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] cursor-pointer"
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] uppercase tracking-wider">Bookings</span>
          </button>

          <button 
            onClick={() => setCurrentView('tech-earnings')}
            className={`flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
              currentView === 'tech-earnings' 
                ? 'text-[#E03C31] font-bold font-mono' 
                : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
            }`}
          >
            <Wallet className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] uppercase tracking-wider">Earnings</span>
          </button>

          <button 
            onClick={() => alert('Logged in as Pak Mike Tech (Penang Branch). ID: #TECH-9012')}
            className="flex flex-col items-center justify-center p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] cursor-pointer"
          >
            <User className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] uppercase tracking-wider">Profile</span>
          </button>
        </nav>
      ) : (
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-around items-center py-2 bg-[#F4F1EE]/95 backdrop-blur-md rounded-none shadow-2xl border border-[#1A1A1A]/15">
          <button 
            onClick={() => setCurrentView('customer-booking')}
            className="flex flex-col items-center justify-center p-2 text-[#E03C31] font-bold font-mono cursor-pointer"
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] uppercase tracking-wider">Book</span>
          </button>

          <button 
            onClick={() => {
              setRole('technician');
              setCurrentView('tech-dashboard');
            }}
            className="flex flex-col items-center justify-center p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] cursor-pointer"
          >
            <Wrench className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] uppercase tracking-wider">Dispatch</span>
          </button>

          <button 
            onClick={() => alert('Connected Profile ID: #CUST-9921 (Ahmad Sabri)')}
            className="flex flex-col items-center justify-center p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] cursor-pointer"
          >
            <User className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] uppercase tracking-wider">Profile</span>
          </button>
        </nav>
      )}

      {/* Floating Toast Notification Container Stack */}
      <div id="toast-container" className="fixed top-20 right-6 z-50 flex flex-col items-end gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem 
              key={toast.id} 
              toast={toast} 
              onDismiss={removeToast} 
            />
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
