'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader/PageHeader';
import PageQuote from '@/components/PageQuote/PageQuote';
import './work.scss';
import { getWorkListApi } from '@/api/workApi';
import { WorkVO } from '@/types/models/work';

const WorksPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<WorkVO[]>([]);

  // 状态映射函数
  const getStatusInfo = (status: number) => {
    const statusMap: Record<number, { label: string; className: string }> = {
      0: { label: '筹划中', className: 'planning' },
      1: { label: '开发中', className: 'developing' },
      2: { label: '测试中', className: 'testing' },
      3: { label: '已上线', className: 'online' },
    };
    
    return statusMap[status] || { label: '未知', className: '' };
  };

  const fetechWorkList = async () => {
    const res = await getWorkListApi();
    if (res.code === 200) {
      setProjects(res.data);
    }
    return [];
  };
  
  // 使用 useEffect 钩子来调用异步函数
  useEffect(() => {
    fetechWorkList();
  }, []);

  const handleProjectClick = (link: string) => {
    router.push(link);
  };

  return (
    <div className="works-container">
      <PageHeader title="拙作小集" subtitle="记录我的创作与实践" />

      {projects.length > 0 ? (
        <section className="timeline-container">
          <div className="timeline-line"></div>
          {projects.map((project, index) => (
            <motion.div
              key={project.nanoid}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: 'easeOut',
              }}
            >
              <div className="timeline-dot"></div>

              {/* 项目状态、时间和心情标签 */}
              <div
                className={`project-meta ${
                  index % 2 === 0 ? 'meta-right' : 'meta-left'
                }`}
              >
                <div className="meta-header">
                  <div className="timeline-date">{new Date(project.launchDate).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</div>
                  <div className={`project-status ${getStatusInfo(project.status).className}`}>
                    {getStatusInfo(project.status).label}
                  </div>
                </div>
                <div className="project-mood">{project.mood}</div>
              </div>

              <div
                className="timeline-card"
                onClick={() => handleProjectClick(project.link)}
              >
                <div className="project-image-container">
                  <Image
                    src={project.coverImage}
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
                      <span key={index} className="project-tag">
                        {tag.name}
                      </span>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 9.88V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
              <rect x="2" y="14" width="8" height="8" rx="2"></rect>
            </svg>
            <h2 className="empty-title">项目筹备中</h2>
            <p className="empty-description">正在精心准备作品集，敬请期待...</p>
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
