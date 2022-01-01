const express = require('express');
const mongoose =require('mongoose');
const dotenv= require('dotenv');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();

//connect to mongodb atlas
mongoose.connect(process.env.MONGO_URL).then(res => console.log("connected")).catch(err => console.log(err));
const ProductSchema=new mongoose.Schema(
  {
  category:{type: String,},
  title: {type: String,},
  img: {type: String,},
  price: {type: Number,}
  });
  Products= mongoose.model('product',ProductSchema);

//get products in specific category
app.get('/products/:category', async (req, res)=>{
  try{
    const product= await Products.find({category: req.params.category});
    res.status(200).json(product);
  }
  catch(err){
    res.status(500).json(err);
  }
});

//update products in db
app.put('/products/:title', async (req, res) =>{
  try{
    const updatedProduct=await Products.update(
    {title: req.params.title},
    {$set: req.body,},
    {new: true}
    );
    res.status(200).json(updatedProduct);
  }
  catch(err){
    res.status(500).json(err);
  }
});

//add products to db
app.post('/products', async (req, res)=>{
  const newProduct= new Products(req.body);
  try {
    const savedProduct= await newProduct.save();
    res.status(200).json(savedProduct);
  }
  catch(err){
    res.status(500).json(err);
    }
});

//get all products
app.get('/products', async (req, res)=>{
  try{
    let products;
    products= await Products.find();
    res.status(200).json(products);
  }
    catch(err){
      res.status(500).json(err);
    }
  });

//delete
app.delete('/products/:id', async (req,res)=>{
  try{
    await Products.deleteOne({ _id: req.params.id });
    res.status(200).json('Product deleted');
  }
  catch(err){
    res.status(500).json(err);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Application is running on ${port}`);
}); 
