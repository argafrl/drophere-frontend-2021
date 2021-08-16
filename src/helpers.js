export const getErrorMessage = (error) =>
  error.response && error.response.data.message
    ? error.response.data.message
    : error.message;

export const countWords = (str) => {
  return str.split(" ").filter((word) => word !== "").length;
};

export const characterCheck = (str) => {
  const acceptedCriteria = /^[-A-Za-z0-9_]+$/;
  if (!str) {
    return true;
  }
  return acceptedCriteria.test(str);
};
