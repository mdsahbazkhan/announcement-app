# Shopify Announcement Banner App

A Shopify app built with the MERN stack that allows merchants to create announcements from the Shopify Admin and display them on every page of the storefront using a Theme App Extension.

---

## Features

- Create announcements from the Shopify Admin.
- Save announcements to MongoDB with a timestamp for audit history.
- Sync announcements to Shopify Shop Metafields using the Admin GraphQL API.
- Display announcements on the storefront using a Theme App Embed.
- Updates are reflected on the storefront after refreshing the page (the Theme App Extension reads the metafield at page load time).

---

## Tech Stack

- React + React Router (Shopify CLI v4)
- Node.js
- MongoDB
- Shopify Admin GraphQL API
- Shopify Theme App Extension

---

## Project Flow

```text
Shopify Admin
      │
      ▼
React Form
      │
      ▼
React Router Action
      │
      ├────────► MongoDB (Audit History)
      │
      ▼
Shopify Shop Metafield
(namespace: my_app
 key: announcement)
      │
      ▼
Theme App Extension
      │
      ▼
Storefront Announcement Banner
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/mdsahbazkhan/announcement-app.git
cd announcement-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
MONGODB_URI=your_mongodb_connection_string
```

### 4. Start the development server

```bash
shopify app dev
```

### 5. Deploy the app

```bash
shopify app deploy
```

---

## How It Works

1. Enter an announcement in the Shopify Admin.
2. Click **Save**.
3. The announcement is stored in MongoDB.
4. The backend updates the Shopify Shop Metafield:

   - Namespace: `my_app`
   - Key: `announcement`

5. The Theme App Extension reads the metafield using Liquid.
6. The announcement banner appears on every storefront page.

---

## Folder Structure

```text
announcement-app/
│
├── app/
├── extensions/
├── prisma/
├── public/
├── package.json
├── shopify.app.toml
├── README.md
└── .env
```

---

## Author

**Md Sahbaz Alam**

GitHub: https://github.com/mdsahbazkhan
