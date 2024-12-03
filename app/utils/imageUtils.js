export const getImageUrlById = (id) => {
  return `https://watchtower-citizen-mobile.onrender.com/api/reports/image/${id}?cache_buster=${Date.now()}`;
};
