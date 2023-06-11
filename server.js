const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const path = require('path');
app.use(express.static('build'));
app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'build','index.html'))
});
app.listen(port,(err) => {
    if (err) {
        throw err
    }
    console.log('Server started on port',port)
})