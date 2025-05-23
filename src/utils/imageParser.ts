export async function parseImageFile(file: File): Promise<fabric.Image | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        fabric.Image.fromURL(e.target.result, (img) => resolve(img));
      } else {
        resolve(null);
      }
    };
    reader.readAsDataURL(file);
  });
}

export async function parseSvgFile(file: File): Promise<fabric.Group> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        fabric.loadSVGFromString(e.target.result, (objects, options) => {
          const group = fabric.util.groupSVGElements(objects, options);
          group.scaleToWidth(300);
          resolve(group);
        });
      }
    };
    reader.readAsText(file);
  });
}