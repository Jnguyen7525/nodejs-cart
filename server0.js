const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const dotenv= require('dotenv');
const app = express();

dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGO_URL).then(res => console.log("connected")).catch(err => console.log('something wrong',err));

const productSchema=new mongoose.Schema(
  {
  category:{type: String,},
  name: {type: String,},
  price: {type: Number,}
  });
  Product= mongoose.model('product',productSchema);
  
const userSchema=new mongoose.Schema({
  name:String,
  psw:String,
  cart: [{item:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'product'},
  qty:{type:Number, default: 1}}]
})
const User=mongoose.model('user',userSchema)
//add new user
app.post('/user/add',async (req,res)=>{
  try{
    const newUser=new User({name:req.body.name})
  newUser.save()
  console.log(newUser)
  res.status(200).json(newUser)
  }catch(err){
    res.status(500).json(err)
  }
})
//delete user
app.delete('/user/:id',async (req,res)=>{
  try{
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json('user deleted');
  }
  catch(err){
    console.log(er)
    res.status(500).json(err);
  }
})
//get products in specific category
app.get('/products/:category', async (req, res)=>{
  try{
    const product= await Product.find({category: req.params.category});
    res.status(200).json(product);
  }
  catch(err){
    res.status(500).json(err);
  }
})
//update product
app.put('/products/:name', async (req, res) =>{
  try{
    const updatedProduct=await Product.update(
    {name: req.params.name},
    {$set: req.body,},
    {new: true}
    );
    res.status(200).json(updatedProduct);
  }
  catch(err){
    res.status(500).json(err);
  }
});
//add new product to db
app.post('/products', async (req, res)=>{
  const newProduct= new Product(req.body);
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
    products= await Product.find();
    res.status(200).json(products);
  }
    catch(err){
      res.status(500).json(err);
    }
  });
  //delete product
app.delete('/products/:name', async (req,res)=>{
  try{
    await Product.deleteOne({name: req.params.name});
    res.status(200).json('Product deleted');
  }
  catch(err){
    res.status(500).json(err);
  }
});
//add items to cart
app.post('/cart',async (req,res)=>{
  const user=await User.findOne({name:"john"})
  const store= await Product.find()
  const ids=store.map(product=>product._id.toString())
  const cart=user.cart
  if (ids.includes(req.body._id)){
    cart.push({item:req.body._id, qty:req.body.qty})
    console.log('cart: ',cart)
    await user.save()
  }else{ 
   console.log('item not found')
   res.send('item not found')
  }})
  //order  
  app.get('/order',async (req,res)=>{
    await User.findOne({}).populate({path:'cart.item',select:'name price'}).exec(function(err, user){
    if(err) console.log(err)
      const items=user.cart
      stuff=[]
      list=items.map(item=>stuff.push(
        {name:item.item.name, price:item.item.price*item.qty, qty: item.qty}))
      console.log('here is ur order: ',stuff)
      let totalprice=0
      total=stuff.map(item=>totalprice+=item.price*item.qty)
      console.log('total: ',totalprice)
      res.status(200).json({order:stuff,totalprice:totalprice})
    })
}
 )
 //home login
 app.get('/', async (req,res)=>{
   
 })
  
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Application is running on ${port}`);
}); 