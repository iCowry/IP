
import React, { useState, useMemo } from 'react';
import { MOCK_DATA, PROJECTS, DEFAULT_CATEGORIES } from './mockData';
import { AppEntity, EntityType, EntityStatus, LoreEntity, AssetEntity, AIEntity, CategoryDefinition } from './types';
import { DICTIONARY, Language } from './utils';
import RelationshipGraph from './components/RelationshipGraph';
import WorldBiblePage from './components/WorldBiblePage';
import AssetVaultPage from './components/AssetVaultPage';
import DashboardPage from './components/DashboardPage';
import AILabPage from './components/AILabPage';
import DetailPanel from './components/DetailPanel'; 
import ResourceCard from './components/ResourceCard';
import CategoryManager from './components/CategoryManager';
import LoreEditor from './components/LoreEditor';
import HistoryModal from './components/HistoryModal';
import { 
  Network, 
  Book, 
  Box, 
  Cpu, 
  Code2, 
  CheckSquare, 
  Globe, 
  Search,
  Bell,
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<EntityType | 'Graph' | 'Dashboard'>('Dashboard');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  
  // Data State (Lifted from constant to state)
  const [entities, setEntities] = useState<AppEntity[]>(MOCK_DATA);

  // Project State
  const [activeProjectId, setActiveProjectId] = useState<string>(PROJECTS[0].id);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

  // Category State
  const [categories, setCategories] = useState<CategoryDefinition[]>(DEFAULT_CATEGORIES);
  const [isCategoryManagerOpen, setCategoryManagerOpen] = useState(false);

  // Editor & History State (Global)
  const [isLoreEditorOpen, setLoreEditorOpen] = useState(false);
  const [editingLoreEntity, setEditingLoreEntity] = useState<LoreEntity | undefined>(undefined);
  const [isHistoryOpen, setHistoryOpen] = useState(false);

  const t = DICTIONARY[lang];

  const activeProject = PROJECTS.find(p => p.id === activeProjectId) || PROJECTS[0];

  const selectedEntity = useMemo(() => 
    entities.find(e => e.id === selectedEntityId), 
  [selectedEntityId, entities]);

  // Filter Data by Project ID AND Active Tab
  const projectData = useMemo(() => {
    return entities.filter(item => item.projectId === activeProjectId);
  }, [activeProjectId, entities]);

  const filteredData = useMemo(() => {
    if (activeTab === 'Graph' || activeTab === 'Dashboard') return projectData;
    return projectData.filter(item => item.type === activeTab);
  }, [activeTab, projectData]);

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  // CRUD Handlers
  const handleAddEntity = (newEntity: AppEntity) => {
    setEntities(prev => [newEntity, ...prev]);
  };

  const handleUpdateEntity = (updatedEntity: AppEntity) => {
    setEntities(prev => prev.map(e => e.id === updatedEntity.id ? updatedEntity : e));
    // Refresh selection if needed
    if (selectedEntityId === updatedEntity.id) {
        // Force re-render of detail panel through data change
    }
  };

  const handleDeleteEntity = (id: string) => {
    setEntities(prev => prev.filter(e => e.id !== id));
    if (selectedEntityId === id) setSelectedEntityId(null);
  };

  const handleOpenLoreEditor = (entity?: LoreEntity) => {
    setEditingLoreEntity(entity);
    setLoreEditorOpen(true);
  };

  const handleEditEntity = (entity: AppEntity) => {
    if (entity.type === EntityType.LORE) {
      handleOpenLoreEditor(entity as LoreEntity);
    } else {
      alert("Editing for this entity type is not yet supported in this demo.");
    }
  };

  const TabIcons = {
    Dashboard: LayoutDashboard,
    Graph: Network,
    [EntityType.LORE]: Book,
    [EntityType.ASSET]: Box,
    [EntityType.AI]: Cpu,
    [EntityType.CODE]: Code2,
    [EntityType.TASK]: CheckSquare,
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardPage 
            data={projectData} 
            onSelect={setSelectedEntityId} 
            lang={lang} 
          />
        );
      case 'Graph':
        return (
          <div className="h-full w-full flex flex-col">
            <div className="flex-1 min-h-[500px]">
              <RelationshipGraph 
                  data={projectData} 
                  onNodeClick={setSelectedEntityId}
                  width={window.innerWidth - 300 - (selectedEntity ? 450 : 0)} 
                  height={window.innerHeight - 150}
                  lang={lang}
              />
            </div>
            <p className="text-center text-slate-500 text-sm mt-4">
              {t.graphHint}
            </p>
          </div>
        );
      case EntityType.LORE:
        return (
          <WorldBiblePage 
            data={filteredData as LoreEntity[]} 
            onSelect={setSelectedEntityId} 
            lang={lang}
            categories={categories}
            onManageCategories={() => setCategoryManagerOpen(true)}
            projectId={activeProjectId}
            projectName={activeProject.name}
            onAddEntity={handleAddEntity}
            onUpdateEntity={handleUpdateEntity}
            onDeleteEntity={handleDeleteEntity}
            onOpenEditor={handleOpenLoreEditor}
          />
        );
      case EntityType.ASSET:
        return (
          <AssetVaultPage 
            data={filteredData as AssetEntity[]} 
            onSelect={setSelectedEntityId} 
            lang={lang} 
          />
        );
      case EntityType.AI:
        return (
           <AILabPage 
             data={filteredData as AIEntity[]}
             onSelect={setSelectedEntityId}
             lang={lang}
           />
        );
      default:
        // Fallback Grid for Code and Task
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
            {filteredData.map((entity) => (
              <ResourceCard 
                 key={entity.id} 
                 entity={entity} 
                 onClick={setSelectedEntityId} 
                 lang={lang} 
                 selected={selectedEntityId === entity.id}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-white"><Network /></span>
            {t.appTitle} <span className="text-xs text-slate-500 font-normal mt-1">v1.4</span>
          </h1>
          <div className="mt-3 px-2 py-1 bg-slate-800 rounded border border-slate-700">
             <div className="text-[10px] text-slate-500 uppercase font-bold">{t.currentProject}</div>
             <div className="text-xs text-slate-300 truncate font-medium">
               {lang === 'zh' ? activeProject.name_zh : activeProject.name}
             </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main Views */}
          <button
            onClick={() => setActiveTab('Dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 mb-1 ${
              activeTab === 'Dashboard' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} /> {t.dashboardLabel}
          </button>

          <button
            onClick={() => setActiveTab('Graph')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'Graph' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Network size={18} /> {t.graphLabel}
          </button>

          <div className="pt-6 pb-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider px-4">
            {t.modulesHeader}
          </div>

          {Object.values(EntityType).map((type) => {
            const Icon = TabIcons[type];
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  activeTab === type 
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} className={activeTab === type ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} /> 
                {t.types[type]}
              </button>
            );
          })}
        </nav>

        {/* Language Toggle */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={toggleLang}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white transition-colors border border-slate-700"
          >
            <Globe size={14} /> {lang === 'en' ? 'Switch to 中文' : 'Switch to English'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
             {/* Project Switcher */}
             <div className="relative">
                <button 
                  onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-colors text-sm text-slate-200"
                >
                  <span className={`w-2 h-2 rounded-full bg-${activeProject.themeColor}-500 shadow-[0_0_8px_rgba(255,255,255,0.3)]`}></span>
                  <span className="font-medium max-w-[150px] truncate">
                    {lang === 'zh' ? activeProject.name_zh : activeProject.name}
                  </span>
                  <ChevronDown size={14} className="text-slate-500" />
                </button>

                {isProjectMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProjectMenuOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden py-1">
                      <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/50 border-b border-slate-800/50">
                        {t.selectProject}
                      </div>
                      {PROJECTS.map(proj => (
                        <button
                          key={proj.id}
                          onClick={() => { setActiveProjectId(proj.id); setIsProjectMenuOpen(false); setSelectedEntityId(null); }}
                          className={`w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors flex items-center gap-3 ${activeProjectId === proj.id ? 'bg-slate-800/50' : ''}`}
                        >
                           <span className={`w-2 h-2 rounded-full bg-${proj.themeColor}-500`}></span>
                           <div>
                             <div className={`text-sm font-medium ${activeProjectId === proj.id ? 'text-white' : 'text-slate-400'}`}>
                               {lang === 'zh' ? proj.name_zh : proj.name}
                             </div>
                             <div className="text-[10px] text-slate-500 truncate w-48">
                               {proj.description}
                             </div>
                           </div>
                           {activeProjectId === proj.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
             </div>

             <div className="h-6 w-px bg-slate-800"></div>

             <h2 className="text-lg font-semibold text-white">
               {activeTab === 'Graph' ? t.universalGraph : 
                activeTab === 'Dashboard' ? t.dashboardLabel : 
                t.types[activeTab]}
             </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="bg-slate-900 border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 w-64 placeholder:text-slate-600 transition-all"
              />
            </div>
            <div className="w-px h-6 bg-slate-800 mx-1" />
            <button className="text-slate-400 hover:text-white relative">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 ring-2 ring-slate-800" />
          </div>
        </header>

        <div className="flex-1 overflow-hidden p-6 relative">
          {renderContent()}
        </div>
      </main>

      {/* New Inspector Panel */}
      {selectedEntity && (
        <DetailPanel 
          entity={selectedEntity} 
          onClose={() => setSelectedEntityId(null)} 
          onSelectEntity={setSelectedEntityId}
          lang={lang}
          onEdit={handleEditEntity}
          onViewHistory={() => setHistoryOpen(true)}
        />
      )}

      {/* Category Manager Modal */}
      <CategoryManager 
        isOpen={isCategoryManagerOpen}
        onClose={() => setCategoryManagerOpen(false)}
        categories={categories}
        setCategories={setCategories}
        lang={lang}
      />

      {/* Lore Editor Modal */}
      <LoreEditor 
        isOpen={isLoreEditorOpen}
        onClose={() => setLoreEditorOpen(false)}
        onSave={(e) => {
            if (editingLoreEntity) handleUpdateEntity(e);
            else handleAddEntity(e);
        }}
        initialData={editingLoreEntity}
        lang={lang}
        categories={categories}
        projectId={activeProjectId}
      />

      {/* History Modal */}
      <HistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setHistoryOpen(false)}
        entity={selectedEntity || null}
        lang={lang}
      />
    </div>
  );
}
