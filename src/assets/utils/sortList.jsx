export const numericalSort = (data) => {
  const toSort = data;
  toSort.sort((a, b) => a.id - b.id);
  return toSort;
};

export const alphabeticalSort = (data) => {
  const toSort = data;
  toSort.sort((a, b) => a.name.localeCompare(b.name));
  return toSort;
};
