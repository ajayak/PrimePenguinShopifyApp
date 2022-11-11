import { useState, useEffect } from "react";
import styles from 'src/styles/Login.module.css'

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export default function Login() {
    const [shop, setShop] = useState("");
    let [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        if (!initialLoad) return;
        setInitialLoad(false);
        let shop = getParameterByName('shop');
        if (shop) {
            window.location.href = `/api/auth/offline?shop=${shop}.myshopify.com`;
        }
    });

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Login with your store url</h1>
            <div className={styles.card}>
                <div className={styles.inputContainer}>
                    <input className={styles.input} value={shop} onChange={e => setShop(e.target.value)} />
                    <div className={styles.myShopify}>.myshopify.com</div>
                </div>
                <a href={`/api/auth/offline?shop=${shop}.myshopify.com`}>
                    <button disabled={shop === ""} className={styles.button}>Login</button>
                </a>
            </div>
        </div>
    )
}