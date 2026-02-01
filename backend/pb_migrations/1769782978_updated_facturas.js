/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_577094678")

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "bool3958380805",
    "name": "en_papelera",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_577094678")

  // remove field
  collection.fields.removeById("bool3958380805")

  return app.save(collection)
})
