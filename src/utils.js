export const FILE_TYPES = {
  pdf: { color: "#FC573B", backgroundColor: "#FFE6E2" },
  rar: { color: "#40C02B", backgroundColor: "#E1FFDC" },
  zip: { color: "#40C02B", backgroundColor: "#E1FFDC" },
  doc: { color: "#41A4D5", backgroundColor: "#D9EDF7" },
  docx: { color: "#41A4D5", backgroundColor: "#D9EDF7" },
  png: { color: "#F4B12F", backgroundColor: "#FFF9DD" },
  jpg: { color: "#F4B12F", backgroundColor: "#FFF9DD" },
  svg: { color: "#F4B12F", backgroundColor: "#FFF9DD" },
  jpeg: { color: "#F4B12F", backgroundColor: "#FFF9DD" },
  mp4: { color: "#EF6FDB", backgroundColor: "#FFECFC" },
  mov: { color: "#EF6FDB", backgroundColor: "#FFECFC" },
  mp3: { color: "#A87DEE", backgroundColor: "#EDE2FF" },
  m4a: { color: "#A87DEE", backgroundColor: "#EDE2FF" },
  xls: { color: "#0F783E", backgroundColor: "#44FFA8" },
  xlsx: { color: "#0F783E", backgroundColor: "#44FFA8" },
  ppt: { color: "#C33F1D", backgroundColor: "#FFA588" },
  pptx: { color: "#C33F1D", backgroundColor: "#FFA588" },
};

export const countWords = (str) => {
  return str.split(" ").filter((word) => word !== "").length;
};
