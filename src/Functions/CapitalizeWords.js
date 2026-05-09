const CapitalizeWords = (word) => {
  return word
    .split(" ")
    .map(
      (item) =>
        item.charAt(0).toLocaleUpperCase() + item.slice(1).toLocaleLowerCase()
    )
    .join(" ");
};
export default CapitalizeWords;
