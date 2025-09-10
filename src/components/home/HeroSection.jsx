'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册GSAP插件
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // 创建粒子动画
      const createParticles = () => {
        const particles = [];
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement('div');
          particle.className = 'absolute w-1 h-1 bg-white/20 rounded-full';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.top = Math.random() * 100 + '%';
          particle.style.animationDelay = Math.random() * 2 + 's';
          heroRef.current?.appendChild(particle);
          particles.push(particle);
        }
        return particles;
      };

      const particles = createParticles();

      // 粒子闪烁动画
      gsap.to(particles, {
        opacity: 0.8,
        duration: 2,
        stagger: 0.1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });

      // 主标题动画
      gsap.fromTo(titleRef.current, 
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotationX: 90
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1.5,
          ease: "power3.out",
          delay: 0.5
        }
      );

      // 副标题动画
      gsap.fromTo(subtitleRef.current,
        {
          opacity: 0,
          y: 50,
          x: -50
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 1,
          ease: "power2.out",
          delay: 1
        }
      );

      // 描述文字动画
      gsap.fromTo(descriptionRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: 1.5
        }
      );

      // 滚动指示器动画
      gsap.fromTo(scrollIndicatorRef.current,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: 2
        }
      );

      // 鼠标移动视差效果
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth - 0.5) * 20;
        const yPos = (clientY / innerHeight - 0.5) * 20;

        gsap.to(titleRef.current, {
          x: xPos,
          y: yPos,
          duration: 0.5,
          ease: "power2.out"
        });

        gsap.to(particles, {
          x: xPos * 0.5,
          y: yPos * 0.5,
          duration: 0.5,
          ease: "power2.out"
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      // 滚动触发动画
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(titleRef.current, {
            scale: 1 - progress * 0.1,
            opacity: 1 - progress * 0.3,
            duration: 0.3
          });
        }
      });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        particles.forEach(particle => particle.remove());
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      {/* 背景渐变效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* 动态背景元素 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center px-8 max-w-6xl mx-auto">
        {/* 主标题 */}
        <h1 
          ref={titleRef}
          className="text-8xl md:text-9xl lg:text-[12rem] font-black text-primary mb-8 leading-none tracking-tight"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textShadow: '0 0 40px rgba(94, 116, 86, 0.3)',
            transformStyle: 'preserve-3d'
          }}
        >
          JSPACE
        </h1>

        {/* 副标题 */}
        <h2 
          ref={subtitleRef}
          className="text-xl md:text-2xl font-medium text-foreground/80 mb-6 tracking-wider uppercase"
        >
          创意空间 · 思想分享
        </h2>

        {/* 描述文字 */}
        <div 
          ref={descriptionRef}
          className="max-w-3xl mx-auto space-y-4"
        >
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
            欢迎来到我的创意空间，这里是我分享作品、思想、学习历程和经验的地方。
          </p>
          <p className="text-base md:text-lg text-foreground/60 leading-relaxed">
            探索设计之美，记录成长足迹，与您分享每一个灵感的诞生。
          </p>
        </div>
      </div>

      {/* 滚动指示器 */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 text-foreground/50"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-foreground/30 to-transparent" />
        <span className="text-sm font-medium tracking-wider uppercase">向下滚动</span>
        <div className="w-1 h-1 bg-foreground/30 rounded-full animate-bounce" />
      </div>

      {/* 装饰性元素 */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-ping" />
      <div className="absolute top-40 right-32 w-1 h-1 bg-primary/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
    </section>
  );
}
