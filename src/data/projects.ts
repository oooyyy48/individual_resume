import type { Project } from '@/types'

export const projects: Project[] = [
  { id: 'p01', index: '01', name: 'MarkFlow', subtitle: '在线 Markdown 编写工具', category: 'product', image: '/A01.webp', year: '2026', role: '独立开发', result: '将 Markdown 写作、预览与导出整合进一个轻量工作台。', tags: ['Vue', 'Markdown', '全栈应用'], link: 'https://github.com/oooyyy48/Markflow' },
  { id: 'p02', index: '02', name: 'myUI', subtitle: '个人组件库', category: 'system', image: '/A02.webp', year: '2025', role: '组件设计与实现', result: '沉淀可复用的界面组件，提升个人项目的开发一致性。', tags: ['组件库', 'UI', '开源'], link: 'https://github.com/oooyyy48/myUI' },
  { id: 'p03', index: '03', name: '学生成绩管理系统', subtitle: '课程成绩管理 Web 应用', category: 'system', image: '/A03.webp', images: ['/A03.webp', '/A04.webp', '/A05.webp'], year: '2026', role: '全栈开发', result: '面向教师与学生的成绩录入、统计与查询流程，正在持续施工中。', tags: ['Vue', 'Node.js', 'SQL'], status: '正在施工ing' },
]
