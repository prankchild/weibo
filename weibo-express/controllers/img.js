const fs = require('fs')
const dbConfig = require("../util/DBConfig")
const multer = require('multer'); // v1.0.5
const upload = multer();
const path = require('path')
const multiparty = require('multiparty');
const { addweibolove } = require('./weiboController');
const { log } = require('console');
const user_id = 30001



//设置文件上传存储路径
const uploadDir = path.join(__dirname, '../public/uploads');
// const uploadDir = `./public/uploads/${moment().format('YYYYMMDD')}`
fs.mkdirSync(uploadDir, {
    recursive: true
}); // recursive 使用递归创建目录，如果父目录不存在会先创建
const storage = multer.diskStorage({ // 设置上传中间件
    destination: function (req, file, cb) { // 上传路径
        // console.log(file);
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) { // 上传之后的文件名
        // console.log(file);
        imagename = Date.now() + '-' + file.originalname
        cb(null, imagename);
    }
})
//设置multer upload
var uploade = multer({
    storage: storage
}).array('images');

function arrup (req, res, next) {
  //多个文件上传
  uploade(req, res, function (err) {
      if (err) {
        console.error('1.[System] ' + err.message);
      } else {
       // 设置微博图片地址数组
       let imgArr = []
       //循环处理
       let imgPath=[];
       req.files.forEach(function (i) {
           //获取临时文件的存储路径
           imgPath.push(i.path);
           console.log("i.path:",i.path)
          imgArr.push('http://localhost:3000/uploads/' + i.filename)
       });
       //所有文件上传成功
       //回复信息
       const reponse = {
           message: 'File uploaded successfully',
       };
      //  返回
       res.send({
        imgArr : imgArr,
       });
      }
  });
}

// 上传微博并保存到数据库当中
const storageSql = async (req,res) =>{
  let weibo_userid = req.query.user_id
  let weibo_container = req.query.container
  let weibo_image = req.query.imgArr
  let weibo_isimage = req.query.isimage
  console.log(weibo_userid,weibo_container,weibo_image,weibo_isimage);
  let addWeibo = async (weiweibo_userid,weibo_container,weibo_image,weibo_isimage) => {
    const sql ="INSERT INTO weibo (weibo_userid, weibo_container,weibo_image,weibo_isimage,weibo_forwords,weibo_loves,weibo_comments) VALUES (?,?,?,?,?,?,?)"
    const sqlArr = [weibo_userid,weibo_container,weibo_image,weibo_isimage,0,0,0];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  const add = await addWeibo(weibo_userid,weibo_container,weibo_image,weibo_isimage)
  if(add){
    let seluser = async (weibo_userid) => {
      const sql ="select user_blogs from user where user_id=?"
      const sqlArr = [weibo_userid];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    }
    let blogs = Number((await seluser(weibo_userid))[0].user_blogs) + 1
    console.log(blogs);
    console.log(weibo_userid);
    let updateuser = async (blogs,weibo_userid) => {
      const sql = 'UPDATE user SET user_blogs = ? WHERE user_id = ?'
      const sqlArr = [blogs,weibo_userid];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    }
    const update = await updateuser(blogs,weibo_userid)
    if(update){
      res.send({
        status : 200,
        msg : "添加成功"
      })

    }
  }
}
// 上传头像
const upAvatar = (req, res) => {
  const file = req.file
  const oldname = file.path
  const pathname = makeid(6) + file.originalname
  const newname = file.destination + '/'+ pathname
  fs.renameSync(oldname, newname)
  res.set({ 'content-type': 'application/JSON; charset=utf-8' })
  res.send({
    status : 200,
    imgUrl: 'http://localhost:3000/uploads/avatar/' + pathname
  })
}
function makeid (length) {
  var result= '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

module.exports = {
  upAvatar,arrup,storageSql
}