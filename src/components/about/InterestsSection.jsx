"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 兴趣爱好和联系方式展示组件
 * 展示个人兴趣爱好标签和联系方式链接
 * @param {Object} texts - 本地化文本内容
 */
const InterestsSection = ({ texts }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const interestsRef = useRef([]);
  const contactRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 标题区域弹性入场动画
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
            toggleActions: "play none none reverse",
          },
        }
      );

      // 兴趣爱好标签旋转入场动画
      interestsRef.current.forEach((interest, index) => {
        if (interest) {
          gsap.fromTo(
            interest,
            {
              scale: 0,
              rotation: 180,
              opacity: 0,
            },
            {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.8,
              ease: "back.out(1.7)",
              delay: index * 0.1,
              scrollTrigger: {
                trigger: interest,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // 联系方式区域入场动画
      gsap.fromTo(
        contactRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /**
   * 兴趣爱好标签组件
   * @param {string} interest - 兴趣爱好名称
   * @param {number} index - 标签索引
   */
  const InterestTag = ({ interest, index }) => (
    <span
      ref={(el) => (interestsRef.current[index] = el)}
      className="group relative px-6 py-3 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-800 dark:text-green-200 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:-rotate-2 overflow-hidden"
    >
      <span className="relative z-10">{interest}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400/30 rounded-full animate-ping group-hover:animate-none" />
    </span>
  );

  /**
   * 联系方式链接组件
   * @param {string} href - 链接地址
   * @param {string} icon - 图标表情
   * @param {string} label - 链接标签
   * @param {number} index - 链接索引
   */
  const ContactLink = ({ href, icon, label, index }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center space-x-3 p-4 bg-card/50 hover:bg-primary/10 border border-border hover:border-primary/50 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform transition-transform">
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
          {label}
        </span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </a>
  );

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* 兴趣爱好展示区域 */}
          <div>
            <div ref={titleRef} className="mb-12">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                <span className="text-primary font-medium tracking-wider uppercase text-sm">
                  个人兴趣
                </span>
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  {texts.sections.interests}
                </span>
              </h2>
              
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full mb-6" />
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                工作之余的热情所在，生活中的美好追求
              </p>
            </div>

            {/* 兴趣爱好标签列表 */}
            <div className="flex flex-wrap gap-4">
              {texts.interests.map((interest, index) => (
                <InterestTag key={index} interest={interest} index={index} />
              ))}
            </div>
          </div>

          {/* 联系方式展示区域 */}
          <div ref={contactRef}>
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  {texts.sections.contact}
                </span>
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full mb-4" />
              <p className="text-muted-foreground">
                随时欢迎交流合作，期待与你的连接
              </p>
            </div>

            {/* 联系方式链接列表 */}
            <div className="space-y-4">
              <ContactLink
                href={`mailto:${texts.contact.email}`}
                icon="✉️"
                label={texts.contact.email}
                index={0}
              />
              <ContactLink
                href={texts.contact.github}
                icon="🐙"
                label="GitHub"
                index={1}
              />
              <ContactLink
                href={texts.contact.twitter}
                icon="🐦"
                label="Twitter"
                index={2}
              />
              <ContactLink
                href={texts.contact.linkedin}
                icon="💼"
                label="LinkedIn"
                index={3}
              />
            </div>

            {/* 行动号召按钮区域 */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
              <h4 className="text-lg font-semibold text-primary mb-2">
                让我们开始对话
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                无论是技术交流还是项目合作，我都很乐意与你分享想法
              </p>
              <a
                href={`mailto:${texts.contact.email}`}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors duration-300 hover:scale-105 transform transition-transform shadow-lg hover:shadow-xl"
              >
                <span>发送邮件</span>
                <span className="text-sm">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterestsSection;
