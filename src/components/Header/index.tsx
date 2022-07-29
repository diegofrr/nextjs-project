import styles from './styles.module.scss';
import Image from 'next/image';
import logo from '../../../public/images/logo.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FiHome, FiHeart, FiCompass, FiArrowRight } from 'react-icons/fi';

export default function Header() {

    const asPath = useRouter().pathname;

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <a href="/" className={styles.logo}>
                    <Image src={logo} alt='Logo da aplicação' />
                </a>
                <nav>
                    <Link href='/'>
                        <a className={asPath === '/' ? styles.active : ''}>
                            <FiHome size={20} />
                            <span>Home</span>
                        </a>
                    </Link>

                    <Link href='/posts'>
                        <a className={asPath === '/posts' ? styles.active : ''}>
                            <FiCompass size={20}/>
                            <span>Conteúdos</span>
                        </a>
                    </Link>

                    <Link href='/sobre'>
                        <a className={asPath === '/sobre' ? styles.active : ''}>
                            <FiHeart size={20}/>
                            <span>Quem somos?</span>
                        </a>
                    </Link>
                </nav>

                <a className={styles.readyButton} type='button' href="https://sujeitoprogramador.com">
                    <FiArrowRight size={20} color='#FFF' />
                    <span>Começar</span>
                </a>
            </div>
        </header>
    )
};
