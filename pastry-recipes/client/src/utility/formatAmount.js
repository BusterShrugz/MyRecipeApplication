export function formatAmount(amount) {
    if (Number.isInteger(amount)) {
        return amount;
    }

    return Number(amount.toFixed(2));
}