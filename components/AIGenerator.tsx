
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { LoreEntity, CategoryDefinition, EntityType, EntityStatus } from '../types';
import { Language, DICTIONARY } from '../utils';
import { Wand2, Loader2, Check, X } from 'lucide-react';

interface AIGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (entity: LoreEntity) => void;
  category: string;
  projectId: string;
  projectName: string;
  lang: Language;
  categories: CategoryDefinition[];
}

const AIGenerator: React.FC<AIGeneratorProps> = ({
  isOpen,
  onClose,
  onGenerated,
  category,
  projectId,
  projectName,
  lang,
  categories
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const t = DICTIONARY[lang];

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);

    try {
      // NOTE: In a real app, strict error handling for missing API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const categoryName = categories.find(c => c.id === category)?.name || category;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
          Role: Game Designer / World Builder.
          Context: Project "${projectName}".
          Task: Create a "${categoryName}" Lore Entity based on this idea: "${prompt}".
          Requirements:
          - Provide English and Chinese translations for Title, Description, and Content.
          - Return a valid JSON object matching the LoreEntity structure.
          - Use a futuristic or fantasy tone based on the context.
          - Generate 3-5 relevant tags.
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              title_zh: { type: Type.STRING },
              description: { type: Type.STRING },
              description_zh: { type: Type.STRING },
              content: { type: Type.STRING },
              content_zh: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['title', 'description', 'content', 'tags']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      if (result.title) {
        const newEntity: LoreEntity = {
          id: `lore-ai-${Date.now()}`,
          projectId,
          type: EntityType.LORE,
          status: EntityStatus.DRAFT,
          category,
          linked_ids: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: 'AI_Architect',
          ...result
        };
        onGenerated(newEntity);
        onClose();
        setPrompt('');
      }
    } catch (e) {
      console.error("AI Generation Failed", e);
      alert("AI Generation failed. Check console or API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-[500px] flex flex-col rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 border-b border-slate-700">
           <div className="flex items-center gap-3 text-white mb-2">
             <div className="p-2 bg-white/10 rounded-lg backdrop-blur">
               <Wand2 size={24} />
             </div>
             <div>
               <h3 className="font-bold text-lg leading-none">{t.crud.genTitle}</h3>
               <p className="text-xs text-white/60 mt-1">Powered by Gemini 2.5</p>
             </div>
           </div>
        </div>

        <div className="p-6 space-y-4">
           <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                {t.fields.category}: <span className="text-blue-400">{category}</span>
              </label>
              <textarea 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none resize-none h-32"
                placeholder={t.crud.genPlaceholder}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
           </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
           <button 
             onClick={onClose} 
             className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
             disabled={isGenerating}
           >
             {t.crud.cancel}
           </button>
           <button 
             onClick={handleGenerate} 
             disabled={!prompt || isGenerating}
             className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
           >
             {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
             {isGenerating ? t.crud.generating : t.crud.aiGenerate}
           </button>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
