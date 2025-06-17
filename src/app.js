const express = require('express');

const app = express();

app.get('/sales', (err, req, res, next) => {
    const {coupenCode} = req.query;
    const salesCoupen = 'SALE50';
    if(coupenCode != salesCoupen){
     const err = new Error('Invalid coupen code')
     next(err);
    }
    else{
     next();
    }
})

app.get('/sales', (req, res, next) => {
     console.log('Congrulations! You have successfully applied the coupen code');
     next();
})

app.get('/sales', (req, res) => {
     res.send('Welcome to the sales page');
})

app.use((err, req, res, next) => {
     res.status(500).send(`Error : ${err.message}`);
})
app.listen(3000, () => {
     console.log('Server is running on port 3000');
})

