"use client";

import styles from "./animated-logo.module.scss";

interface AnimatedLogoProps {
    className?: string;
    title?: string;
}

export function AnimatedLogo({ className, title = "Rowell Blanca" }: AnimatedLogoProps) {
    return (
        <svg
            className={`${styles.mark} ${className ?? ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="60 87 260 260"
            role="img"
            aria-label={title}
        >
            <path
                className={styles.dot}
                d="M161.311,216.967a8.636,8.636,0,1,1-8.631,8.636A8.635,8.635,0,0,1,161.311,216.967Z"
            />
            <path
                className={styles.monogram}
                d="M128.019,140.478h83.848c23.926,5.9,39.6,28.518,36.991,51.815-2.384,21.306-19.6,38.964-41.924,41.946L278.451,313.2h12.33V115.8H88.562V315.663h46.857a8.786,8.786,0,0,1,2.466,4.935,9.029,9.029,0,0,1-2.466,7.4H76.231V105.935a3.671,3.671,0,0,1,0-2.468c0.61-1.581,2.544-2.7,4.932-2.467H298.18l2.466,2.467,2.466,2.468v217.13L298.18,328H273.519l-91.246-98.7a7.854,7.854,0,0,1,0-4.934,8.065,8.065,0,0,1,4.933-4.935H216.8c15.583-6.151,24.561-21.859,22.194-37.011-1.962-12.567-11.509-23.3-24.661-27.141H137.884a9.43,9.43,0,0,1-9.865-2.468A9.609,9.609,0,0,1,128.019,140.478Z"
            />
            <path
                className={styles.accent}
                d="M128.553,170.087h8.8a3,3,0,0,1,3,3V283.054a3,3,0,0,1-3,3h-8.8a3,3,0,0,1-3-3V173.087A3,3,0,0,1,128.553,170.087Z"
            />
        </svg>
    );
}
