const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`Shoppinglist service object`, function() {
    let db;
    let testItems = [
        {
            product_id: 1,
            name: 'oatmeal',
            price: '1.10',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main'
        },
        {
            product_id: 2,
            name: 'hot dogs',
            price: '2.20',
            date_added: new Date('2100-05-22T16:28:32.615Z'),
            checked: false,
            category: 'Lunch'
        },
        {
            product_id: 3,
            name: 'yogurt',
            price: '3.30',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            checked: false,
            category: 'Snack'
        },
    ];

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems.map(item => ({
                        ...item,
                        date_added: new Date(item.date_added)
                    })))
                })
        })

        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const thirdId = 3;
            const thirdTestItem = testItems[thirdId - 1];
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        product_id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        date_added: thirdTestItem.date_added,
                        checked: thirdTestItem.checked,
                        category: thirdTestItem.category
                    })
                })
        })

        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3;
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    // copy the test items array without the "deleted" item
                    const expected = testItems.filter(item => item.product_id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })

        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3;
            const newItemData = {
                name: 'updated name',
                price: '2.20',
                date_added: new Date(),
            };
            const originalItem = testItems[idOfItemToUpdate - 1];
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        product_id: idOfItemToUpdate,
                        ...originalItem,
                        ...newItemData,
                    })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertItem() inserts an item and resolves the item with an 'id'`, () => {
            const newItem = {
                name: 'Test new name',
                price: '1.10',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: false,
                category: 'Main'
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        product_id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category
                    })
                })
        })
    })
})