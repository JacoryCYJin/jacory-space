import { NextResponse } from 'next/server';

// 生成测试用的博客文章数据
const generateTestPosts = () => {
  const posts = [];
  const categories = ['tech', 'frontend', 'backend', 'ai', 'life', 'learning', 'coffee'];
  const tags = ['react', 'nextjs', 'javascript', 'typescript', 'css', 'tailwind', 'nodejs', 'python', 'tutorial', 'experience', 'coffee', 'mindset', 'growth', 'lifestyle', 'minimalism', 'reading', 'digital-wellness'];
  
  for (let i = 1; i <= 50; i++) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1);
    
    posts.push({
      slug: `test-article-${i}`,
      title: `测试文章 ${i} - 这是一个用于测试分页功能的示例文章标题`,
      excerpt: `这是测试文章 ${i} 的摘要内容。这篇文章主要用于测试博客系统的分页功能，包括文章列表显示、分页导航、筛选功能等。`,
      content: `# 测试文章 ${i}

这是测试文章 ${i} 的完整内容。

## 章节 1

这是一个测试章节，用于验证文章内容的显示效果。

## 章节 2

另一个测试章节，包含一些示例内容：

- 列表项 1
- 列表项 2
- 列表项 3

## 代码示例

\`\`\`javascript
console.log('Hello from test article ${i}');
\`\`\`

## 总结

这是测试文章 ${i} 的总结部分。`,
      category: randomCategory,
      tags: randomTags,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: `${Math.floor(Math.random() * 10) + 3} 分钟`,
      author: '测试作者',
      cover: null
    });
  }
  
  // 按日期排序，最新的在前面
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export async function GET() {
  try {
    const posts = generateTestPosts();
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error generating test posts:', error);
    return NextResponse.json(
      { error: 'Failed to generate test posts' },
      { status: 500 }
    );
  }
}
