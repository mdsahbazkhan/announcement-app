import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher } from "react-router";

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

  // Get shop details
  const response = await admin.graphql(`
    query {
      shop {
        id
        name
      }
    }
  `);

  const data = await response.json();
  const shopId = data.data.shop.id;

  const formData = await request.formData();
  const announcement = formData.get("announcement") as string;
  await connectDB();
  await Announcement.create({
    announcement,
  });

  const metafieldResponse = await admin.graphql(
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
    }
    `,
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

  return (
    <s-page heading="Announcement App">
      <fetcher.Form method="post">
        <label htmlFor="announcement">Announcement</label>

        <s-text-field
          id="announcement"
          name="announcement"
          multiline="4"
          placeholder="Enter announcement..."
        />

        <br />
        <br />

        <s-button type="submit">Save</s-button>
      </fetcher.Form>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
