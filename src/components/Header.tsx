import { useState } from 'react';
import { Snowflake, Bell, ArrowLeft, RefreshCw, User, Settings, Check } from 'lucide-react';
import { ViewScreen } from '../types';

interface HeaderProps {
  currentView: ViewScreen;
  onViewChange: (view: ViewScreen) => void;
  role: 'customer' | 'technician';
  onRoleChange: (r: 'customer' | 'technician') => void;
  titleOverride?: string;
  onBack?: () => void;
}

export default function Header({
  currentView,
  onViewChange,
  role,
  onRoleChange,
  titleOverride,
  onBack,
}: HeaderProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Notifications list
  const notifications = [
    { id: 1, text: 'New job assigned: #SK-9021', time: '10 mins ago', read: false },
    { id: 2, text: 'Payment of RM450 received!', time: 'Yesterday', read: true },
    { id: 3, text: 'Weekly top rating achieved: 4.9 ★', time: '2 days ago', read: true },
  ];

  const currentProfile = role === 'technician' 
    ? {
        name: "Pak Mike Tech",
        role: "Senior Technician",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoG03HG4MisPQVmGjpExTX8XVFUYtZEjsSCcJOnqcg40qpcMwSRx__a--PdscH3bBfeowwLzgxFgoinRwIvynFHmxpVHfmvcbTo6TDjAywF-ts83D8USP_8mHzCv-M2yqYfClp_bzWJt41B3zUVNZrGsyNV_X_Q01ZQl9RXQGJCGTstYqTAiWYEZ2zYRZcDrKWueqQ78eDaA73A282eKGm6dBCUU2YnlPiaQLav1ZCKKvdfFFLg_kQ202pksKibeqTC5jVpAN_uqc"
      }
    : {
        name: "Ah San Customer",
        role: "Homeowner Profile",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKMqQ4HTauI_5Qa13hjDjhTEdrlBSBpwO68o_gTTN5AI1liM9wVKI2VSXmuo1VgE2_3tmffp9Lh1SO5jrYEzm3l0vm0NfvVJT4LtmSjc2ZQvoOji28u7rN6lFsSiiqQ7f4Ii-_b7JFM74skp53LT7qiPKkezXoYQiC_jCTjFXSWKrmX0mTdYV2KojSbCagcvoo4VXptbAm5s-xqS2CJp6zUq3dkWRxO4t_uCxdl9Ugq6gCvonhQ_qcB1iJmUO05KcmPVS5_9wdD8s"
      };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 h-16 bg-[#F4F1EE]/95 backdrop-blur-md border-b border-[#1A1A1A]/15 shadow-sm">
      {/* Brand or Back navigation */}
      <div className="flex items-center gap-3">
        {onBack ? (
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-[#1A1A1A]"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#E03C31]" />
          </button>
        ) : null}
        
        <div className="flex items-center gap-2">
          {!onBack && <Snowflake className="w-5 h-5 text-[#E03C31] animate-spin-slow" />}
          <h1 className="text-xl md:text-2xl font-serif italic font-bold text-[#1A1A1A] tracking-wide">
            {titleOverride || "SuperKool Penang."}
          </h1>
        </div>
      </div>

      {/* Quick controls and Profile dropdown */}
      <div className="flex items-center gap-4">
        {/* Role Toggle Selector Button */}
        <div className="relative">
          <button 
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none text-[10px] font-mono uppercase tracking-[0.15em] bg-transparent text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F4F1EE] transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#E03C31] animate-pulse"></span>
            Role: {role === 'technician' ? 'Technician' : 'Customer'}
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#F4F1EE] border border-[#1A1A1A]/20 rounded-none shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/50 border-b border-[#1A1A1A]/10">
                Switch Portal Role
              </div>
              <button
                onClick={() => {
                  onRoleChange('customer');
                  onViewChange('customer-booking');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer font-sans ${
                  role === 'customer' ? 'bg-[#E03C31] text-white font-semibold' : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5'
                }`}
              >
                Customer Portal
                {role === 'customer' && <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  onRoleChange('technician');
                  onViewChange('tech-dashboard');
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer font-sans ${
                  role === 'technician' ? 'bg-[#E03C31] text-white font-semibold' : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5'
                }`}
              >
                Technician Portal
                {role === 'technician' && <Check className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon with active badge */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded-none transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#E03C31] rounded-full text-[9px] font-bold text-white flex items-center justify-center border-2 border-[#F4F1EE]">
              1
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-[#F4F1EE] border border-[#1A1A1A]/15 rounded-none shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 bg-[#EBE7E2] text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A1A1A] border-b border-[#1A1A1A]/10 flex justify-between items-center">
                <span>Notifications</span>
                <span className="text-[9px] text-[#E03C31] hover:underline cursor-pointer">Mark All Read</span>
              </div>
              <div className="divide-y divide-[#1A1A1A]/10 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 text-xs leading-normal hover:bg-black/5 transition-colors ${!n.read ? 'bg-[#E03C31]/5 font-medium' : ''}`}>
                    <div className="text-[#1A1A1A]">{n.text}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-[#1A1A1A]">{currentProfile.name}</span>
            <span className="text-[10px] text-[#1A1A1A]/60 font-mono uppercase tracking-wider">{currentProfile.role}</span>
          </div>
          <div className="w-9 h-9 rounded-none border border-[#1A1A1A] overflow-hidden shadow-inner shrink-0 bg-[#E2E0DD]">
            <img 
              alt={currentProfile.name} 
              className="w-full h-full object-cover" 
              src={currentProfile.avatar} 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
