const currencyFormatter = (value, currency = "GHS", locale = "en-GH") => {
  // Handle null/undefined/empty
  if (value === null || value === undefined || value === "") return "";

  // Convert incoming value to a Number safely
  let numValue;
  if (typeof value === "number") {
    numValue = value;
  } else if (typeof value === "string") {
    // Remove common thousands separators and whitespace
    const cleaned = value.includes(",")
      ? value.replace(/,/g, "")
      : value.trim();

    numValue = parseFloat(cleaned);

    if (Number.isNaN(numValue)) {
      // Try a more aggressive cleanup (remove any non-numeric except dot/minus)
      const cleaned2 = cleaned.replace(/[^0-9.-]+/g, "");
      numValue = parseFloat(cleaned2);
    }

    if (Number.isNaN(numValue)) {
      // If still invalid, return original value so caller can decide
      return value;
    }
  } else {
    // Try coercion for other types (e.g. BigInt)
    numValue = Number(value);
    if (Number.isNaN(numValue)) return value;
  }

  const getCurrencyAndLocale = () => {
    let cur =
      typeof currency === "string" ? currency.toUpperCase() : String(currency);
    let loc = locale;

    switch (cur) {
      case "GHS":
        loc = "en-GH";
        break;
      case "GBP":
        loc = "en-GB";
        break;
      case "USD":
        loc = "en-US";
        break;
      case "EUR":
        loc = "de-DE";
        break;
      case "NGN":
        loc = "en-NG";
        break;
      default:
        // keep provided locale or fallback to en-GH
        if (!cur || typeof cur !== "string" || cur.length !== 3) {
          cur = "GHS";
          loc = "en-GH";
        }
        break;
    }

    return { currency: cur, locale: loc };
  };

  try {
    const { currency: cur, locale: loc } = getCurrencyAndLocale();
    const option = {
      style: "currency",
      currency: cur,
      currencyDisplay: "symbol",
    };

    return new Intl.NumberFormat(loc, option).format(numValue);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return String(numValue);
  }
};

export default currencyFormatter;
