import type { Project } from '@/types'

export const projects: Project[] = [
  { id: 'p01', index: '01', name: '乐谱', subtitle: '数字化乐谱交互体验', category: 'product', image: '/01.webp', year: '2025', role: '产品设计', result: '让演奏者在排练中更快找到下一步。', tags: ['产品体验', '交互原型'] },
  { id: 'p02', index: '02', name: '温感', subtitle: '温度可视化交互装置', category: 'creative', image: '/02.webp', year: '2024', role: '创意开发', result: '把不可见的温度变成可以感知的记忆。', tags: ['互动装置', '创意技术'] },
  { id: 'p03', index: '03', name: '网格', subtitle: '模块化设计语言', category: 'system', image: '/03.webp', year: '2024', role: '视觉系统', result: '为快速增长的内容团队建立统一的表达秩序。', tags: ['品牌系统', '设计系统'] },
  { id: 'p04', index: '04', name: '溯源', subtitle: '食品供应链透明化', category: 'product', image: '/04.webp', year: '2023', role: '产品设计', result: '让一条食物的旅程变得清楚而可信。', tags: ['用户研究', '服务设计'] },
]
