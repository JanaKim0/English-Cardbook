/**
 * Достаёт из размеченного текста обычный, без тегов — нужно для поиска
 * по содержимому конспектов и для короткого превью в списке.
 */
export function htmlToPlainText(html: string): string {
  const container = document.createElement('div')
  container.innerHTML = html

  return (container.textContent ?? '').replace(/\s+/g, ' ').trim()
}
