"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { portfolioProjects, shareTexts } from "@/constants/home/ShareSection";
import SectionHeader from "@/components/common/SectionHeader";

/**
 * 作品集预览组件
 * 展示 3-4 个精选项目，采用网格布局
 * 每个卡片包含：缩略图、项目名称、描述、技术标签
 */
const PortfolioPreview = ({ onEnter, onLeave }) => {
  const { language } = useApp();
  const currentProjects = portfolioProjects[language];
  const currentTexts = shareTexts[language];
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    // 为每个卡片添加 hover 效果
    cardRefs.current.forEach((cardRef) => {
      if (cardRef) {
        const handleMouseEnter = () => {
          gsap.to(cardRef, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(cardRef, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        cardRef.addEventListener("mouseenter", handleMouseEnter);
        cardRef.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          cardRef.removeEventListener("mouseenter", handleMouseEnter);
          cardRef.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    });
  }, []);

  // 获取技术标签的颜色样式
  const getTagColor = (tag) => {
    const tagColors = {
      "React": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      "Next.js": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300", 
      "Tailwind": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
      "GSAP": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "TypeScript": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "MDX": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "Storybook": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      "CSS": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      "JavaScript": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    };
    return tagColors[tag] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen space-y-8 flex flex-col justify-center"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* 标题区域 */}
      <SectionHeader 
        title={currentTexts.portfolioTitle || "Featured Works"}
        description={currentTexts.portfolioDescription || "Featured Works Showcase"}
        size="medium"
      />

      {/* 网格布局容器 */}
      <div className="grid grid-cols-2 gap-4">
        {currentProjects.slice(0, 4).map((project, index) => (
          <div
            key={project.id}
            ref={(el) => (cardRefs.current[index] = el)}
            className="group cursor-pointer"
          >
            <Link href={project.link} className="block">
              <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-lg overflow-hidden hover:bg-card/90 transition-all duration-300">
                {/* 项目缩略图 - 占比 70% */}
                <div className="aspect-video w-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    {/* 占位图标 */}
                    <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>

                {/* 项目信息 - 占比 30% */}
                <div className="p-4 space-y-3">
                  {/* 项目名称 */}
                  <h3 className="text-foreground font-semibold text-sm group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  {/* 简短描述 */}
                  <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* 技术标签 */}
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag}
                        className={`px-2 py-1 rounded text-xs font-medium ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground/60">
                        +{project.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPreview;
