export default function nameInitials(fullName) {
  // nameInitials.js

  if (!fullName) return "";
  return fullName
    .trim()
    .split(" ")
    .filter(Boolean) // 👈 removes empty strings from extra spaces
    .map((word) => word[0].toUpperCase())
    .join("");
}
