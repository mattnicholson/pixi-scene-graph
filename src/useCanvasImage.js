const createImage = (url): any =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getRadianAngle = (degreeValue) => {
  return (degreeValue * Math.PI) / 180;
};

const exportFromCanvas = async (
  canvas,
  qualityReductionFactor,
  exportAsBlob
) => {
  return exportAsBlob
    ? new Promise((resolve) => {
        canvas.toBlob(
          (file) => {
            resolve(URL.createObjectURL(file));
          },
          "image/png",
          qualityReductionFactor
        );
      })
    : canvas.toDataURL("image/jpeg");
};

const SIZE_REDUCTION_FACTOR = 0.125;
const QUALITY_REDUCTION_FACTOR = 0.4;

export const useCanvasImage = (
  reductionFactor = SIZE_REDUCTION_FACTOR,
  qualityReductionFactor = QUALITY_REDUCTION_FACTOR,
  exportAsBlob = true
) => {
  const getImage = async (imageSrc, pixelCrop = null, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!pixelCrop) {
      pixelCrop = {
        width: image.width,
        height: image.height,
        x: 0,
        y: 0
      };
    }
    const safeArea = Math.max(image.width, image.height);

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea * reductionFactor, safeArea * reductionFactor);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea * reductionFactor, -safeArea * reductionFactor);
    ctx.drawImage(
      image,
      safeArea * reductionFactor - image.width * reductionFactor,
      safeArea * reductionFactor - image.height * reductionFactor
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      0 -
        safeArea * reductionFactor +
        image.width * reductionFactor -
        pixelCrop.x,
      0 -
        safeArea * reductionFactor +
        image.height * reductionFactor -
        pixelCrop.y
    );

    return exportFromCanvas(canvas, qualityReductionFactor, exportAsBlob);
  };

  return { getImage };
};
