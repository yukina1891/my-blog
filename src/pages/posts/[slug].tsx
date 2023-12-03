import fs from "fs";
import matter from "gray-matter";
// import { marked } from 'marked';
// import markdownit from 'markdown-it';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import Image from 'next/image';
import { NextSeo } from "next-seo";
import remarkToc from "remark-toc";
import rehypeSlug from 'rehype-slug';
import remarkPrism from 'remark-prism';
import { createElement, Fragment, useEffect, useState } from 'react';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import PostImage from "@/components/posts/PostImage";
import Link from "next/link";
import { toc } from "mdast-util-toc";

export const getStaticPaths = async () => {
    const files = fs.readdirSync('./src/posts');
    const paths = files.map((filename) => ({
        params: {
            slug: filename.replace(/\.md$/, ''),
        }
    }))
    return {
        paths,
        fallback: false,
    }
}

export const getStaticProps = async (params:any) => {
    const file = fs.readFileSync(`./src/posts/${params.params.slug}.md`, 'utf-8');
    const { data, content } = matter(file);
    const result = await unified()
        .use(remarkParse)
        .use(remarkPrism, {
            plugins: ['line-numbers'],
        })
        .use(remarkToc, {
            heading: '目次',
            tight: true,
        })
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeSlug)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .use(checkAST)
        .process(content);
        return {
            props: {
                frontMatter: data,
                content: result.toString(),
                slug: params.slug,
            } 
            //  props: { frontMatter: data, content } 
        };
}

const toReactNode = (content) => {
    const [Content, setContent] = useState(Fragment);

    useEffect(() => {
      const processor = unified()
        .use(rehypeParse, {
          fragment: true,
        })
        .use(rehypeReact, {
          createElement,
          Fragment,
          components: {
            img: PostImage,
          }
        })
        .processSync(content);
  
      setContent(processor.result);
    }, [content]);
  
    return Content;
}
//     return unified()
//       .use(rehypeParse, {
//         fragment: true,
//       })
//       .use(rehypeReact, {
//         createElement,
//         Fragment,
//       })
//       .processSync(content).result;
//   };

const checkAST = () => {
    return (tree) => {
    visit(tree, (node) => {
        console.log(node);
    });
    };
};

const Post = ( { frontMatter, content, slug } ) => {
    return (
        <>
            <NextSeo
                title={frontMatter.title}
                description={frontMatter.description}
                openGraph={{
                    type: 'website',
                    // TODO: サーバにあげたら更新
                    url: `http:localhost:3000/posts/${slug}`,
                    title: frontMatter.title,
                    description: frontMatter.description,
                    images: [
                        {
                            url: `https://localhost:3000/${frontMatter.image}`,
                            width: 1200,
                            height: 700,
                            alt: frontMatter.title,
                        }
                    ]
                }}
            />
            <div className="prose prose-lg max-w-none">
                <div className="border">
                    <Image
                        src={`/${frontMatter.image}`}
                        alt={frontMatter.title}
                        width={1200}
                        height={700}
                    />
                </div>
                <h1 className="mt-12">{frontMatter.title}</h1>
                <span>{frontMatter.date}</span>
                <div className="space-x-2">
                    {frontMatter.categories.map((category) => (
                        <span key={category}>
                            <Link href={`/categories/${category}`}>{category}</Link>
                        </span>
                    ))}
                </div>
                {toReactNode(content)}
                {/* <div dangerouslySetInnerHTML={{__html: markdownit().render(content)}}></div> */}
                <div dangerouslySetInnerHTML={{__html: content}}></div>
                <div className="grid grid-cols-12">
                    <div className="col-span-9">{toReactNode(content)}</div>
                    <div className="col-span-3">
                    <div
                        className="sticky top-[50px]"
                        dangerouslySetInnerHTML={{ __html: toc }}
                    ></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Post;