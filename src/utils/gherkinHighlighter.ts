
export const applySyntaxHighlighting = (text: string) => {
  if (!text) return '';
  
  const lines = text.split('\n');
  const highlightedLines = lines.map(line => {
    const keywordMatch = line.match(/^(Feature:|Scenario:|Given|When|Then|And|But)(\s+)(.*)/i);
    if (keywordMatch) {
      const keyword = keywordMatch[1];
      const space = keywordMatch[2];
      const rest = keywordMatch[3];
      
      const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
      const highlightedRest = rest.replace(/"([^"]*)"/g, '<span class="text-blue-500">"$1"</span>');
      
      return `<div><span class="font-bold text-primary">${capitalizedKeyword}</span>${space}${highlightedRest}</div>`;
    }
    
    return `<div>${line || '&nbsp;'}</div>`;
  });
  
  return highlightedLines.join('');
};
