let nextMaterialId = 5;

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";

export let materials = [
    {
        id: 1,
        uploaderId: 3,
        title: "CS732 Midterm Summary",
        courseCode: "COMPSCI732",
        year: 2024,
        semester: "Sem1",
        targetDepartment: "Computer Science",
        description: "Summary for Week 1-6",
        fileType: "pdf",
        fileUrl: `${BASE_URL}/uploads/materials/sample1.pdf`,
        fileSize: "1.2 MB",
        downloadCost: 500,
        status: "live",
        createdAt: "2024-03-15T00:00:00Z",
        updatedAt: "2024-03-15T00:00:00Z",
    },
    {
        id: 2,
        uploaderId: 1,
        title: "CS220 Algorithm Notes",
        courseCode: "COMPSCI220",
        year: 2023,
        semester: "Sem2",
        targetDepartment: "Computer Science",
        description: "Full semester notes",
        fileType: "pdf",
        fileUrl: `${BASE_URL}/uploads/materials/sample2.pdf`,
        fileSize: "2.4 MB",
        downloadCost: 500,
        status: "live",
        createdAt: "2023-11-20T00:00:00Z",
        updatedAt: "2023-11-20T00:00:00Z",
    },
    {
        id: 3,
        uploaderId: 5,
        title: "MATHS108 Exam Prep",
        courseCode: "MATHS108",
        year: 2025,
        semester: "Sem1",
        targetDepartment: "Mathematics",
        description: "Exam practice questions",
        fileType: "pdf",
        fileUrl: `${BASE_URL}/uploads/materials/sample3.pdf`,
        fileSize: "800 KB",
        downloadCost: 500,
        status: "live",
        createdAt: "2025-02-01T00:00:00Z",
        updatedAt: "2025-02-01T00:00:00Z",
    },
    {
        id: 4,
        uploaderId: 2,
        title: "ENGL210 Essay Guide (Pending Review)",
        courseCode: "ENGL210",
        year: 2026,
        semester: "Sem1",
        targetDepartment: "English",
        description: "Draft upload pending review",
        fileType: "docx",
        fileUrl: null,
        fileSize: "340 KB",
        downloadCost: 300,
        status: "pending",
        createdAt: "2026-04-01T00:00:00Z",
        updatedAt: "2026-04-01T00:00:00Z",
    },
];

// ─── Read ────────────────────────────────────────────────────────────────────

export async function getMaterialById(id) {
    return materials.find(m => m.id === id) || null;
}

export async function getMaterialByUploaderId(uploaderId) {
    return materials.filter(m => m.uploaderId === uploaderId);
}

// Multi-filter with pagination (only "live" for public)
export async function getMaterialFiltered({ search, courseCode, year, level, semester, type, department, page = 1, limit = 20, includeAll = false }) {
    let filtered = [...materials];

    if (!includeAll) {
        filtered = filtered.filter(m => m.status === "live");
    }

    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(m =>
            m.title.toLowerCase().includes(q) ||
            (m.description && m.description.toLowerCase().includes(q)) ||
            m.courseCode.toLowerCase().includes(q)
        );
    }
    if (courseCode) {
        filtered = filtered.filter(m => m.courseCode.toLowerCase() === courseCode.toLowerCase());
    }
    if (year) {
        filtered = filtered.filter(m => m.year === parseInt(year));
    }
    if (semester) {
        filtered = filtered.filter(m => m.semester?.toLowerCase() === semester.toLowerCase());
    }
    if (type) {
        filtered = filtered.filter(m => m.fileType?.toLowerCase() === type.toLowerCase());
    }
    if (department) {
        filtered = filtered.filter(m => m.targetDepartment?.toLowerCase() === department.toLowerCase());
    }
    if (level) {
        // Filter by course level: COMPSCI732 → 700, MATHS108 → 100
        const lvl = parseInt(level);
        filtered = filtered.filter(m => {
            const match = m.courseCode.match(/(\d)/);
            if (!match) return false;
            const courseLvl = parseInt(match[1]) * 100;
            return courseLvl === lvl;
        });
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = filtered.length;
    const startIdx = (page - 1) * limit;
    const items = filtered.slice(startIdx, startIdx + parseInt(limit));

    return { items, total, page: parseInt(page), limit: parseInt(limit) };
}

export async function getMaterialByStatus(status) {
    return materials.filter(m => m.status === status);
}

// Get recent materials for a specific course (for aggregated course detail)
export async function getRecentMaterialsByCourse(courseCode, limit = 3) {
    return materials
        .filter(m => m.courseCode === courseCode && m.status === "live")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
}

// ─── Create / Update / Delete ─────────────────────────────────────────────────

export async function createMaterial(data) {
    const newMaterial = {
        id: nextMaterialId++,
        uploaderId: data.uploaderId,
        title: data.title,
        courseCode: data.courseCode,
        year: data.year ? parseInt(data.year) : null,
        semester: data.semester ?? null,
        targetDepartment: data.targetDepartment ?? null,
        description: data.description ?? "",
        fileType: data.fileType ?? null,
        fileUrl: data.fileUrl ?? null,
        fileSize: data.fileSize ?? null,
        downloadCost: data.downloadCost ? parseInt(data.downloadCost) : 500,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    materials.push(newMaterial);
    return newMaterial;
}

export async function updateMaterialById(id, data) {
    const material = materials.find(m => m.id === id);
    if (!material) return null;

    const allowedFields = ["title", "courseCode", "year", "semester", "targetDepartment", "description", "fileType", "downloadCost"];
    const updates = {};
    for (const field of allowedFields) {
        if (data[field] !== undefined) updates[field] = data[field];
    }
    updates.updatedAt = new Date().toISOString();

    Object.assign(material, updates);
    return material;
}

export async function approveMaterial(id) {
    const material = materials.find(m => m.id === id);
    if (!material) return null;
    material.status = "live";
    material.updatedAt = new Date().toISOString();
    return material;
}

export async function rejectMaterial(id) {
    const material = materials.find(m => m.id === id);
    if (!material) return null;
    material.status = "rejected";
    material.updatedAt = new Date().toISOString();
    return material;
}

export async function deleteMaterialById(id) {
    const index = materials.findIndex(m => m.id === id);
    if (index === -1) return false;
    materials.splice(index, 1);
    return true;
}

export async function deleteMaterialsByUploaderId(uploaderId) {
    for (let i = materials.length - 1; i >= 0; i--) {
        if (materials[i].uploaderId === uploaderId) {
            materials.splice(i, 1);
        }
    }
}

// Kept for backward compat
export async function getAllMaterials() {
    return materials;
}