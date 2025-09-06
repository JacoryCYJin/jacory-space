"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 视频制作技能卡片组件
 * 展示视频制作相关的技能和项目
 * @param {Array} skills - 技能名称数组
 * @param {string} language - 当前语言设置
 * @param {Object} cardData - 卡片配置数据
 */
const VideoCard = ({ skills, language, cardData }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 初始化动画状态
      gsap.set(".video-header", { opacity: 0, y: 20 });
      gsap.set(".video-skills", { opacity: 0, y: 20 });
      gsap.set(".video-projects", { opacity: 0, y: 20 });
      gsap.set(".video-skill-tag", { opacity: 0, scale: 0, rotate: 180 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // 顺序动画时间线
      tl.to(".video-header", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0)
      .to(".video-skills", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.2)
      .to(".video-projects", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.4);

      // 技能标签错开动画
      skills.forEach((_, index) => {
        tl.to(`.video-skill-tag:nth-child(${index + 1})`, {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.6,
          ease: "back.out(1.7)"
        }, 0.6 + index * 0.1);
      });

    }, cardRef);

    return () => ctx.revert();
  }, [skills]);

  return (
    <div ref={cardRef} className="w-full h-full flex items-center justify-center p-3">
      <div className="w-full mx-auto">
        <div className="video-header text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-3">
            <span className="text-xl">🎬</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-bold mb-3 text-foreground">
            {cardData?.title || (language === 'en' ? 'Video Production' : language === 'zh-tw' ? '影片製作' : '视频制作')}
          </h3>
          <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {cardData?.description || (language === 'en' ? 'Focusing on video production and post-processing to create engaging visual content' : language === 'zh-tw' ? '專注於影片製作和後期處理，創造引人入勝的視覺內容' : '专注于视频制作和后期处理，创造引人入胜的视觉内容')}
          </p>
        </div>

        <div className="video-skills mb-6">
          <h4 className="text-base lg:text-lg font-semibold text-foreground mb-4 text-center">
            {language === 'en' ? 'Technologies' : '技术栈'}
          </h4>
          <div className="flex flex-wrap gap-1.5 lg:gap-2 justify-center">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="video-skill-tag px-2.5 lg:px-3 py-1 lg:py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="video-projects space-y-4">
          <h4 className="text-base lg:text-lg font-semibold text-foreground text-center">
            {language === 'en' ? 'Featured Projects' : '精选项目'}
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <div className="bg-card/50 border border-border/50 rounded-lg p-3 lg:p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                <h5 className="font-semibold text-foreground text-xs lg:text-sm">
                  {cardData?.projects?.[0]?.title || (language === 'en' ? 'Product Promotional Video' : '产品宣传视频')}
                </h5>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {cardData?.projects?.[0]?.description || (language === 'en' ? 'High-quality promotional video with motion graphics and effects' : '具有动态图形和特效的高质量宣传视频')}
              </p>
            </div>

            <div className="bg-card/50 border border-border/50 rounded-lg p-3 lg:p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                <h5 className="font-semibold text-foreground text-xs lg:text-sm">
                  {cardData?.projects?.[1]?.title || (language === 'en' ? 'Event Coverage' : '活动拍摄')}
                </h5>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {cardData?.projects?.[1]?.description || (language === 'en' ? 'Professional event coverage with multi-camera setup and editing' : '专业的多机位活动拍摄和后期制作')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
