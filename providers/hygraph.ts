import { joinURL } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'

type ImageOptimizations = {
  width?: number
  height?: number
  fit?: string | "clip" | "crop" | "scale" | "max"
  format?: string | "jpg" | "png" | "webp" | "avif" | "auto_image"
}

export function getImageFormat(format?: string) {
  let result = 'auto_image';

  if (format && format !== 'auto_image') {
    result = `output=format:${format}`
  }

  return result;
}

export function optimizeHygraphImage(baseurl: string, url: string, optimizations: ImageOptimizations) {
  baseurl = baseurl.replace(/\/+$/, '');
  const imageId = url.split(`${baseurl}/`)[1];
  const imageFormat = getImageFormat(optimizations.format)
  const optimBase = 'resize'

  let optimList = [];
  for (const [key, value] of Object.entries(optimizations)) {
    if (key !== 'format' && value !== undefined) {
      optimList.push(`${key}:${value}`)
    }
  }

  const optim = `${optimBase}=${optimList.join(',')}`
  const result = joinURL(baseurl, imageFormat, optim, imageId)

  return result;
}

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseurl } = {}
) => {

  const {
    width,
    height,
    fit,
    format,
  } = modifiers

  if (!baseurl) {
    baseurl = 'https://media.graphassets.com'
  }

  return {
    url: optimizeHygraphImage(baseurl, src, { width, height, fit, format })
  }
}