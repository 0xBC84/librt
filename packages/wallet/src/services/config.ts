export const getConfig = () => {
  const mneomic = process.env.LIBRT_MNEMONIC as string;
  const node = process.env.LIBRT_NODE as string;
  const network = process.env.LIBRT_NETWORK as string;

  if (!mneomic) throw new Error("`LIBRT_MNEMONIC` is not configured");
  if (!node) throw new Error("`LIBRT_NODE` is not configured");
  if (!network) throw new Error("`LIBRT_NETWORK` is not configured");

  return {
    mneomic,
    node,
    network,
  };
};
