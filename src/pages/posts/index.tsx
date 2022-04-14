import Head from 'next/head';
import Link from 'next/link';
import { PrismicText, PrismicRichText } from '@prismicio/react'
import { createClient } from '../../services/prismicio'
import * as prismicH from '@prismicio/helpers'
import styles from './styles.module.scss'

type Post = {
    slug: string,
    title: string,
    summary: string,
    updatedAt: string
}
interface PostsProps {
    posts: Post[]
}

export default function Post({ posts }: PostsProps) {

    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    { posts.map(post => (
                        <Link href={`/posts/${post.slug}`} key={post.slug}>
                            <a>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.summary}</p>
                            </a>
                        </Link>
                    )) }
                </div>
            </main>
        </>
    );
} 

export async function getStaticProps() {
    // Client used to fetch CMS content.
    const client = createClient()
  
    // Page document for our homepage from the CMS.
    const page = await client.getAllByType('post', {
        pageSize: 100,
        fetch: ['post.title', 'post.content']
    })

    // console.log(JSON.stringify(page, null, 2)) // see result formated

    const posts = page.map(post => {
        return {
            slug: post.uid,
            title: prismicH.asText(post.data.title),
            summary: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })
    // Pass the homepage as prop to our page.
    return {
      props: { posts },
    }
}