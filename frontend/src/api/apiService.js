const BASE_URL = '/api';

export const apiService = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  // Dashboard
  getDashboardSummary: async () => {
    const res = await fetch(`${BASE_URL}/dashboard/summary`);
    if (!res.ok) throw new Error('Failed to load dashboard summary');
    return res.json();
  },

  // Customers
  getCustomers: async (search = '', segment = 'all') => {
    const query = new URLSearchParams({ search, segment }).toString();
    const res = await fetch(`${BASE_URL}/customers/?${query}`);
    if (!res.ok) throw new Error('Failed to load customers');
    return res.json();
  },

  getCustomerProfile: async (customerId) => {
    const res = await fetch(`${BASE_URL}/customers/${customerId}`);
    if (!res.ok) throw new Error('Failed to load customer profile');
    return res.json();
  },

  // Segmentation
  getSegmentationOverview: async () => {
    const res = await fetch(`${BASE_URL}/segmentation/overview`);
    if (!res.ok) throw new Error('Failed to load segmentation overview');
    return res.json();
  },

  triggerCampaign: async (segment, campaignName, offerDiscountPct = 15) => {
    const res = await fetch(`${BASE_URL}/segmentation/trigger-campaign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ segment, campaign_name: campaignName, offer_discount_pct: offerDiscountPct })
    });
    if (!res.ok) throw new Error('Failed to trigger campaign');
    return res.json();
  },

  // Predictions
  getPredictionsSummary: async () => {
    const res = await fetch(`${BASE_URL}/predictions/summary`);
    if (!res.ok) throw new Error('Failed to load predictions summary');
    return res.json();
  },

  trainModel: async (modelType = 'ridge') => {
    const res = await fetch(`${BASE_URL}/predictions/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model_type: modelType })
    });
    if (!res.ok) throw new Error('Failed to retrain model');
    return res.json();
  },

  // Products
  getProductsSummary: async () => {
    const res = await fetch(`${BASE_URL}/products/summary`);
    if (!res.ok) throw new Error('Failed to load product intelligence');
    return res.json();
  },

  // Reports
  getMonthlyReport: async () => {
    const res = await fetch(`${BASE_URL}/reports/monthly`);
    if (!res.ok) throw new Error('Failed to load monthly report');
    return res.json();
  },

  // Upload
  uploadCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/upload/csv`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },

  resetSampleDataset: async () => {
    const res = await fetch(`${BASE_URL}/upload/reset-sample`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset dataset');
    return res.json();
  }
};
