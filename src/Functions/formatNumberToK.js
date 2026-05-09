const formatNumberToK = (number) => {
  if (number >= 1000000000000) return (number / 1000000000000).toFixed(0) + "T";
  if (number >= 1000000000) return (number / 1000000000).toFixed(0) + "B";
  if (number >= 1000000) return (number / 1000000).toFixed(0) + "M";
  if (number >= 1000) return (number / 1000).toFixed(0) + "K";

  return number;
};
export default formatNumberToK;
