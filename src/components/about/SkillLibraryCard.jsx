"use client";

import { motion } from "framer-motion";
import { OrbitingCircles } from "../magicui/orbiting-circles";
import {
  techIcons,
  skillsStackLabels,
  skillCardsData,
} from "../../constants/about/SkillLibrary";

const SkillLibraryCard = ({ skills, language, cardData }) => {
  // 获取当前语言的技能栈标签
  const currentLanguage = language || "zh-cn";
  const skillsStackLabel = skillsStackLabels[currentLanguage] || "技术栈";

  // 为技能生成图标
  const generateIcons = () => {
    return skills.map((skill) => {
      // 处理技能名称的匹配
      const normalizedSkill = skill.replace(/\s+/g, "");

      // 首先尝试精确匹配
      let iconKey = Object.keys(techIcons).find(
        (key) => key.toLowerCase() === skill.toLowerCase()
      );

      // 如果没有精确匹配，尝试包含匹配
      if (!iconKey) {
        iconKey = Object.keys(techIcons).find(
          (key) =>
            key.toLowerCase().includes(normalizedSkill.toLowerCase()) ||
            normalizedSkill.toLowerCase().includes(key.toLowerCase()) ||
            key.toLowerCase().replace(/\s+/g, "") ===
              normalizedSkill.toLowerCase()
        );
      }

      return techIcons[iconKey] || techIcons["default"];
    });
  };

  return (
    <div className="w-full h-full grid grid-cols-5 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
      {/* 左侧技能图标展示区域 - 占据3列 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        className="col-span-3 flex items-center justify-center relative"
      >
        {/* 技能图标轨道 */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
          {/* 内圈轨道 */}
          <OrbitingCircles
            radius={60}
            duration={20}
            path={true}
            reverse={false}
            className="absolute"
          >
            {generateIcons()
              .slice(0, 3)
              .map((icon, index) => (
                <div
                  key={`inner-${index}`}
                  className="flex items-center justify-center"
                >
                  {icon}
                </div>
              ))}
          </OrbitingCircles>

          {/* 中圈轨道 */}
          <OrbitingCircles
            radius={120}
            duration={25}
            path={true}
            reverse={true}
            className="absolute"
          >
            {generateIcons()
              .slice(3, 7)
              .map((icon, index) => (
                <div
                  key={`middle-${index}`}
                  className="flex items-center justify-center"
                >
                  {icon}
                </div>
              ))}
          </OrbitingCircles>

          {/* 外圈轨道 */}
          <OrbitingCircles
            radius={180}
            duration={30}
            path={true}
            reverse={false}
            className="absolute"
          >
            {generateIcons()
              .slice(7)
              .map((icon, index) => (
                <div
                  key={`outer-${index}`}
                  className="flex items-center justify-center"
                >
                  {icon}
                </div>
              ))}
          </OrbitingCircles>
        </div>
      </motion.div>

      {/* 右侧内容区域 - 占据2列 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="col-span-2 flex flex-col justify-center lg:pl-6"
      >
        {/* 标题和描述 - 现代简约设计 */}
        <div className="mb-9">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl lg:text-3xl font-bold text-foreground mb-4 tracking-wide"
          >
            {cardData?.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm lg:text-base text-muted-foreground leading-relaxed max-w-xs opacity-80"
          >
            {cardData?.description}
          </motion.p>
        </div>

        {/* 技能标签展示 - 现代美观样式 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          {/* 技能分组标题 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-1 h-4 bg-gradient-to-b from-primary/60 to-primary/30 rounded-full"></div>
            <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
              {skillsStackLabel}
            </span>
          </motion.div>

          {/* 技能标签 - 现代美观样式，自然排列 */}
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {skills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: (index - 1) * 0.05,
                  type: "spring",
                  stiffness: 200,
                }}
                className="px-3 lg:px-4 py-2 lg:py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SkillLibraryCard;
