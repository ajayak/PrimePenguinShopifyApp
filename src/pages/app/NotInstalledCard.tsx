import { useState } from "react";
import { Card, TextContainer, Heading, Link, DisplayText, TextStyle, DescriptionList, Loading, CalloutCard } from "@shopify/polaris";

export function NotInstalledCard({ installationSecret }) {
    const [isLoading, setIsLoading] = useState(false);
    const [storeInfo, setStoreInfo] = useState(undefined);
    const [initialFetchComplete, setInitialFetchComplete] = useState(false);

    async function getShopInfo() {
        if (isLoading) return;
        fetch('/api/primepenguin-shop-info', { method: "GET" })
            .then(r => r.json())
            .then(r => {
                setInitialFetchComplete(true);
                setStoreInfo(r);
                setIsLoading(false);
            })
    }

    if (!initialFetchComplete) {
        getShopInfo();
    }

    function getEstimatedTimeToConnect(productCount, orderCount) {
        let total = (productCount * 2) + orderCount;
        if (total <= 50) return 'Less than 1 minute';
        if (total > 50 && total <= 200) return 'Less than 2 minute';
        if (total > 200 && total <= 500) return 'Less than 5 minute';
        return 'Less than 15 minute';
    }

    const terms = <p>
        By clicking <strong>Connect</strong>, you agree to accept Prime Penguin App's{' '}
        <Link url="https://docs.google.com/document/d/e/2PACX-1vSJ3gpmynDnvxM_Aa3bHxdYhElI9ggw7trgiJxeJc6uWvVkkoek2D1k_1DMfWrrkpn_48ppkQoOZtv8/pub?embedded=true">terms and conditions</Link>.
    </p>

    return (
        <>
            {isLoading && <Loading />}

            {isLoading &&
                <CalloutCard
                    title="Loading..."
                    illustration="https://app.primepenguin.com/assets/common/images/app-logo-on-light.svg"
                    primaryAction={{
                        content: 'Know more about Prime Penguin',
                        url: 'https://primepenguin.com/',
                        external: true
                    }}
                >
                    <p>Please wait while we are loading the information.</p>
                </CalloutCard>
            }

            {storeInfo && <>
                <Card
                    title="Steps to connect to Prime Penguin"
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
                                    Select the "Manual" tab.
                                </>
                            },
                            {
                                term: <DisplayText size="small"><TextStyle variation="strong">Step 4</TextStyle></DisplayText>,
                                description: <>
                                    Copy the following "Installation Secret" and paste it in the installation secret input box and hit the save button.<br />
                                    <DisplayText size="small"><TextStyle variation="code">{installationSecret}</TextStyle></DisplayText>
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
