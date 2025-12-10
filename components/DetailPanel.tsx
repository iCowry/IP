
import React, { useMemo } from 'react';
import { AppEntity, EntityType, EntityStatus, AssetEntity, LoreEntity } from '../types';
import { MOCK_DATA } from '../mockData'; // Need access to full data for linking
import { Language, DICTIONARY, getLoc } from '../utils';
import { 
  X, 
  Code2, 
  Box, 
  Clock, 
  Link2,
  FileText,
  ExternalLink,
  Tag
} from 'lucide-react';

interface DetailPanelProps {
  entity: AppEntity;
  onClose: () => void;
  onSelectEntity: (id: string) => void;
  lang: Language;
  onEdit: (entity: AppEntity) => void;
  onViewHistory: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ entity, onClose, onSelectEntity, lang, onEdit, onViewHistory }) => {
  const t = DICTIONARY[lang];

  // 1. Group Linked Entities
  const relations = useMemo(() => {
    // In a real app this should use the live entity state, but for MVP MOCK_DATA linkage is static reference
    // We can rely on the passed 'entity.linked_ids' to search the global store if available, 
    // but here we fall back to MOCK_DATA for the lookups to find *other* entities. 
    // ideally App should pass "allEntities" prop.
    const linked = MOCK_DATA.filter(item => entity.linked_ids.includes(item.id));
    const grouped: Partial<Record<EntityType, AppEntity[]>> = {};
    
    linked.forEach(item => {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type]?.push(item);
    });
    
    return grouped;
  }, [entity]);

  return (
    <aside className="w-[450px] bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl z-20 absolute right-0 top-0 bottom-0 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/95 backdrop-blur shrink-0">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Code2 size={16} className="text-blue-500"/>
          {t.inspectorHeader}
        </h3>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Title Block */}
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-blue-400 uppercase rounded tracking-wide border border-slate-700">
               {t.types[entity.type]}
             </span>
             <span className={`text-[10px] font-bold px-2 py-0.5 uppercase rounded tracking-wide border ${
               entity.status === EntityStatus.APPROVED ? 'bg-green-900/30 text-green-400 border-green-800' : 
               'bg-slate-800 text-slate-400 border-slate-700'
             }`}>
               {t.status[entity.status]}
             </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 leading-tight font-serif tracking-tight">
            {getLoc(entity, 'title', lang)}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>{t.detailPanel.id}: {entity.id}</span>
            <span>•</span>
            <span>{t.detailPanel.auth}: {entity.author_id}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
           <p className="text-slate-300 text-sm leading-relaxed relative z-10">
             {getLoc(entity, 'description', lang)}
           </p>
        </div>

        {/* Content / Specifics */}
        <div className="space-y-4">
           {/* Asset Preview */}
           {'fileUrl' in entity && (
             <div className="bg-black/40 rounded-lg overflow-hidden border border-slate-800">
                {(entity as AssetEntity).fileType === 'Image' || (entity as AssetEntity).fileType === 'Texture' ? (
                  <img src={(entity as AssetEntity).fileUrl} className="w-full h-48 object-cover opacity-80" alt="Asset" />
                ) : (
                  <div className="h-32 flex items-center justify-center text-slate-600">
                    <Box size={40} strokeWidth={1} />
                  </div>
                )}
                <div className="p-3 flex justify-between text-xs text-slate-400 bg-slate-900 border-t border-slate-800">
                   <span>{(entity as AssetEntity).fileType}</span>
                   <span>{(entity as AssetEntity).fileSize}</span>
                </div>
             </div>
           )}

           {/* Lore Content */}
           {'content' in entity && (
             <div>
                <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">{t.fields.contentPreview}</h4>
                <div className="text-sm text-slate-300 font-serif italic border-l-2 border-slate-700 pl-4 py-1">
                  "{getLoc(entity, 'content', lang)}"
                </div>
             </div>
           )}

           {/* AI Prompt */}
           {'promptTemplate' in entity && (
             <div>
                <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">{t.fields.promptTemplate}</h4>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-xs text-green-400/90 whitespace-pre-wrap">
                  {(entity as any).promptTemplate}
                </div>
             </div>
           )}

           {/* Tags */}
           <div className="flex flex-wrap gap-2 pt-2">
             {entity.tags.map(tag => (
               <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-1 bg-slate-800/50 rounded-full text-slate-400 border border-slate-800">
                 <Tag size={10} /> {tag}
               </span>
             ))}
           </div>
        </div>

        {/* Relations Graph List - Grouped */}
        <div>
          <h4 className="text-xs uppercase font-bold text-slate-500 mb-4 flex items-center gap-2">
             <Link2 size={14} /> {t.fields.connectedEntities}
          </h4>
          
          <div className="space-y-6">
             {Object.keys(relations).length === 0 && (
                <div className="text-sm text-slate-600 italic px-2">{t.fields.noConnections}</div>
             )}

             {Object.entries(relations).map(([type, items]) => (
               <div key={type} className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider pl-1">
                    {t.relations[type as EntityType]}
                  </div>
                  <div className="space-y-2">
                    {(items as AppEntity[]).map(linked => (
                       <button
                         key={linked.id}
                         onClick={() => onSelectEntity(linked.id)}
                         className="w-full flex items-center gap-3 p-2 rounded-lg bg-slate-800/20 border border-slate-800/50 hover:bg-slate-800 hover:border-slate-700 transition-all group text-left"
                       >
                          <div className={`w-8 h-8 rounded flex items-center justify-center text-xs shrink-0 ${
                             linked.type === EntityType.LORE ? 'bg-purple-900/20 text-purple-500' :
                             linked.type === EntityType.ASSET ? 'bg-blue-900/20 text-blue-500' :
                             linked.type === EntityType.AI ? 'bg-green-900/20 text-green-500' :
                             'bg-slate-800 text-slate-500'
                          }`}>
                             {linked.type[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="text-sm text-slate-300 font-medium truncate group-hover:text-blue-400 transition-colors">
                               {getLoc(linked, 'title', lang)}
                             </div>
                             <div className="text-[10px] text-slate-500">
                               {linked.id}
                             </div>
                          </div>
                          <ExternalLink size={12} className="text-slate-600 group-hover:text-slate-400" />
                       </button>
                    ))}
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0 flex gap-2">
         <button 
           onClick={() => onEdit(entity)}
           className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded transition-colors"
         >
            {t.detailPanel.editEntity}
         </button>
         <button 
           onClick={onViewHistory}
           className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded transition-colors"
         >
            {t.detailPanel.viewHistory}
         </button>
      </div>
    </aside>
  );
};

export default DetailPanel;
