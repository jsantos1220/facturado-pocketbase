/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
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

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1440673410",
    "max": 0,
    "min": 0,
    "name": "comprobante",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4095515429",
    "max": 0,
    "min": 0,
    "name": "cliente",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2698878039",
    "max": 0,
    "min": 0,
    "name": "termino_pago",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2384492675",
    "max": 0,
    "min": 0,
    "name": "estatus",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3776899405",
    "max": 0,
    "min": 0,
    "name": "items",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number778798567",
    "max": null,
    "min": null,
    "name": "sub_total",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number2151496396",
    "max": null,
    "min": null,
    "name": "itbis",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number3316683524",
    "max": null,
    "min": null,
    "name": "descuento",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "number3257917790",
    "max": null,
    "min": null,
    "name": "total",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text27834329",
    "max": 0,
    "min": 0,
    "name": "fecha",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1674213815",
    "max": 0,
    "min": 0,
    "name": "fecha_pago",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_577094678")

  // remove field
  collection.fields.removeById("text982552870")

  // remove field
  collection.fields.removeById("text1440673410")

  // remove field
  collection.fields.removeById("text4095515429")

  // remove field
  collection.fields.removeById("text2698878039")

  // remove field
  collection.fields.removeById("text2384492675")

  // remove field
  collection.fields.removeById("text3776899405")

  // remove field
  collection.fields.removeById("number778798567")

  // remove field
  collection.fields.removeById("number2151496396")

  // remove field
  collection.fields.removeById("number3316683524")

  // remove field
  collection.fields.removeById("number3257917790")

  // remove field
  collection.fields.removeById("text27834329")

  // remove field
  collection.fields.removeById("text1674213815")

  return app.save(collection)
})
