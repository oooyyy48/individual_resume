import type { Profile } from '@/types'

/** Replace this single file with your real profile content when ready. */
export const profile: Profile = {
  name: '林默',
  role: '独立产品设计师 / 创意开发者',
  location: '上海 · 中国',
  availability: '2026 年开放合作',
  statement: '把复杂的事，设计得自然。',
  statementEmphasis: '设计得自然。',
  bio: '我从问题和人的真实处境出发，把策略、视觉与技术放进同一个体验里。过去几年，我参与数字产品、品牌系统与互动装置，从模糊的想法走到可被使用、被理解、也值得记住的成品。',
  email: 'hello@example.com',
  resumeUrl: '/resume.pdf',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Behance', href: 'https://www.behance.net/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
  experiences: [
    {
      period: '2024 — 至今',
      organization: '独立实践',
      role: '产品设计师 / 创意开发者',
      description: '为早期团队和文化品牌梳理产品方向，完成从研究、原型到上线的完整设计闭环。',
    },
    {
      period: '2021 — 2024',
      organization: '观澜设计工作室',
      role: '交互设计师',
      description: '负责数字产品体验与设计系统，推动跨职能团队用更清晰的语言协作。',
    },
    {
      period: '2017 — 2021',
      organization: '同济大学 · 设计学',
      role: '本科 / 视觉与交互方向',
      description: '在研究、叙事和动手制作之间建立自己的工作方法，持续探索技术与设计的边界。',
    },
  ],
  skills: [
    {
      index: '01',
      title: '产品策略',
      description: '在目标还模糊的时候，先把真正的问题说清楚。',
      outputs: '研究框架 · 用户路径 · 产品结构',
      tools: ['Figma', 'Notion', 'FigJam'],
    },
    {
      index: '02',
      title: '视觉系统',
      description: '建立有辨识度、也经得起长期使用的界面语言。',
      outputs: '品牌基因 · 设计系统 · 响应式界面',
      tools: ['Figma', 'Illustrator', 'After Effects'],
    },
    {
      index: '03',
      title: '交互实现',
      description: '用真实的交互验证节奏、反馈和情绪，让设计提前被体验。',
      outputs: '高保真原型 · 动效方案 · 前端实现',
      tools: ['Vue', 'GSAP', 'HTML / CSS'],
    },
  ],
}
