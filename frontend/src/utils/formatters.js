export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null) return '₹0';
  
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount / 83.0); // approx conversion for USD display
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatCompactNumber = (num) => {
  if (!num) return '0';
  if (num >= 10000000) return `${(num / 10000000).toFixed(2)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(2)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

export const getSegmentBadgeClass = (segment) => {
  if (!segment) return 'badge-loyal';
  const seg = segment.toLowerCase();
  if (seg.includes('champion')) return 'badge-champions';
  if (seg.includes('loyal')) return 'badge-loyal';
  if (seg.includes('potential')) return 'badge-potential';
  if (seg.includes('new')) return 'badge-new';
  if (seg.includes('risk')) return 'badge-at-risk';
  if (seg.includes('hibernat')) return 'badge-hibernating';
  return 'badge-loyal';
};
