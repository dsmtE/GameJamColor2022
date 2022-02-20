import imagesData from "../data/img_data";

export function getImageDataFromName(name) {
    const data = imagesData[name] || { src: "" };
    const src = data["src"];
    return { name, src };
}