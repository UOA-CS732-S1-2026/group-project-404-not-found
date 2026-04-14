//Hard coding

let nextItemId = 3; // Track next available ID

export let marketplaceItems = [
    {
        id: 1,
        sellerId : 1,
        title: "Used iPhone16",
        description: "Almost new one",
        price : 500,
        category: "Electronics",
        createdAt: "2026-04-01"
    },
     {
        id: 2,
        sellerId : 2,
        title: "Dining table",
        description: "Old one",
        price : 200,
        category: "Furniture",
        createdAt: "2026-02-28"
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
        id: nextItemId++,
        ...data,
        createdAt: new Date().toISOString().split('T')[0]
    };
    marketplaceItems.push(newItem);
    return newItem;
}

//Update item(user)
export async function updateItemById(id, data){
    const item = marketplaceItems.find(item => item.id === id);
    if(!item) return null;

    const allowedFields = ['title', 'description', 'price', 'category', 'status'];
    const updates = {};
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updates[field] = data[field];
        }
    }

    //Override
    Object.assign(item, updates);
    return item;
}

//Delete item(user)
export async function deleteItemById(id){
    const index = marketplaceItems.findIndex(item => item.id === id);
    if(index === -1) return false;

    marketplaceItems.splice(index,1);
    return true;
}

//Delete all items created by a specific user
export async function deleteItemsBySellerId(sellerId){
    for (let i = marketplaceItems.length - 1; i >= 0; i--) {
        if (marketplaceItems[i].sellerId === sellerId) {
            marketplaceItems.splice(i, 1);
        }
    }
}
