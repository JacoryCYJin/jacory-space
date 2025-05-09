'use client';

import React from 'react';
import Image from 'next/image';
import './views.scss';
import PageHeader from '@/components/PageHeader/PageHeader';

const ViewsPage = () => {
  return (
    <div className="views-container">
      <PageHeader title="寸心之介" subtitle="技术与人文的交融者" />

      <div className="profile-section">
        <div className="profile-image-container">
          <Image 
            src="/images/avatar.jpg" 
            alt="金诚悦" 
            width={200} 
            height={200} 
            className="profile-image"
          />
        </div>
        <div className="profile-info">
          <h2>金诚悦</h2>
          <p className="profile-bio">
            计算机科学与技术专业毕业，热衷于前后端技术的探索与实践。擅长将技术与用户体验相结合，
            打造高效、美观、易用的应用系统。对智能化交通管理与数据可视化领域有深入研究。
          </p>
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">所在地</span>
              <span className="detail-value">上海</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">邮箱</span>
              <span className="detail-value">chengyuejin@outlook.com</span>
            </div>
          </div>
        </div>
      </div>

      <section className="skills-section">
        <h2 className="section-title">技术能力</h2>
        <div className="skills-container">
          <div className="skill-category">
            <h3>前端开发</h3>
            <ul className="skill-list">
              <li>Vue3 / Vite</li>
              <li>Element Plus</li>
              <li>ECharts</li>
              <li>HTML/CSS/JavaScript</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>后端开发</h3>
            <ul className="skill-list">
              <li>Spring Boot</li>
              <li>Java</li>
              <li>MyBatis</li>
              <li>Spring Cloud</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>数据库</h3>
            <ul className="skill-list">
              <li>MySQL</li>
              <li>SQL Server</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>工具与其他</h3>
            <ul className="skill-list">
              <li>Git/Vite</li>
              <li>Apache Flink</li>
              <li>ROS2</li>
              <li>Python</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="projects-section">
        <h2 className="section-title">项目精选</h2>
        <div className="projects-container">
          <div className="project-card">
            <h3 className="project-title">智慧交通管理与数据可视化解决方案</h3>
            <p className="project-period">2024-04 ~ 2024-05</p>
            <p className="project-description">
              开发一套智慧道路交通与可视化解决方案，以提升交通管理的智能化水平和监控效率。系统采用前后端分离架构，
              前端基于Vue3 实现响应式界面和动态数据可视化，后端通过Spring Boot和Apache Flink提供实时数据处理和扩展能力。
            </p>
            <div className="project-tech">
              <span className="tech-tag">Vue3</span>
              <span className="tech-tag">Element Plus</span>
              <span className="tech-tag">ECharts</span>
              <span className="tech-tag">Spring Boot</span>
              <span className="tech-tag">Apache Flink</span>
            </div>
          </div>

          <div className="project-card">
            <h3 className="project-title">智能化课程管理与数据分析平台</h3>
            <p className="project-period">2024-12</p>
            <p className="project-description">
              开发一套课程管理系统，以帮助学校或者教育机构管理教学资源和课程安排。系统采用前后端分离架构，
              前端基于Vue3实现响应式界面和数据可视化，后端通过Spring Boot和Spring Cloud提供微服务架构支持。
            </p>
            <div className="project-tech">
              <span className="tech-tag">Vue3</span>
              <span className="tech-tag">Element Plus</span>
              <span className="tech-tag">Spring Boot</span>
              <span className="tech-tag">MyBatis</span>
              <span className="tech-tag">Spring Cloud</span>
            </div>
          </div>

          <div className="project-card">
            <h3 className="project-title">基于ROS2的智能四轮小车运动控制与仿真系统</h3>
            <p className="project-period">2024-11</p>
            <p className="project-description">
              开发一套智能四轮小车运动控制与仿真系统，以支持高精度的运动控制和路径规划研究。基于ROS2 Humble系统，
              测试多节点通讯和小车运动控制算法实现，并在Gazebo中完成高精度的仿真环境。
            </p>
            <div className="project-tech">
              <span className="tech-tag">ROS2</span>
              <span className="tech-tag">Python</span>
              <span className="tech-tag">Gazebo</span>
              <span className="tech-tag">URDF</span>
            </div>
          </div>
        </div>
      </section>

      <section className="education-section">
        <h2 className="section-title">教育背景</h2>
        <div className="education-card">
          <div className="education-header">
            <h3 className="school-name">上海电力大学</h3>
            <span className="education-period">2022-09 ~ 至今</span>
          </div>
          <p className="education-major">计算机科学与技术（本科）</p>
          <p className="education-gpa">GPA: 3.16/4</p>
        </div>
      </section>

      <section className="contact-section">
        <h2 className="section-title">联系我</h2>
        <div className="contact-methods">
          <div className="contact-method">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span className="contact-value">chengyuejin@outlook.com</span>
          </div>
          <div className="contact-method">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span className="contact-value">19821269277</span>
          </div>
        </div>
      </section>

      <section className="quote-section">
        <blockquote>
          <p>具有良好的团队协作和沟通能力，坚持刻苦，能高效完成任务；擅长资源协调与任务分配，推动团队目标实现，为项目创造实际价值。</p>
        </blockquote>
      </section>
    </div>
  );
};

export default ViewsPage;