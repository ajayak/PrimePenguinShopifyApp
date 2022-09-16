// @ts-check
import { join } from "path";
import fs from "fs";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import fetch from 'node-fetch';
import * as https from 'https';

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import { AppInstallations } from "./app_installations.js";

const USE_ONLINE_TOKENS = false;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";
const SECURITY_KEY = 'Q*MKZZNnUjV7rFbFohQh5S*cGAr@bnW%';

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

const DB_PATH = `${process.cwd()}/database.sqlite`;

// let scopes = [
//   // "read_all_orders",
//   "read_orders",
//   "read_customers",
//   "read_products",
//   "write_orders",
//   "write_products",
//   "read_fulfillments",
//   "read_inventory",
//   "read_shipping",
//   "write_fulfillments",
//   "write_inventory",
//   "read_locations",
//   "read_merchant_managed_fulfillment_orders",
//   "write_merchant_managed_fulfillment_orders"
// ];

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES,
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
  HOST_SCHEME: process.env.HOST.split("://")[0],
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH),
});

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/api/webhooks",
  webhookHandler: async (_topic, shop, _body) => {
    await AppInstallations.delete(shop);
  },
});

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const BILLING_SETTINGS = {
  required: false,
  // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  // chargeName: "My Shopify One-Time Charge",
  // amount: 5.0,
  // currencyCode: "USD",
  // interval: BillingInterval.OneTime,
};

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  billingSettings = BILLING_SETTINGS
) {
  const app = express();
  app.disable('etag');
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app, {
    billing: billingSettings,
  });

  // Do not call app.use(express.json()) before processing webhooks with
  // Shopify.Webhooks.Registry.process().
  // See https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers
  // for more details.
  app.post("/api/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (e) {
      console.log(`Failed to process webhook: ${e.message}`);
      if (!res.headersSent) {
        res.status(500).send(e.message);
      }
    }
  });

  // All endpoints after this point will require an active session
  app.use(
    "/api/*",
    verifyRequest(app, {
      billing: billingSettings,
    })
  );

  app.get("/api/shop/info", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    if (!session) {
      res.status(500);
      return res.send("No shop provided");
    }

    var weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { Product, Order } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    const product = await Product.count({ session });
    const order = await Order.count({ session, status: 'any', created_at_min: weekAgo.toISOString() });

    let result = {
      productCount: product.count,
      orderCount: order.count
    };
    res.status(200).json(result);
  });

  app.get("/api/primepenguin/installationStatus", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    if (!session) {
      res.status(500);
      return res.send("No shop provided");
    }

    let shop = session.shop.replace('.myshopify.com', '');
    let uri = `https://service.primepenguin.com/api/services/app/shopify/GetShopifyInstallationStatus?shop=${shop}&securityKey=${SECURITY_KEY}`;
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    let response = await fetch(uri, { method: 'GET', agent: httpsAgent });
    let data = await response.json();
    res.status(200).json(data.result);
  });

  app.get("/api/primepenguin/connect", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, app.get("use-online-tokens"));
    if (!session) {
      res.status(500);
      return res.send("No shop provided");
    }

    let body = {
      ShopName: session.shop,
      AccessToken: session.accessToken,
      SecurityKey: SECURITY_KEY
    };

    let uri = `https://service.primepenguin.com/api/services/app/shopify/ShopifyNewAppInstallation`;
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    await fetch(uri, {
      method: 'POST', agent: httpsAgent,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(200).json({ result: "OK" });
  });

  // All endpoints after this point will have access to a request.body
  // attribute, as a result of the express.json() middleware
  app.use(express.json());

  app.use((req, res, next) => {
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${encodeURIComponent(
          shop
        )} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  if (isProd) {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    app.use(compression());
    app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
  }

  app.use("/*", async (req, res, next) => {
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    if (!shop) {
      res.status(500);
      return res.send("No shop provided");
    }

    const appInstalled = await AppInstallations.includes(shop);

    if (shop && !appInstalled) {
      res.redirect(`/api/auth?shop=${encodeURIComponent(shop)}`);
    } else {
      const fs = await import("fs");
      const fallbackFile = join(
        isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
        "index.html"
      );
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(fallbackFile));
    }
  });

  return { app };
}

createServer().then(({ app }) => app.listen(PORT));
