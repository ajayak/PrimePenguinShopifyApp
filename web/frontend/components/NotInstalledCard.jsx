import { Card, TextContainer, Heading, Link, List, DisplayText, TextStyle } from "@shopify/polaris";
import { useAppQuery } from "../hooks";

export function NotInstalledCard() {
    const { data: storeInfo } = useAppQuery({ url: "/api/auth/info" });

    function getEstimatedTimeToConnect(productCount, orderCount) {
        let total = (productCount * 2) + orderCount;
        if (total <= 50) return 'Less than 1 minute';
        if (total > 50 && total <= 200) return 'Less than 2 minute';
        if (total > 200 && total <= 500) return 'Less than 5 minute';
        return 'Less than 15 minute';
    }

    return (
        <>
            <Card
                title="Not Connected"
                sectioned
            >
                <TextContainer spacing="loose">
                    {storeInfo && <>
                        <p>
                            Your store is not connected to <Link url="https://app.primepenguin.com/">Prime Penguin</Link> yet. <br />
                            Please follow the instructions below to link your Shopify store to Prime Penguin: <br />
                        </p>
                        <List type="bullet">
                            <List.Item>Login at <Link url="https://app.primepenguin.com/">https://app.primepenguin.com/</Link></List.Item>
                            <List.Item>Go to Integration &gt; Sales Channel page and click on "Connect" button under Shopify</List.Item>
                            <List.Item>Select Manual Installation tab</List.Item>
                            <List.Item>Enter Shop name - <TextStyle variation="strong">{storeInfo.shop.replace('.myshopify.com', '')}</TextStyle></List.Item>
                            <List.Item>Enter Access Token - <TextStyle variation="strong">{storeInfo.token}</TextStyle></List.Item>
                            <List.Item>Click on the save button and your store will be connected.</List.Item>
                        </List>

                        <p>
                            For any assistance, please write to <TextStyle variation="strong">support@primepenguin.com</TextStyle>
                        </p>
                    </>}
                </TextContainer>
            </Card>
            <Card
                title="Estimated Time"
                sectioned
            >
                <TextContainer spacing="loose">
                    {storeInfo && <>
                        <p>
                            Total Products - <TextStyle variation="strong">{storeInfo.productCount}</TextStyle> <br />
                            Total Orders (Past 7 days) - <TextStyle variation="strong">{storeInfo.orderCount}</TextStyle> <br />
                        </p>
                        <Heading element="h4">
                            Estimated time to connect
                            <DisplayText size="medium">
                                <TextStyle variation="strong">
                                    {getEstimatedTimeToConnect(storeInfo.productCount, storeInfo.orderCount)}
                                </TextStyle>
                            </DisplayText>
                        </Heading>
                    </>}
                </TextContainer>
            </Card>
        </>
    );
}
