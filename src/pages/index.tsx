import PostCard from '@/components/posts/PostCard';
import fs from 'fs';
import matter from 'gray-matter';

export const getStaticProps = () => {
  const files = fs.readdirSync('./src/posts');
  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const fileContent = fs.readFileSync(`./src/posts/${filename}`, 'utf-8');
    const { data } = matter(fileContent);
    return {
      frontMatter: data,
      slug,
    }
  });

  const sortedPosts = posts.sort((postA, postB) => new Date(postA.frontMatter.date) > new Date(postB.frontMatter.date) ? -1 : 1)

  return {
    props: {
      posts: sortedPosts,
    }
  };
};

export default function Home({ posts }:any) {
  return (
    <div className="my-8">
      <div className='grid grid-cols-3 gap-4'>
        {posts.map((post:any) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
