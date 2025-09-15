"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useApp } from "@/lib/context";
import { mediaContent, shareTexts } from "@/constants/home/ShareSection";
import SectionHeader from "@/components/common/SectionHeader";

/**
 * 媒体预览组件
 * 展示摄影/视频内容，采用4x3网格错落布局
 * 左侧：1个大垂直卡片(1x3)
 * 右侧：1个大视频卡片(2x2) + 3个小图片卡片(1x1)
 * 包含图片展示和带播放按钮的视频缩略图
 */
const MediaPreview = ({ onEnter, onLeave }) => {
  const { language } = useApp();
  const currentMedia = mediaContent[language];
  const currentTexts = shareTexts[language];
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  // 统一的卡片内容渲染方法
  const renderCardContent = (mediaItem, isVideo = false, iconSize = "w-7 h-7") => {
    // 如果标记为空白，返回完全透明的内容
    if (mediaItem?.isEmpty) {
      return (
        <div className="w-full h-full bg-transparent">
          {/* 完全透明的空白留白效果 */}
        </div>
      );
    }

    // 如果有图片，渲染图片内容
    if (mediaItem?.image) {
      return (
        <div className="w-full h-full relative">
          <img
            src={mediaItem.image}
            alt={mediaItem.title}
            className="w-full h-full object-cover"
          />
          
          {/* 如果是视频，显示播放按钮 */}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <svg
                  className="w-16 h-16 text-white drop-shadow-lg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <div className="absolute inset-0 w-16 h-16 border-2 border-white rounded-full"></div>
              </div>
            </div>
          )}

          {/* Hover 覆盖层 */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-3 text-white">
              <h4 className="text-sm font-medium">
                {mediaItem?.title}
              </h4>
              <p className="text-xs text-white/80">
                {mediaItem?.date}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // 默认占位符内容
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center relative">
        <div className="relative">
          {isVideo ? (
            <>
              <svg
                className="w-12 h-12 text-muted-foreground"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <div className="absolute inset-0 w-12 h-12 border-2 border-muted-foreground rounded-full"></div>
            </>
          ) : (
            <svg
              className={`${iconSize} text-muted-foreground`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>
      </div>
    );
  };

  // 统一的卡片容器样式方法
  const getCardClassName = (mediaItem, baseClassName) => {
    const baseStyles = "group cursor-pointer relative overflow-hidden rounded-xl transition-all duration-300";
    
    if (mediaItem?.isEmpty) {
      return `${baseClassName} ${baseStyles} bg-transparent border-transparent pointer-events-none`;
    }
    
    return `${baseClassName} ${baseStyles} bg-card/80 backdrop-blur-md border border-border/50 hover:bg-card/90`;
  };

  useEffect(() => {
    // 为每个媒体项添加 hover 效果
    itemRefs.current.forEach((itemRef) => {
      if (itemRef) {
        const handleMouseEnter = () => {
          gsap.to(itemRef, {
            scale: 1.03,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(itemRef, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        itemRef.addEventListener("mouseenter", handleMouseEnter);
        itemRef.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          itemRef.removeEventListener("mouseenter", handleMouseEnter);
          itemRef.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen space-y-8 flex flex-col justify-center"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* 标题区域 */}
      <SectionHeader
        title={currentTexts.mediaTitle || "Visual Stories"}
        description={currentTexts.mediaDescription || "Visual Story Records"}
        size="medium"
      />

      {/* 错落网格布局 - 4x3网格，左侧大卡片，右侧混合布局 */}
      <div className="grid grid-cols-4 auto-rows-fr gap-3 max-w-4xl mx-auto">
        {/* 左侧大的垂直卡片 */}
        <div
          ref={(el) => (itemRefs.current[0] = el)}
          className={getCardClassName(currentMedia[0], "col-span-1 row-span-3")}
        >
          {renderCardContent(currentMedia[0], false, "w-8 h-8")}
        </div>

        {/* 右上小卡片 - 可设置为留白效果 */}
        {/* 要设置为空白留白效果，在数据中添加 isEmpty: true 属性 */}
        <div
          ref={(el) => (itemRefs.current[1] = el)}
          className={getCardClassName(currentMedia[1], "col-span-1 row-span-1")}
        >
          {renderCardContent(currentMedia[1])}
        </div>

        {/* 右中间大视频卡片 */}
        <div
          ref={(el) => (itemRefs.current[2] = el)}
          className={getCardClassName(currentMedia[2], "col-span-2 row-span-2")}
        >
          {renderCardContent(currentMedia[2], true)}
        </div>

        {/* 右上小卡片 */}
        <div
          ref={(el) => (itemRefs.current[3] = el)}
          className={getCardClassName(currentMedia[3], "col-span-1 row-span-1")}
        >
          {renderCardContent(currentMedia[3])}
        </div>

        {/* 右下大图片卡片 */}
        <div
          ref={(el) => (itemRefs.current[4] = el)}
          className={getCardClassName(currentMedia[4], "col-span-2 row-span-2")}
        >
          {renderCardContent(currentMedia[4])}
        </div>

        {/* 右下小卡片 - 图片类型 */}
        <div
          ref={(el) => (itemRefs.current[5] = el)}
          className={getCardClassName(currentMedia[5], "col-span-1 row-span-1")}
        >
          {renderCardContent(currentMedia[5], false, "w-8 h-8")}
        </div>

        {/* 底部两个中等卡片 */}
        {[6, 7].map((index) => (
          <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            className={getCardClassName(currentMedia[index], "col-span-1 row-span-1")}
          >
            {renderCardContent(currentMedia[index])}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPreview;
