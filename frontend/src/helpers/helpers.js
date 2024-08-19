export const getPriceParams = (searchParams, key, value) => {
  const hasValueInParams = searchParams.has(key);

  if (value && hasValueInParams) {
    searchParams.set(key, value);
  } else if (value) {
    searchParams.append(key, value);
  } else if (searchParams) {
    searchParams.delete(key);
  }

  return searchParams;
};

export const caluclateOrderCost = (cartItems) => {
  const itemsCost = cartItems.reduce(
    (acc, item) => acc + item?.price * item?.quantity,
    0
  );

  const shippingCost = itemsCost > 400 ? 0 : 40;

  const taxCost = 0.05 * itemsCost;

  const totalCost = itemsCost + shippingCost + taxCost;

  return {
    itemsCost: Number(itemsCost).toFixed(2),
    shippingCost,
    taxCost: taxCost.toFixed(2),
    totalCost: totalCost.toFixed(2),
  };
};
