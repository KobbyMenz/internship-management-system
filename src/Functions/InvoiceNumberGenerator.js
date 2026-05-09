const InvoiceNumberGenerator = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `${year}${month}${day}${randomNumber}`;
};
export default InvoiceNumberGenerator;
