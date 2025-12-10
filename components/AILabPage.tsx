
import React, { useState } from 'react';
import { AIEntity, EntityType } from '../types';
import { Language, DICTIONARY, getLoc } from '../utils';
import { Cpu, Play, Copy, Sliders, Zap } from 'lucide-react';

interface AILabPageProps {
  data: AIEntity[];
  onSelect: (id: string) => void;
  lang: Language;
}

const AILabPage: React.FC<AILabPageProps> = ({ data, onSelect, lang }) => {
  const [selectedId, setSelectedId] = useState<string | null>(data[0]?.id || null);
  const t = DICTIONARY[lang];

  const selectedAI = data.find(item => item.id === selectedId);

  // Mock handlers
  const handleCopy = () => {
    if (selectedAI) {
      navigator.clipboard.writeText(selectedAI.promptTemplate);
      alert("Prompt copied to clipboard!");
    }
  };

  return (
    <div className="h-full flex overflow-hidden border border-slate-800 rounded-xl bg-slate-900">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900/50">
        <div className="p-4 border-b border-slate-800">
           <h3 className="font-semibold text-slate-200 flex items-center gap-2">
             <Cpu size={18} className="text-green-400"/>
             {t.types[EntityType.AI]}
           </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {data.map(item => (
            <button
              key={item.id}
              onClick={() => { setSelectedId(item.id); onSelect(item.id); }}
              className={`w-full text-left p-4 border-b border-slate-800 hover:bg-slate-800 transition-colors ${selectedId === item.id ? 'bg-slate-800 border-l-4 border-l-green-500' : 'border-l-4 border-l-transparent'}`}
            >
              <h4 className={`font-medium text-sm ${selectedId === item.id ? 'text-green-400' : 'text-slate-300'}`}>
                {getLoc(item, 'title', lang)}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {getLoc(item, 'description', lang)}
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-950 rounded text-slate-400 font-mono">
                  {item.modelName}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      {selectedAI ? (
        <div className="flex-1 flex flex-col bg-slate-950">
          {/* Editor Header */}
          <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900">
             <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-300">{t.aiLab.editorTitle}</span>
                <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-900/50">
                   {selectedAI.status}
                </span>
             </div>
             <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" 
                  title={t.aiLab.copy}
                >
                  <Copy size={18} />
                </button>
                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                  <Play size={14} fill="currentColor" />
                  {t.aiLab.runButton}
                </button>
             </div>
          </div>

          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
             {/* Configuration Panel */}
             <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                   <label className="text-xs text-slate-500 uppercase font-bold mb-2 block flex items-center gap-2">
                      <Zap size={12} /> {t.aiLab.modelSelect}
                   </label>
                   <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:outline-none focus:border-green-500" disabled>
                      <option>{selectedAI.modelName}</option>
                   </select>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                   <label className="text-xs text-slate-500 uppercase font-bold mb-2 block flex items-center gap-2">
                      <Sliders size={12} /> {t.aiLab.params}
                   </label>
                   <div className="flex gap-4 text-sm text-slate-400">
                      <div className="flex-1 flex justify-between">
                         <span>Temp:</span>
                         <span className="font-mono text-green-400">{selectedAI.parameters.temperature}</span>
                      </div>
                      <div className="flex-1 flex justify-between border-l border-slate-800 pl-4">
                         <span>Seed:</span>
                         <span className="font-mono text-green-400">{selectedAI.parameters.seed || 'Random'}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Prompt Editor */}
             <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs text-slate-500 uppercase font-bold">System / User Prompt</label>
                <textarea 
                  className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 resize-none leading-relaxed selection:bg-green-500/30"
                  value={selectedAI.promptTemplate}
                  readOnly
                />
             </div>

             {/* Output Mock */}
             <div className="h-32 mt-6 border-t border-slate-800 pt-4">
                 <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Output Preview</label>
                 <div className="w-full h-full bg-black/30 rounded border border-slate-800 border-dashed flex items-center justify-center text-slate-600 text-sm italic">
                    {t.aiLab.outputPlaceholder}
                 </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-600">
           Select an AI Entity
        </div>
      )}
    </div>
  );
};

export default AILabPage;
