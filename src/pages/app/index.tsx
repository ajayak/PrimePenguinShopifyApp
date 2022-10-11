import Head from 'next/head'
import Image from 'next/image'
import styles from 'src/styles/Home.module.css'
import Link from "next/link";
import { useState } from "react";

const IS =
{
    Installed: 0,
    Installing: 1,
    UnInstalling: 2,
    Uninstalled: 3,
    Invalid: 100,
    NotInstalled: 101
}

export default function AppHome() {
    const [isLoadingStatus, setIsLoadingStatus] = useState(false);
    const [runningInterval, setRunningInterval] = useState(false);
    const [status, setStatus] = useState(undefined);

    async function getInstallationStatus() {
        if (isLoadingStatus) return;
        fetch('/api/primepenguin-installation-status', {
            method: "GET"
        }).then(r => r.text()).then(r => {
            setStatus(r);
            setIsLoadingStatus(false);
        })
    }

    function shouldFetchInstallationStatus() {
        if (!status) return true;
        let s = status.salesChannelInstallationStatus;
        if ((s === IS.Installing || s === IS.NotInstalled || s === IS.Invalid) && !isLoadingStatus) {
            return true;
        }
        return false;
    }

    if (shouldFetchInstallationStatus()) {
        setTimeout(() => {
            setRunningInterval(true);
            getInstallationStatus();
        }, 5000);
    }

    if (!runningInterval) {
        getInstallationStatus();
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Prime Penguin Shopify App</title>
                <meta name="description" content="Prime Penguin Shopify App" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to your <a href="https://nextjs.org">Next.js</a> <a
                        href='https://shopify.dev/apps'>Shopify</a> App!
                </h1>

                <p className={styles.description}>
                    Get started by editing{' '}
                    <code className={styles.code}>pages/app/index.js</code>
                </p>

                <div className={styles.grid}>
                    <Link href="/app/get-data">
                        <div className={styles.card}>
                            <h2>Get Data &rarr;</h2>
                            <p>Fetch data from Shopify&apos;s GraphQL Api or from your own endpoint.</p>
                        </div>
                    </Link>

                    <Link href="/app/subscriptions">
                        <div className={styles.card}>
                            <h2>Manage Billing &rarr;</h2>
                            <p>Subscribe Merchants to recurring plans and view active subscriptions.</p>
                        </div>
                    </Link>

                    <a
                        href="https://nextjs.org/docs"
                        className={styles.card}
                    >
                        <h2>Documentation &rarr;</h2>
                        <p>Find in-depth information about Next.js features and API.</p>
                    </a>

                    <a
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h2>Deploy &rarr;</h2>
                        <p>
                            Instantly deploy your Next.js site to a public URL with Vercel.
                        </p>
                    </a>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div>
    )
}
