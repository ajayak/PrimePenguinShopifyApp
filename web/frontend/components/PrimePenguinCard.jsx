import { useState } from "react";
import { Loading, Frame, CalloutCard, Link, TextStyle } from "@shopify/polaris";
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
  const [isConnectingApp, setIsConnecting] = useState(true);
  const fetch = useAuthenticatedFetch();

  const {
    isLoading: isConnecting
  } = useAppQuery({
    url: "/api/primepenguin/connect",
    reactQueryOptions: {
      onSuccess: () => {
        setIsConnecting(false);
      },
    },
  });

  const {
    data: status,
    refetch: refetchInstallationStatus,
    isLoading: isLoadingStatus,
    isRefetching: isRefetching,
  } = useAppQuery({
    url: "/api/primepenguin/installationStatus",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  function shouldFetchInstallationStatus() {
    if (!status) return false;
    let s = status.salesChannelInstallationStatus;
    if ((s === installationStatus.Installing || s === installationStatus.NotInstalled || s === installationStatus.Invalid) && !isRefetching && !isLoadingStatus) {
      return true;
    }
    return false;
  }

  if (shouldFetchInstallationStatus()) {
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

      {!isLoading && status && status.salesChannelInstallationStatus === installationStatus.NotInstalled &&
        <NotInstalledCard installationSecret={status.installationSecret}></NotInstalledCard>
      }

      {!isLoading && status && status.salesChannelInstallationStatus === installationStatus.Installed &&
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

      {!isLoading && status && status.salesChannelInstallationStatus === installationStatus.Installing &&
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
    </Frame>
  );
}
