'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import Link from 'next/link';
import './video.scss';
import PageQuote from '@/components/PageQuote/PageQuote';
import PageHeader from '@/components/PageHeader/PageHeader';

// 视频数据类型定义
interface Video {
  id: string;
  title: string;
  cover: string;
  url: string;
  date: string;
  views: string;
  duration: string;
  description: string;
  tags: string[];
}

const VideosPage = () => {
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [videos, setVideos] = useState<Video[]>([]);
  
  // 模拟视频数据 - 实际项目中可以从API获取
  useEffect(() => {
    // 这里可以替换为实际的API调用
    const mockVideos: Video[] = [
      {
        id: 'BV1Gp4y1E7NH',
        title: '如何高效学习编程 - 从入门到精通的学习方法',
        cover: '/images/videos/programming-learning.jpg',
        url: 'https://www.bilibili.com/video/BV1Gp4y1E7NH',
        date: '2023-12-15',
        views: '2.5万',
        duration: '15:42',
        description: '分享我多年编程学习的经验和方法，帮助新手快速入门并持续提升。',
        tags: ['编程学习', '技术分享']
      },
      {
        id: 'BV2Kh411Y7Xz',
        title: 'React与Next.js实战 - 打造现代化个人网站',
        cover: '/images/videos/react-nextjs.jpg',
        url: 'https://www.bilibili.com/video/BV2Kh411Y7Xz',
        date: '2023-11-20',
        views: '1.8万',
        duration: '23:15',
        description: '从零开始，手把手教你用React和Next.js搭建一个高性能的个人网站。',
        tags: ['前端开发', '技术分享', 'React']
      },
      {
        id: 'BV3Ks411n7Zq',
        title: '设计师必学 - UI设计中的留白艺术',
        cover: '/images/videos/ui-whitespace.jpg',
        url: 'https://www.bilibili.com/video/BV3Ks411n7Zq',
        date: '2023-10-05',
        views: '3.2万',
        duration: '18:30',
        description: '探讨UI设计中留白的重要性，以及如何运用留白提升设计的美感和可用性。',
        tags: ['设计', 'UI/UX']
      },
      {
        id: 'BV4Lp4y1v7Mh',
        title: '云南之旅 - 探寻丽江古城人文风景',
        cover: '/images/videos/lijiang-travel.jpg',
        url: 'https://www.bilibili.com/video/BV4Lp4y1v7Mh',
        date: '2023-09-12',
        views: '5.7万',
        duration: '20:18',
        description: '记录我在云南丽江的旅行见闻，感受古城的历史文化和自然风光。',
        tags: ['旅行', '生活记录']
      },
      {
        id: 'BV5Kh411n7Xz',
        title: 'Java高级编程技巧 - 提升代码质量的20个实用技巧',
        cover: '/images/videos/java-tips.jpg',
        url: 'https://www.bilibili.com/video/BV5Kh411n7Xz',
        date: '2023-08-25',
        views: '4.1万',
        duration: '25:40',
        description: '分享20个能立即提升Java代码质量的实用技巧，适合有一定基础的Java开发者。',
        tags: ['编程学习', '技术分享', 'Java']
      },
      {
        id: 'BV6Lp4y1v7Nh',
        title: '我的工作环境搭建 - 程序员效率工具分享',
        cover: '/images/videos/dev-environment.jpg',
        url: 'https://www.bilibili.com/video/BV6Lp4y1v7Nh',
        date: '2023-07-30',
        views: '3.8万',
        duration: '16:55',
        description: '分享我日常使用的开发工具和环境配置，提高编程效率的小技巧。',
        tags: ['技术分享', '工具分享']
      }
    ];
    
    setVideos(mockVideos);
  }, []);
  
  // 获取所有标签
  const allTags = ['全部', ...Array.from(new Set(videos.flatMap(video => video.tags)))];
  
  // 根据标签筛选视频
  const filteredVideos = selectedTag === '全部' 
    ? videos 
    : videos.filter(video => video.tags.includes(selectedTag));
  
  return (
    <div className="videos-container">
      <PageHeader 
        title="流光片羽" 
        subtitle="分享技术、设计与生活的点滴思考" 
      />
      
      <section className="bilibili-intro">
        <div className="bilibili-avatar">
          <Image 
            src="/images/avatar.jpg" 
            alt="B站头像" 
            width={80} 
            height={80} 
            className="avatar-image"
          />
        </div>
        <div className="bilibili-info">
          <h2 className="bilibili-name">芥子不才</h2>
          <p className="bilibili-desc">技术与人文的交融者 | 分享编程、设计与生活感悟</p>
          <div className="bilibili-stats">
            <div className="stat-item">
              <span className="stat-value">128</span>
              <span className="stat-label">视频</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">2.5万</span>
              <span className="stat-label">粉丝</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">180万</span>
              <span className="stat-label">播放量</span>
            </div>
          </div>
          <a 
            href="https://b23.tv/oYbIaKn" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bilibili-link"
          >
            访问我的B站主页
          </a>
        </div>
      </section>
      
      <section className="videos-filter">
        <div className="tag-filter">
          {allTags.map(tag => (
            <button 
              key={tag}
              className={`tag-button ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>
      
      <section className="videos-grid">
        {filteredVideos.map(video => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail">
              <a 
                href={video.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="thumbnail-link"
              >
                <Image 
                  src={video.cover} 
                  alt={video.title}
                  width={320}
                  height={200}
                  className="thumbnail-image"
                />
                <span className="video-duration">{video.duration}</span>
              </a>
            </div>
            <div className="video-info">
              <h3 className="video-title">
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {video.title}
                </a>
              </h3>
              <p className="video-description">{video.description}</p>
              <div className="video-meta">
                <span className="video-date">{video.date}</span>
                <span className="video-views">{video.views}次观看</span>
              </div>
              <div className="video-tags">
                {video.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="video-tag"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
      
      <PageQuote text="所谓艺术，就是巨大的晚霞。" author='三岛由纪夫' />
    </div>
  );
};

export default VideosPage;