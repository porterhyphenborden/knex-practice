require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
});

console.log('connection successful');

function searchByItemName(searchTerm) {    
    knexInstance
        .select('product_id', 'name', 'price', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

searchByItemName('fish');

function paginateProducts(pageNumber) {
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber - 1);
    knexInstance
        .select('product_id', 'name', 'date_added', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}
  
paginateProducts(2);

function itemsAddedAfter(daysAgo) {
    knexInstance
        .select('product_id', 'name', 'date_added', 'category')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })
}

itemsAddedAfter(2);

function totalCost() {
    knexInstance
        .select('category')
        .sum('price AS total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}

totalCost();