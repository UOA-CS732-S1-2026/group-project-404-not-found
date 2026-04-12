
let nextMaterialId = 4; // Track next available ID

export let materials = [
 {
        id: 1,
        uploaderId: 3,
        title: "CS732 Midterm Summary",
        courseCode: "COMPSCI732",
        year: 2024,
        description: "Summary for Week 1-6",
        fileType: "pdf",
        createdAt: "2024-03-15"
    },
    {
        id: 2,
        uploaderId: 1,
        title: "CS220 Algorithm Notes",
        courseCode: "COMPSCI220",
        year: 2023,
        description: "Full semester notes",
        fileType: "pdf",
        createdAt: "2023-11-20"
    },
     {
        id: 3,
        uploaderId: 5,
        title: "CS220 Algorithm Notes",
        courseCode: "COMPSCI220",
        year: 2023,
        description: "Full semester notes",
        fileType: "pdf",
        createdAt: "2023-11-20"
    }
];

//Search all materials
export async function getAllMaterials(){
    return materials;
}

//filer(year, course name)
export async function getMaterialFiltered({course, year}){
    let filtered = [...materials];

    //1. course name
    if(course){
        filtered = filtered.filter(m=>m.courseCode.toLowerCase() === course.toLowerCase());
    }

    //2. year
    if(year){
        filtered = filtered.filter(m=> m.year === parseInt(year));
    }

    // 3. Default(Based on the course name A-Z)
    filtered.sort((a,b)=>{
        if(a.courseCode < b.courseCode) return -1;
        if(a.courseCode > b.courseCode) return 1;
        return 0;
    });
    return filtered;
}

//if user click the specific material, move to detailed page
export async function getMaterialById(id){
    return materials.find(m=> m.id === id);
}

//Post materials
export async function createMaterial(data){
    const newMaterial ={
        id: nextMaterialId++,
        ...data,
        createdAt: new Date().toISOString().split('T')[0]
    };
    materials.push(newMaterial);
    return newMaterial;
}

//Delete material(user or admin)
export async function deleteMaterialById(id){
    const index = materials.findIndex(m=> m.id === id);
    if(index === -1) return false;
    materials.splice(index, 1);
    return true;
}

//Update material(user)
export async function updateMaterialById(id, data){
    const material = materials.find(m=> m.id === id);
    if(!material) return null;

    Object.assign(material, data);
    return material;
}

//Search list user uploaded in my profile
export async function getMaterialByUploaderId(uploaderId){
    const myMaterials = materials.filter(m=> m.uploaderId === uploaderId);

    return myMaterials;
}