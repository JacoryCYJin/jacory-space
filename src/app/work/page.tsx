'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader/PageHeader';
import PageQuote from '@/components/PageQuote/PageQuote';
import './work.scss';

const WorksPage = () => {
  const router = useRouter();
  const projects = [
    {
      id: 1,
      title: "个人博客空间",
      description: "使用Next.js构建的个人博客网站，融合了传统文学气息与现代技术实现。",
      image: "/images/avatar.jpg",
      tags: ["Next.js", "React", "SCSS", "响应式设计"],
      link: "/",
      date: "2025年5月8号",
      status: "开发中",
      statusClass: "developing",
      mood: "迸发灵感"
    },
    {
      id: 2,
      title: "个人博客空间",
      description: "使用Next.js构建的个人博客网站，融合了传统文学气息与现代技术实现。",
      image: "/images/avatar.jpg",
      tags: ["Next.js", "React", "SCSS", "响应式设计"],
      link: "/works/blog",
      date: "2023年12月",
      status: "已上线",
      statusClass: "online",
      mood: "满怀期待"
    },
    {
      id: 3,
      title: "个人博客空间",
      description: "使用Next.js构建的个人博客网站，融合了传统文学气息与现代技术实现。",
      image: "/images/avatar.jpg",
      tags: ["Next.js", "React", "SCSS", "响应式设计"],
      link: "/works/blog",
      date: "2023年12月",
      status: "测试中",
      statusClass: "testing",
      mood: "迷茫"
    },
    {
      id: 4,
      title: "新项目构思",
      description: "一个创新的Web应用，旨在解决用户日常生活中的实际问题。",
      image: "/images/avatar.jpg",
      tags: ["创意", "规划", "用户体验"],
      link: "/works/new-project",
      date: "2024年1月",
      status: "筹划中",
      statusClass: "planning",
      mood: "充满想象"
    },
    // 将来可以添加更多项目
  ];

  const handleProjectClick = (link: string) => {
    router.push(link);
  };

  return (
    <div className="works-container">
      <PageHeader 
        title="拙作小集" 
        subtitle="记录我的创作与实践" 
      />

      {projects.length > 0 ? (
        <section className="timeline-container">
          <div className="timeline-line"></div>
          {projects.map((project, index) => (
            <motion.div 
              key={project.id} 
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                ease: "easeOut" 
              }}
            >
              <div className="timeline-dot"></div>
              
              {/* 项目状态、时间和心情标签 */}
              <div className={`project-meta ${index % 2 === 0 ? 'meta-right' : 'meta-left'}`}>
                <div className="meta-header">
                  <div className="timeline-date">{project.date}</div>
                  <div className={`project-status ${project.statusClass}`}>{project.status}</div>
                </div>
                <div className="project-mood">{project.mood}</div>
              </div>
              
              <div 
                className="timeline-card"
                onClick={() => handleProjectClick(project.link)}
              >
                <div className="project-image-container">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={225}
                    className="project-image"
                  />
                </div>
                <div className="project-content">
                  <h2 className="project-title">{project.title}</h2>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      ) : (
        <section className="empty-projects">
          <div className="empty-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9.88V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
              <rect x="2" y="14" width="8" height="8" rx="2"></rect>
            </svg>
            <h2 className="empty-title">项目筹备中</h2>
            <p className="empty-description">
              正在精心准备作品集，敬请期待...
            </p>
          </div>
        </section>
      )}

      <section>
        <PageQuote text="创作是一种自我对话，也是与世界的交流。" />
      </section>
    </div>
  );
};

export default WorksPage;