import Head from "next/head"
import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/react"
import * as prismicH from '@prismicio/helpers'
import { createClient } from "../../../services/prismicio"

import styles from '../post.module.scss'
import Link from "next/link"
import { useEffect } from "react"
import { Router, useRouter } from "next/router"

interface PostPreviewProps {
    post: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string
    }
}

export default function PostPreview({ post }: PostPreviewProps) {
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`)
        }
        
    }, [session])

    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1> 
                    <time>{post.updatedAt}</time>
                    <div 
                        dangerouslySetInnerHTML={{ __html: post.content}} 
                        className={`${styles.postContent} ${styles.previewContent}`}
                    />
                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href='/'>
                            <a>Subscribe now 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            '/posts/preview/[slug]',
            // { params: { slug: 'javascript-fundamentals-before-learning-react' } },
        ],

        fallback: 'blocking' // (true:) (false: se não tiver static ele retorna 404) (blocking: ele gera na hora server side)
    } // https://nextjs.org/docs/messages/invalid-getstaticpaths-value
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params
    
    const prismic = createClient()

    const response = await prismic.getByUID("post", String(slug), {})

    const post = {
        slug,
        title: prismicH.asText(response.data.title),
        content: prismicH.asHTML(response.data.content.splice(0, 2)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }
    return {
        props: {post},
        revalidate: 60 * 30 // 30 minutes
    }
}