var express = require('express');
var fs = require('fs');

var Mock = require('mockjs');
var path = require('path');


var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/canvas.action', function (req, res) {
    var result = [];
    for(var i = 0; i < 51;i++){
        var num = [Math.ceil(Math.random()*6),Math.ceil(Math.random()*6),Math.ceil(Math.random()*6)];
        result.push({
            nums: num.sort(),
            issue: i == 30 ? 87 : i + 1
        });
    }
    res.send(JSON.stringify(result))
});

router.post('/download.action', function (req, res) {
    if(req.body.img){
        var imgData = req.body.img;
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data ,'base64');
        fs.writeFile('out/1.png', dataBuffer ,function(err){
            if(err){
                res.send(err);
            }else{
                res.send('chengg');
            }
        });
    }
});

module.exports = router;
