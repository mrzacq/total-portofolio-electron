export const downloadJson = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const readJsonFile = async (file) => {
  const data = JSON.parse(await file.text());
  if (!Array.isArray(data)) throw new Error("Format JSON tidak valid");
  return data;
};
