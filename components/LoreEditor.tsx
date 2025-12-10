
import React, { useState, useEffect } from 'react';
import { LoreEntity, EntityType, EntityStatus, CategoryDefinition } from '../types';
import { Language, DICTIONARY } from '../utils';
import { X, Save, FileText, Tag } from 'lucide-react';

interface LoreEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entity: LoreEntity) => void;
  initialData?: Partial<LoreEntity>;
  lang: Language;
  categories: CategoryDefinition[];
  projectId: string;
}

const LoreEditor: React.FC<LoreEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  lang,
  categories,
  projectId
}) => {
  const t = DICTIONARY[lang];
  
  const [formData, setFormData] = useState<Partial<LoreEntity>>({
    title: '',
    title_zh: '',
    description: '',
    description_zh: '',
    content: '',
    content_zh: '',
    category: categories[0]?.id || 'Character',
    status: EntityStatus.DRAFT,
    tags: [],
    type: EntityType.LORE,
    linked_ids: []
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...formData, ...initialData, projectId });
      } else {
        // Reset for new entry
        setFormData({
          id: `lore-${Date.now()}`,
          projectId,
          title: '',
          title_zh: '',
          description: '',
          description_zh: '',
          content: '',
          content_zh: '',
          category: initialData?.category || categories[0]?.id,
          status: EntityStatus.DRAFT,
          tags: [],
          type: EntityType.LORE,
          linked_ids: [],
          created_at: new Date().toISOString(),
          author_id: 'user',
        });
      }
    }
  }, [isOpen, initialData, projectId]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.title) return;
    onSave({
       ...formData,
       updated_at: new Date().toISOString()
    } as LoreEntity);
    onClose();
  };

  const addTag = () => {
    if (tagInput && !formData.tags?.includes(tagInput)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput] });
      setTagInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-[800px] max-h-[90vh] flex flex-col rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText size={20} className="text-purple-500" />
            {initialData?.id ? t.crud.edit : t.crud.addEntity}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {/* Section 1: Basic Info */}
           <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 pb-2 border-b border-slate-800">
                {t.crud.basicInfo}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-slate-400 mb-1 block">Title (EN)</label>
                    <input 
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-xs text-slate-400 mb-1 block">Title (ZH)</label>
                    <input 
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                      value={formData.title_zh}
                      onChange={e => setFormData({...formData, title_zh: e.target.value})}
                    />
                 </div>
                 
                 <div>
                    <label className="text-xs text-slate-400 mb-1 block">{t.fields.category}</label>
                    <select 
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {lang === 'zh' ? c.name_zh : c.name}
                        </option>
                      ))}
                    </select>
                 </div>

                 <div>
                    <label className="text-xs text-slate-400 mb-1 block">{t.fields.status}</label>
                    <select 
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as EntityStatus})}
                    >
                      {Object.values(EntityStatus).map(s => (
                        <option key={s} value={s}>{t.status[s]}</option>
                      ))}
                    </select>
                 </div>
              </div>

              <div className="mt-4">
                 <label className="text-xs text-slate-400 mb-1 block">{t.fields.description}</label>
                 <textarea 
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none h-20 resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                 />
              </div>
           </div>

           {/* Section 2: Details */}
           <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 pb-2 border-b border-slate-800">
                {t.crud.details}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-slate-400 mb-1 block">Content (EN)</label>
                    <textarea 
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none h-40"
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-xs text-slate-400 mb-1 block">Content (ZH)</label>
                    <textarea 
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none h-40"
                      value={formData.content_zh}
                      onChange={e => setFormData({...formData, content_zh: e.target.value})}
                    />
                 </div>
              </div>
           </div>

           {/* Section 3: Tags */}
           <div>
             <label className="text-xs text-slate-400 mb-1 block">{t.fields.tags}</label>
             <div className="flex gap-2 mb-2">
                <input 
                  className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  placeholder="Press Enter to add tag..."
                />
                <button onClick={addTag} className="px-4 py-2 bg-slate-800 text-white rounded text-xs font-bold border border-slate-700">Add</button>
             </div>
             <div className="flex flex-wrap gap-2">
               {formData.tags?.map(tag => (
                 <span key={tag} className="flex items-center gap-1 bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">
                   <Tag size={10} /> {tag}
                   <button onClick={() => setFormData({...formData, tags: formData.tags?.filter(t => t !== tag)})} className="hover:text-red-400"><X size={10}/></button>
                 </span>
               ))}
             </div>
           </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-2">
           <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
             {t.crud.cancel}
           </button>
           <button onClick={handleSave} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-purple-900/20">
             <Save size={16} /> {t.crud.save}
           </button>
        </div>
      </div>
    </div>
  );
};

export default LoreEditor;
