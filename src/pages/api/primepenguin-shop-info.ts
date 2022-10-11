import Shopify from "@lib/shopify";
import { DataType } from "@shopify/shopify-api";
import { ApiRequest, NextApiResponse } from "@types";

export default async function handler(req: ApiRequest, res: NextApiResponse) {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    if (!session) {
        res.status(500);
        return res.send("No shop provided");
    }

    var weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const productCount = await client.get<any>({
        path: 'products/count.json',
        type: DataType.JSON
    });

    const orderCount = await client.get<any>({
        path: `orders/count.json?created_at_min=${weekAgo.toISOString()}`,
        type: DataType.JSON
    });

    let result = {
        productCount: productCount.body.count,
        orderCount: orderCount.body.count
    };
    return res.status(200).json(result);
}
