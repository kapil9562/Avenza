// Format number for UI only (INR)
const formatINR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "0";

  return Number(amount).toLocaleString("en-IN");
};

export { formatINR };