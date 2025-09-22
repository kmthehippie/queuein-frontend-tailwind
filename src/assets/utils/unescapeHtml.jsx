export const noUnescapedHtml = (string) => {
  const unescapedHtmlRegex = (?<!\\)(?:(\\\\)*)[*];

  if (string.includes(unescapedHtmlRegex)) {
    return false;
  }
  return true;
};
