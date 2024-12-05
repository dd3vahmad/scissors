interface Config {
  server_base_url: string;
}

const config: Config = {
  server_base_url:
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_SERVER_URL
      : import.meta.env.VITE_PROD_SERVER_URL,
};

export default config;
