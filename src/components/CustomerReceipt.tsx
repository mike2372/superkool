import React from 'react';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Camera, 
  FilePenLine, 
  FileText, 
  Wrench,
  Sparkles,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { Job } from '../types';

interface CustomerReceiptProps {
  job: Job;
  onClose?: () => void;
  standalone?: boolean;
}

export default function CustomerReceipt({ job, onClose, standalone = false }: CustomerReceiptProps) {
  // Count active parts checked
  const checkedParts = job.parts.filter(p => p.checked);
  const partsCost = checkedParts.reduce((sum, p) => sum + p.price, 0);
  const totalAmount = job.amount + partsCost;

  return (
    <div id="customer-receipt-screen" className="bg-[#1A1A1A] text-[#F4F1EE] min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans relative overflow-hidden">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#F4F1EE 1px, transparent 1px), linear-gradient(90deg, #F4F1EE 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-xl w-full relative z-10 space-y-6">
        
        {/* Standalone header back action */}
        {onClose && (
          <button 
            id="receipt-back-btn"
            onClick={onClose}
            className="inline-flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-[0.15em] font-bold text-[#F4F1EE]/70 hover:text-white transition-all bg-[#F4F1EE]/5 hover:bg-[#F4F1EE]/15 border border-white/10 px-4 py-2 rounded-none cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E03C31]" />
            Exit Customer Summary
          </button>
        )}

        {/* Receipt Wrapper Card with premium serrated styling look */}
        <div className="bg-[#1A1A1A] border-2 border-[#E03C31] text-[#1A1A1A] bg-radial from-[#F9F7F5] to-[#F4F1EE] p-6 sm:p-8 shadow-2xl relative select-text">
          {/* Authentic status badge */}
          <div className="absolute -top-3.5 right-6 bg-[#E03C31] text-white px-3 py-1 font-mono text-[9px] uppercase tracking-widest font-extrabold flex items-center gap-1.5 shadow-md">
            <CheckCircle className="w-3 h-3 text-white fill-white" />
            <span>Verifiable Record</span>
          </div>

          {/* Letterhead Logo */}
          <div className="border-b-2 border-dashed border-[#1A1A1A]/20 pb-5 text-center">
            <h1 className="text-xl font-serif italic font-black text-[#1A1A1A] tracking-tight">SuperKool Penang</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-slate-500 mt-1 font-semibold">HVAC Service &amp; Treatment Summary</p>
            <p className="text-[8px] font-mono text-slate-400 mt-0.5 select-all">DISPATCH SYSTEM ID: #{job.id}</p>
          </div>

          {/* Core Metrics Waypoints list */}
          <div className="py-5 space-y-3.5 border-b border-[#1A1A1A]/10 text-xs">
            <div className="flex justify-between items-start gap-4">
              <span className="font-mono text-slate-400 uppercase text-[9px] tracking-wider w-24 shrink-0">Client Account</span>
              <span className="font-bold text-slate-800 font-sans">{job.clientName}</span>
            </div>
            
            <div className="flex justify-between items-start gap-4">
              <span className="font-mono text-slate-400 uppercase text-[9px] tracking-wider w-24 shrink-0">Treatment Date</span>
              <span className="text-slate-700 font-mono font-medium">{job.dateStr} • {job.timeRange}</span>
            </div>

            <div className="flex justify-between items-start gap-4">
              <span className="font-mono text-slate-400 uppercase text-[9px] tracking-wider w-24 shrink-0">Job Verified</span>
              <span className="text-[#E03C31] font-bold uppercase tracking-wider font-mono text-[10px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E03C31] fill-current" />
                {job.type}
              </span>
            </div>

            <div className="flex justify-between items-start gap-4">
              <span className="font-mono text-slate-400 uppercase text-[9px] tracking-wider w-24 shrink-0">Service Site</span>
              <span className="text-slate-600 font-serif italic text-right truncate" title={job.address}>
                {job.address}
              </span>
            </div>
          </div>

          {/* Before and After Visual Evidence section */}
          <div className="py-5 border-b border-[#1A1A1A]/10">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A] mb-3 font-extrabold flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#E03C31]" />
              Treatment Visual Evidence
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Pre-service status */}
              <div className="space-y-1.5">
                <span className="block text-[8px] font-mono text-[#1A1A1A]/60 uppercase tracking-wider">Pre-Service Status</span>
                <div className="aspect-square bg-[#EBE7E2] rounded-none overflow-hidden relative border border-[#1A1A1A]/10 flex items-center justify-center">
                  {job.beforePhotos.length > 0 ? (
                    <img 
                      src={job.beforePhotos[job.beforePhotos.length - 1]} 
                      alt="Before servicing status" 
                      className="w-full h-full object-cover grayscale"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-2 text-center text-[9px] text-[#1A1A1A]/40 font-mono normal-case">
                      No photo captured
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[7px] font-mono px-1 py-0.2">BEFORE</span>
                </div>
              </div>

              {/* Completion status */}
              <div className="space-y-1.5">
                <span className="block text-[8px] font-mono text-[#1A1A1A]/60 uppercase tracking-wider">Completion Status</span>
                <div className="aspect-square bg-[#EBE7E2] rounded-none overflow-hidden relative border border-[#1A1A1A]/10 flex items-center justify-center">
                  {job.afterPhotos.length > 0 ? (
                    <img 
                      src={job.afterPhotos[job.afterPhotos.length - 1]} 
                      alt="After completed status" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="p-2 text-center text-[9px] text-[#1A1A1A]/40 font-mono normal-case">
                      No photo captured
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-[#E03C31] text-white text-[7px] font-mono px-1 py-0.2 font-bold animate-pulse">FIXED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Parts Allocation list & Invoicing details */}
          <div className="py-5 border-b border-[#1A1A1A]/10">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A] mb-3 font-extrabold flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#E03C31]" />
              Diagnostics &amp; Parts Ledger
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#1A1A1A]/70">{job.title} Service Rate</span>
                <span className="font-bold text-[#1A1A1A]">RM {job.amount.toFixed(2)}</span>
              </div>

              {checkedParts.length > 0 ? (
                <>
                  {checkedParts.map(p => (
                    <div key={p.id} className="flex justify-between text-[11px] font-mono pl-3 border-l border-[#1A1A1A]/15 text-slate-600">
                      <span>↳ {p.name} {p.isCustom && <span className="text-[8px] bg-[#E03C31] text-white px-1 py-0.05 font-sans">Custom</span>}</span>
                      <span>RM {p.price.toFixed(2)}</span>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-[9px] font-mono text-slate-400 italic">No spare parts or components replaced.</p>
              )}
            </div>
          </div>

          {/* Pricing settlement */}
          <div className="py-5 flex items-baseline justify-between border-b border-[#1A1A1A]/10 font-mono">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/60">Total Cost cleared</span>
            <div className="text-right">
              <small className="text-[9px] text-[#E03C31] block font-bold uppercase tracking-wider mb-0.5">Approved &amp; Settled Ok</small>
              <span className="text-2xl font-black text-[#1A1A1A]">RM {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Verification Signatures section */}
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-full">
                <CheckCircle className="w-4 h-4 fill-emerald-100" />
              </div>
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-emerald-800">Assigned Expert Checked</h4>
                <p className="text-[9px] text-slate-500 font-serif italic">Pak Mike, Senior Aircon Specialist</p>
              </div>
            </div>

            {/* Render client-side signature pad proof */}
            <div className="text-right flex flex-col items-center sm:items-end">
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 block mb-1">Client Authorization</span>
              <div className="bg-[#EBE7E2]/60 px-4 py-1 border border-[#1A1A1A]/10 h-10 w-28 flex items-center justify-center overflow-hidden">
                {job.clientSignature ? (
                  <span className="text-[9px] font-serif italic text-emerald-700 font-bold tracking-widest uppercase">
                    SIGNED OK
                  </span>
                ) : (
                  <span className="text-[8px] font-mono text-slate-400 italic">Signed Offline</span>
                )}
              </div>
            </div>
          </div>

          {/* Brand seal footer lines */}
          <div className="mt-6 pt-4 border-t border-dashed border-[#1A1A1A]/20 text-center text-[8.5px] font-mono uppercase tracking-widest text-slate-400 leading-normal">
            Thank you for using SuperKool Penang.<br />
            Certified Coolness Guaranteed • Support: 1-800-KOOL-PG
          </div>

        </div>

        {/* Informative text below the receipt */}
        <p className="text-center font-mono text-[9px] text-[#F4F1EE]/40 uppercase tracking-widest">
          Secured with SHA-256 Dispatch Block verification.
        </p>

      </div>
    </div>
  );
}
