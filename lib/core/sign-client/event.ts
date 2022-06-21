export const toDateCreated = (id: number) => {
  const timestamp = Math.round(id / 1000);
  return new Date(timestamp);
};
