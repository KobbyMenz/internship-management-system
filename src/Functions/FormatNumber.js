const FormatNumber = (number) => {
  const formatter = new Intl.NumberFormat("en-GB");
  return formatter.format(number);
};
export default FormatNumber;
