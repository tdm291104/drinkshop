export const formatCurrency = (amount: number, showCurrency = true): string => {
    if (!amount || isNaN(amount)) return showCurrency ? '0 VND' : '0';

    const formatted = amount.toLocaleString('vi-VN');
    return showCurrency ? `${formatted} VND` : formatted;
};

export const formatPrice = (price: number) => formatCurrency(price);

export const formatAmount = (amount: number) => formatCurrency(amount, false);

export const formatDiscount = (amount: number) => `-${formatPrice(amount)}`;

export const formatPriceWithColor = (price: number, isDiscount = false) => {
    const formatted = formatPrice(price);
    return isDiscount ? `-${formatted}` : formatted;
};
