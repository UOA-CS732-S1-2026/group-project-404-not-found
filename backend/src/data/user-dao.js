// For user and admin

import bcrypt from "bcrypt";

let nextUserId = 6;

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";

export let users = [
    {
        id: 1,
        username: "alice",
        upi: "akim123",
        email: "alice@aucklanduni.ac.nz",
        firstname: "Alice",
        lastname: "Kim",
        password: bcrypt.hashSync("alice123", 10),
        bio: "CS student who loves sharing notes!",
        phone: "+64 21 111 1111",
        dob: "2000-01-01",
        avatarUrl: `${BASE_URL}/uploads/avatars/default_1.png`,
        notifPrefs: { email: true, push: false, sms: false },
        creditBalance: 1240,
        is_admin: 0,
        createdAt: "2024-01-15T00:00:00Z",
    },
    {
        id: 2,
        username: "bob",
        upi: "blee456",
        email: "bob@aucklanduni.ac.nz",
        firstname: "Bob",
        lastname: "Lee",
        password: bcrypt.hashSync("bob123", 10),
        bio: "Hi there!",
        phone: "+64 21 222 2222",
        dob: "1999-05-05",
        avatarUrl: `${BASE_URL}/uploads/avatars/default_2.png`,
        notifPrefs: { email: true, push: true, sms: false },
        creditBalance: 800,
        is_admin: 0,
        createdAt: "2024-02-10T00:00:00Z",
    },
    {
        id: 3,
        username: "james",
        upi: "jjang789",
        email: "james@aucklanduni.ac.nz",
        firstname: "James",
        lastname: "Jang",
        password: bcrypt.hashSync("james123", 10),
        bio: "Good to see you",
        phone: "+64 21 333 3333",
        dob: "1994-03-16",
        avatarUrl: `${BASE_URL}/uploads/avatars/default_3.png`,
        notifPrefs: { email: false, push: false, sms: false },
        creditBalance: 300,
        is_admin: 0,
        createdAt: "2024-03-01T00:00:00Z",
    },
    {
        id: 4,
        username: "sky",
        upi: "shong001",
        email: "sky@aucklanduni.ac.nz",
        firstname: "Sky",
        lastname: "Hong",
        password: bcrypt.hashSync("sky123", 10),
        bio: "Platform admin. Have fun!",
        phone: "+64 21 444 4444",
        dob: "1990-02-16",
        avatarUrl: `${BASE_URL}/uploads/avatars/default_4.png`,
        notifPrefs: { email: true, push: true, sms: true },
        creditBalance: 5000,
        is_admin: 1,
        createdAt: "2024-01-01T00:00:00Z",
    },
    {
        id: 5,
        username: "cloudy",
        upi: "chong002",
        email: "cloudy@aucklanduni.ac.nz",
        firstname: "Cloudy",
        lastname: "Hong",
        password: bcrypt.hashSync("cloudy123", 10),
        bio: "Have fun!!!",
        phone: "+64 21 555 5555",
        dob: "1970-02-16",
        avatarUrl: `${BASE_URL}/uploads/avatars/default_5.png`,
        notifPrefs: { email: true, push: false, sms: false },
        creditBalance: 420,
        is_admin: 0,
        createdAt: "2024-04-20T00:00:00Z",
    },
];

// ─── Finders ────────────────────────────────────────────────────────────────

export async function findUserById(id) {
    return users.find(u => u.id === id) || null;
}

export async function findUserByUsername(username) {
    return users.find(u => u.username === username) || null;
}

export async function findUserByEmail(email) {
    const normalizedEmail = email?.trim().toLowerCase();
    return users.find(u => u.email?.toLowerCase() === normalizedEmail) || null;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

// Register
export async function createUser(data) {
    const email = data.email?.trim().toLowerCase();
    if (!email) throw new Error("Email is required");
    if (await findUserByEmail(email)) throw new Error("Email already exists");

    const username = data.username?.trim() || email.split("@")[0];
    if (await findUserByUsername(username)) throw new Error("Username already exists");

    const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";
    const avatarId = data.avatarId ?? 1;

    const newUser = {
        id: nextUserId++,
        username,
        upi: data.upi?.trim() || null,
        email,
        firstname: data.firstname ?? username,
        lastname: data.lastname ?? "",
        bio: data.bio ?? "",
        phone: data.phone?.trim() || null,
        description: data.description ?? "",
        dob: data.dob ?? null,
        avatarUrl: `${BASE_URL}/uploads/avatars/default_${avatarId}.png`,
        notifPrefs: data.notifPrefs ?? { email: true, push: false, sms: false },
        password: bcrypt.hashSync(data.password, 10),
        creditBalance: 500, // welcome bonus
        is_admin: 0,
        createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
}

// Verify password
export async function verifyUserPassword(user, password) {
    return bcrypt.compare(password, user.password);
}

// ─── Profile Updates ─────────────────────────────────────────────────────────

export async function updateMyProfile(id, data) {
    const user = users.find(u => u.id === id);
    if (!user) return null;

    const allowedFields = [
        "username", "firstname", "lastname", "bio", "phone",
        "upi", "dob", "notifPrefs", "avatarUrl",
    ];
    const updates = {};
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updates[field] = data[field];
        }
    }

    Object.assign(user, updates);
    return user;
}

export async function changePassword(id, newPassword) {
    const user = users.find(u => u.id === id);
    if (!user) return false;
    user.password = bcrypt.hashSync(newPassword, 10);
    return true;
}

// ─── Credit ──────────────────────────────────────────────────────────────────

export async function updateCreditBalance(userId, delta) {
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    user.creditBalance += delta;
    return user.creditBalance;
}

// ─── Deletion ────────────────────────────────────────────────────────────────

export async function deleteUserById(id) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
}
