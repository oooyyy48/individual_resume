export interface Project {
  id: string
  index: string
  name: string
  subtitle: string
  category: ProjectCategory
  image: string
  /** Extra shots cycled in the card frame; image stays the cover */
  images?: string[]
  year: string
  role: string
  result: string
  tags: string[]
  link?: string
  /** Badge text over the frame, e.g. '正在施工ing' */
  status?: string
}

export type ProjectCategory = 'product' | 'creative' | 'system'

export interface Service {
  index: string
  title: string
  description: string
}

export interface Experience {
  period: string
  organization: string
  role: string
  description: string
}

export interface SkillGroup {
  index: string
  title: string
  description: string
  outputs: string
  tools: string[]
}

export interface SocialLink {
  label: string
  href: string
}

export interface Profile {
  name: string
  role: string
  location: string
  availability: string
  statement: string
  statementEmphasis: string
  bio: string
  email: string
  secondaryEmail: string
  qq: string
  resumeUrl: string
  socialLinks: SocialLink[]
  experiences: Experience[]
  skills: SkillGroup[]
}
