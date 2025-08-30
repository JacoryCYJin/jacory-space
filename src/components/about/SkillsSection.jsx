"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/lib/context";

gsap.registerPlugin(ScrollTrigger);

const SkillsSection = ({ texts }) => {
  const { language } = useApp();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const categoriesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 标题动画
      gsap.fromTo(
        titleRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 技能分类动画
      categoriesRef.current.forEach((category, index) => {
        if (category) {
          gsap.fromTo(
            category,
            {
              x: index % 2 === 0 ? -100 : 100,
              opacity: 0,
              rotationY: index % 2 === 0 ? -45 : 45,
            },
            {
              x: 0,
              opacity: 1,
              rotationY: 0,
              duration: 1.2,
              ease: "power3.out",
              delay: index * 0.2,
              scrollTrigger: {
                trigger: category,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // 技能标签动画
          const skillTags = category.querySelectorAll('.skill-tag');
          skillTags.forEach((tag, tagIndex) => {
            gsap.fromTo(
              tag,
              {
                scale: 0,
                rotation: 180,
                opacity: 0,
              },
              {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(1.7)",
                delay: index * 0.2 + tagIndex * 0.1,
                scrollTrigger: {
                  trigger: category,
                  start: "top 80%",
                  end: "bottom 20%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const SkillTag = ({ skill, index, category }) => {
    const getTagStyles = () => {
      switch (category) {
        case 'fullstack':
          return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/50';
        case 'animation':
          return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-900/50';
        case 'design':
          return 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 hover:bg-pink-200 dark:hover:bg-pink-900/50';
        case 'video':
          return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-900/50';
        default:
          return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-900/50';
      }
    };

    return (
      <span
        className={`skill-tag px-4 py-2 rounded-full text-sm font-medium cursor-pointer
          transition-all duration-300 hover:scale-110 hover:shadow-lg
          ${getTagStyles()}
          hover:rotate-2 group relative overflow-hidden`}
        style={{
          animationDelay: `${index * 0.1}s`,
        }}
      >
        <span className="relative z-10">{skill}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </span>
    );
  };

  const SkillCategory = ({ title, skills, icon, category, index }) => (
    <div
      ref={(el) => (categoriesRef.current[index] = el)}
      className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl group relative overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
            <span className="text-2xl">{icon}</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, skillIndex) => (
            <SkillTag 
              key={skillIndex} 
              skill={skill} 
              index={skillIndex}
              category={category}
            />
          ))}
        </div>
      </div>

      {/* 悬停效果装饰线 */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );

  // 根据语言获取分类标题
  const getCategoryTitles = () => {
    const titles = {
      "zh-cn": {
        fullstack: "全栈开发",
        animation: "动画交互", 
        design: "设计创作",
        video: "视频制作"
      },
      "zh-tw": {
        fullstack: "全端開發",
        animation: "動畫互動",
        design: "設計創作", 
        video: "影片製作"
      },
      en: {
        fullstack: "Full-Stack Dev",
        animation: "Animation & Interactive",
        design: "Design & Creative",
        video: "Video Production"
      }
    };
    return titles[language] || titles["zh-cn"];
  };

  const categoryTitles = getCategoryTitles();

  const skillCategories = [
    {
      title: categoryTitles.fullstack,
      skills: texts.skills.fullstack,
      icon: "🚀",
      category: "fullstack",
    },
    {
      title: categoryTitles.animation,
      skills: texts.skills.animation,
      icon: "🎭",
      category: "animation",
    },
    {
      title: categoryTitles.design,
      skills: texts.skills.design,
      icon: "🎨", 
      category: "design",
    },
    {
      title: categoryTitles.video,
      skills: texts.skills.video,
      icon: "🎬",
      category: "video",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div
          ref={titleRef}
          className="text-center mb-16"
        >
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {texts.sections.skills}
            </span>
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full" />
          
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Mastering full-stack development with focus on modern tools and creative technologies'
              : language === 'zh-tw'
              ? '掌握全端開發技術，專注於現代化工具和創意科技'  
              : '掌握全栈开发技术，专注于现代化工具和创意科技'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCategory
              key={index}
              title={category.title}
              skills={category.skills}
              icon={category.icon}
              category={category.category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
