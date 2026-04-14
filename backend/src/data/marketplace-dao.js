let nextItemId = 4;

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";

export let marketplaceItems = [
    {
        id: 1,
        sellerId: 1,
        title: "Calculus: Early Transcendentals - 3rd Edition",
        description: "Well-kept textbook. Spine slightly creased. Ideal for first-year engineering students.",
        price: 10.99,
        category: "Books",
        condition: "Good",
        location: "Ilam Campus",
        courseCode: "MATHS108",
        images: [`${BASE_URL}/uploads/marketplace/book1_1.jpg`, `${BASE_URL}/uploads/marketplace/book1_2.jpg`],
        contactMethods: { whatsapp: "+64 21 555 0123", wechat: "uoa_student_88", email: "alex.chen@aucklanduni.ac.nz", phone: "+64 9 373 7519" },
        status: "live",
        createdAt: "2026-04-01T00:00:00Z",
        updatedAt: "2026-04-01T00:00:00Z",
    },
    {
        id: 2,
        sellerId: 2,
        title: "Scientific Calculator (Casio)",
        description: "Barely used, works perfectly. Great for course exercises.",
        price: 18.00,
        category: "Electronics",
        condition: "Like New",
        location: "City Campus",
        courseCode: null,
        images: [`${BASE_URL}/uploads/marketplace/calc1.jpg`],
        contactMethods: { email: "bob@aucklanduni.ac.nz" },
        status: "live",
        createdAt: "2026-04-02T00:00:00Z",
        updatedAt: "2026-04-02T00:00:00Z",
    },
    {
        id: 3,
        sellerId: 3,
        title: "USB Drive 64GB",
        description: "Works perfectly. Selling because I have too many.",
        price: 8.00,
        category: "Electronics",
        condition: "Good",
        location: "Online",
        courseCode: null,
        images: [`${BASE_URL}/uploads/marketplace/usb1.jpg`],
        contactMethods: { email: "james@aucklanduni.ac.nz" },
        status: "draft",
        createdAt: "2026-04-05T00:00:00Z",
        updatedAt: "2026-04-05T00:00:00Z",
    },
];

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getItemById(id) {
    return marketplaceItems.find(item => item.id === id) || null;
}

export async function getItemBysellerId(sellerId) {
    return marketplaceItems.filter(item => item.sellerId === sellerId);
}

// Multi-filter with pagination (only "live" for public)
export async function getAllItems({ search, category, courseCode, condition, minPrice, maxPrice, page = 1, limit = 20, includeAll = false } = {}) {
    let filtered = [...marketplaceItems];

    if (!includeAll) {
        filtered = filtered.filter(i => i.status === "live");
    }

    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(i =>
            i.title.toLowerCase().includes(q) ||
            (i.description && i.description.toLowerCase().includes(q))
        );
    }
    if (category) {
        filtered = filtered.filter(i => i.category?.toLowerCase() === category.toLowerCase());
    }
    if (courseCode) {
        filtered = filtered.filter(i => i.courseCode?.toLowerCase() === courseCode.toLowerCase());
    }
    if (condition) {
        filtered = filtered.filter(i => i.condition?.toLowerCase() === condition.toLowerCase());
    }
    if (minPrice !== undefined) {
        filtered = filtered.filter(i => i.price >= parseFloat(minPrice));
    }
    if (maxPrice !== undefined) {
        filtered = filtered.filter(i => i.price <= parseFloat(maxPrice));
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = filtered.length;
    const startIdx = (page - 1) * limit;
    const items = filtered.slice(startIdx, startIdx + parseInt(limit));

    return { items, total, page: parseInt(page), limit: parseInt(limit) };
}

// Similar items: same category or courseCode, exclude self, limit 4
export async function getSimilarItems(itemId, category, courseCode) {
    return marketplaceItems
        .filter(i =>
            i.id !== itemId &&
            i.status === "live" &&
            (i.category === category || (courseCode && i.courseCode === courseCode))
        )
        .slice(0, 4);
}

// Get recent listings for a specific course (for aggregated course detail)
export async function getRecentListingsByCourse(courseCode, limit = 4) {
    return marketplaceItems
        .filter(i => i.courseCode === courseCode && i.status === "live")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
}

// ─── Create / Update / Delete ─────────────────────────────────────────────────

export async function createItem(data) {
    const newItem = {
        id: nextItemId++,
        sellerId: data.sellerId,
        title: data.title,
        description: data.description ?? "",
        price: parseFloat(data.price) || 0,
        category: data.category ?? "Other",
        condition: data.condition ?? null,
        location: data.location ?? null,
        courseCode: data.courseCode ?? null,
        images: data.images ?? [],
        contactMethods: data.contactMethods ?? {},
        status: data.status === "live" ? "live" : "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    marketplaceItems.push(newItem);
    return newItem;
}

export async function updateItemById(id, data) {
    const item = marketplaceItems.find(item => item.id === id);
    if (!item) return null;

    const allowedFields = ["title", "description", "price", "category", "condition", "location", "courseCode", "contactMethods", "status"];
    const updates = {};
    for (const field of allowedFields) {
        if (data[field] !== undefined) updates[field] = data[field];
    }
    updates.updatedAt = new Date().toISOString();

    Object.assign(item, updates);
    return item;
}

export async function deleteItemById(id) {
    const index = marketplaceItems.findIndex(item => item.id === id);
    if (index === -1) return false;
    marketplaceItems.splice(index, 1);
    return true;
}

export async function deleteItemsBySellerId(sellerId) {
    for (let i = marketplaceItems.length - 1; i >= 0; i--) {
        if (marketplaceItems[i].sellerId === sellerId) {
            marketplaceItems.splice(i, 1);
        }
    }
}
