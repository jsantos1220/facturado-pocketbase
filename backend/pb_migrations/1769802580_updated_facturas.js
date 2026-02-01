/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_577094678")

  // remove field
  collection.fields.removeById("text982552870")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_577094678")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text982552870",
    "max": 0,
    "min": 0,
    "name": "nombre",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
