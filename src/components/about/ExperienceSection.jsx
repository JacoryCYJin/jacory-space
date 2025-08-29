"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ExperienceSection = ({ texts }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 标题动画
      gsap.fromTo(
        titleRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.5,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.3)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 经历卡片动画
      cardsRef.current.forEach((card, index) => {
        if (card) {
          // 入场动画
          gsap.fromTo(
            card,
            {
              y: 100,
              opacity: 0,
              rotationX: -90,
              transformOrigin: "center bottom",
            },
            {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 1.2,
              ease: "power3.out",
              delay: index * 0.2,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // 悬停动画
          const handleMouseEnter = () => {
            gsap.to(card, {
              y: -15,
              rotationY: 5,
              scale: 1.02,
              duration: 0.4,
              ease: "power2.out",
            });

            // 卡片内容动画
            const content = card.querySelector(".card-content");
            gsap.to(content, {
              y: -5,
              duration: 0.4,
              ease: "power2.out",
            });
          };

          const handleMouseLeave = () => {
            gsap.to(card, {
              y: 0,
              rotationY: 0,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            });

            const content = card.querySelector(".card-content");
            gsap.to(content, {
              y: 0,
              duration: 0.4,
              ease: "power2.out",
            });
          };

          card.addEventListener("mouseenter", handleMouseEnter);
          card.addEventListener("mouseleave", handleMouseLeave);

          return () => {
            card.removeEventListener("mouseenter", handleMouseEnter);
            card.removeEventListener("mouseleave", handleMouseLeave);
          };
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const ExperienceCard = ({ experience, index }) => (
    <div
      ref={(el) => (cardsRef.current[index] = el)}
      className="group relative"
    >
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-2xl relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl group-hover:from-primary/30 transition-colors duration-500" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl group-hover:from-primary/20 transition-colors duration-500" />

        {/* 顶部装饰条 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />

        <div className="card-content relative z-10">
          {/* 头部信息 */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform transition-transform">
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {experience.title}
                </h3>
                <p className="text-primary font-semibold text-lg">
                  {experience.company}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-muted/50 group-hover:bg-primary/10 px-4 py-2 rounded-full transition-colors duration-300">
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                  {experience.period}
                </span>
              </div>
            </div>
          </div>

          {/* 描述 */}
          <div className="relative">
            <p className="text-muted-foreground leading-relaxed text-lg group-hover:text-foreground transition-colors duration-300">
              {experience.description}
            </p>

            {/* 引用装饰 */}
            <div className="absolute -left-4 -top-2 text-6xl text-primary/20 font-serif leading-none">
              "
            </div>
          </div>

          {/* 底部技能标签（如果有的话） */}
          <div className="mt-6 pt-6 border-t border-border/30">
            <div className="flex flex-wrap gap-2">
              {/* 示例技能标签，你可以根据实际数据调整 */}
              {["React", "Node.js", "TypeScript"].map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors duration-200 cursor-pointer"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 悬停时的装饰效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

        {/* 边框光效 */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/50 to-primary/20 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm" />
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/2" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl transform translate-x-1/2" />
      </div>

      {/* 网格背景 */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-primary/20" />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* 标题部分 */}
        <div ref={titleRef} className="text-center mb-20">
          {/* <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              职业历程
            </span>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            />
          </div> */}

          <h2 className="text-5xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {texts.sections.experience}
            </span>
          </h2>

          <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full mb-6" />

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            每一段经历都是成长的阶梯，每一个项目都是技能的磨砺
          </p>
        </div>

        {/* 经历卡片网格 */}
        <div className="grid lg:grid-cols-2 gap-8">
          {texts.experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} index={index} />
          ))}
        </div>

        {/* 底部统计信息 */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "3+", label: "年工作经验" },
              { number: "20+", label: "完成项目" },
              { number: "5+", label: "技术栈" },
              { number: "100%", label: "项目成功率" },
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
