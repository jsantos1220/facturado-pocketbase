/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_577094678")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = usuario",
    "updateRule": "@request.auth.id = usuario",
    "viewRule": "@request.auth.id = usuario"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_577094678")

  // update collection data
  unmarshal({
    "deleteRule": null,
    "updateRule": "@request.auth.id = \"\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
})
