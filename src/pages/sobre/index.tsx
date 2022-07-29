import { GetStaticProps } from "next";
import Head from "next/head";
import styles from './styles.module.scss';

import { createClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import Prismic from '@prismicio/client';

import { FaGithub, FaInstagram, FaLink, FaLinkedin } from 'react-icons/fa';

type Content = {
    title: string,
    description: string,
    banner: string,
    instagram: string,
    linkedin: string,
    github: string,
}

interface ContentProps {
    content: Content
}

export default function Sobre({ content }: ContentProps) {
    return (
        <>
            <Head>
                <title>About us</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.containerHeader}>
                    <section className={styles.ctaText}>
                        <h1>{content.title}</h1>
                        <p>{content.description}</p>


                        <a rel="noreferrer" target="_blank" href={content.instagram}>
                            <FaInstagram size={30} />
                        </a>

                        <a rel="noreferrer" target="_blank" href={content.linkedin}>
                            <FaLinkedin size={30} />
                        </a>

                        <a rel="noreferrer" target="_blank" href={content.github}>
                            <FaGithub size={30} />
                        </a>
                    </section>
                    <img src={content.banner} alt={content.title} />

                </div>
            </main>
        </>
    )
};

export const getStaticProps: GetStaticProps = async () => {

    const prismic = createClient();

    const response = await prismic.getByType('about');

    const {
        title,
        description,
        banner,
        instagram,
        linkedin,
        github
    } = response.results[0].data;

    const content = {
        title: RichText.asText(title),
        description: RichText.asText(description),
        banner: banner.url,
        instagram: instagram.url,
        linkedin: linkedin.url,
        github: github.url
    }

    return {
        props: {
            content
        },
        revalidate: 60 * 15
    }
}
