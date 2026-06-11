import { useState, FormEvent } from 'react';
import { 
  Wrench, 
  Droplets, 
  Zap, 
  Clock, 
  Calendar, 
  Plus, 
  ShieldCheck, 
  Lock, 
  ChevronLeft, 
  ChevronRight, 
  History,
  CheckCircle,
  FileCheck,
  MapPin,
  FlameKindling
} from 'lucide-react';
import { ServiceOption, UnitProfile } from '../types';
import { INITIAL_UNIT_PROFILES, SERVICE_OPTIONS } from '../data';

interface CustomerBookingProps {
  onAddBooking: (booking: {
    serviceType: string;
    unitSelected: string;
    totalAmount: number;
    selectedDate: string;
    selectedTime: string;
  }) => void;
}

export default function CustomerBooking({ onAddBooking }: CustomerBookingProps) {
  const [unitProfiles, setUnitProfiles] = useState<UnitProfile[]>(INITIAL_UNIT_PROFILES);
  const [selectedUnit, setSelectedUnit] = useState<string>(INITIAL_UNIT_PROFILES[0].name);
  const [selectedService, setSelectedService] = useState<ServiceOption>(SERVICE_OPTIONS[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');
  
  // Custom unit form toggle
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');

  // Payment popup/success view state
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Service options lookup with icon renderer helper
  const renderServiceIcon = (iconName: string, active: boolean) => {
    const cls = `w-5 h-5 ${active ? 'text-white' : 'text-[#E03C31]'}`;
    switch (iconName) {
      case 'cleaning_services':
        return <Zap className={cls} />;
      case 'water_drop':
        return <Droplets className={cls} />;
      case 'build':
        return <Wrench className={cls} />;
      case 'troubleshoot':
        return <FlameKindling className={cls} />;
      default:
        return <Wrench className={cls} />;
    }
  };

  const handleAddNewUnit = (e: FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim()) return;
    const newUnit: UnitProfile = {
      id: `unit-${Date.now()}`,
      name: newUnitName.trim()
    };
    const updated = [...unitProfiles, newUnit];
    setUnitProfiles(updated);
    setSelectedUnit(newUnit.name);
    setNewUnitName('');
    setShowAddUnit(false);
  };

  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      onAddBooking({
        serviceType: selectedService.name,
        unitSelected: selectedUnit,
        totalAmount: selectedService.price + 10.0,
        selectedDate: `28 Oct 2023`,
        selectedTime: selectedTimeSlot
      });
    }, 1800);
  };

  const activeTotal = selectedService.price + 10.0;

  return (
    <div className="bg-[#F4F1EE] min-h-screen pb-24 relative select-none">
      {/* Subtle background grid lining */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Editorial Subheader */}
        <div className="border-b border-[#1A1A1A]/10 pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#1A1A1A]/40 block mb-1">Service Dispatch Portal</span>
            <h1 className="text-3xl md:text-4xl font-serif italic text-[#1A1A1A]">Configure Active Booking</h1>
          </div>
          <div className="flex gap-4 text-right text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/60">
            <span>Branch: Georgetown, Penang</span>
            <span>•</span>
            <span>Secure SSL Sandbox</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Setup details */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Unit Selection Card */}
            <section className="bg-[#F4F1EE] border border-[#1A1A1A]/15 p-6 rounded-none relative">
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1A1A1A] text-white">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-mono text-[#1A1A1A]/50 block">Step 01 / PROFILE</span>
                    <h2 className="text-lg font-serif italic text-[#1A1A1A] font-bold">Appliance Profile</h2>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowAddUnit(!showAddUnit)}
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A] border border-[#1A1A1A] px-3 py-1 bg-transparent hover:bg-[#1A1A1A] hover:text-[#F4F1EE] transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Add Unit
                </button>
              </div>

              {showAddUnit && (
                <form onSubmit={handleAddNewUnit} className="mb-6 p-5 bg-[#EBE7E2] border border-[#1A1A1A]/10 rounded-none space-y-3">
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-[#1A1A1A]/70">
                    Register New Aircon Unit
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Bedroom - Sharp 1.5HP"
                      value={newUnitName}
                      onChange={(e) => setNewUnitName(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-[#1A1A1A]/20 focus:outline-[#E03C31] rounded-none font-mono"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-[#1A1A1A] text-white px-4 py-2 text-[10px] uppercase font-mono tracking-wider hover:bg-[#E03C31] transition-colors">
                        Add Unit
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowAddUnit(false)}
                        className="bg-[#E2E0DD] text-[#1A1A1A] px-3 py-2 text-[10px] uppercase font-mono tracking-wider hover:bg-black/5"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/50">
                  Selected Active Aircon
                </label>
                <div className="relative">
                  <select 
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 appearance-none bg-[#EBE7E2]/60 border border-[#1A1A1A]/20 rounded-none focus:border-[#E03C31] focus:ring-0 transition-all text-[#1A1A1A] text-xs font-mono"
                  >
                    {unitProfiles.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#1A1A1A]/60">
                    ▼
                  </span>
                </div>
              </div>
            </section>

            {/* Service Type Selection */}
            <section className="bg-[#F4F1EE] border border-[#1A1A1A]/15 p-6 rounded-none relative">
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
              <div className="mb-6">
                <span className="text-[9px] uppercase tracking-widest font-mono text-[#1A1A1A]/50 block">Step 02 / TREATMENT</span>
                <h2 className="text-lg font-serif italic text-[#1A1A1A] font-bold">Select Service Program</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICE_OPTIONS.map(opt => {
                  const isSelected = selectedService.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedService(opt)}
                      className={`flex flex-col text-left p-5 rounded-none border transition-all cursor-pointer relative group ${
                        isSelected 
                          ? 'border-[#E03C31] bg-[#1A1A1A]/5 shadow-sm' 
                          : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/60 bg-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full mb-3">
                        <div className={`p-2 transition-colors border ${
                          isSelected ? 'bg-[#E03C31] border-[#E03C31] text-white' : 'bg-[#EBE7E2] border-[#1A1A1A]/15 text-slate-700'
                        }`}>
                          {renderServiceIcon(opt.icon, isSelected)}
                        </div>
                        {opt.tag && (
                          <span className="text-[8px] font-mono font-bold bg-[#1A1A1A] text-white px-2 py-0.5 uppercase tracking-widest">
                            {opt.tag}
                          </span>
                        )}
                      </div>
                      
                      <span className="text-sm font-serif italic font-bold text-[#1A1A1A] group-hover:text-[#E03C31] transition-colors">
                        {opt.name}
                      </span>
                      <span className="text-[11px] text-slate-600 mb-4 mt-1 leading-relaxed">
                        {opt.description}
                      </span>
                      <span className={`mt-auto text-sm font-mono font-bold ${isSelected ? 'text-[#E03C31]' : 'text-[#1A1A1A]'}`}>
                        RM {opt.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Schedule & checkout */}
          <div className="lg:col-span-5 space-y-10">
            {/* Schedule picker */}
            <section className="bg-[#F4F1EE] border border-[#1A1A1A]/15 p-6 rounded-none relative">
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#1A1A1A] text-white">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-[#1A1A1A]/50 block">Step 03 / CALENDAR</span>
                  <h2 className="text-lg font-serif italic text-[#1A1A1A] font-bold">Preferred Dispatch</h2>
                </div>
              </div>

              {/* Styled Editorial Calendar UI */}
              <div className="mb-6 p-4 bg-[#EBE7E2]/50 border border-[#1A1A1A]/10">
                <div className="flex justify-between items-center mb-4 px-1">
                  <span className="text-xs font-serif font-bold italic text-[#1A1A1A]">October 2023 Edition</span>
                  <div className="flex gap-1">
                    <button className="p-1 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] text-[#1A1A1A]/40 cursor-not-allowed" disabled>
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button className="p-1 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] text-[#1A1A1A]/40 cursor-not-allowed" disabled>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-mono font-bold text-[#1A1A1A]/40 mb-2 uppercase tracking-wider">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>

                <div className="grid grid-cols-7 gap-1 font-mono text-xs">
                  <button className="h-8 flex items-center justify-center text-[#1A1A1A]/20 pointer-events-none" disabled>24</button>
                  <button className="h-8 flex items-center justify-center text-[#1A1A1A]/20 pointer-events-none" disabled>25</button>
                  <button className="h-8 flex items-center justify-center text-[#1A1A1A]/60 hover:bg-black/5 font-medium">26</button>
                  <button className="h-8 flex items-center justify-center text-[#1A1A1A]/60 hover:bg-black/5 font-medium">27</button>
                  <button className="h-8 flex items-center justify-center bg-[#E03C31] text-white font-bold border border-[#E03C31]">28</button>
                  <button className="h-8 flex items-center justify-center text-[#1A1A1A]/60 hover:bg-black/5 font-medium">29</button>
                  <button className="h-8 flex items-center justify-center text-[#1A1A1A]/60 hover:bg-black/5 font-medium">30</button>
                </div>
              </div>

              {/* Time slots */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 block">
                  Select Hour (Penang Branch)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'].map(time => {
                    const isSelected = selectedTimeSlot === time;
                    const isDisabled = time === '05:00 PM';
                    
                    if (isDisabled) {
                      return (
                        <button
                          key={time}
                          type="button"
                          className="py-2.5 text-[10px] font-mono border border-dashed border-[#1A1A1A]/10 bg-[#EBE7E2]/30 text-[#1A1A1A]/30 cursor-not-allowed"
                          disabled
                        >
                          {time}
                        </button>
                      );
                    }

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTimeSlot(time)}
                        className={`py-2 text-[10px] font-mono tracking-wider transition-all cursor-pointer uppercase border ${
                          isSelected 
                            ? 'border-[#E03C31] bg-[#E03C31] text-white' 
                            : 'border-[#1A1A1A]/20 hover:border-[#1A1A1A]/60 bg-transparent text-[#1A1A1A]'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Invoice statement block */}
            <section className="bg-[#EBE7E2] border border-[#1A1A1A]/20 p-6 rounded-none relative">
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#1A1A1A]/40 block mb-2">Statement of Account</span>
              
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E03C31] uppercase tracking-widest mb-4">
                <ShieldCheck className="w-4 h-4" />
                Receipt Breakdown
              </div>

              <div className="space-y-2.5 pb-4 mb-4 border-b border-[#1A1A1A]/10 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#1A1A1A]/60 italic font-serif">{selectedService.name} Program</span>
                  <span className="font-mono font-bold text-[#1A1A1A]">RM {selectedService.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#1A1A1A]/60 italic font-serif">Service Fee (Georgetown zone)</span>
                  <span className="font-mono font-bold text-[#1A1A1A]">RM 10.00</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#1A1A1A]/50 bg-black/5 p-2 font-mono">
                  <span>Unit Assigned:</span>
                  <span className="truncate max-w-[200px]">{selectedUnit}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-6">
                <span className="text-xs uppercase font-mono tracking-widest text-[#1A1A1A]/80 font-bold">Final Total due</span>
                <span className="text-2xl font-mono font-black text-[#E03C31]">RM {activeTotal.toFixed(2)}</span>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isPaying || paymentSuccess}
                className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#E03C31] text-white rounded-none font-mono text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPaying ? (
                  <>
                    <History className="w-4 h-4 animate-spin text-[#E2E0DD]" />
                    Processing SSL Auth...
                  </>
                ) : paymentSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-white" />
                    Statement Approved
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Authorize Booking payment
                  </>
                )}
              </button>

              <div className="text-[9px] text-center text-[#1A1A1A]/40 mt-3 font-mono tracking-wider uppercase">
                256-Bit SSL Secured Penang Gateway
              </div>
            </section>
          </div>

        </div>
      </div>

      {/* Success Dialog */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#F4F1EE] border border-[#1A1A1A]/30 p-8 max-w-md w-full shadow-2xl relative text-center rounded-none animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-[#E03C31] text-[#F4F1EE] flex items-center justify-center mx-auto mb-4 border border-[#E03C31]">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif italic font-bold text-[#1A1A1A] mb-1">Receipt Confirmed</h3>
            <p className="text-xs font-mono uppercase tracking-widest text-[#E03C31] font-bold mb-6">Authorized RM {activeTotal.toFixed(2)}</p>
            
            <div className="bg-[#EBE7E2] border border-[#1A1A1A]/10 p-4 text-[11px] text-left space-y-2 mb-6 font-mono">
              <div className="flex justify-between">
                <span className="opacity-50 uppercase tracking-widest">Date:</span>
                <span className="font-bold">Saturday, Oct 28, 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50 uppercase tracking-widest">Time:</span>
                <span className="font-bold">{selectedTimeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50 uppercase tracking-widest">Program:</span>
                <span className="font-bold">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50 uppercase tracking-widest">Target Unit:</span>
                <span className="font-bold truncate max-w-[180px]">{selectedUnit}</span>
              </div>
            </div>

            <button 
              onClick={() => setPaymentSuccess(false)}
              className="w-full bg-[#1A1A1A] text-white py-3 text-xs uppercase tracking-widest font-mono font-bold hover:bg-[#E03C31] transition-all cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
