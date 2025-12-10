
import React, { useState, useMemo } from 'react';
import { LoreEntity, CategoryDefinition, EntityStatus } from '../types';
import { Language, DICTIONARY } from '../utils';
import ResourceCard from './ResourceCard';
import { Filter, Settings, Plus, Wand2 } from 'lucide-react';
import LoreEditor from './LoreEditor';
import AIGenerator from './AIGenerator';

interface WorldBiblePageProps {
  data: LoreEntity[];
  onSelect: (id: string) => void;
  lang: Language;
  categories: CategoryDefinition[];
  onManageCategories: () => void;
  projectId: string;
  projectName: string;
  onAddEntity: (entity: LoreEntity) => void;
  onUpdateEntity: (entity: LoreEntity) => void;
  onDeleteEntity: (id: string) => void;
}

const WorldBiblePage: React.FC<WorldBiblePageProps> = ({ 
  data, 
  onSelect, 
  lang,
  categories,
  onManageCategories,
  projectId,
  projectName,
  onAddEntity,
  onUpdateEntity,
  onDeleteEntity
}) => {
  const [filter, setFilter] = useState<string>('All');
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [isAIGenOpen, setAIGenOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<LoreEntity | undefined>(undefined);

  const t = DICTIONARY[lang];

  // Dynamic Filtering
  const filteredData = useMemo(() => {
    if (filter === 'All') return data;
    return data.filter(item => item.category === filter);
  }, [data, filter]);

  const getCategoryLabel = (catId: string) => {
      if (catId === 'All') return (t.categories as any).All;
      const def = categories.find(c => c.id === catId);
      if (!def) return catId;
      return lang === 'zh' ? def.name_zh : def.name;
  };

  const handleOpenAdd = () => {
    setEditingEntity(undefined);
    setEditorOpen(true);
  };

  const handleEdit = (entity: any) => {
    setEditingEntity(entity as LoreEntity);
    setEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.crud.deleteConfirm)) {
      onDeleteEntity(id);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-start justify-between mb-6 shrink-0">
        <div className="flex flex-col gap-4 flex-1 mr-4">
           {/* Actions Row */}
           <div className="flex gap-2">
              <button 
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-900/20 transition-all"
              >
                <Plus size={16} /> {t.crud.addEntity}
              </button>
              <button 
                onClick={() => setAIGenOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-purple-900/20 transition-all"
              >
                <Wand2 size={16} /> {t.crud.aiGenerate}
              </button>
              <div className="w-px h-8 bg-slate-800 mx-2"></div>
               <button 
                onClick={onManageCategories}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all"
              >
                 <Settings size={14} />
                 <span className="text-xs font-medium">{t.categoryManager.manageBtn}</span>
              </button>
           </div>

           {/* Filters Row */}
           <div className="flex flex-wrap gap-2">
            <button
                onClick={() => setFilter('All')}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${filter === 'All'
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'}
                `}
            >
               {getCategoryLabel('All')}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-medium transition-all border
                  ${filter === cat.id
                    ? 'bg-slate-700 text-white border-slate-600' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'}
                `}
              >
                 {lang === 'zh' ? cat.name_zh : cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap pt-2">
          <Filter size={14} />
          <span>{filteredData.length} entries</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-6 pr-2">
        {filteredData.map(entity => (
          <ResourceCard 
            key={entity.id} 
            entity={entity} 
            onClick={onSelect} 
            lang={lang} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        
        {/* Empty State / Add New Card Shortcut */}
        <button 
          onClick={handleOpenAdd}
          className="border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-600 hover:text-blue-400 hover:border-blue-500/50 hover:bg-slate-900/50 transition-all min-h-[200px] group"
        >
           <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
             <Plus size={24} />
           </div>
           <span className="text-sm font-medium">{t.crud.addEntity}</span>
        </button>
      </div>

      {/* Modals */}
      <LoreEditor 
        isOpen={isEditorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={(e) => { 
           if (editingEntity) onUpdateEntity(e); 
           else onAddEntity(e); 
        }}
        initialData={editingEntity || { category: filter === 'All' ? categories[0]?.id : filter }}
        lang={lang}
        categories={categories}
        projectId={projectId}
      />

      <AIGenerator 
        isOpen={isAIGenOpen}
        onClose={() => setAIGenOpen(false)}
        onGenerated={onAddEntity}
        category={filter === 'All' ? categories[0]?.id : filter}
        projectId={projectId}
        projectName={projectName}
        lang={lang}
        categories={categories}
        existingEntities={filteredData}
      />
    </div>
  );
};

export default WorldBiblePage;
