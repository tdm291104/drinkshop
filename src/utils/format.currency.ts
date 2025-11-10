export const formatCurrency = (
  value: number | string | null | undefined
): string => {
  const numberValue = typeof value === "string" ? parseInt(value) : value;
  if (numberValue === null || numberValue === undefined) return "0 đ";
  return numberValue.toLocaleString("vi-VN") + " đ";
};
