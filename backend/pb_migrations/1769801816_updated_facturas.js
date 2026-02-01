/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_577094678")

  // add field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3369090573",
    "max": 0,
    "min": 0,
    "name": "nota",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2953521965",
    "max": 0,
    "min": 0,
    "name": "moneda",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "bool274677171",
    "name": "lleva_itbis",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_577094678")

  // remove field
  collection.fields.removeById("text3369090573")

  // remove field
  collection.fields.removeById("text2953521965")

  // remove field
  collection.fields.removeById("bool274677171")

  return app.save(collection)
})
