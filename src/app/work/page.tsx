'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './work.scss';
import PageQuote from '@/components/PageQuote/PageQuote';
import PageHeader from '@/components/PageHeader/PageHeader';

const WorksPage = () => {
  const projects = [
    {
      id: 1,
      title: "个人博客空间",
      description: "使用Next.js构建的个人博客网站，融合了传统文学气息与现代技术实现。",
      image: "/images/avatar.jpg",
      tags: ["Next.js", "React", "SCSS", "响应式设计"],
      link: "/works/blog",
      date: "2023年12月"
    },
    // 将来可以添加更多项目
  ];

  return (
    <div className="works-container">
      <PageHeader 
        title="拙作小集" 
        subtitle="记录我的创作与实践" 
      />

      {projects.length > 0 ? (
        <section className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
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
                <p className="project-date">{project.date}</p>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="project-tag">{tag}</span>
                  ))}
                </div>
                <Link href={project.link} className="project-link">
                  查看详情
                </Link>
              </div>
            </div>
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