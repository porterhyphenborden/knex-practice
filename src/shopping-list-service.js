const ShoppingListService = {
    getAllItems(knex) {
        return knex.select('*')
            .from('shopping_list')
    },
    insertItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, product_id) {
        return knex
            .from('shopping_list')
            .select('*')
            .where('product_id', product_id)
            .first()
    },
    deleteItem(knex, product_id) {
        return knex('shopping_list')
            .where({ product_id })
            .delete()
    },
    updateItem(knex, product_id, newItemFields) {
        return knex('shopping_list')
            .where({ product_id })
            .update(newItemFields)
    }
}

module.exports = ShoppingListService;