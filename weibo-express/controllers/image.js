const fs = require('fs')
const dbConfig = require("../util/DBConfig")
const path = require('path')
const swiperAddress = 'C:\\Users\\Hi菠萝\\Documents\\Project\\ExpressApi\\apiLearn\\public\\uploads\\'
// 上传图片并保存到数据库当中
const upSwiperImage = (req, res) => {
  if (req.file.length === 0) {
    res.render('error', { message: '上传文件不能为空' })
  } else {
    const file = req.file
    console.log(file)
    // fs.renameSync('./public/uploads/'+file.filename,'./public/uploads/'+file.originalname)
    // fs.renameSync(path.basename('C:\\Users\\Hi菠萝\\Documents\\Project\\ExpressApi\\apiLearn\\public\\uploads'),) 
    // fs.renameSync(path.join(__dirname, '../public/uploads/' + file.filename), path.join(__dirname, '../public/uploads/' + file.originalname))
    const oldname = file.path
    const newname = file.destination + '/' + file.originalname
    const goodID = makeid(8)
    console.log(req.query)
    console.log(newname)
    fs.renameSync(oldname, newname)
    res.set({ 'content-type': 'application/JSON; charset=utf-8' })
    const imgUrl = 'http://localhost:3000/uploads/' + file.originalname
    const sql = 'INSERT INTO swiperimgae (good_id,name,url,address) VALUES (?,?, ?,?)'
    const sqlArr = [goodID, file.originalname, imgUrl, newname]
    dbConfig.sqlConnect(sql, sqlArr, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        if (data.affectedRows === 1) {
          res.send({
            status: 200,
            msg: '图片上传成功',
            url: imgUrl
          })
        } else {
          res.send({
            status: 400,
            msg: '图片上传失败'
          })
        }
      }
    })
  }
}
const seeSwiperImage = (req, res) => {
  const sql = 'SELECT * FROM swiperimgae'
  const sqlArr = []
  const callBack = (err, data) => {
    if (err) {
      console.log('连接出错' + err)
      res.send({
        status: 400,
        msg: '出错了'
      })
    } else {
      res.send({
        status: 200,
        list: data
      })
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}
// 删除图片文件并删除到数据库当中数据
const delSwiperImage = (req, res) => {
  const delID = req.query.delID
  // const delAddress = req.query.del_address
  const delname = req.query.delname
  console.log(req)
  fs.unlinkSync(swiperAddress + delname)
  console.log(swiperAddress + delname)
  const sql = 'delete from swiperimgae where id = ?'
  const sqlArr = [delID]
  dbConfig.sqlConnect(sql, sqlArr, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      if (data.affectedRows === 1) {
        res.send({
          status: 200,
          msg: '图片删除成功'
        })
      } else {
        res.send({
          status: 400,
          msg: '图片删除失败'
        })
      }
    }
  })
}
// 随机生成11位token
function makeid (length) {
  var result= '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result
}
// 重写上传图片到数据库
const newUpSwiperImage = (req, res) => {
  res.set({ 'content-type': 'application/JSON; charset=utf-8' })
  const goodID = makeid(8)
  const name = req.query.name
  const imgUrl = 'http://localhost:3000/uploads/' + name
  const sql = 'INSERT INTO swiperimgae (good_id,name,url) VALUES (?, ?,?)'
  const sqlArr = [goodID, name, imgUrl]
  dbConfig.sqlConnect(sql, sqlArr, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      if (data.affectedRows === 1) {
        res.send({
          status: 200,
          msg: '图片上传成功',
          url: imgUrl
        })
      } else {
        res.send({
          status: 400,
          msg: '图片上传失败'
        })
      }
    }
  })
}
module.exports = {
  upSwiperImage, seeSwiperImage, delSwiperImage, newUpSwiperImage
}