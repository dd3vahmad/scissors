import noImagePlaceholder from "../assets/no-image-placeholder.webp";

const getCroppedImageUrl = (url: string) => {
  if (!url) return noImagePlaceholder;
  const target = "media/";
  const index = url.indexOf("media/") + target.length;
  return url.slice(0, index) + "crop/600/400/" + url.slice(index);
};

export default getCroppedImageUrl;
