const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const dotenv= require('dotenv');
const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(res => console.log("connected")).catch(err => console.log(err));

const itemSchema=new mongoose.Schema({
  name:String,
  price:Number
});
const Item=mongoose.model('item',itemSchema);
const cartSchema=new mongoose.Schema({
  item:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'item'}]});
const Cart=mongoose.model('cart',cartSchema);
//const newItem=new Item({name:'ipod', price:9.99});
//newItem.save();
//const newCart=new Cart({item: newItem._id});
//newCart.save();
//console.log('item: ',newItem)
//console.log('cart: ',newCart)
//have to create item n cart separately 1st n then run then after...so put in different post route
const order=async function(){ await Cart.findOne({}).populate('item','price').exec(function(err, res){
    if(err) console.log(err)
    console.log('order: ',res.item[0].price)
})};
order()
//gotta modify this to put in server4 after implementing functionalities above
//app.post('/cart',async (req,res)=>{
  //const user=await Users.findOne({name:"john"})
  //const store=await Products.find()
  //const ids=store.map(product=>product._id.toString())
  //const cart=user.cart
  //if (ids.includes(req.body._id)){
    //cart.push({_id:req.body._id, qty:req.body.qty})
   //await user.save()
   // console.log("cart: ",cart)
   // res.json(cart)
  //}else{ 
    //console.log('item not found')
   // res.send('item not found')
  //}
 // });
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Application is running on ${port}`);
}); 