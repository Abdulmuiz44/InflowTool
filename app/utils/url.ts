export const cleanUrl = (url: string): string => {
  return url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
};
