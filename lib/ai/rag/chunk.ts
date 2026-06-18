export function chunkByParagraph(text: string, minLength = 30): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length >= minLength);
}
