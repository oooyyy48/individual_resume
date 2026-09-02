import type { Profile } from '@/types'

export const profile: Profile = {
  name: '欧阳子翔',
  role: '24 级软件工程学生',
  location: '湖北黄石 · 中国',
  availability: 'AI + 全栈开发方向，持续探索中',
  statement: '在代码与产品之间，持续构建自己的答案。',
  statementEmphasis: '持续构建自己的答案。',
  bio: '2024 年考入湖北理工学院计算机学院软件工程专业。入学以来，我系统学习数据结构、操作系统、计算机网络与数据库等核心课程，并持续将理论落到工程实践中。除了课程设计，我重点探索 AI 工具与全栈应用开发，以及底层高效代码的开发与调试，在 GitHub 分享实践，也训练自己的代码规范、调优意识和问题定位能力。',
  email: 'ouyangzixiang1@gmail.com',
  secondaryEmail: '516384399@qq.com',
  qq: '516384399',
  resumeUrl: '/resume.pdf',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/oooyyy48' },
  ],
  experiences: [
    {
      period: '2026 — 至今',
      organization: '独立实践',
      role: 'AI + 全栈开发方向',
      description: '明确发展方向，持续深入 AI 与全栈开发就业技术栈，并规划通过研究生学习提升专业能力与行业认可度。',
    },
    {
      period: '2024 — 2026',
      organization: '学科竞赛 · 技能认证',
      role: '持续参赛与实践',
      description: '获得第十六届蓝桥杯省二等奖与第十七届省一等奖、团队程序设计天梯赛省三等奖与优秀个人奖，并取得讯飞星火 AI Prompt 工程师认证。',
    },
    {
      period: '2023 — 2024',
      organization: '湖北理工学院 · 计算机学院',
      role: '本科 / 软件工程',
      description: '大一阶段积极了解行业前沿，建立学业发展方向，系统学习计算机基础课程并持续探索技术与产品的结合。',
    },
    {
      period: '持续学习',
      organization: '语言与开源实践',
      role: 'CET-4 · CET-6 / GitHub',
      description: '通过大学英语四、六级考试，积极阅读优秀开源项目并在 GitHub 分享自己的开发实践。',
    },
  ],
  skills: [
    {
      index: '01',
      title: 'AI 应用开发',
      description: '探索如何把 AI 工具转化为可用、可维护的应用能力。',
      outputs: 'Prompt 设计 · AI 工作流 · 应用集成',
      tools: ['Prompt Engineering', 'API', 'Agent'],
    },
    {
      index: '02',
      title: '全栈应用',
      description: '从数据、接口到界面，完成一条完整的产品开发链路。',
      outputs: '前端界面 · 后端服务 · 数据库设计',
      tools: ['Vue', 'Node.js', 'SQL'],
    },
    {
      index: '03',
      title: '工程基础',
      description: '重视底层原理、代码质量和定位问题的效率。',
      outputs: '数据结构 · 操作系统 · 网络与数据库',
      tools: ['C / C++', 'Git', 'Debugging'],
    },
  ],
}
