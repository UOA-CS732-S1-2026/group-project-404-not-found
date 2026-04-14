// Unlocked Materials DAO - tracks which users have paid to access which materials

export let unlockedMaterials = [
    // seed: user 1 already unlocked material 2
    { userId: 1, materialId: 2, unlockedAt: "2025-03-10T08:00:00Z" },
];

// Check if a user has already unlocked a material
export async function isUnlocked(userId, materialId) {
    return unlockedMaterials.some(
        r => r.userId === userId && r.materialId === materialId
    );
}

// Record a new unlock
export async function unlockMaterial(userId, materialId) {
    const record = { userId, materialId, unlockedAt: new Date().toISOString() };
    unlockedMaterials.push(record);
    return record;
}
