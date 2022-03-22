const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const AppError = require('./AppError');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand')
    .then( () => {
        console.log('MONGO CONNECTION')
    })
    .catch( error => {
        console.log('OH NO MONGO ERROR');
        console.log(error)
    })


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.engine('ejs',ejsMate);

app.use(express.urlencoded({ extended:true }));
app.use(methodOverride('_method'))

const categories = ['fruit','vegetable','dairy'];

// async function error handling function 
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

// show all products
app.get('/products',wrapAsync(async (req,res) => {
    const products = await Product.find({});
    let productsCount = products.length;
    res.render('products/index',{ products, productsCount});
}))

// add product
app.get('/products/new',(req,res) => {
    res.render('products/new',{ categories })
})

app.post('/products',wrapAsync(async(req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
}))

// find products id
app.get('/products/:id', wrapAsync(async(req,res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if(!product) {
        throw new AppError('This Product Not Found',404);
    }
    res.render('products/show',{ product })
}))

app.get('/products/:id/edit',wrapAsync(async(req,res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if(!product) {
        throw new AppError('This Product Not Found',404);
    }
    res.render('products/edit',{ product,categories })
}))

app.put('/products/:id',wrapAsync(async(req,res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id,req.body,{runValidators:true,new:true});
    res.redirect(`/products/${product._id}`)
}))

// delete product
app.delete('/products/:id',wrapAsync(async(req,res) => {
    const { id } = req.params;
    const deleted_product = await Product.findByIdAndDelete(id);
    res.redirect('/products')
}))

const handleValidationErr = err => {
    console.dir(err);
    //In a real app, we would do a lot more here...
    return new AppError(`Validation Failed...${err.message}`, 400)
}

app.use((err,req,res,next) => {
    if(err.name==='ValidationError'){
        err = handleValidationErr(err)
    }
    next(err);
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).send(message);
})

app.listen(3000,() => {
    console.log('App is listening on PORT 3000')
})