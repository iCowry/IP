
import React from 'react';
import { AppEntity, EntityStatus, EntityType, AssetEntity } from '../types';
import { Language, getLoc, DICTIONARY } from '../utils';
import { 
  Box, 
  Image as ImageIcon, 
  FileAudio, 
  Scroll, 
  Link2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText,
  Edit2,
  Trash2
} from 'lucide-react';

interface ResourceCardProps {
  entity: AppEntity;
  onClick: (id: string) => void;
  lang: Language;
  selected?: boolean;
  onEdit?: (entity: AppEntity) => void;
  onDelete?: (id: string) => void;
}

const StatusBadge: React.FC<{ status: EntityStatus, lang: Language }> = ({ status, lang }) => {
  const t = DICTIONARY[lang];
  const colors = {
    [EntityStatus.APPROVED]: 'bg-green-500/10 text-green-400 border-green-500/20',
    [EntityStatus.DRAFT]: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    [EntityStatus.REVIEW]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    [EntityStatus.DEPRECATED]: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  
  const Icons = {
    [EntityStatus.APPROVED]: CheckCircle2,
    [EntityStatus.DRAFT]: Clock,
    [EntityStatus.REVIEW]: AlertCircle,
    [EntityStatus.DEPRECATED]: XCircle,
  };

  const Icon = Icons[status];

  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${colors[status]}`}>
      <Icon size={10} />
      {t.status[status]}
    </span>
  );
};

const EntityIcon: React.FC<{ entity: AppEntity }> = ({ entity }) => {
  if (entity.type === EntityType.ASSET) {
    const asset = entity as AssetEntity;
    if (asset.fileType === 'Image' || asset.fileType === 'Texture') {
      return <ImageIcon className="text-blue-400" size={24} />;
    }
    if (asset.fileType === 'Audio') return <FileAudio className="text-purple-400" size={24} />;
    if (asset.fileType === 'Model') return <Box className="text-orange-400" size={24} />;
  }
  if (entity.type === EntityType.LORE) return <Scroll className="text-purple-400" size={24} />;
  if (entity.type === EntityType.CODE) return <FileText className="text-green-400" size={24} />;
  return <Box className="text-slate-400" size={24} />;
};

const ResourceCard: React.FC<ResourceCardProps> = ({ entity, onClick, lang, selected, onEdit, onDelete }) => {
  const t = DICTIONARY[lang];
  const isImage = entity.type === EntityType.ASSET && 
    ((entity as AssetEntity).fileType === 'Image' || (entity as AssetEntity).fileType === 'Texture');
  
  return (
    <div 
      onClick={() => onClick(entity.id)}
      className={`
        group relative flex flex-col bg-slate-900 border rounded-xl overflow-hidden cursor-pointer transition-all duration-200
        hover:shadow-lg hover:shadow-black/40 hover:-translate-y-1
        ${selected ? 'border-blue-500 ring-1 ring-blue-500/30' : 'border-slate-800 hover:border-slate-600'}
      `}
    >
      {/* Edit/Delete Overlay */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(entity); }}
            className="p-1.5 bg-slate-800/90 text-slate-300 hover:text-white hover:bg-blue-600 rounded-md backdrop-blur border border-slate-700 shadow-lg"
          >
            <Edit2 size={12} />
          </button>
        )}
        {onDelete && (
          <button 
             onClick={(e) => { e.stopPropagation(); onDelete(entity.id); }}
             className="p-1.5 bg-slate-800/90 text-slate-300 hover:text-white hover:bg-red-600 rounded-md backdrop-blur border border-slate-700 shadow-lg"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Preview Header */}
      <div className={`h-32 w-full overflow-hidden relative ${isImage ? 'bg-slate-950' : 'bg-slate-800/50 flex items-center justify-center'}`}>
        {isImage ? (
          <img 
            src={(entity as AssetEntity).fileUrl} 
            alt={getLoc(entity, 'title', lang)}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="p-4 rounded-full bg-slate-800 ring-1 ring-white/5 group-hover:scale-110 transition-transform duration-300">
            <EntityIcon entity={entity} />
          </div>
        )}
        
        {/* Linked Count Badge (Only show if not hovering actions) */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-slate-300 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 border border-white/5 group-hover:opacity-0 transition-opacity">
          <Link2 size={10} />
          {entity.linked_ids.length}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
           <div className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 rounded">{entity.id}</div>
           <StatusBadge status={entity.status} lang={lang} />
        </div>

        <h3 className="font-semibold text-slate-100 text-sm mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {getLoc(entity, 'title', lang)}
        </h3>
        
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 flex-1">
          {getLoc(entity, 'description', lang)}
        </p>

        {/* Footer */}
        <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-slate-800/50">
          {entity.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-800/80 rounded text-slate-400 border border-slate-700/50">
              #{tag}
            </span>
          ))}
          {entity.tags.length > 2 && (
            <span className="text-[10px] px-1.5 py-0.5 text-slate-600">+{entity.tags.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
