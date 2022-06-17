export const parseArgs = () => {
  const args = [...process.argv];
  args.splice(0, 3);
  return args;
};
