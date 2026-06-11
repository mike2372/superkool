import { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Navigation, 
  Lock, 
  CalendarClock, 
  UserCheck, 
  ShieldAlert, 
  ThumbsUp, 
  Navigation2,
  CalendarDays,
  FlameKindling,
  User,
  ExternalLink,
  DollarSign,
  Locate
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Job, ViewScreen } from '../types';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1A1A1A]/95 text-[#F4F1EE] p-3 border border-[#1A1A1A] font-mono text-[9px] uppercase tracking-widest rounded-none shadow-xl">
        <p className="font-bold text-[#E03C31] mb-1">{data.name}</p>
        <p className="text-white">{payload[0].value} {payload[0].value === 1 ? 'Job' : 'Jobs'} Assigned</p>
      </div>
    );
  }
  return null;
};

interface TechDashboardProps {
  jobs: Job[];
  onSelectJob: (id: string) => void;
  onViewChange: (view: ViewScreen) => void;
}

export default function TechDashboard({ jobs, onSelectJob, onViewChange }: TechDashboardProps) {
  const [isOnline, setIsOnline] = useState(true);

  // Filter jobs for daily assignments (e.g. those assigned for "Today" or incomplete)
  const remainingCount = jobs.filter(j => j.status !== 'completed' && j.id.startsWith('SK-90')).length;
  const completedCount = jobs.filter(j => j.status === 'completed' && j.id.startsWith('SK-90')).length;

  // Let's compute estimated pay from completed
  const baseCompletedPay = jobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + j.amount, 0);

  // Status distributions for workload overview chart
  const pendingJobs = jobs.filter(j => j.status === 'pending_start');
  const inProgressJobs = jobs.filter(j => j.status === 'navigating' || j.status === 'active');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  const chartData = [
    { name: 'Pending', value: pendingJobs.length, color: '#A8A29E' },      // warm gray-neutral
    { name: 'In Progress', value: inProgressJobs.length, color: '#1A1A1A' },  // sleek charcoal
    { name: 'Completed', value: completedJobs.length, color: '#E03C31' }      // brand crimson
  ];

  const handleSelectJobDetail = (jobId: string) => {
    onSelectJob(jobId);
    onViewChange('tech-job-detail');
  };

  return (
    <div className="bg-[#F4F1EE] min-h-screen pb-24 relative select-none">
      {/* Subtle backing grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 relative z-10">
        
        {/* Header and Online Indicator Grid */}
        <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1A1A1A]/10 pb-6">
          <div>
            <p className="text-[10px] font-mono font-bold text-[#E03C31] uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-current" />
              Dispatch Plan — October 2023 Edition
            </p>
            <h2 className="text-3xl md:text-4xl font-serif italic font-bold text-[#1A1A1A]">
              Daily Dispatch Queue
            </h2>
          </div>

          {/* Interactive Availability Toggle */}
          <div className="flex items-center gap-3 bg-[#EBE7E2] px-4 py-2 border border-[#1A1A1A]/15 rounded-none shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60">Status:</span>
            
            <button 
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`relative inline-flex h-5 w-9 items-center rounded-none transition-colors cursor-pointer border border-[#1A1A1A] ${
                isOnline ? 'bg-[#E03C31]' : 'bg-[#E2E0DD]'
              }`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-none bg-white transition-transform ${
                isOnline ? 'translate-x-4' : 'translate-x-[1px]'
              }`} />
            </button>
            
            <span className={`text-[10px] font-mono uppercase tracking-widest ${isOnline ? 'text-[#E03C31] font-bold' : 'text-[#1A1A1A]/40'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </section>

        {/* Stats Bento Grid (Design HTML layout style) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#EBE7E2]/60 p-5 rounded-none border border-[#1A1A1A]/10 relative">
            <div className="absolute top-0 left-0 w-4 h-[1px] bg-[#E03C31]"></div>
            <p className="text-[9px] font-mono font-bold text-[#1A1A1A]/50 uppercase tracking-widest">Jobs Remaining</p>
            <p className="text-3xl font-mono font-black text-[#1A1A1A] mt-1">{String(remainingCount).padStart(2, '0')}</p>
          </div>
          
          <div className="bg-[#EBE7E2]/60 p-5 rounded-none border border-[#1A1A1A]/10 relative">
            <div className="absolute top-0 left-0 w-4 h-[1px] bg-[#E03C31]"></div>
            <p className="text-[9px] font-mono font-bold text-[#1A1A1A]/50 uppercase tracking-widest">Completed Tasks</p>
            <p className="text-3xl font-mono font-black text-[#1A1A1A]/80 mt-1">{String(completedCount).padStart(2, '0')}</p>
          </div>

          <div className="bg-[#EBE7E2]/60 p-5 rounded-none border border-[#1A1A1A]/10 relative">
            <div className="absolute top-0 left-0 w-4 h-[1px] bg-[#E03C31]"></div>
            <p className="text-[9px] font-mono font-bold text-[#1A1A1A]/50 uppercase tracking-widest">Estimated Pay</p>
            <p className="text-3xl font-mono font-black text-[#E03C31] mt-1">RM {baseCompletedPay || 450}</p>
          </div>

          <div className="bg-[#EBE7E2]/60 p-5 rounded-none border border-[#1A1A1A]/10 relative">
            <div className="absolute top-0 left-0 w-4 h-[1px] bg-[#E03C31]"></div>
            <p className="text-[9px] font-mono font-bold text-[#1A1A1A]/50 uppercase tracking-widest">Travel Log</p>
            <p className="text-3xl font-mono font-black text-[#1A1A1A] mt-1">24 KM</p>
          </div>
        </div>

        {/* Two Column Layout: Main list on left, Workload overview donut on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Daily Jobs Queue list (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {jobs.filter(j => j.id.startsWith('SK-90')).map((job, idx) => {
              const isActive = idx === 0 && job.status !== 'completed'; // Highlight the first incomplete job as 'NOW'
              
              return (
                <div 
                  key={job.id} 
                  className={`bg-[#F4F1EE] rounded-none overflow-hidden flex flex-col md:flex-row transition-all relative border ${
                    isActive 
                      ? 'border-[#E03C31] shadow-md' 
                      : 'border-[#1A1A1A]/15 hover:border-[#1A1A1A]/40'
                  }`}
                >
                  {/* Accent flag for outstanding task/active status */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#E03C31]"></div>
                  )}

                  {/* Left Side: Photo with NOW Badge overlay */}
                  <div className="md:w-1/3 relative h-48 md:h-auto min-h-[190px] border-b md:border-b-0 md:border-r border-[#1A1A1A]/10 shrink-0">
                    <img 
                      alt={job.clientName} 
                      className={`w-full h-full object-cover select-none ${!isActive ? 'grayscale opacity-70' : ''}`} 
                      src={job.siteImage} 
                      referrerPolicy="no-referrer"
                    />
                    {isActive && (
                      <div className="absolute top-4 left-4 bg-[#E03C31] text-white text-[9px] font-mono font-extrabold px-2.5 py-1 rounded-none uppercase tracking-[0.2em] shadow-sm">
                        ACTIVE NOW
                      </div>
                    )}
                    {job.status === 'completed' && (
                      <div className="absolute top-4 left-4 bg-emerald-700 text-white text-[9px] font-mono font-extrabold px-2.5 py-1 rounded-none uppercase tracking-[0.2em] shadow-sm">
                        COMPLETED
                      </div>
                    )}
                  </div>

                  {/* Right Side: Job details & responsive action links */}
                  <div className={`flex-1 p-6 flex flex-col justify-between ${isActive ? 'md:pl-8' : ''}`}>
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-3 pb-3 border-b border-dashed border-[#1A1A1A]/10">
                        <div>
                          <h3 className="text-xl font-serif italic text-[#1A1A1A] font-bold flex items-center gap-2">
                            {job.clientName}
                            <span className="text-[9px] font-mono bg-white border border-[#1A1A1A]/20 px-2 py-0.5 rounded-none uppercase tracking-wider">
                              #{job.id}
                            </span>
                          </h3>
                          <p className="text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 mt-1">{job.title}</p>
                        </div>
                        
                        <div className="text-right shrink-0">
                          <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-none uppercase tracking-widest block text-center border ${
                            job.type === 'Urgent Repair' 
                              ? 'bg-rose-50 text-rose-700 border-rose-100' 
                              : 'bg-transparent text-[#1A1A1A]/80 border-[#1A1A1A]/20'
                          }`}>
                            {job.type}
                          </span>
                          <p className="text-xs font-mono font-bold text-[#E03C31] mt-2.5">{job.timeRange}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5 text-slate-600 text-xs mt-3">
                        <MapPin className="w-4 h-4 text-[#1A1A1A]/40 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed italic">{job.address}</span>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-[#1A1A1A]/10">
                      {job.status === 'completed' ? (
                        <button 
                          onClick={() => handleSelectJobDetail(job.id)}
                          className="flex-1 bg-[#EBE7E2] border border-[#1A1A1A]/15 text-[#1A1A1A] py-2.5 rounded-none font-mono font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-4 hover:bg-[#1A1A1A] hover:text-white transition-all cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          Reprint Work Invoice / Evidence
                        </button>
                      ) : isActive ? (
                        <>
                          <button 
                            onClick={() => {
                              // Launch simulated GPS behavior in alert
                              alert(`Directions active: dispatching coordinates to Seberang Jaya!`);
                            }}
                            className="flex-1 bg-[#E03C31] text-white py-2.5 rounded-none font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors cursor-pointer"
                          >
                            <Navigation className="w-4 h-4 fill-current" />
                            Start GPS Route
                          </button>
                          
                          <button 
                            onClick={() => handleSelectJobDetail(job.id)}
                            className="flex-1 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] py-2.5 rounded-none font-mono font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                          >
                            View Details & Sign-off
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            disabled
                            className="flex-1 bg-[#EBE7E2]/50 text-[#1A1A1A]/30 py-2.5 rounded-none font-semibold font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed border border-dashed border-[#1A1A1A]/10"
                          >
                            <Lock className="w-4 h-4" />
                            Pending Dispatch Activation
                          </button>
                          
                          <button 
                            onClick={() => handleSelectJobDetail(job.id)}
                            className="flex-1 border border-[#1A1A1A]/20 hover:border-[#1A1A1A] text-[#1A1A1A] py-2.5 rounded-none font-mono font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                          >
                            Preview job profile
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Workload distribution visual and bulletins (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Elegant Workload Distribution Card */}
            <div className="bg-[#EBE7E2]/60 p-6 border border-[#1A1A1A]/10 relative rounded-none">
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#E03C31]"></div>
              
              <div className="flex justify-between items-baseline mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#E03C31] uppercase tracking-[0.2em] block mb-1">Queue health</span>
                  <h3 className="text-xl font-serif italic font-bold text-[#1A1A1A]">Workload Balance</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase bg-[#1A1A1A] text-white px-2 py-0.5 font-bold tracking-widest">
                    Live
                  </span>
                </div>
              </div>

              {/* Recharts Workload Donut Chart */}
              <div className="h-[220px] w-full flex items-center justify-center relative my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="55%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Clean Typographic Core inside Donut */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none pr-8">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400">allocated</p>
                  <p className="text-2xl font-mono font-black text-[#1A1A1A]">
                    {jobs.length}
                  </p>
                </div>
              </div>

              {/* Precise Legend with Percentages */}
              <div className="mt-4 pt-4 border-t border-[#1A1A1A]/10 space-y-2.5 font-mono text-[10px]">
                {chartData.map((d) => {
                  const total = jobs.length || 1;
                  const pct = ((d.value / total) * 100).toFixed(0);
                  
                  return (
                    <div key={d.name} className="flex justify-between items-center transition-all">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 border border-[#1A1A1A]/5" style={{ backgroundColor: d.color }}></span>
                        <span className="text-[#1A1A1A]/75 uppercase tracking-wider font-bold">{d.name}</span>
                      </div>
                      
                      <div className="text-right">
                        <span className="font-bold text-[#1A1A1A]">{d.value}</span>
                        <span className="text-slate-400 ml-1.5 font-medium">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Micro Incident Bulletin */}
            <div className="bg-[#EBE7E2]/20 p-5 border border-[#1A1A1A]/10 relative rounded-none">
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#1A1A1A]/30"></div>
              <span className="text-[9px] font-mono text-[#1A1A1A]/50 uppercase tracking-widest block mb-1">Supervisor memo</span>
              <h4 className="text-xs font-serif italic font-bold text-[#1A1A1A] mb-2.5">Field Advisory Bulletin</h4>
              <p className="text-[11.5px] text-slate-600 leading-normal italic font-serif">
                "Heavy rainfall forecast over Georgetown and Bayan Lepas sectors later today. Keep track of customer access availability and inspect condenser mounts carefully."
              </p>
              
              <div className="mt-4 pt-3 border-t border-[#1A1A1A]/5 flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                <span>Dispatch Office</span>
                <span>Active</span>
              </div>
            </div>

          </div>

        </div>


      </div>
    </div>
  );
}
