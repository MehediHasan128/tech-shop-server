const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jmtxbp5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const productCollection = client.db('shopDB').collection('products');
    const cartCollection = client.db('shopDB').collection('cart')


    app.get('/product/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.findOne(query);
        res.send(result);
    })

    app.get('/products/:name', async(req, res) =>{
        const productBrand = req.params.name;
        const query = {brandName: productBrand}
        const result = await productCollection.find(query).toArray();
        res.send(result)
    })

    app.get('/cart', async(req, res) =>{
      const result = await cartCollection.find().toArray();
      res.send(result);
    })

    app.get('/products', async(req, res) =>{
      const result = await productCollection.find().toArray();
      res.send(result);
    })

    app.get('/cart/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.findOne(query);
      res.send(result)
    })

    app.post('/products', async(req, res) =>{
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
    })

    app.post('/cart', async(req, res) =>{
        const cartProduct = req.body;
        const result = await cartCollection.insertOne(cartProduct);
        res.send(result)
    })


    app.put('/cart/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name,
          brandName: updatedProduct.brandName,
          categorie: updatedProduct.categorie,
          price: updatedProduct.price,
          ratings: updatedProduct.ratings,
          image: updatedProduct.image,
          description: updatedProduct.description
        }
      }
      const result = await cartCollection.updateOne(query, product, options);
      res.send(result);
    })


    app.delete('/cart/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res)=>{
    res.send('My tech shop server is running successfully');
})


app.listen(port, () =>{
    console.log(`This server is running on port ${port}`);
})