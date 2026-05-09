import CapitalizeWords from "./CapitalizeWords";

const formatName = (fullName) => {
  //Removing leading and trailing spaces
  const name = fullName.trim().replace(/\s+/g, " ");

  const parts = name.split(" ");

  //if only first and last name (or one name),return the name
  if (parts.length <= 2) {
    return CapitalizeWords(name);
  }

  //Keeping first and last name, convert middle name(s) to initials
  return parts
    .map((part, index) => {
      if (index === 0 || index === parts.length - 1) {
        return CapitalizeWords(part); //Keep first and last name
      }

      return part[0].toUpperCase() + "."; //Middle name initials
    })
    .join(" ");
};
export default formatName;
