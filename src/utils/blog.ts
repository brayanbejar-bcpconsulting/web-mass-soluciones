/**
 * Utilidades para el sistema de blog
 * Centraliza funciones helper reutilizables en todo el blog
 */

import type { ImageMetadata } from 'astro';

// Tipo para las imágenes importadas con glob
export type ImageModule = { default: ImageMetadata };
export type ImagesMap = Record<string, ImageModule>;

/**
 * Carga todas las imágenes de portadas del blog usando import.meta.glob
 * Debe llamarse en el frontmatter del componente Astro
 */
export function loadBlogImages(): ImagesMap {
  return import.meta.glob<ImageModule>(
    "/src/assets/blog/portadas/*.{jpeg,jpg,png,gif,webp}",
    { eager: true }
  );
}

/**
 * Resuelve la imagen de un post con fallback a imagen por defecto
 * @param imageName - Nombre del archivo de imagen (puede incluir ruta)
 * @param images - Mapa de imágenes cargadas con loadBlogImages()
 * @param defaultImage - Imagen por defecto si no se encuentra
 */
export function getPostImage(
  imageName: string | undefined,
  images: ImagesMap,
  defaultImage: ImageMetadata
): ImageMetadata {
  if (!imageName) return defaultImage;
  
  const name = imageName.split('/').pop();
  const imagePath = `/src/assets/blog/portadas/${name}`;
  
  return images[imagePath]?.default ?? defaultImage;
}

/**
 * Calcula el tiempo estimado de lectura en minutos
 * @param content - Contenido del post (body)
 * @param wordsPerMinute - Velocidad de lectura (default: 200)
 */
export function getReadingTime(content: string, wordsPerMinute = 200): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Formatea una fecha en español peruano
 * @param date - Fecha a formatear
 * @param options - Opciones de formato (default: día, mes corto, año)
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }
): string {
  return date.toLocaleDateString('es-PE', options);
}

/**
 * Genera el slug de un post a partir del ID del archivo
 * @param id - ID del entry de la colección (incluye extensión .md)
 */
export function getSlug(id: string): string {
  return id.replace(/\.md$/, '');
}

/**
 * Genera un slug URL-friendly para tags
 * @param tag - Nombre del tag
 */
export function getTagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Tipo para los datos de un post de blog
 */
export interface BlogPostData {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  image?: string;
  tags: string[];
  featured?: boolean;
}

/**
 * Tipo para un post completo de la colección
 */
export interface BlogPost {
  id: string;
  body?: string;
  data: BlogPostData;
}