import { ethers } from "ethers";

export const formatFiat = (value: number | string, currency = "$") => {
  return currency + formatCurrency(value);
};

export const formatPercent = (value: number) => {
  return (value * 100).toFixed(2) + "%";
};

export const truncateAddress = (address: string) => {
  const last = address.length - 1;
  const front = address.slice(0, 5);
  const back = address.substring(last - 3, last);
  return front + "..." + back;
};

export const formatCurrency = (value: number | string) => {
  let _value = value;
  if (typeof _value === "number") _value = _value.toFixed(2);
  _value = ethers.utils.commify(_value.toString());
  return _value;
};
