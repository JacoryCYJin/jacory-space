/**
 * 分享区域组件 - 首页内容展示区域
 * 作者：JacoryJin
 *
 * 功能：左侧固定标题，右侧滚动展示作品集、博客、媒体内容
 * 特性：使用 GSAP ScrollTrigger 实现滚动联动效果和固定布局
 */
"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/lib/context";
import { shareTexts } from "@/constants/home/ShareSection";
import PortfolioPreview from "./PortfolioPreview";
import BlogPreview from "./BlogPreview";
import MediaPreview from "./MediaPreview";

gsap.registerPlugin(ScrollTrigger);

/**
 * 分享区域组件
 *
 * @returns {JSX.Element} 分享区域布局组件
 */
const ShareSection = () => {
  const { language } = useApp();
  const currentTexts = shareTexts[language];
  const sectionRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const decorLineRef = useRef(null);
  const [rightScrollComplete, setRightScrollComplete] = useState(false);
  const [sectionAtTop, setSectionAtTop] = useState(false);
  const [rightScrollProgress, setRightScrollProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 获取标题内容区域的子元素
      const titleContent = leftContentRef.current.querySelector(".space-y-6");
      const mainTitle = titleContent?.querySelector("h2");
      const subtitle = titleContent?.querySelector("p");

      // 创建协调的入场动画时间线
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // 装饰线条：从上往下展开（最先开始）
      if (decorLineRef.current) {
        tl.fromTo(
          decorLineRef.current,
          {
            scaleY: 0,
            transformOrigin: "top center",
            opacity: 0,
          },
          {
            scaleY: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
          }
        );
      }

      // 主标题：从左侧滑入，与装饰线同步开始
      if (mainTitle) {
        tl.fromTo(
          mainTitle,
          {
            x: -60,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8" // 在装饰线动画进行到 0.4s 时开始
        );
      }

      // 副标题：从左侧滑入，稍微延迟
      if (subtitle) {
        tl.fromTo(
          subtitle,
          {
            x: -40,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6" // 在主标题开始后稍微延迟
        );
      }

      // 装饰线条的持续脉冲效果（在入场动画完成后开始）
      if (decorLineRef.current) {
        tl.to(
          decorLineRef.current,
          {
            boxShadow:
              "0 0 20px rgba(var(--primary-rgb), 0.4), 0 0 40px rgba(var(--primary-rgb), 0.2)",
            duration: 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
          "+=0.5" // 在入场动画完成后 0.5s 开始脉冲
        );
      }

      /**
       * 创建滚动联动效果
       * 实现页面滚动时右侧内容区域的同步滚动
       */
      const createScrollTrigger = () => {
        if (!rightContentRef.current) return;

        // 确保 DOM 内容完全渲染后再计算滚动参数
        requestAnimationFrame(() => {
          const rightContentScrollHeight = rightContentRef.current.scrollHeight;
          const rightContentClientHeight = rightContentRef.current.clientHeight;
          const maxScrollDistance =
            rightContentScrollHeight - rightContentClientHeight;

          // // 调试信息：输出滚动区域的尺寸参数
          // console.log(
          //   "ScrollHeight:",
          //   rightContentScrollHeight,
          //   "ClientHeight:",
          //   rightContentClientHeight,
          //   "MaxScroll:",
          //   maxScrollDistance
          // );

          if (maxScrollDistance <= 0) {
            console.warn("No scroll distance available");
            return;
          }

          // 创建 ScrollTrigger 实例：固定整个区域，控制右侧内容滚动
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top", // 当区域顶部到达视口顶部时开始
            end: `+=${maxScrollDistance * 1.5}`, // 根据内容高度计算结束位置
            pin: true, // 固定整个区域
            pinSpacing: true, // 保持页面流布局
            scrub: 1, // 平滑滚动效果
            onUpdate: (self) => {
              const progress = self.progress;
              setSectionAtTop(self.isActive);

              // 根据页面滚动进度控制右侧内容区域的滚动位置
              const scrollAmount = progress * maxScrollDistance;
              if (rightContentRef.current) {
                rightContentRef.current.scrollTop = scrollAmount;
                
                // // 调试信息：输出滚动进度和滚动量
                // console.log(
                //   "Scroll progress:",
                //   progress,
                //   "Scroll amount:",
                //   scrollAmount
                // );
              }

              setRightScrollProgress(progress);
              setRightScrollComplete(progress >= 0.9);
            },
            onLeave: () => setSectionAtTop(false),
            onEnterBack: () => setSectionAtTop(true),
          });
        });
      };

      // 延迟执行以确保所有子组件内容完全渲染
      const timer = setTimeout(createScrollTrigger, 500);
      return () => clearTimeout(timer);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen bg-gradient-to-b from-background via-muted/50 to-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 h-full">
          {/* 左侧固定标题区域：主标题和副标题 */}
          <div className="flex flex-col justify-center">
            <div
              ref={leftContentRef}
              className="relative flex items-start space-x-6"
            >
              {/* 装饰线条 - 主题色竖线 */}
              <div className="flex-shrink-0 mt-3">
                <div
                  ref={decorLineRef}
                  className="w-1.5 h-40 bg-gradient-to-b from-primary via-primary to-primary/60 rounded-full shadow-lg shadow-primary/20"
                  style={{
                    transformOrigin: "top center",
                    transform: "scaleY(0)",
                    opacity: 0,
                  }}
                ></div>
              </div>

              {/* 标题内容区域 */}
              <div className="space-y-6 flex-1">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight text-foreground">
                  {currentTexts.title}
                </h2>
                <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-muted-foreground leading-relaxed">
                  {currentTexts.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* 右侧滚动内容区域：作品集、博客、媒体预览 */}
          <div
            ref={rightContentRef}
            className="overflow-y-auto h-full scrollbar-hide"
          >
            <div className="space-y-0 pr-4">
              {/* 作品集预览区块 */}
              <div className="py-4">
                <PortfolioPreview />
              </div>

              {/* 博客预览区块 */}
              <div className="py-4">
                <BlogPreview />
              </div>

              {/* 媒体预览区块 */}
              <div className="py-4">
                <MediaPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareSection;
