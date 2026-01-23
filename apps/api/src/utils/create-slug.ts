export function createSlug(text: string): string {
  return text
    .normalize('NFD') // Separate accents from letters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove symbols
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '') // Trim hyphens
}
