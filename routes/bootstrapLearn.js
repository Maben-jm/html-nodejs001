"use strict";

let express = require("express");
let router = express.Router();
let path = require('path'); //系统路径模块
let fs = require('fs'); //文件模块


router.get('/bootstrp-table', function (req, res, next) {
    res.render('bootstrap-table');
});

router.post('/table', function (req, res, next) {
    let file = path.join(__dirname, '../public/json/table.json'); //文件路径，__dirname为当前运行js文件的目录
    //读取json文件
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            res.send('文件读取失败');
        } else {
            data = JSON.parse(data);
            res.send(data);
        }
    });
});


router.post('/tableFy', function (req, res, next) {
    let file = path.join(__dirname, '../public/json/table.json'); //文件路径，__dirname为当前运行js文件的目录
    //读取json文件
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            res.send('文件读取失败');
        } else {
            data = JSON.parse(data);
            console.log('body', req.body);
            let name = req.body.name;
            if (name && name !== '') {
                let newData = new Array();
                for (let temp in data) {
                    let tName = data[temp].name;
                    if (tName.indexOf(name) !== -1) {
                        newData.push(data[temp]);
                    }
                }
                data = newData;
            }
            let limit = req.body.rows;
            let offset = req.body.page;
            if (!limit || limit === '') {
                res.send(data);
                return;
            }
            let start = (offset - 1) * limit;
            let arr = new Array();
            for (let i = 0; i <= limit - 1; i++) {
                if ((start + i) > data.length - 1) {
                    break;
                }
                arr.push(data[start + i]);
            }
            res.send({
                'total': data.length,
                'rows': arr
            });
        }
    });
});


module.exports = router;