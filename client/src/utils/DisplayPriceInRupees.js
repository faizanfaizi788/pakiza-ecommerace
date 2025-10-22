export const DisplayPriceInRupees = (price) => {
  const numericPrice = Number(price) || 0;

  return new Intl.NumberFormat('ur-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0, // remove decimals
  }).format(numericPrice);
};
