export const getConfig = () => {
  const mneomic = process.env.LBRTS_MNEMOIC as string;
  const provider = process.env.LBRTS_PROVIDER as string;
  const network = process.env.LBRTS_NETWORK as string;

  if (!mneomic) throw new Error("`LBRTS_MNEMOIC` is not configured");
  if (!provider) throw new Error("`LBRTS_PROVIDER` is not configured");
  if (!network) throw new Error("`LBRTS_NETWORK` is not configured");

  return {
    mneomic,
    provider,
    network,
  };
};
