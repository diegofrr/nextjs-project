import { useState } from "react";
import Head from "next/head";
import styles from './styles.module.scss';
import Link from "next/link";
import Image from "next/image";

import { FiCalendar, FiChevronLeft, FiChevronsLeft, FiChevronRight, FiChevronsRight } from 'react-icons/fi'
import { GetStaticProps } from "next";
import { createClient } from "../../services/prismic";
import { RichText } from "prismic-dom";

type Post = {
    slug: string | null,
    title: string,
    description: string,
    banner: string,
    updatedAt: string,
}

interface PostsProps {
    posts: Post[],
    page: string,
    totalPages: string,
}

export default function Posts({ posts: blogPosts, page, totalPages }: PostsProps) {

    const [posts, setPosts] = useState(blogPosts || []);
    const [currentPage, setCurrentPage] = useState(Number(page))

    async function getNewPosts(pageNumber: number) {
        const prismic = createClient();

        const response = await prismic.getByType('post', {
            page: pageNumber,
            pageSize: 2,
            orderings: {
                field: 'document.last_publication_date',
                direction: "desc",
            },
            fetch: ['post.postTitle', 'post.postDescription', 'post.postImage']
        });

        return response;
    }

    async function navigatePage(pageNumber: number) {
        const response = await getNewPosts(pageNumber);

        if (response.results.length === 0) return;

        const getPosts = response.results.map(post => {
            return {
                slug: post.uid,
                title: RichText.asText(post.data.postTitle),
                description: post.data.postDescription.find((content: { type: string; }) => content.type === 'paragraph')?.text ?? '',
                banner: post.data.postImage.url,
                updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: "long",
                    year: "numeric"
                }),
            }
        });

        setCurrentPage(pageNumber);
        setPosts(getPosts);
    }

    return (
        <>
            <Head>
                <title>Explorer</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>

                    {posts.map(post => (
                        <Link key={post.slug} href={`/posts/${post.slug}`}>
                            <a key={post.slug} className={styles.postContent}>
                                <Image
                                    src={post.banner}
                                    alt={post.title}
                                    quality={100}
                                    width={720}
                                    height={410}
                                    placeholder='blur'
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mM0/g8AAWsBNAUUB5MAAAAASUVORK5CYII="
                                />
                                <div>
                                    <strong>{post.title}</strong>
                                    <time><FiCalendar />{post.updatedAt}</time>
                                    <p>
                                        {post.description}
                                    </p>
                                </div>
                            </a>
                        </Link>
                    ))}

                    <div className={styles.buttonNavigate}>
                        {Number(currentPage) > 1 && (
                            <div>
                                <button onClick={() => navigatePage(1)}>
                                    <FiChevronsLeft size={20} color='#FFF' />
                                </button>
                                <button onClick={() => navigatePage(Number(currentPage - 1))}>
                                    <FiChevronLeft size={20} color='#FFF' />
                                </button>
                            </div>
                        )}

                        <span className={styles.pagination}>
                            {`Página ${currentPage} de ${totalPages}`}
                        </span>

                        {Number(currentPage) < Number(totalPages) && (
                            <div>
                                <button onClick={() => navigatePage(Number(currentPage + 1))}>
                                    <FiChevronRight size={20} color='#FFF' />
                                </button>
                                <button onClick={() => navigatePage(Number(totalPages))}>
                                    <FiChevronsRight size={20} color='#FFF' />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
};


export const getStaticProps: GetStaticProps = async ({ params }) => {

    const prismic = createClient();

    const response = await prismic.getByType('post', {
        pageSize: 2,
        orderings: {
            field: 'document.last_publication_date',
            direction: "desc",
        },
        fetch: ['post.postTitle', 'post.postDescription', 'post.postImage']
    })

    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.postTitle),
            description: post.data.postDescription.find((content: { type: string; }) => content.type === 'paragraph')?.text ?? '',
            banner: post.data.postImage.url,
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: "long",
                year: "numeric"
            }),
        }
    })

    return {
        props: {
            posts,
            page: response.page,
            totalPages: response.total_pages,
        },
        revalidate: 60 * 30 // atualiza a cada 30 minutos
    }
}