import { GetServerSideProps } from 'next';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import { createClient } from '../../services/prismic';
import Image from 'next/image';
import Head from 'next/head';

interface PostProps {
    post: {
        slug: string,
        title: string,
        description: string,
        banner: string,
        updatedAt: string
    }
}

export default function Post({ post }: PostProps) {

    return (
        <>
            <Head>
                <title>{post.title}</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <Image
                        src={post.banner}
                        alt={post.title}
                        quality={100}
                        width={720}
                        height={410}
                        placeholder='blur'
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM0/g8AAWsBNAUUB5MAAAAASUVORK5CYII="
                    />
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                    className={styles.postContent}
                    dangerouslySetInnerHTML={{__html: post.description}}>
                    </div>
                </article>
            </main>
        </>
    )
};

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {

    const slug = params?.slug;
    const prismic = createClient(req);
    let post = {};

    try {
        const response = await prismic.getByUID('post', String(slug), {})

        post = {
            slug: slug,
            title: RichText.asText(response.data.postTitle),
            description: RichText.asHtml(response.data.postDescription),
            banner: response.data.postImage.url,
            updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            })

        }

    } catch {
        return {
            redirect: {
                destination: '/posts',
                permanent: false,
            }
        }
    }


    return {
        props: {
            post
        }
    }
}
