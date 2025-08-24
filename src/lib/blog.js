import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogsDirectory = path.join(process.cwd(), 'src/constants/blogs');

// 获取所有博客文章
export function getAllPosts() {
  try {
    // 确保目录存在
    if (!fs.existsSync(blogsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(blogsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        // 移除文件扩展名获取 slug
        const slug = fileName.replace(/\.md$/, '');

        // 读取 markdown 文件内容
        const fullPath = path.join(blogsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // 使用 gray-matter 解析 metadata
        const matterResult = matter(fileContents);

        // 返回文章数据
        return {
          slug,
          content: matterResult.content,
          ...matterResult.data,
        };
      });

    // 按日期排序 (最新的在前)
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

// 根据 slug 获取单篇文章
export function getPostBySlug(slug) {
  try {
    const fullPath = path.join(blogsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      content: matterResult.content,
      ...matterResult.data,
    };
  } catch (error) {
    console.error('Error reading blog post:', error);
    return null;
  }
}

// 获取所有文章的 slug (用于生成静态路径)
export function getAllPostSlugs() {
  try {
    if (!fs.existsSync(blogsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(blogsDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        return {
          params: {
            slug: fileName.replace(/\.md$/, ''),
          },
        };
      });
  } catch (error) {
    console.error('Error getting post slugs:', error);
    return [];
  }
}

// 根据分类筛选文章
export function getPostsByCategory(category) {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.category === category);
}

// 根据标签筛选文章
export function getPostsByTag(tag) {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.tags && post.tags.includes(tag));
}

// 搜索文章
export function searchPosts(query) {
  const allPosts = getAllPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return allPosts.filter(post => 
    post.title?.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt?.toLowerCase().includes(lowercaseQuery) ||
    post.content?.toLowerCase().includes(lowercaseQuery) ||
    post.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
