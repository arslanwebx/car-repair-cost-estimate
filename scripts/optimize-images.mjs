import sharp from "sharp";
import path from "node:path";

const names = ["honda-civic-rear-bumper", "ford-f150-fender", "toyota-camry-front", "tesla-model-3-door"];
await Promise.all(names.map(name => sharp(path.join("public", "images", `${name}.png`)).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82, smartSubsample: true }).toFile(path.join("public", "images", `${name}.webp`))));
