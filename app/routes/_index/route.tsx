import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <div className={styles.logo}>📢</div>
        <h1 className={styles.heading}>Shopify Announcement Banner</h1>
        <p className={styles.text}>
          Display custom announcements on your storefront in seconds.
          <br />
          Set it once — your banner updates everywhere.
        </p>

        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span className={styles.labelText}>Shop domain</span>
              <input
                className={styles.input}
                type="text"
                name="shop"
                placeholder="my-shop.myshopify.com"
                autoComplete="off"
              />
            </label>
            <button className={styles.button} type="submit">
              Install App
            </button>
          </Form>
        )}

        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span className={styles.icon}>✏️</span>
            <strong>Write once</strong>
            <span>
              Type your announcement in the Shopify Admin and hit Save.
            </span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.icon}>⚡</span>
            <strong>Instant sync</strong>
            <span>Text is stored in a Shop Metafield via the GraphQL API.</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.icon}>🌐</span>
            <strong>Storefront banner</strong>
            <span>A floating banner appears on every page of your store.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
