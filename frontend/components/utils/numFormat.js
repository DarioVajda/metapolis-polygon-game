
function formatNumber(num) {
    const formatter = Intl.NumberFormat('en', { notation: 'compact' });
    let r = formatter.format(num);
    return r;
}

export { formatNumber }