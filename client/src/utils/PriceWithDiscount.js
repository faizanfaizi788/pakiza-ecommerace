export const pricewithDiscount = (price, dis = 0) => {
  const numericPrice = Number(price);
  const numericDis = Number(dis);

  if (isNaN(numericPrice) || isNaN(numericDis)) {
    console.error('Invalid input: price and discount must be numbers');
    return 0;
  }

  // If discount ≤ 100, treat it as a percentage; otherwise, as a fixed amount
  const discountAmount =
    numericDis <= 100
      ? Math.ceil((numericPrice * numericDis) / 100)
      : numericDis;

  const actualPrice = numericPrice - discountAmount;

  return actualPrice < 0 ? 0 : actualPrice; // Ensure price never goes negative
};
