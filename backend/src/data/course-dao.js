let nextCourseId = 5;

export let courses = [
    {
        id: 1,
        courseCode: "COMPSCI732",
        courseName: "Software Tools and Processes",
        description: "An introduction to modern software engineering tools, version control, and development processes.",
        instructorName: "Dr. Andrew Meads",
        instructorAvatar: null,
        level: 700,
        semester: "Sem1",
        department: "Computer Science",
        seatsLeft: 12,
        status: "Available",
        prerequisites: "COMPSCI220",
        schedule: "Mon, Wed 10:00 – 11:30 • Engineering Block",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
    },
    {
        id: 2,
        courseCode: "COMPSCI220",
        courseName: "Algorithms and Data Structures",
        description: "Core algorithms including sorting, searching, trees, and graphs with analysis of complexity.",
        instructorName: "Dr. Bernhard Pfahringer",
        instructorAvatar: null,
        level: 200,
        semester: "Sem2",
        department: "Computer Science",
        seatsLeft: 5,
        status: "Limited",
        prerequisites: "COMPSCI101",
        schedule: "Tue, Thu 14:00 – 15:30 • Science Building",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
    },
    {
        id: 3,
        courseCode: "SOFTENG281",
        courseName: "Object-Oriented Programming",
        description: "OOP principles using Java: inheritance, polymorphism, design patterns.",
        instructorName: "Dr. Ewan Tempero",
        instructorAvatar: null,
        level: 200,
        semester: "Sem1",
        department: "Computer Science",
        seatsLeft: 0,
        status: "Closed",
        prerequisites: "COMPSCI101",
        schedule: "Mon, Fri 09:00 – 10:30 • Kate Edger",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
    },
    {
        id: 4,
        courseCode: "MATHS108",
        courseName: "Mathematics for Business",
        description: "An introduction to applied mathematics for business students covering calculus fundamentals.",
        instructorName: "Dr. Ayesha Patel",
        instructorAvatar: null,
        level: 100,
        semester: "Sem1",
        department: "Mathematics",
        seatsLeft: 30,
        status: "Available",
        prerequisites: "None",
        schedule: "Tue, Thu 10:00 – 11:30 • Owen G Glenn",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
    },
];

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getCourseById(id) {
    return courses.find(c => c.id === id) || null;
}

export async function getAllCourses({ search, department, level, semester } = {}) {
    let filtered = [...courses];

    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(c =>
            c.courseCode.toLowerCase().includes(q) ||
            c.courseName.toLowerCase().includes(q) ||
            c.instructorName?.toLowerCase().includes(q)
        );
    }
    if (department) {
        filtered = filtered.filter(c => c.department?.toLowerCase() === department.toLowerCase());
    }
    if (level) {
        filtered = filtered.filter(c => c.level === parseInt(level));
    }
    if (semester) {
        filtered = filtered.filter(c => c.semester?.toLowerCase() === semester.toLowerCase());
    }

    return filtered.sort((a, b) => a.courseCode.localeCompare(b.courseCode));
}

// Kept for backward compat
export async function getCourseBySearch(query) {
    const searchTerm = query.toUpperCase();
    return courses.filter(c =>
        c.courseCode.toUpperCase().startsWith(searchTerm) ||
        c.courseName.toUpperCase().includes(searchTerm)
    ).sort((a, b) => a.courseCode.localeCompare(b.courseCode));
}

// ─── Create / Update / Delete ─────────────────────────────────────────────────

export async function createCourse(data) {
    const newCourse = {
        id: nextCourseId++,
        courseCode: data.courseCode,
        courseName: data.courseName,
        description: data.description ?? "",
        instructorName: data.instructorName ?? null,
        instructorAvatar: data.instructorAvatar ?? null,
        level: data.level ? parseInt(data.level) : null,
        semester: data.semester ?? null,
        department: data.department ?? null,
        seatsLeft: data.seatsLeft ? parseInt(data.seatsLeft) : null,
        status: data.status ?? "Available",
        prerequisites: data.prerequisites ?? "None",
        schedule: data.schedule ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    courses.push(newCourse);
    return newCourse;
}

export async function updateCourse(id, updatedData) {
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) return null;
    const allowedFields = ["courseName", "description", "instructorName", "level", "semester", "department", "seatsLeft", "status", "prerequisites", "schedule"];
    const updates = {};
    for (const field of allowedFields) {
        if (updatedData[field] !== undefined) updates[field] = updatedData[field];
    }
    updates.updatedAt = new Date().toISOString();
    courses[index] = { ...courses[index], ...updates };
    return courses[index];
}

export async function deleteCourseById(id) {
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) return false;
    courses.splice(index, 1);
    return true;
}