import { useState, useEffect } from "react";
import styles from './styles.module.scss';

import { FiArrowUp } from 'react-icons/fi';

export default function ScrollToTopButton() {

    const [buttonActive, setButtonActive] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
    }, [])

    function handleScroll() {
        if (window.scrollY > 500) setButtonActive(true);
        else setButtonActive(false);
    }

    function handleScrollToTop() {
        window.scrollTo({
            behavior: "smooth",
            top: 0,
        })
    }

    return (
        <button
            style={{ display: buttonActive ? 'block' : 'none' }}
            onClick={handleScrollToTop}
            className={styles.scrollToTopButton}>
            <FiArrowUp size={20} />
        </button>
    )
};
