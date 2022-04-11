import Head from 'next/head';
import { PrismicText, PrismicRichText } from '@prismicio/react'
import { createClient } from '../../services/prismicio'
import styles from './styles.module.scss'

export default function Post({ page }) {

    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href="">
                        <time>28 de março de 2022</time>
                        <strong><PrismicText field={page.data} /></strong>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum possimus excepturi iste sequi accusamus similique placeat commodi pariatur eius assumend.</p>
                    </a>
                    <a href="">
                        <time>28 de março de 2022</time>
                        <strong>Creating a API with Fastapi and Docker containers</strong>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum possimus excepturi iste sequi accusamus similique placeat commodi pariatur eius assumend.</p>
                    </a>                
                    <a href="">
                        <time>28 de março de 2022</time>
                        <strong>Creating a API with Fastapi and Docker containers</strong>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum possimus excepturi iste sequi accusamus similique placeat commodi pariatur eius assumend.</p>
                    </a>
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
    console.log(JSON.stringify(page, space=2))
    // Pass the homepage as prop to our page.
    return {
      props: { page },
    }
}