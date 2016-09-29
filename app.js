var express = require('express');
var path = require('path');
var fs = require('fs');
var	app = express();
var file;
//加载静态
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/saveTxt', (req, res) => {
	let name = req.query.name;
	if (!name) {
		res.send("empty");
		return false;
	}
	file = 'public/txt/' + name + '.txt';
	let remark = req.query.remark; 
	let content = "用户名：" + name + "\r\n" + 
                  "描述：" + remark + "\r\n";
	if (fs.existsSync(file)) {
		fs.appendFileSync(file, '\r\n' + content);
	} else {
		fs.writeFileSync(file, content, 'utf8');
	}
	res.send('success');
});

app.get('/image', (req, res) => {
	if (!file) {
		res.redirect('/');
		return false;
	}
	res.sendFile(path.join(__dirname, 'views', 'image.html'));
});

app.get('/getImgs', (req, res) => {
	let url = path.resolve(__dirname)+ '\\public\\images';
	allImgs = {};
	readFile(url);
	res.send(allImgs);
});

app.get('/imageInfo', (req, res) => {
	if (!file) {
		res.send("empty");
		return false;
	}
	let type = req.query.type;
	let level = req.query.level;
	let key = req.query.key;
	let content = '';
	let imgObj = allImgs[`${key}`];
	for (let i in imgObj) {
		content += "第" + (Number(i) + 1) + "图片地址：" + imgObj[i] + "\r\n";
	}
	content += "类别：" + type + '\r\n' + 
			  "程度：" + level + '\r\n';
	fs.appendFileSync(file, content);
	res.send('success');
});

var allImgs = {};
// 遍历图片
function readFile (url, filename) {
	filename = (filename == null) ? 'default' : filename; 
	if (fs.existsSync(url)) {
		let singalFile = [];
		let allFiles = fs.readdirSync(url);
		for (let i = 0; i < allFiles.length; i++){
			let isfile = fs.statSync(url + '/' + allFiles[i]).isFile();
			if (!isfile) {
				readFile(url + '/' + allFiles[i], allFiles[i]);
				continue;
			} 
			if (isImg(allFiles[i])) {
				let imgurl = (filename == 'default') ? 'images/' + allFiles[i] : 'images/'+ filename +'/' + allFiles[i]
				singalFile.push(imgurl);
			}
		}

		allImgs[`${filename}`] = singalFile;
	}
}

// 判断是否为图片
function isImg (imgname) {
	var extStart=imgname.lastIndexOf('.');
	var ext=imgname.substring(extStart,imgname.length).toUpperCase();
	if(ext !='.BMP' && ext !='.PNG' && ext !='.GIF' && ext !='.JPG' && ext !='.JPEG'){
		return false;
	} 
	return true;
}

app.listen(3002, function(){    
	console.log('Server is running, port is 3002');
});
