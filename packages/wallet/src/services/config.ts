export const getConfig = () => {
  const mneomic = process.env.LIBRT_MNEMOIC as string;
  const provider = process.env.LIBRT_PROVIDER as string;
  const network = process.env.LIBRT_NETWORK as string;

  if (!mneomic) throw new Error("`LIBRT_MNEMOIC` is not configured");
  if (!provider) throw new Error("`LIBRT_PROVIDER` is not configured");
  if (!network) throw new Error("`LIBRT_NETWORK` is not configured");

  return {
    mneomic,
    provider,
    network,
  };
};
