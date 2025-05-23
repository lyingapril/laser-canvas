import { fabric } from "fabric";

export function applyGrayscaleFilter(image: fabric.Image) {
  image.filters?.push(new fabric.Image.filters.Grayscale());
  image.applyFilters();
}