const mongoose = require('mongoose');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand')
    .then( () => {
        console.log('MONGO CONNECTION')
    })
    .catch( error => {
        console.log('OH NO MONGO ERROR');
        console.log(error)
    })

// const p = new Product({
//     name:'Ruby Grapefruit',
//     price:2000,
//     category:'fruit'
// })
// p.save().
//     then(p => {
//         console.log(p)
//     })
//     .catch(err => {
//         console.log(err)
//     })

const seedProducts = [
    {
        name:'Fariy Eggplant',
        price:1000,
        category:'vegetable'
    },
    {
        name:'Organic Goddess Melon',
        price:5000,
        category:'fruit'
    },
    {
        name:'Organic Mini Seedless Watermelon',
        price:4000,
        category:'fruit'
    },
    {
        name:'Organic Celery',
        price:2000,
        category:'vegetable'
    },
    {
        name:'Chocolate Whole Milk',
        price:2650,
        category:'dairy'
    }
]
Product.insertMany(seedProducts)
    .then(res => {
        console.log(res)
    })
    .catch(error => {
        console.log(error)
    })
