//For user and admin

import bcrypt from "bcrypt";

//Hard-coding
let nextUserId = 6; // Track next available ID

export let users = [
   {
    id: 1,
    username: "alice",
    email: "alice@aucklanduni.ac.nz",
    firstname: "Alice",
    lastname: "Kim",
    password: bcrypt.hashSync("alice123", 10), 
    description: "Hello",
    dob: "2000-01-01",
    avatar_id: 1,
    is_admin: 0
  },
  {
    id: 2,
    username: "bob",
    email: "bob@aucklanduni.ac.nz",
    firstname: "Bob",
    lastname: "Lee",
    password: bcrypt.hashSync("bob123", 10),
    description: "Hi",
    dob: "1999-05-05",
    avatar_id: 2,
    is_admin: 0
  },
   {
    id: 3,
    username: "james",
    email: "james@aucklanduni.ac.nz",
    firstname: "James",
    lastname: "Jang",
    password: bcrypt.hashSync("james123", 10),
    description: "Good to see you",
    dob: "1994-03-16",
    avatar_id: 3,
    is_admin: 0
  },
    {
    id: 4,
    username: "sky",
    email: "sky@aucklanduni.ac.nz",
    firstname: "sky",
    lastname: "Hong",
    password: bcrypt.hashSync("sky123", 10),
    description: "Have fun",
    dob: "1990-02-16",
    avatar_id: 4,
    is_admin: 1
  },
  {
    id: 5,
    username: "cloudy",
    email: "cloudy@aucklanduni.ac.nz",
    firstname: "cloudy",
    lastname: "Hong",
    password: bcrypt.hashSync("cloudy123", 10),
    description: "Have fun!!!",
    dob: "1970-02-16",
    avatar_id: 5,
    is_admin: 0
  }
]

//Register
export async function createUser(data){
    const email = data.email?.trim().toLowerCase();
    if(!email) throw new Error("Email is required");
    if(await findUserByEmail(email)) throw new Error("Email already exists");

    const username = data.username?.trim() || email.split("@")[0];
    if(await findUserByUsername(username)) throw new Error("Username already exists");

    const newUser = {
        id: nextUserId++,
        username,
        email,
        firstname: data.firstname ?? username,
        lastname: data.lastname ?? "",
        description: data.description ?? "",
        dob: data.dob ?? null,
        avatar_id: data.avatar_id ?? 1,
        password : bcrypt.hashSync(data.password, 10),
        is_admin: 0 
    };
    users.push(newUser);
    return newUser;
}

//Login : Check Username
export async function findUserByUsername(username){
    return users.find(u=> u.username === username) || null;
}

export async function findUserByEmail(email){
    const normalizedEmail = email?.trim().toLowerCase();
    return users.find(u => u.email?.toLowerCase() === normalizedEmail) || null;
}

//Login : Verify password
export async function verifyUserPassword(user, password){
    return bcrypt.compare(password, user.password);
}

//Modify user infomation
export async function updateMyProfile(id, data){
    const user = users.find(u=> u.id === id);
    if(!user) return null;
    
    // Only allow updating safe fields - prevent password/admin privilege changes
    const allowedFields = ['username', 'firstname', 'lastname', 'description', 'dob', 'avatar_id'];
    const updates = {};
    
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updates[field] = data[field];
        }
    }
    
    Object.assign(user, updates);
    return user;
}

//Delete user by themselves
export async function deleteUserById(id){
    const index = users.findIndex(u=>u.id === id);
    if(index === -1) return false;

    users.splice(index, 1);
    return true;
}
