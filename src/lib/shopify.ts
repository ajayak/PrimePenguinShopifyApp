import Shopify, {ApiVersion} from "@shopify/shopify-api";
import SessionStorage from "./sessionStorage";

Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY,
    SCOPES: process.env.SCOPES.split(','),
    HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
    IS_EMBEDDED_APP: false,
    API_VERSION: ApiVersion.October22,
    SESSION_STORAGE: SessionStorage
})

export default Shopify