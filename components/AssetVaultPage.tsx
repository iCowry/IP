import React, { useState, useMemo } from 'react';
import { AssetEntity } from '../types';
import { Language, DICTIONARY } from '../utils';
import ResourceCard from './ResourceCard';
import { Filter } from 'lucide-react';

interface AssetVaultPageProps {
  data: AssetEntity[];
  onSelect: (id: string) => void;
  lang: Language;
}

const AssetVaultPage: React.FC<AssetVaultPageProps> = ({ data, onSelect, lang }) => {
  const [filter, setFilter] = useState<string>('All');
  const t = DICTIONARY[lang];

  const fileTypes = ['All', 'Model', 'Image', 'Texture', 'Audio'];

  const filteredData = useMemo(() => {
    if (filter === 'All') return data;
    return data.filter(item => item.fileType === filter);
  }, [data, filter]);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {fileTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`
                px-3 py-1.5 rounded-md text-xs font-medium transition-all
                ${filter === type 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}
              `}
            >
              {(t.fileTypes as any)[type]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Filter size={14} />
          <span>{filteredData.length} assets</span>
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
          />
        ))}
      </div>
    </div>
  );
};

export default AssetVaultPage;