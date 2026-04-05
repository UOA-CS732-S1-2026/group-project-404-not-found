//Hard coding

export let marketplaceItems = [
    {
        id: 1,
        sellerId : 1,
        title: "Used iPhone16",
        description: "Almost new one",
        price : 500,
        category: "Electronics",
        createdAt: "2026-04-01"
    }
];

export async function getAllItems(){
    return marketplaceItems;
}

export async function getItemById(id){
    return marketplaceItems.find(item=> item.id === id);
}

//the function for my profile
export async function getItemBysellerId(sellerId){
    return marketplaceItems.filter(item => item.sellerId === sellerId);
}

export async function createItem(data){
    const newItem = {
        id: marketplaceItems.length +1,
        ...data,
        createAt: new Date().toISOString().split('T')[0]
    };
    marketplaceItems.push(newItem);
    return newItem;
}