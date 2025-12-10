
import React from 'react';
import { AppEntity, EntityStatus, EntityType } from '../types';
import { Language, DICTIONARY, getLoc } from '../utils';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Database, 
  Cpu, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

interface DashboardPageProps {
  data: AppEntity[];
  onSelect: (id: string) => void;
  lang: Language;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className={`bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between group hover:border-${color}-500/50 transition-colors`}>
    <div>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
  </div>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ data, onSelect, lang }) => {
  const t = DICTIONARY[lang];

  // Calculated Stats
  const totalEntities = data.length;
  const pendingTasks = data.filter(e => e.type === EntityType.TASK && e.status !== EntityStatus.APPROVED).length;
  const aiModels = data.filter(e => e.type === EntityType.AI).length;
  const recentItems = [...data].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5);

  return (
    <div className="h-full overflow-y-auto pb-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title={t.stats.totalEntities} 
          value={totalEntities} 
          icon={<Database size={24} />} 
          color="blue" 
        />
        <StatCard 
          title={t.stats.pendingTasks} 
          value={pendingTasks} 
          icon={<CheckCircle2 size={24} />} 
          color="orange" 
        />
        <StatCard 
          title={t.stats.aiModels} 
          value={aiModels} 
          icon={<Cpu size={24} />} 
          color="green" 
        />
        <StatCard 
          title={t.stats.storageUsed} 
          value="474 MB" 
          icon={<LayoutDashboard size={24} />} 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Clock size={18} className="text-blue-400" />
            {t.recentActivity}
          </h3>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {recentItems.map((item, index) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`
                  p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-800 transition-colors
                  ${index !== recentItems.length - 1 ? 'border-b border-slate-800' : ''}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold
                  ${item.type === EntityType.LORE ? 'bg-purple-900/30 text-purple-400' : 
                    item.type === EntityType.ASSET ? 'bg-blue-900/30 text-blue-400' : 
                    item.type === EntityType.AI ? 'bg-green-900/30 text-green-400' : 
                    'bg-slate-800 text-slate-400'}
                `}>
                  {item.type[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-200">{getLoc(item, 'title', lang)}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.types[item.type]} • Updated {new Date(item.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-slate-500">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Progress (Mini) */}
        <div className="space-y-4">
           <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-orange-400" />
            {t.taskProgress}
          </h3>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <div className="flex items-center justify-center py-6">
                <div className="w-32 h-32 rounded-full border-8 border-slate-800 border-t-orange-500 border-r-orange-500 rotate-45 flex items-center justify-center">
                   <div className="-rotate-45 text-center">
                      <div className="text-2xl font-bold text-white">65%</div>
                      <div className="text-[10px] text-slate-500 uppercase">Complete</div>
                   </div>
                </div>
             </div>
             <div className="space-y-3 mt-4">
                <div className="flex justify-between text-sm">
                   <span className="text-slate-400">High Priority</span>
                   <span className="text-orange-400 font-mono">3</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-slate-400">Due This Week</span>
                   <span className="text-blue-400 font-mono">5</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
