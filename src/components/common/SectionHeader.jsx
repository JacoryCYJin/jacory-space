/**
 * 可复用的页面标题和描述组件
 * 作者：JacoryJin
 *
 * 功能：为各个预览组件提供统一的标题和描述样式
 * 特性：支持渐变标题、预设尺寸、响应式设计、GSAP动画
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 页面标题组件
 *
 * @param {Object} props - 组件属性
 * @param {string} props.title - 主标题文本
 * @param {string} props.description - 描述文本
 * @param {'large'|'medium'|'small'} props.size - 预设尺寸 (默认 'large')
 * @param {string} props.titleClassName - 标题自定义样式类
 * @param {string} props.descriptionClassName - 描述自定义样式类
 * @param {string} props.containerClassName - 容器自定义样式类
 * @param {boolean} props.useGradient - 是否使用渐变标题效果（默认 true）
 * @param {number} props.animationDelay - 动画延迟时间（秒，默认 0.2）
 * @returns {JSX.Element} 页面标题组件
 */
const SectionHeader = ({
  title,
  description,
  size = "large",
  titleClassName = "",
  descriptionClassName = "",
  containerClassName = "",
  useGradient = true,
  animationDelay = 0.2,
}) => {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const containerRef = useRef(null);
  // 预设尺寸配置
  const sizePresets = {
    large: {
      title: "text-4xl",
      description: "text-lg",
      container: "space-y-6 mb-16",
    },
    medium: {
      title: "text-3xl",
      description: "text-base",
      container: "space-y-4 mb-8",
    },
    small: {
      title: "text-2xl",
      description: "text-sm",
      container: "space-y-3 mb-6",
    },
  };

  const currentPreset = sizePresets[size];

  // 基础标题样式
  const baseTitleClass = useGradient
    ? `${currentPreset.title} font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent`
    : `${currentPreset.title} font-bold text-foreground`;

  // 基础描述样式
  const baseDescriptionClass = `${currentPreset.description} text-muted-foreground/80 font-light`;

  // 基础容器样式
  const baseContainerClass = `${currentPreset.container} text-center relative`;

  // 初始化动画效果
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 设置初始状态
      if (titleRef.current) {
        gsap.set(titleRef.current, { y: 30, opacity: 0 });
      }
      if (descriptionRef.current) {
        gsap.set(descriptionRef.current, { y: 20, opacity: 0 });
      }

      // 使用 ScrollTrigger 控制动画时机
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // 更晚触发
          end: "bottom 15%",
          toggleActions: "play none none reset", // 重置动画，向上滚动时重置为初始状态
          // markers: true, // 开发时可以打开查看触发点
        },
      });

      // 标题动画：从下方淡入，带有轻微的弹性效果
      if (titleRef.current) {
        tl.to(titleRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // 描述动画：稍后从下方淡入，更加轻柔
      if (descriptionRef.current) {
        tl.to(
          descriptionRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [animationDelay]);

  return (
    <div
      ref={containerRef}
      className={`${baseContainerClass} ${containerClassName}`}
    >
      <div className="relative">
        <h3 ref={titleRef} className={`${baseTitleClass} ${titleClassName}`}>
          {title}
        </h3>
      </div>
      {description && (
        <p
          ref={descriptionRef}
          className={`${baseDescriptionClass} ${descriptionClassName}`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
