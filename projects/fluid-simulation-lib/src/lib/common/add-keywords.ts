export function addKeywords(source, keywords) {
  if (keywords == null) { return source; }
  let keywordsString = '';
  keywords.forEach(keyword => {
    keywordsString += '#define ' + keyword + '\n';
  });
  return keywordsString + source;
}
