import styles from 'src/styles/Global.module.css';
import Head from "next/head";
import Link from "next/link";

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Prime Penguin Shopify App</title>
                <meta name="description" content="Prime Penguin Shopify App"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    <a href="https://primepenguin.com/">Prime Penguin</a> Shopify App
                </h1>
                <p className={styles.description}>
                    Start your journey with the Prime Penguin logistics network.
                    <br/>
                    Most of the necessary setup is ready, so you can get going fast!
                </p>
                <Link href={'/login'}>
                    <button
                        className={styles.button}
                        style={{maxWidth: "fit-content", padding: "1rem", fontSize: "1.6rem"}}
                    >
                        Install App / Login
                    </button>
                </Link>
            </main>
        </div>
    )
}