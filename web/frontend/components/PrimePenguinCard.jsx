import { useState } from "react";
import { Card, TextContainer, Loading, Frame, CalloutCard, Link, TextStyle } from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { NotInstalledCard } from './NotInstalledCard';

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
        <NotInstalledCard></NotInstalledCard>
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
            Please write to <TextStyle variation="strong">support@primepenguin.com</TextStyle> to get the issue resolved ASAP.
          </p>
        </CalloutCard>
      }

    </Frame>
  );
}
