const Router = require('express').Router;

const router = Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const db = require('../db');
const Decimal128 = mongodb.Decimal128;
const ObjectId = mongodb.ObjectId;

// Get list of products products
router.get('/', (req, res, next) => {
  const queryPage = req.query.page;
  const pageSize = 2;
  const products = [];
  db.getDb().db().collection('products')
    .find({})
    //.sort({price: -1})
    //.skip((queryPage - 1) * pageSize) // uncomment to use paging feature
    //.limit(pageSize)
    .forEach(productDoc=> {
      console.log(productDoc);
      productDoc.price = productDoc.price.toString();
      products.push(productDoc);
    })
    .then(result => {
      console.log(products);
      res.status(200).json(products);
    }).catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occured'});
    });

});

// Get single product
router.get('/:id', (req, res, next) => {
  db.getDb().db().collection('products').findOne({"_id": new ObjectId(req.params.id)})
  .then(productDoc => {
    productDoc.price = productDoc.price.toString();
    res.status(200).json(productDoc);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: 'An error occured.'})
  })
});

// Add a new product
// Requires logged in user
router.post('', (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description, 
    price: Decimal128.fromString(req.body.price.toString()), // storing price as 128bit decimal in MongoDB
    image: req.body.image
  };
  console.log(newProduct);

  db.getDb().db().collection('products').insertOne(newProduct).then(result => {
      console.log(result);
      res.status(201).json({ message: 'Product added', productId: result.insertedId });
    }).catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occured'});
    })
  });


// Edit existing product
// Requires logged in user
router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // to store as 128bit decimal in MongoDB
    image: req.body.image
  };
  console.log(updatedProduct);

  db.getDb().db().collection('products')
    .updateOne(
      {_id: new ObjectId(req.params.id)},
      {
        $set: updatedProduct
        
      }
    )
    .then(result => {
      res.status(200)
      .json({message: 'Product updated id =', productId: req.params.id})
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "An error occured while update."});
    })
});

// Delete a product
// Requires logged in user
router.delete('/:id', (req, res, next) => {
  db.getDb().db().collection('products').deleteOne({_id: new ObjectId(req.params.id)}).then(() => {
    console.log('Product deleted id=',  req.params.id);
    res.status(200).json({message: 'Product deleted.'});
  }).catch(err=>{
    console.log(err)
    res.status(500).json({message: "An errr occured while delete."});
  })
});

module.exports = router;
