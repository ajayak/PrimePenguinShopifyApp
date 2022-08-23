import { Card, TextContainer, Heading, Link, DisplayText, TextStyle, DescriptionList, AccountConnection } from "@shopify/polaris";
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

    const terms = <p>
        By clicking <strong>Connect</strong>, you agree to accept Prime Penguin App's{' '}
        <Link external="true"
            url="https://docs.google.com/document/d/e/2PACX-1vSJ3gpmynDnvxM_Aa3bHxdYhElI9ggw7trgiJxeJc6uWvVkkoek2D1k_1DMfWrrkpn_48ppkQoOZtv8/pub?embedded=true"
        >terms and conditions</Link>.
    </p>

    return (
        <>
            {storeInfo && <>
                <AccountConnection
                    accountName="Prime Penguin"
                    connected="Not connected"
                    title="Prime Penguin"
                    action={{
                        content: "Connect",
                        external: false,
                        url: `https://service.primepenguin.com/api/services/app/shopify/RedirectInstallShopify?shop=${storeInfo.shop}`
                    }}
                    details="Not connected"
                    termsOfService={terms}
                    avatarUrl="https://app.primepenguin.com/assets/common/images/app-logo-on-light.svg"
                />

                <Card
                    title="Alternate way to connect"
                    sectioned
                >
                    <DescriptionList
                        items={[
                            {
                                term: <DisplayText size="small"><TextStyle variation="strong">Step 1</TextStyle></DisplayText>,
                                description: <>
                                    <>
                                        Login at <Link url="https://app.primepenguin.com/">https://app.primepenguin.com/</Link>. <br />
                                        Make sure to set your Company name before entering your Prime Penguin credentials.
                                    </>
                                </>
                            },
                            {
                                term: <DisplayText size="small"><TextStyle variation="strong">Step 2</TextStyle></DisplayText>,
                                description: <>
                                    Go to Integration &gt; Sales Channel page from the left sidebar and click on "Connect" button under Shopify
                                </>
                            },
                            {
                                term: <DisplayText size="small"><TextStyle variation="strong">Step 3</TextStyle></DisplayText>,
                                description: <>
                                    Enter your shop name and click on "Save" button. <br />
                                    Make sure you have SKU assigned for ev every product for the warehouse to identify the product.
                                </>
                            },
                        ]}
                    />
                </Card>

                <Card
                    title={
                        <Heading element="h4">
                            Estimated time to connect
                            <DisplayText size="small">
                                <TextStyle variation="strong">
                                    {getEstimatedTimeToConnect(storeInfo.productCount, storeInfo.orderCount)}
                                </TextStyle>
                            </DisplayText>
                        </Heading>
                    }
                    sectioned
                >
                    <TextContainer spacing="loose">
                        <p>
                            Total Products - <TextStyle variation="strong">{storeInfo.productCount}</TextStyle> <br />
                            Total Orders (Past 7 days) - <TextStyle variation="strong">{storeInfo.orderCount}</TextStyle>
                        </p>
                    </TextContainer>
                </Card>
            </>}
        </>
    );
}
