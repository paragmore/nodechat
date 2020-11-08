const router = require('express').Router() 

router.get('/',(req,res)=>{
    res.send("Sever is running")
})

module.exports = router