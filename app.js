var express = require('express')
var fileUpload = require('express-fileupload');
var app = express();
var crypto = require('crypto');
/**
 * {limits: { fileSize: 50 * 1024 * 1024 },}
 * 
 */
app.use(fileUpload());
app.use(express.static(__dirname + '/public'));
app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

var makeFileName = (filename)=>{
    var tmp = new Date();
    tmp += filename;
    console.log(tmp);
    tmp = crypto.createHash('sha256').update(tmp).digest('hex');
    console.log(tmp);
    return tmp;
};

app.get('/',(req,res)=>{
    res.render('index.html');
});

app.post('/upload',(req,res)=>{
    if(Object.keys(req.files).length==0){
        res.status(400).send('Access Denied.');
    }
    var uploadFile = req.files.file;
    var fileName = makeFileName(uploadFile.name);
    uploadFile.mv(__dirname+'/public/upload/'+fileName,(err)=>{
        if(err)
            return res.json({"result":false,"reason":err});
        res.json({"result":true,"filename":fileName});
    })

});

app.listen(3000,()=>{
    console.log('Server is running now on port 3000.');
});