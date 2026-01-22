const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

const ESCAPE_REGEX = /[&<>"']/g;

export function escapeHtml(text: string): string {
  if (!text) return '';
  return text.replace(ESCAPE_REGEX, char => HTML_ESCAPES[char]);
}

/**
 * Parsea Markdown simple incluyendo negritas y enlaces.
 */
export function parseSimpleMarkdown(text: string): string {
  if (!text) return '';

  // 1. Escapar HTML primero para seguridad (XSS)
  let html = escapeHtml(text);

  return html
    // 2. Enlaces: [texto](url)
    .replace(/\[(.*?)\]\(([^ \s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // 3. Negritas: **texto** o ##texto##
    .replace(/\*\*(.*?)\*\*|##(.*?)##/g, '<strong>$1$2</strong>')
    
    // 4. Cursivas: *texto*
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}