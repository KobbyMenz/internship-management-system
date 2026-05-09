const parseCurrency = (value) => {
  return value.replace(/[^0-9.-]+/g, ""); //Keep digits, minus, and decimal
};
export default parseCurrency;
