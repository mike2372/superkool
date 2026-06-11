import { useState } from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  Wallet, 
  ChevronRight, 
  TrendingUp, 
  Star, 
  Info, 
  ArrowRight,
  Sparkles,
  Building,
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Job, ViewScreen } from '../types';

interface TechEarningsProps {
  jobs: Job[];
  onSelectJob: (id: string) => void;
  onViewChange: (view: ViewScreen) => void;
}

export const TREND_DATA = [
  { day: 'MON', amount: 120, height: 'h-[30%]' },
  { day: 'TUE', amount: 240, height: 'h-[60%]' },
  { day: 'WED', amount: 320, height: 'h-[85%]', highlight: true },
  { day: 'THU', amount: 180, height: 'h-[45%]' },
  { day: 'FRI', amount: 280, height: 'h-[70%]' },
  { day: 'SAT', amount: 210, height: 'h-[55%]' },
  { day: 'SUN', amount: 90, height: 'h-[20%]' },
];

export default function TechEarnings({ jobs, onSelectJob, onViewChange }: TechEarningsProps) {
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false);
  const [activeChartHover, setActiveChartHover] = useState<string | null>('WED');

  // Completed transactions
  const transactions = jobs.filter(j => j.status === 'completed' || j.id.startsWith('SK-99') || j.id.startsWith('SK-98'));

  const handleWithdrawClick = () => {
    setShowWithdrawSuccess(true);
  };

  const handleTxRowClick = (jobId: string) => {
    onSelectJob(jobId);
    onViewChange('tech-job-detail');
  };

  return (
    <div className="bg-[#F4F1EE] min-h-screen pb-24 relative select-none font-sans">
      {/* Backing grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 relative z-10">
        
        {/* Header Title Section */}
        <section className="mb-10 pb-6 border-b border-[#1A1A1A]/10">
          <span className="text-[10px] font-mono text-[#E03C31] uppercase tracking-[0.25em] block mb-1">Financial Ledger</span>
          <h2 className="text-3xl md:text-4xl font-serif italic font-bold text-[#1A1A1A]">
            Weekly Settlements
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-normal italic">
            Review your approved payouts, pending clearance, and weekly incentives.
          </p>
        </section>

        {/* Total balance card (Deep Charcoal & Crimson Theme) */}
        <div className="relative overflow-hidden bg-[#1A1A1A] text-white rounded-none p-6 sm:p-8 mb-10 shadow-xl border border-[#1A1A1A]">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#E03C31]"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Left Balance display */}
            <div>
              <span className="text-[#F4F1EE]/60 text-[10px] font-mono uppercase tracking-[0.2em] block">
                Total Available Balance
              </span>
              <h3 className="text-4xl font-mono font-black text-white mt-2 leading-none">
                RM 2,450.00
              </h3>
              
              <div className="flex items-center gap-4 mt-6">
                <button 
                  onClick={handleWithdrawClick}
                  className="bg-[#E03C31] text-white px-6 py-2.5 rounded-none font-mono font-bold text-[10px] uppercase tracking-widest hover:bg-[#c93026] transition-colors cursor-pointer border border-[#E03C31]"
                >
                  <Wallet className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                  Withdraw Funds
                </button>
              </div>
            </div>

            {/* Right details grid info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-none border border-white/10 text-white relative">
                <p className="text-[#F4F1EE]/50 text-[9px] font-mono uppercase tracking-widest">Pending Clearance</p>
                <p className="text-lg font-mono font-bold mt-1">RM 420.00</p>
              </div>
              
              <div className="bg-white/5 p-4 rounded-none border border-white/10 text-white relative">
                <p className="text-[#F4F1EE]/50 text-[9px] font-mono uppercase tracking-widest">Weekly growth</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-400">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-lg font-mono font-bold text-white">+12%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bento Grid for detailed trend and Performance incentives */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Detailed trend bar graph column split */}
          <div className="lg:col-span-2 bg-[#F4F1EE] border border-[#1A1A1A]/15 rounded-none p-6 relative">
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-800 font-bold">Weekly Performance Trend</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Assigned payouts based on site signoffs</p>
              </div>
              <span className="text-[10px] bg-[#EBE7E2] text-slate-600 font-mono font-bold py-1 px-3 border border-[#1A1A1A]/10">
                Oct 12 - Oct 18
              </span>
            </div>

            {/* Custom Bar Graph */}
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 select-none">
              {TREND_DATA.map(d => {
                const isHovered = activeChartHover === d.day;
                const isHighlighted = d.highlight;

                return (
                  <div 
                    key={d.day} 
                    className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                    onMouseEnter={() => setActiveChartHover(d.day)}
                    onMouseLeave={() => setActiveChartHover('WED')}
                  >
                    {/* Tooltip display */}
                    {(isHovered || isHighlighted) && (
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[9px] font-mono font-bold px-2 py-1 rounded-none shadow-md z-30">
                        RM{d.amount}
                      </div>
                    )}

                    {/* Bar visual */}
                    <div 
                      className={`w-full rounded-none transition-all duration-300 ${d.height} ${
                        isHighlighted 
                          ? 'bg-[#E03C31]' 
                          : isHovered 
                            ? 'bg-[#E03C31]/75' 
                            : 'bg-[#1A1A1A]/10 hover:bg-[#1A1A1A]/20'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between mt-4 px-2 text-[9px] font-mono font-extrabold text-[#1A1A1A]/50 uppercase tracking-widest">
              {TREND_DATA.map(d => (
                <span key={d.day} className={`w-8 text-center ${d.highlight ? 'text-[#E03C31] font-black' : ''}`}>
                  {d.day}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Incentive details card */}
          <div className="bg-[#E03C31]/5 border border-[#E03C31]/20 rounded-none p-6 flex flex-col justify-between relative">
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
            <div>
              <div className="w-10 h-10 bg-[#E03C31] text-white flex items-center justify-center mb-4 border border-[#E03C31]">
                <Star className="w-5 h-5 fill-current text-white" />
              </div>
              <h4 className="text-xl font-serif italic text-[#1A1A1A] font-bold">Lead Elite Specialist</h4>
              <p className="text-xs text-slate-700 leading-relaxed mt-2 italic">
                A bonus weighting of <span className="font-bold font-mono">RM150.00</span> was applied to your invoice for maintaining an exceptional 4.9 weekly sign-off score.
              </p>
            </div>

            {/* Rating Milestone progress bar */}
            <div className="mt-6 md:mt-0 pt-4 border-t border-[#1A1A1A]/10">
              <div className="flex justify-between items-baseline mb-1.5 text-[9px] font-mono font-bold">
                <span className="text-slate-500 uppercase tracking-wider">Milestone Progress</span>
                <span className="text-[#E03C31]">85%</span>
              </div>
              
              <div className="h-2 w-full bg-[#1A1A1A]/10 rounded-none overflow-hidden">
                <div className="h-full bg-[#E03C31] w-[85%] rounded-none"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Transaction History list */}
        <section>
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <h4 className="text-lg font-serif italic text-[#1A1A1A] font-bold">Transaction History</h4>
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Processed Service Payout Log</p>
            </div>
            
            <button className="text-[#E03C31] hover:underline text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer">
              Details 
              <ArrowRight className="w-3" />
            </button>
          </div>

          <div className="bg-transparent border border-[#1A1A1A]/15 rounded-none overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#EBE7E2] border-b border-[#1A1A1A]/15 text-left">
                    <th className="px-6 py-4 font-mono font-bold text-[#1A1A1A]/70 text-[9px] uppercase tracking-wider">Assigned Task / Service ID</th>
                    <th className="px-6 py-4 font-mono font-bold text-[#1A1A1A]/70 text-[9px] uppercase tracking-wider">Fulfillment Timestamp</th>
                    <th className="px-6 py-4 font-mono font-bold text-[#1A1A1A]/70 text-[9px] uppercase tracking-wider text-right">Invoice Balance</th>
                    <th className="px-6 py-4 font-mono font-bold text-[#1A1A1A]/70 text-[9px] uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/10">
                  {transactions.map(tx => {
                    const isProcessing = tx.id === 'SK-9921';
                    
                    return (
                      <tr 
                        key={tx.id} 
                        onClick={() => tx.id.startsWith('SK-90') && handleTxRowClick(tx.id)}
                        className={`hover:bg-[#1A1A1A]/5 transition-colors group ${tx.id.startsWith('SK-90') ? 'cursor-pointer' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 bg-[#EBE7E2]/60 border border-[#1A1A1A]/10 text-[#E03C31] flex items-center justify-center shrink-0 rounded-none">
                              <Building className="w-4.5 h-4.5 text-current" />
                            </div>
                            
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#E03C31] transition-colors">
                                {tx.title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">
                                Acc: #{tx.id} • {tx.clientName}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs font-mono text-slate-500">
                          {tx.timeRange.includes('PM') ? 'Today, 2:30 PM' : tx.timeRange}
                        </td>

                        <td className="px-6 py-4 text-right font-mono font-bold text-xs text-[#1A1A1A]">
                          RM {tx.amount.toFixed(2)}
                        </td>

                        <td className="px-6 py-4 text-center">
                          {isProcessing ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-mono font-extrabold uppercase tracking-wider rounded-none">
                              <Clock className="w-3 h-3 text-amber-700 animate-spin" style={{ animationDuration: '3s' }} />
                              Processing
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-850 border border-emerald-200 text-[9px] font-mono font-extrabold uppercase tracking-wider rounded-none">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              Paid
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>

      {/* Simulated Withdrawal Success Overlay */}
      {showWithdrawSuccess && (
        <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#F4F1EE] border border-[#1A1A1A]/30 p-8 max-w-md w-full shadow-2xl relative text-center rounded-none animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-[#E03C31] text-[#F4F1EE] flex items-center justify-center mx-auto mb-4 border border-[#E03C31]">
              <Sparkles className="w-6 h-6 " />
            </div>
            
            <h3 className="text-xl font-serif italic font-bold text-[#1A1A1A]">Transfer Initiated</h3>
            <p className="text-xs text-slate-600 mt-2 font-mono uppercase tracking-wide">
              RM 2,450.00 Approved
            </p>
            
            <div className="bg-[#EBE7E2] border border-[#1A1A1A]/10 p-4 text-[11px] text-left space-y-1 my-5 font-mono">
              <div><span className="opacity-50">Recipient Acc:</span> Maybank Acc ****9012</div>
              <div><span className="opacity-50">Settlement Code:</span> SSL-TX-WTH8823</div>
              <div><span className="opacity-50">Est. Arrival:</span> &lt; 2 Hours</div>
            </div>

            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setShowWithdrawSuccess(false)}
                className="w-full bg-[#1A1A1A] hover:bg-[#E03C31] text-white py-3 text-xs uppercase tracking-widest font-mono font-bold transition-colors cursor-pointer"
              >
                Acknowledge Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
