import { Page, Layout } from "@shopify/polaris";
import { PrimePenguinCard } from "../components";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <PrimePenguinCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
