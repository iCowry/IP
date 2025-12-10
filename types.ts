
// Status of any entity in the pipeline
export enum EntityStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  DEPRECATED = 'deprecated',
}

// The specific module/domain the entity belongs to
export enum EntityType {
  LORE = 'lore',
  ASSET = 'asset',
  AI = 'ai',
  CODE = 'code',
  TASK = 'task',
}

export interface Project {
  id: string;
  name: string;
  name_zh: string;
  description: string;
  themeColor: string; // Tailwind color class stub (e.g., 'blue', 'red')
}

// The Base Interface that all entities must implement
// This ensures the "Universal" nature of the platform
export interface BaseEntity {
  id: string;
  projectId: string; // The IP this belongs to
  title: string;
  title_zh?: string; // Localized Title
  description: string;
  description_zh?: string; // Localized Description
  type: EntityType;
  status: EntityStatus;
  tags: string[];
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  author_id: string;
  
  // The core of the Relation Graph: IDs of other entities this one is connected to
  linked_ids: string[]; 
}

// 1. World Bible (Lore, Settings)
export interface LoreEntity extends BaseEntity {
  type: EntityType.LORE;
  category: 'Character' | 'Location' | 'Timeline' | 'Artifact';
  content: string; // Markdown or rich text content
  content_zh?: string; // Localized Content
}

// 2. Asset Vault (Images, 3D Models, Audio)
export interface AssetEntity extends BaseEntity {
  type: EntityType.ASSET;
  fileType: 'Model' | 'Image' | 'Audio' | 'Texture';
  fileUrl: string; // Mock URL
  fileSize: string;
  version: number;
}

// 3. AI Engineering (Prompts, Model configs, Datasets)
export interface AIEntity extends BaseEntity {
  type: EntityType.AI;
  modelName: string; // e.g., "Gemini 1.5 Pro"
  promptTemplate: string;
  parameters: {
    temperature: number;
    topK?: number;
    seed?: number;
  };
  datasetIds?: string[]; // specific to AI training
}

// 4. Tech & Code (Docs, Snippets, API refs)
export interface CodeEntity extends BaseEntity {
  type: EntityType.CODE;
  language: 'TypeScript' | 'Python' | 'C#' | 'C++' | 'GLSL';
  codeSnippet: string;
  documentationUrl?: string;
}

// 5. Project Management (Tasks, Milestones)
export interface TaskEntity extends BaseEntity {
  type: EntityType.TASK;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;
  dueDate: string;
  isMilestone: boolean;
}

// Union type for use in lists and generic components
export type AppEntity = 
  | LoreEntity 
  | AssetEntity 
  | AIEntity 
  | CodeEntity 
  | TaskEntity;

export interface LinkEdge {
  source: string;
  target: string;
  strength?: number;
}
