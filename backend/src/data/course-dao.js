
export let courses = [
    { id: 1, courseCode: "COMPSCI732", courseName: "Software Tools and Processes" },
    { id: 2, courseCode: "COMPSCI220", courseName: "Algorithms and Data Structures" },
    { id: 3, courseCode: "SOFTENG281", courseName: "Object-Oriented Programming" }
];

//Search all course(A-Z)
export async function getAllCourses(){
    return [...courses].sort((a,b)=> a.courseCode.localeCompare(b.courseCode));

}

//Search courses using coursecode or number
export async function getCourseBySearch(query){
    
    const searchTerm = query.toUpperCase();
    return courses.filter(c=>
        c.courseCode.toUpperCase().startsWith(searchTerm) ||
        c.courseName.toUpperCase().includes(searchTerm)
    ).sort((a,b)=> a.courseCode.localeCompare(b.courseCode));  
}

//Add the course information by admin
export async function createCourse(data){
    const newCourse = {id: courses.length +1, ... data};
    courses.push(newCourse);
    return newCourse;
}

//Delete the course information by admin
export async function deleteCourseById(id){
    const index = courses.findIndex(c => c.id === id);
    if(index === -1) return false;
    courses.splice(index, 1);
    return true;
}