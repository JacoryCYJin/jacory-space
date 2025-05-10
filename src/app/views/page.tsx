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
            热衷于技术与人文的交融，在编程世界和创意领域之间寻找平衡。通过博客和视频分享技术见解、设计思考和生活感悟，
            希望用文字和影像记录成长，也为他人提供有价值的内容。
          </p>
          <p className="profile-bio">
            <span>邮箱：chengyuejin@outlook.com</span>
            <span>电话：19821269277</span>
          </p>
          <div className="profile-social">
            <a href="/blog" className="social-link">
              博客文章
            </a>
            <a href="/videos" className="social-link">
              视频创作
            </a>
            <a href="/projects" className="social-link">
              项目作品
            </a>
          </div>
        </div>
      </div>

      <section className="about-section">
        <h2 className="section-title">关于我</h2>
        <div className="about-content">
          <p>
            上海电力大学计算机科学与技术专业在读，热衷于前后端技术的探索与实践。擅长将技术与用户体验相结合，打造高效、美观、易用的应用系统。
          </p>
          <p>
            同时，我也是一名内容创作者，在B站以&quot;芥子不才&quot;的名义分享技术教程和生活记录，希望通过视频形式传递知识和思考。
          </p>
          <p>
            在博客中，我记录学习心得、技术分析和对行业的思考，用文字构建自己的知识体系，也希望能为读者提供有价值的参考。
          </p>
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">内容创作</h2>
        <div className="content-cards">
          <div className="content-card">
            <div className="card-icon">📝</div>
            <h3>技术博客</h3>
            <p>分享编程技巧、项目实践和技术分析，记录学习路上的思考与收获。</p>
            <a href="/blog" className="card-link">
              阅读博客
            </a>
          </div>
          <div className="content-card">
            <div className="card-icon">🎬</div>
            <h3>视频教程</h3>
            <p>
              在B站发布编程教学、技术分享和工具使用指南，用视频形式传递知识。
            </p>
            <a href="/videos" className="card-link">
              观看视频
            </a>
          </div>
          <div className="content-card">
            <div className="card-icon">💻</div>
            <h3>开源项目</h3>
            <p>参与和创建开源项目，分享代码实践和解决方案。</p>
            <a href="/projects" className="card-link">
              查看项目
            </a>
          </div>
        </div>
      </section>

      <section className="skills-section">
        <h2 className="section-title">技术栈</h2>
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
              前端基于Vue3 实现响应式界面和动态数据可视化，后端通过Spring
              Boot和Apache Flink提供实时数据处理和扩展能力。
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
              前端基于Vue3实现响应式界面和数据可视化，后端通过Spring
              Boot和Spring Cloud提供微服务架构支持。
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
            <h3 className="project-title">
              基于ROS2的智能四轮小车运动控制与仿真系统
            </h3>
            <p className="project-period">2024-11</p>
            <p className="project-description">
              开发一套智能四轮小车运动控制与仿真系统，以支持高精度的运动控制和路径规划研究。基于ROS2
              Humble系统，
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

      <section className="quote-section">
        <blockquote>
          <p>
            技术改变世界，人文塑造灵魂。希望在代码的世界里保持人文关怀，在创作中传递技术之美。
          </p>
        </blockquote>
      </section>
    </div>
  );
};

export default ViewsPage;
