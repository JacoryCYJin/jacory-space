/**
 * 可复用的页面标题和描述组件
 * 作者：JacoryJin
 * 
 * 功能：为各个预览组件提供统一的标题和描述样式
 * 特性：支持渐变标题、预设尺寸、响应式设计
 */
"use client";

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
 * @returns {JSX.Element} 页面标题组件
 */
const SectionHeader = ({ 
  title, 
  description, 
  size = "large",
  titleClassName = "", 
  descriptionClassName = "", 
  containerClassName = "",
  useGradient = true 
}) => {
  // 预设尺寸配置
  const sizePresets = {
    large: {
      title: "text-4xl",
      description: "text-lg",
      container: "space-y-6 mb-16"
    },
    medium: {
      title: "text-3xl",
      description: "text-base",
      container: "space-y-4 mb-8"
    },
    small: {
      title: "text-2xl",
      description: "text-sm",
      container: "space-y-3 mb-6"
    }
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

  return (
    <div className={`${baseContainerClass} ${containerClassName}`}>
      <div className="relative">
        <h3 className={`${baseTitleClass} ${titleClassName}`}>
          {title}
        </h3>
      </div>
      {description && (
        <p className={`${baseDescriptionClass} ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
