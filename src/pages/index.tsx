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
        <title>Home</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.section}>
            <h1>{content.title}</h1>
            <span>
              {content.subTitle}
            </span>

            <a href={content.linkAction}>
              <button>Get Started!</button>
            </a>

          </section>
          <img
            src="/images/banner-conteudos.png"
            alt="Lorem ipsum" />
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
          <img src={content.webBanner} alt="Lorem ipsum" />
          <section>
            <h2>{content.webTitle}</h2>
            <span>
              {content.webContent}
            </span>
          </section>
        </div>

        <div className={styles.nextLevelContent}>
          <h2>
          Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs
          </h2>
          <span>Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text.</span>

          <a href={content.linkAction}>
            <button>Lorem Ipsum!</button>
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