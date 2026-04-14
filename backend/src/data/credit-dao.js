// Credit Logs DAO - tracks all credit transactions (earn & spend)

let nextLogId = 4;

export let creditLogs = [
    { id: 1, userId: 1, amount: 500,  reason: "Welcome bonus",        createdAt: "2025-01-01T00:00:00Z" },
    { id: 2, userId: 1, amount: -500, reason: "Downloaded material",   createdAt: "2025-03-10T08:00:00Z" },
    { id: 3, userId: 2, amount: 500,  reason: "Welcome bonus",        createdAt: "2025-02-01T00:00:00Z" },
];

// Get paginated credit history for a user
export async function getCreditLogsByUserId(userId, page = 1, limit = 20) {
    const userLogs = creditLogs
        .filter(log => log.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = userLogs.length;
    const start = (page - 1) * limit;
    const items = userLogs.slice(start, start + limit);

    return { items, total, page, limit };
}

// Append a new credit log entry
export async function addCreditLog({ userId, amount, reason }) {
    const log = {
        id: nextLogId++,
        userId,
        amount,
        reason,
        createdAt: new Date().toISOString(),
    };
    creditLogs.push(log);
    return log;
}
