'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册GSAP插件
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LenisProvider({ children }) {
  useEffect(() => {
    // 初始化Lenis平滑滚动
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // 连接Lenis和GSAP ScrollTrigger，确保两者同步工作
    lenis.on('scroll', ScrollTrigger.update);

    // 使用GSAP ticker处理Lenis动画帧，提供更好的性能
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // 禁用GSAP的延迟平滑，让Lenis完全控制滚动
    gsap.ticker.lagSmoothing(0);

    // 清理函数：销毁Lenis实例
    return () => {
      lenis.destroy();
    };
  }, []);

  return children;
}
