const mongoose = require('mongoose');
const farms = require('./farmDatas');
const Farmstand = require('../models/product');

console.log(farms.length);
mongoose.connect('mongodb://localhost:27017/farmStand')
    .then( () => {
        console.log('MONGO CONNECTION')
    })
    .catch( error => {
        console.log('OH NO MONGO ERROR');
        console.log(error)
    })
    
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Farmstand.deleteMany({});
    for (let i=0;i<farms.length;i++){
        const product = new Farmstand({
            name:farms[i].name,
            img:'https://source.unsplash.com/collection/1027750',
            price:farms[i].price,
            category:farms[i].category,
            qty:farms[i].qty
        })
        await product.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})