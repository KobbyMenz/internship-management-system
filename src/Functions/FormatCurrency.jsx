//============= FORMAT CURRENCY ================
import { useEffect, useState } from "react";
import axios from "axios";

const FormatCurrency = (value) => {
  const [currencyData, setCurrencyData] = useState({});

  useEffect(() => {
    const getSettings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/getSettings`
        );

        setCurrencyData({
          preferredCurrency: response.data?.preferredCurrency || "GHS",
        });
      } catch (err) {
        console.log(err);
      }
    };
    getSettings();
  }, []);

  // console.log("Currency: ", currencyData);
  let locale;

  const currency = currencyData.preferredCurrency
    ? currencyData.preferredCurrency
    : "GHS";

  if (currency === "GHS") {
    locale = "en-GH";
  } else if (currency === "GBP") {
    locale = "en-GB";
  } else if (currency === "USD") {
    locale = "en-US";
  } else if (currency === "EUR") {
    locale = "de-DE";
  } else if (currency === "NGN") {
    locale = "en-NG";
  }

  const option = {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  };

  try {
    return new Intl.NumberFormat(locale, option).format(value);
  } catch (err) {
    console.error(err);
    return value;
  }
};
export default FormatCurrency;
