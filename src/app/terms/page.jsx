"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { termsContent } from "@/constants/terms";

/**
 * 服务条款页面
 * 详细说明网站使用条款和服务条件
 */
const TermsPage = () => {
  const { language } = useApp();
  const currentContent = termsContent[language] || termsContent["zh-cn"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {currentContent.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {currentContent.subtitle}
          </p>
          <p className="text-sm text-muted-foreground">
            {currentContent.lastUpdated}
          </p>
        </div>

        {/* 内容区域 */}
        <div className="space-y-8">
          {currentContent.sections.map((section, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <p key={itemIndex} className="text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TermsPage;
