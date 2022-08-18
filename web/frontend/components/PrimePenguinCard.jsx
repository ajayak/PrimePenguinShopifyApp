import { useState } from "react";
import { Card, TextContainer, Loading, Frame, CalloutCard, Link, List } from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

const installationStatus =
{
  Installed: 0,
  Installing: 1,
  UnInstalling: 2,
  Uninstalled: 3,
  Invalid: 100,
  NotInstalled: 101
}

export function PrimePenguinCard() {
  const [isLoading, setIsLoading] = useState(true);
  const fetch = useAuthenticatedFetch();

  const {
    data: status,
    refetch: refetchInstallationStatus,
    isLoading: isLoadingStatus,
    isRefetching: isRefetching,
  } = useAppQuery({
    url: "/api/auth/installationStatus",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const { data: storeInfo } = useAppQuery({ url: "/api/auth/info" });

  if (status === installationStatus.Installing && !isRefetching && !isLoadingStatus) {
    setTimeout(() => {
      refetchInstallationStatus();
    }, 5000);
  }

  return (
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

      {!isLoading && status === installationStatus.NotInstalled &&
        <Card
          title="Not Connected"
          sectioned
        >
          <TextContainer spacing="loose">
            {storeInfo && <p>
              Your store is not connected to <Link url="https://app.primepenguin.com/">Prime Penguin</Link> yet. <br />
              Please follow the instructions below to link your Shopify store to Prime Penguin: <br />
              <List type="bullet">
                <List.Item>Login at <Link url="https://app.primepenguin.com/">https://app.primepenguin.com/</Link></List.Item>
                <List.Item>Go to Integration &gt; Sales Channel page and click on "Connect" button under Shopify</List.Item>
                <List.Item>Select Manual Installation tab</List.Item>
                <List.Item>Enter Shop name - <b>{storeInfo.shop.replace('.myshopify.com', '')}</b></List.Item>
                <List.Item>Enter Access Token - <b>{storeInfo.token}</b></List.Item>
                <List.Item>Click on the save button and your store will be connected.</List.Item>
              </List>

              <br />
              <p>
                For any assistance, please write to <b>support@primepenguin.com</b>
              </p>
            </p>}
          </TextContainer>
        </Card>
      }

      {!isLoading && status === installationStatus.Installed &&
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

      {!isLoading && status === installationStatus.Installing &&
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

      {!isLoading && (status === installationStatus.UnInstalling || status === installationStatus.Uninstalled || status === installationStatus.Invalid) &&
        <CalloutCard
          title="Uh Oh!"
          illustration="https://app.primepenguin.com/assets/common/images/app-logo-on-light.svg"
          primaryAction={{
            content: 'Visit Prime Penguin',
            url: 'https://app.primepenguin.com/',
          }}
        >
          <p>
            There appears to be some problem with the connection to Prime Penguin. <br />
            Don't worry, we get you covered! <br />
            Please write to <b>support@primepenguin.com</b> to get the issue resolved ASAP.
          </p>
        </CalloutCard>
      }

    </Frame>
  );
}
