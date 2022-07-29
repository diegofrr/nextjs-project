import Head from "next/head";
import styles from '../styles/home.module.scss';
import Image from "next/image";
import techsImage from '../../public/images/techs.svg';
import ScrollToTopButton from "../components/ScrollToTopButton";
import { GetStaticProps } from "next";
import { createClient } from '../services/prismic';
import { RichText } from 'prismic-dom';

type Content = {
  title: string,
  subTitle: string,
  linkAction: string,
  mobileTitle: string,
  mobileContent: string,
  mobileBanner: string,
  webTitle: string,
  webContent: string,
  webBanner: string,
}

interface ContentProps {
  content: Content,
}

export default function Home({ content } : ContentProps) {
  
  return (
    <>
      <Head>
        <title>Página inicial</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.section}>
            <h1>{content.title}</h1>
            <span>
              {content.subTitle}
            </span>

            <a href={content.linkAction}>
              <button>Começar agora!</button>
            </a>

          </section>
          <img
            src="/images/banner-conteudos.png"
            alt="Banner página Conteúdos" />
        </div>

        <hr className={styles.divisor} />

        <div className={styles.sectionContent}>
          <section>
            <h2>{content.mobileTitle}</h2>
            <span>
              {content.mobileContent}
            </span>
          </section>

          <img src={content.mobileBanner} />
        </div>

        <hr className={styles.divisor} />

        <div className={styles.sectionContent}>
          <img src={content.webBanner} alt="Desenvolvimento de aplicações" />
          <section>
            <h2>{content.webTitle}</h2>
            <span>
              {content.webContent}
            </span>
          </section>
        </div>

        <div className={styles.nextLevelContent}>
          <Image quality={2} src={techsImage} alt="Tecnologias" />

          <h2>
            Mais de <span className={styles.alunos}>15 mil alunos</span> já levaram sua carreira
            para o próximo nível.
          </h2>
          <span>E você, vai perder a chance de evoluir de uma vez por todas?</span>

          <a href={content.linkAction}>
            <button>Começar agora!</button>
          </a>

        </div>

      </main>
      <ScrollToTopButton />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {

  const client = createClient();

  const page = await client.getByUID('home', 'levando-voce-ao-proximo-nivel');

  const {
    title,
    subtitle,
    linkAction,
    mobile,
    mobileContent,
    mobileBanner,
    titleWeb,
    webContent,
    webBanner
  } = page.data

  const content = {
    title: RichText.asText(title),
    subTitle: RichText.asText(subtitle),
    linkAction: linkAction.url,
    mobileTitle: RichText.asText(mobile),
    mobileContent: RichText.asText(mobileContent),
    mobileBanner: mobileBanner.url,
    webTitle: RichText.asText(titleWeb),
    webContent: RichText.asText(webContent),
    webBanner: webBanner.url,
    
  }

  return {
    props: {
      content
    },
    revalidate: 60 * 2 // 2 minutos
  }
}