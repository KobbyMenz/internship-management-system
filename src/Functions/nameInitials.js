export default function nameInitials(fullName) {
  if (!fullName) {
    return "";
  } else {
    return fullName
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  }
}
