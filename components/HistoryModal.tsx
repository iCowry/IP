
import React from 'react';
import { Language, DICTIONARY } from '../utils';
import { X, Clock, RotateCcw } from 'lucide-react';
import { AppEntity } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: AppEntity | null;
  lang: Language;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, entity, lang }) => {
  const t = DICTIONARY[lang].history;

  if (!isOpen || !entity) return null;

  // Mock History Data
  const history = [
    { version: 'v1.2', date: '2023-11-15', author: 'User', changes: 'Updated description and tags.' },
    { version: 'v1.1', date: '2023-11-10', author: 'AI Architect', changes: 'Initial AI generation.' },
    { version: 'v1.0', date: '2023-11-01', author: 'System', changes: 'Draft created.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-[500px] flex flex-col rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock size={20} className="text-blue-500" />
            {t.title}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
            {history.map((h, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                    <div className="flex flex-col items-center gap-1 pt-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        {i !== history.length - 1 && <div className="w-px h-full bg-slate-700 my-1"></div>}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <span className="font-bold text-sm text-slate-200">{h.version}</span>
                            <span className="text-xs text-slate-500">{h.date}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{h.changes}</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-500">by {h.author}</span>
                            <button className="text-[10px] flex items-center gap-1 text-blue-400 hover:text-blue-300">
                                <RotateCcw size={10} /> {t.restore}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
