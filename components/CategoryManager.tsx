
import React, { useState } from 'react';
import { CategoryDefinition } from '../types';
import { X, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { Language, DICTIONARY } from '../utils';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryDefinition[];
  setCategories: (cats: CategoryDefinition[]) => void;
  lang: Language;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  setCategories,
  lang 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEn, setEditEn] = useState('');
  const [editZh, setEditZh] = useState('');
  
  const [newEn, setNewEn] = useState('');
  const [newZh, setNewZh] = useState('');

  const t = DICTIONARY[lang].categoryManager;

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newEn) return;
    const newId = newEn; // Simple ID generation
    
    // Check dupe
    if (categories.some(c => c.id === newId)) {
        alert("Category ID already exists");
        return;
    }

    const newCat: CategoryDefinition = {
      id: newId,
      name: newEn,
      name_zh: newZh || newEn
    };
    
    setCategories([...categories, newCat]);
    setNewEn('');
    setNewZh('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.deleteConfirm)) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const startEdit = (cat: CategoryDefinition) => {
    setEditingId(cat.id);
    setEditEn(cat.name);
    setEditZh(cat.name_zh);
  };

  const saveEdit = () => {
    if (editingId) {
       setCategories(categories.map(c => 
         c.id === editingId ? { ...c, name: editEn, name_zh: editZh } : c
       ));
       setEditingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-[600px] max-h-[80vh] flex flex-col rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">
            {t.title}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 uppercase px-2 mb-2">
            <div className="col-span-5">{t.nameEn}</div>
            <div className="col-span-5">{t.nameZh}</div>
            <div className="col-span-2 text-right">{t.actions}</div>
          </div>

          {/* List */}
          {categories.map(cat => (
            <div key={cat.id} className="grid grid-cols-12 gap-2 items-center bg-slate-800/50 p-2 rounded hover:bg-slate-800 transition-colors">
               {editingId === cat.id ? (
                 <>
                   <div className="col-span-5">
                      <input 
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
                        value={editEn}
                        onChange={(e) => setEditEn(e.target.value)}
                      />
                   </div>
                   <div className="col-span-5">
                      <input 
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
                        value={editZh}
                        onChange={(e) => setEditZh(e.target.value)}
                      />
                   </div>
                   <div className="col-span-2 flex justify-end gap-2">
                     <button onClick={saveEdit} className="text-green-400 hover:text-green-300" title={t.save}>
                       <Save size={16} />
                     </button>
                     <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-300">
                       <X size={16} />
                     </button>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="col-span-5 text-sm text-slate-200">{cat.name}</div>
                   <div className="col-span-5 text-sm text-slate-400">{cat.name_zh}</div>
                   <div className="col-span-2 flex justify-end gap-2">
                     <button onClick={() => startEdit(cat)} className="text-blue-400 hover:text-blue-300" title={t.edit}>
                       <Edit2 size={14} />
                     </button>
                     <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300" title={t.delete}>
                       <Trash2 size={14} />
                     </button>
                   </div>
                 </>
               )}
            </div>
          ))}
        </div>

        {/* Add New */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
           <div className="text-xs font-bold text-slate-500 uppercase mb-2">
             {t.addTitle}
           </div>
           <div className="flex gap-2">
              <input 
                placeholder={t.nameEn}
                className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                value={newEn}
                onChange={(e) => setNewEn(e.target.value)}
              />
              <input 
                placeholder={t.nameZh}
                className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                value={newZh}
                onChange={(e) => setNewZh(e.target.value)}
              />
              <button 
                onClick={handleAdd}
                disabled={!newEn}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus size={16} /> {t.add}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
