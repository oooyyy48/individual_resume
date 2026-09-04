import type { AlbumPhoto, LifeSection } from '@/types'

export const lifeSections: LifeSection[] = [
  {
    id: 'hometown',
    index: '01',
    title: '我的家乡',
    summary: '天门，江汉平原上的一座小城，也是我成长与出发的地方。',
    detail: '天门市历史人文底蕴深厚，是中华文明与楚文化的重要发祥地、茶圣陆羽故里、内陆侨乡、状元故里与文化之乡。石家河遗址为中华文明五千年提供了重要实证，也是三星堆文化、楚文化的重要源头。',
    image: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.lpKq6WTHovLYDQoKFSN4QgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    link: 'https://baike.baidu.com/item/%E5%A4%A9%E9%97%A8%E5%B8%82/372782',
    direction: 'left',
  },
  {
    id: 'school',
    index: '02',
    title: '我的学校',
    summary: '在湖北理工学院，我把兴趣慢慢变成了可以坚持的方向。',
    detail: '湖北理工学院位于湖北省黄石市，是一所以工为主、培养应用型人才的普通高等学校。这里让我系统学习软件工程，也让我在课程、竞赛、开源和独立实践之间逐步建立自己的学习节奏。',
    image: 'https://www.hbpu.edu.cn/images/DJI_02782018.jpg',
    link: 'https://www.hbpu.edu.cn/',
    direction: 'right',
  },
  {
    id: 'interest',
    index: '03',
    title: '我的兴趣',
    summary: '我喜欢把新工具拆开研究，再把它们变成真正能用的东西。',
    detail: '兴趣不只停留在屏幕前，也包括观察、记录和保持好奇心。对我来说，持续输入与动手实践同样重要。',
    direction: 'left',
    bullets: ['AI 工具与 Prompt Engineering', '全栈应用、底层代码与性能调试', '算法竞赛、开源项目与技术阅读', '音乐、摄影、阅读和记录日常'],
  },
  {
    id: 'album',
    index: '04',
    title: '我的相册',
    summary: '记录学习、生活与灵感，把经过的地方留下一点痕迹。',
    detail: '这里收集一些学习之外的画面。点击进入相册，在一个可以拖拽旋转的 3D 画廊里慢慢浏览。',
    image: 'https://images.pexels.com/photos/38370963/pexels-photo-38370963.jpeg',
    direction: 'right',
  },
]

export const albumPhotos: AlbumPhoto[] = [
  { src: 'https://images.pexels.com/photos/16912154/pexels-photo-16912154.jpeg', alt: '相册照片一', caption: '在路上的片刻' },
  { src: 'https://images.pexels.com/photos/38370963/pexels-photo-38370963.jpeg', alt: '相册照片二', caption: '光线落下来的时候' },
  { src: 'https://images.pexels.com/photos/5113133/pexels-photo-5113133.jpeg', alt: '相册照片三', caption: '把灵感带回桌面' },
  { src: 'https://images.pexels.com/photos/19453607/pexels-photo-19453607.jpeg', alt: '相册照片四', caption: '日常的另一面' },
  { src: 'https://images.pexels.com/photos/19670/pexels-photo.jpg', alt: '相册照片五', caption: '留给自己的时间' },
  { src: 'https://images.pexels.com/photos/38964264/pexels-photo-38964264.jpeg', alt: '相册照片六', caption: '继续探索未知' },
]
