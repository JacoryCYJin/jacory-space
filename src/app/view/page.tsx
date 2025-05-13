'use client';

import React from 'react';
import Image from 'next/image';
import './view.scss';
import PageHeader from '@/components/PageHeader/PageHeader';
import Link from 'next/link';

const ViewsPage = () => {
  return (
    <div className="views-container">
      <PageHeader title="寸心之介" subtitle="技术与人文的交融者" />

      <div className="profile-section">
        <div className="profile-image-container">
          <Image
            src="/images/avatar.jpg"
            alt="芥子不才"
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
            <Link href="/blog" className="social-link bgc-tag">
              博客文章
            </Link>
            <Link href="/video" className="social-link bgc-tag">
              视频创作
            </Link>
            <Link href="/work" className="social-link bgc-tag">
              项目作品
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewsPage;
