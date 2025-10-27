export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const APP_CONFIG = {
  siteName: 'Daily Spends',
  description: 'Track your daily expenses easily',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  dateFormat: 'MMMM dd, yyyy',
  currency: 'Rupees',
};