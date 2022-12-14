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

    let shop = session.shop.replace('.myshopify.com', '');
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    let uri = `${process.env.PRIMEPENGUIN_URI}/api/services/app/shopify/GetShopifyInstallationStatus?shop=${shop}&securityKey=${process.env.SECURITY_KEY}`;
    let response = await axios.get(uri, { httpsAgent: httpsAgent });
    res.status(200).json(response.data['result']);
}
