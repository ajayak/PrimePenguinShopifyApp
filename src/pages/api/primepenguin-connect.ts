import Shopify from "@lib/shopify";
import { ApiRequest, NextApiResponse } from "@types";
import axios from 'axios';
import * as https from 'https';

export default async function handler(req: ApiRequest, res: NextApiResponse) {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    if (!session) {
        res.status(500);
        return res.send("No shop provided");
    }

    let body = {
        ShopName: session.shop,
        AccessToken: session.accessToken,
        SecurityKey: process.env.SECURITY_KEY
    };

    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    let uri = `${process.env.PRIMEPENGUIN_URI}/api/services/app/shopify/ShopifyNewAppInstallation`;

    await axios.post(uri, body, { httpsAgent: httpsAgent, headers: { 'Content-Type': 'application/json' } });
    return res.status(200).json({ result: "OK" });
}
