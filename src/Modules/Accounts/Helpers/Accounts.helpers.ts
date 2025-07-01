export const checkLastDatehWhitoutSettle = (
    balanceDate: string,
    accountDate: number,
    accountStatus: string,
): string => {
    if (accountStatus === 'paid') return balanceDate;

    if (balanceDate === '' && accountDate > 0 && accountStatus === 'pending')
        return accountDate.toString();
    if (
        balanceDate !== '' &&
        accountDate > 0 &&
        accountStatus === 'pending' &&
        balanceDate !== accountDate.toString()
    )
        return `${balanceDate}-${accountDate.toString()}`;
    if (
        balanceDate !== '' &&
        accountDate > 0 &&
        accountStatus === 'pending' &&
        balanceDate === accountDate.toString()
    )
        return balanceDate;
    return balanceDate;
};


export const getDiscount = (discount: string | number = 0, price: number | null): number | null => {
    if (price === null) return null;

    if (discount.toString().includes('%')) {
        const percentage = Number(discount.toString().replace('%', ''));
        return (percentage / 100) * price;
    } else {
        return Number(discount);
    }
};
