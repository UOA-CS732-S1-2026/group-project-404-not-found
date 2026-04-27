import multer from "multer";
import path from "path";
import fs from "fs";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";

// Ensure upload directories exist
const dirs = [
    "public/uploads/avatars",
    "public/uploads/materials",
    "public/uploads/marketplace",
];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Avatar upload ────────────────────────────────────────────────────────────
const avatarStorage = multer.diskStorage({
    destination: "public/uploads/avatars/",
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `avatar_${Date.now()}${ext}`);
    },
});

const avatarFilter = (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only jpg, png, gif images are allowed for avatar"), false);
    }
};

export const uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: avatarFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ─── Material file upload ─────────────────────────────────────────────────────
const materialStorage = multer.diskStorage({
    destination: "public/uploads/materials/",
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `mat_${Date.now()}${ext}`);
    },
});

const materialFilter = (req, file, cb) => {
    const allowed = [".pdf", ".docx", ".doc", ".pptx", ".ppt", ".mp4", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"), false);
    }
};

export const uploadMaterial = multer({
    storage: materialStorage,
    fileFilter: materialFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
}).single("file");

// ─── Marketplace images upload ────────────────────────────────────────────────
const marketplaceStorage = multer.diskStorage({
    destination: "public/uploads/marketplace/",
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`);
    },
});

const imageFilter = (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed for marketplace listings"), false);
    }
};

export const uploadMarketplaceImages = multer({
    storage: marketplaceStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
}).array("images", 6); // max 6 images

// ─── Helper: convert disk path → absolute URL ─────────────────────────────────
export function filePathToUrl(diskPath) {
    // diskPath e.g. "public/uploads/avatars/avatar_123.png"
    // → "http://localhost:3001/uploads/avatars/avatar_123.png"
    const relativePath = diskPath.replace(/^public/, "");
    return `${BASE_URL}${relativePath}`;
}

// ─── Helper: human-readable file size ────────────────────────────────────────
export function humanFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
