export const replaceEscaped = (string) => {
  if (string !== undefined) {
    const entityMap = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#039;": "'",
      "&apos;": "'",
      "&#x2F;": "/",
    };
    const decodeHtmlEntities = (text) => {
      let decodedText = text;
      for (const entity in entityMap) {
        // Use a regular expression with the 'g' flag for global replacement
        const regex = new RegExp(entity, "g");
        decodedText = decodedText.replace(regex, entityMap[entity]);
      }
      return decodedText;
    };
    const decodedContent = decodeHtmlEntities(string);
    return decodedContent;
  } else {
    return string;
  }
};
