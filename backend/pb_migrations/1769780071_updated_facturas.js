/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_577094678")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"",
    "listRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id = \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_577094678")

  // update collection data
  unmarshal({
    "createRule": null,
    "listRule": "",
    "updateRule": null
  }, collection)

  return app.save(collection)
})
