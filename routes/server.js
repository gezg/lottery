var express = require('express');
var images  = require('images');
var Mock    = require('mockjs');
var path    = require('path');


var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/canvas.action', function (req, res) {
    var result = [];
    for(var i = 0; i < 51;i++){
        var num = [Math.ceil(Math.random()*6),Math.ceil(Math.random()*6),Math.ceil(Math.random()*6)];
        var nums = num.sort();
        result.push({
            n1: nums[0],
            n2: nums[1],
            n3: nums[2],
            issueno: i == 30 ? 87 : i + 1
        });
    }
    res.send(JSON.stringify(result))
});

router.post('/download.action', function (req, res) {
    if(req.body.img){
        var imgData = req.body.img;
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data ,'base64');

        var body = images(dataBuffer ,0 ,dataBuffer.length);
        var head = images(path.join(__dirname ,'/header.png'));
        var currImg = images(756 ,1292);

        currImg.draw(head ,0 ,0);
        currImg.draw(body ,0 ,120);
        currImg.save('out/1.png');
        // fs.writeFile('out/1.png', currImg ,function(err){
        //     if(err){
        //         res.send(err);
        //     }else{
        //         res.send('chengg');
        //     }
        // });
    }
});

module.exports = router;
