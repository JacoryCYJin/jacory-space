module.exports = {
  // 箭头函数参数始终使用括号，即使只有一个参数
  arrowParens: "always",
  // 在对象字面量的括号内添加空格，如 { foo: bar }
  bracketSpacing: true,
  // 使用 Unix 风格的换行符 (LF)
  endOfLine: "lf",
  // HTML 空白敏感度根据 CSS display 属性决定
  htmlWhitespaceSensitivity: "css",
  // 不在文件顶部插入 Prettier 格式化标记
  insertPragma: false,
  // JSX 标签的 > 放在下一行，而不是与最后一个属性在同一行
  jsxBracketSameLine: false,
  // 在 JSX 中使用双引号而不是单引号
  jsxSingleQuote: false,
  // 每行代码的最大宽度为 80 个字符
  printWidth: 80,
  // 保持 Markdown 文本原有的换行方式
  proseWrap: "preserve",
  // 对象属性仅在必要时使用引号
  quoteProps: "as-needed",
  // 不要求文件顶部有特殊注释才格式化
  requirePragma: false,
  // 在语句末尾添加分号
  semi: true,
  // 使用单引号而不是双引号，如 'hello' 而不是 "hello"
  singleQuote: true,
  // 缩进使用 2 个空格
  tabWidth: 2,
  // 在 ES5 中有效的多行结构中添加尾随逗号
  trailingComma: "es5",
  // 使用空格而不是制表符进行缩进
  useTabs: false,
  // 不缩进 Vue 文件中的 <script> 和 <style> 标签内容
  vueIndentScriptAndStyle: false,
  // 使用 babel 解析器来解析 JavaScript 代码
  parser: "babel"
};