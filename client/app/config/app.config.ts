interface ImportMetaEnv {
  readonly VITE_DEV_SERVER_URL: string;
  readonly VITE_PROD_SERVER_URL: string;
  readonly VITE_NODE_ENV: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const config = {
  server_base_url:
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_SERVER_URL
      : import.meta.env.VITE_PROD_SERVER_URL,
};

export default config;
