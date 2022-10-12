import { useState } from "react";
import axios from 'axios';
import '@shopify/polaris/build/esm/styles.css';
import { AppProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import { Loading, Frame, CalloutCard, Link, Page } from "@shopify/polaris";
import NotInstalledCard from './NotInstalledCard';

const IS =
{
    Installed: 0,
    Installing: 1,
    UnInstalling: 2,
    Uninstalled: 3,
    Invalid: 100,
    NotInstalled: 101
}

export default function AppHome() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingInstallationStatus, setIsLoadingInstallationStatus] = useState(false);
    const [status, setStatus] = useState(undefined);
    const [connectionCallMade, setConnectionCallMade] = useState(false);
    const [initialFetchComplete, setInitialFetchComplete] = useState(false);

    const connectPrimePenguinApp = () => {
        if (connectionCallMade) return;
        setConnectionCallMade(true);
        axios.get('/api/primepenguin-connect')
            .then(r => {
                console.log('Connection complete');
                getInstallationStatus();
            })
    }

    const getInstallationStatus = () => {
        if (isLoadingInstallationStatus) return;
        setIsLoadingInstallationStatus(true);
        axios.get('/api/primepenguin-installation-status')
            .then(r => {
                if (!connectionCallMade && r && (
                    r.data.salesChannelInstallationStatus === IS.Invalid ||
                    r.data.salesChannelInstallationStatus === IS.Uninstalled
                )) {
                    connectPrimePenguinApp();
                }
                setInitialFetchComplete(true);
                setIsLoadingInstallationStatus(false);
                setStatus(r.data);
                setIsLoading(false);
            })
    }

    if (!initialFetchComplete) {
        setTimeout(() => getInstallationStatus(), 500);
    }

    return (
        <AppProvider i18n={translations}>
            <Page>
                <Frame>
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

                    {!isLoading && status && status.salesChannelInstallationStatus === IS.NotInstalled &&
                        <>
                            <NotInstalledCard installationSecret={status.installationSecret}></NotInstalledCard>
                            <CalloutCard
                                title="Installation Status - Not Connected"
                                illustration="https://app.primepenguin.com/assets/common/images/app-logo-on-light.svg"
                                primaryAction={{
                                    content: 'Check Connection Status',
                                    onAction: getInstallationStatus
                                }}
                            >
                                <p>
                                    Click on the button to check the connection status
                                </p>
                            </CalloutCard>
                        </>
                    }

                    {!isLoading && status && status.salesChannelInstallationStatus === IS.Installed &&
                        <CalloutCard
                            title="Connected"
                            illustration="https://app.primepenguin.com/assets/common/images/app-logo-on-light.svg"
                            primaryAction={{
                                content: 'Visit Prime Penguin',
                                url: 'https://app.primepenguin.com/',
                            }}
                        >
                            <p>
                                Hurray Your store is connected to Prime Penguin <br />
                                Visit <Link url="https://app.primepenguin.com/">https://app.primepenguin.com/</Link> to experience full set of features offered by Prime Penguin.
                            </p>
                        </CalloutCard>
                    }

                    {!isLoading && status && status.salesChannelInstallationStatus === IS.Installing &&
                        <CalloutCard
                            title="Installing..."
                            illustration="https://app.primepenguin.com/assets/common/images/app-logo-on-light.svg"
                            primaryAction={{
                                content: 'Visit Prime Penguin',
                                url: 'https://app.primepenguin.com/',
                            }}
                        >
                            <p>
                                Please wait while we connect your store to Prime Penguin. <br />
                                Visit <Link url="https://app.primepenguin.com/">https://app.primepenguin.com/</Link> to experience full set of features offered by Prime Penguin.
                            </p>
                        </CalloutCard>
                    }

                    {!isLoading && status && status.salesChannelInstallationStatus === IS.Invalid &&
                        <CalloutCard
                            title="Invalid..."
                            illustration="https://app.primepenguin.com/assets/common/images/app-logo-on-light.svg"
                            primaryAction={{
                                content: 'Visit Prime Penguin',
                                url: 'https://app.primepenguin.com/',
                            }}
                        >
                            <p>
                                Something went wrong. <br />
                                Please contact Prime Penguin support.
                            </p>
                        </CalloutCard>
                    }
                </Frame>
            </Page>
        </AppProvider>
    )
}
