
import { AppEntity, EntityStatus, EntityType } from './types';

export type Language = 'en' | 'zh';

export const DICTIONARY = {
  en: {
    appTitle: "NEXUS",
    appSubtitle: "IP Development",
    selectProject: "Select IP / Project",
    currentProject: "Current Project",
    graphLabel: "Relation Graph",
    dashboardLabel: "Dashboard",
    modulesHeader: "Modules",
    universalGraph: "Universal Relationship Graph",
    entitiesFound: "Entities found",
    graphHint: "Interactive Graph: Drag nodes to rearrange, click to view details.",
    inspectorHeader: "Entity Inspector",
    recentActivity: "Recent Activity",
    taskProgress: "Task Progress",
    stats: {
      totalEntities: "Total Entities",
      pendingTasks: "Pending Tasks",
      aiModels: "AI Models",
      storageUsed: "Storage Used"
    },
    aiLab: {
      editorTitle: "Prompt Engineering",
      runButton: "Generate Output",
      modelSelect: "Model Selection",
      params: "Parameters",
      copy: "Copy Prompt",
      outputPlaceholder: "Model output will appear here..."
    },
    fields: {
      id: "ID",
      description: "Description",
      contentPreview: "Content Preview",
      assetFile: "Asset File",
      codeSnippet: "Code Snippet",
      promptTemplate: "Prompt Template",
      tags: "Tags",
      connectedEntities: "Connected Entities",
      createdBy: "Created by",
      noConnections: "No connections found.",
      temp: "Temp",
      model: "Model",
      category: "Category",
      priority: "Priority",
      fileType: "File Type",
      linked: "Linked",
      status: "Status"
    },
    types: {
      [EntityType.LORE]: 'World Bible',
      [EntityType.ASSET]: 'Asset Vault',
      [EntityType.AI]: 'AI Engineering',
      [EntityType.CODE]: 'Tech & Code',
      [EntityType.TASK]: 'Project Management',
    },
    status: {
      [EntityStatus.DRAFT]: 'Draft',
      [EntityStatus.REVIEW]: 'In Review',
      [EntityStatus.APPROVED]: 'Approved',
      [EntityStatus.DEPRECATED]: 'Deprecated',
    },
    categories: {
      All: 'All',
      Character: 'Character',
      Location: 'Location',
      Timeline: 'Timeline',
      Artifact: 'Artifact'
    },
    priorities: {
      Low: 'Low',
      Medium: 'Medium',
      High: 'High',
      Critical: 'Critical'
    },
    fileTypes: {
      All: 'All',
      Model: 'Model',
      Image: 'Image',
      Audio: 'Audio',
      Texture: 'Texture'
    },
    relations: {
      [EntityType.LORE]: "Connected Lore",
      [EntityType.ASSET]: "Related Assets",
      [EntityType.AI]: "AI Models/Prompts",
      [EntityType.CODE]: "Tech Integrations",
      [EntityType.TASK]: "Associated Tasks"
    }
  },
  zh: {
    appTitle: "NEXUS 核心",
    appSubtitle: "IP 开发平台",
    selectProject: "切换 IP / 项目",
    currentProject: "当前项目",
    graphLabel: "关系图谱",
    dashboardLabel: "仪表盘",
    modulesHeader: "功能模块",
    universalGraph: "全局关系可视化",
    entitiesFound: "个对象",
    graphHint: "交互式图表：拖动节点重新排列，点击查看详情。",
    inspectorHeader: "实体检查器",
    recentActivity: "近期活动",
    taskProgress: "任务进度",
    stats: {
      totalEntities: "实体总数",
      pendingTasks: "待办任务",
      aiModels: "AI 模型数",
      storageUsed: "已用存储"
    },
    aiLab: {
      editorTitle: "提示词工程",
      runButton: "生成内容",
      modelSelect: "模型选择",
      params: "参数设置",
      copy: "复制提示词",
      outputPlaceholder: "模型输出将显示在这里..."
    },
    fields: {
      id: "ID 编号",
      description: "描述",
      contentPreview: "内容预览",
      assetFile: "资产文件",
      codeSnippet: "代码片段",
      promptTemplate: "提示词模板",
      tags: "标签",
      connectedEntities: "关联实体",
      createdBy: "创建者",
      noConnections: "暂无关联。",
      temp: "温度",
      model: "模型",
      category: "分类",
      priority: "优先级",
      fileType: "文件类型",
      linked: "关联",
      status: "状态"
    },
    types: {
      [EntityType.LORE]: '世界设定集',
      [EntityType.ASSET]: '数字资产库',
      [EntityType.AI]: 'AI 工程化',
      [EntityType.CODE]: '技术代码',
      [EntityType.TASK]: '项目管理',
    },
    status: {
      [EntityStatus.DRAFT]: '草稿',
      [EntityStatus.REVIEW]: '审核中',
      [EntityStatus.APPROVED]: '已批准',
      [EntityStatus.DEPRECATED]: '已弃用',
    },
    categories: {
      All: '全部',
      Character: '角色',
      Location: '地点',
      Timeline: '时间线',
      Artifact: '物品'
    },
    priorities: {
      Low: '低',
      Medium: '中',
      High: '高',
      Critical: '紧急'
    },
    fileTypes: {
      All: '全部',
      Model: '3D 模型',
      Image: '图片',
      Audio: '音频',
      Texture: '贴图'
    },
    relations: {
      [EntityType.LORE]: "关联设定",
      [EntityType.ASSET]: "相关资产",
      [EntityType.AI]: "AI 模型/提示词",
      [EntityType.CODE]: "技术集成",
      [EntityType.TASK]: "关联任务"
    }
  }
};

export const getLoc = (entity: AppEntity | undefined, field: 'title' | 'description' | 'content', lang: Language) => {
  if (!entity) return '';
  if (lang === 'zh') {
    const val = (entity as any)[`${field}_zh`];
    if (val) return val;
  }
  return (entity as any)[field];
};
