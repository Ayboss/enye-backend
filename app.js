const express = require('express');
const axios = require('axios');
const app = express();

app.get('/',(req,res,next)=>{
    res.send('i am a child of God..')
})


app.get('/api/rates',async (req,res)=>{
    //get the following query parameters
    const {base, currency} = req.query;
    if(!base || !currency){
        return res.status(400).json({
            status: 'error',
            error:'invalid resquest, base and currency query is required'
        })
    }
    console.log(base, currency)
    //make an api call to the base server
    try{
      const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${base.toUpperCase()}&symbols=${currency.toUpperCase()}`);
      const {base: apibase ,rates} = response.data;
      const todaydate = new Date();
      return res.status(200).json({
          results: {
              base:apibase,
              date:`${todaydate.getFullYear()}-${todaydate.getMonth() + 1}-${todaydate.getDate()}`,
              rates
          }
      });
    }catch(err){
        console.log(err);
        if(err.response){
            return res.status(err.response.status).json(err.response.data)
        }
        res.status(500).json({
            error:'something went very wrong'
        })
    }
});

app.all('*',(req,res)=>{
    console.log(req.originalUrl);
    res.status(404).json({
        err:  `${req.originalUrl} not available`
    })
})

//listen to incoming request
const port = process.env.PORT || 7000;
app.listen(port,()=>{
    console.log('knock knock, open port' + port);
})