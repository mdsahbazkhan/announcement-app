import { useEffect } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";

import { connectDB } from "../db/mongoose.server";
import Announcement from "../models/Announcement";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const shopResponse = await admin.graphql(`
    query {
      shop {
        id
      }
    }
  `);
  const shopData = await shopResponse.json();
  const shopId = shopData.data.shop.id;

  const formData = await request.formData();
  const announcement = formData.get("announcement") as string;

  await connectDB();
  await Announcement.create({ announcement });

  await admin.graphql(
    `#graphql
    mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
        }
        userErrors {
          field
          message
          code
        }
      }
    }`,
    {
      variables: {
        metafields: [
          {
            ownerId: shopId,
            namespace: "my_app",
            key: "announcement",
            type: "single_line_text_field",
            value: announcement,
          },
        ],
      },
    },
  );

  return { success: true };
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const isLoading = ["loading", "submitting"].includes(fetcher.state);

  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show("Announcement saved");
    }
  }, [fetcher.data, shopify]);

  return (
    <s-page heading="Announcement App">
      <fetcher.Form method="post">
        <s-section heading="Announcement Text">
          <s-text-field
            id="announcement"
            name="announcement"
            label="Announcement"
            multiline="4"
            placeholder="Enter your announcement text..."
          />
        </s-section>
        <s-button
          slot="primary-action"
          type="submit"
          {...(isLoading ? { loading: true } : {})}
        >
          Save
        </s-button>
      </fetcher.Form>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
