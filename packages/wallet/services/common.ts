import { ethers } from "ethers";

export const formatFiat = (value: number | string, currency = "$") => {
  return currency + formatCurrency(value);
};

export const formatPercent = (value: number) => {
  return (value * 100).toFixed(2) + "%";
};

export const formatCurrency = (value: number | string) => {
  let _value = value;
  if (typeof _value === "number") _value = _value.toFixed(2);
  _value = ethers.utils.commify(_value.toString());
  return _value;
};
