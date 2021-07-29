const { createConnection } = require("mysql");
const dbConfig = require("../util/DBConfig")
const nodemailer = require('../util/emailConfig')
getUser = (req, res) => {
  const sql = 'SELECT * FROM user';
  const sqlArr = [];
  const callBack = (err, data) => {
    if (err) {
      console.log("连接出错" + err);
    } else {
      res.send({
        'list': data
      })
    }
  }

  dbConfig.sqlConnect(sql, sqlArr, callBack)
}
getUserId = (req, res) => {
  let { user_id } = req.query;
  let sql = `SELECT * FROM backstageuser where user_id=?`;
  let sqlArr = [user_id];
  let callBack = (err, data) => {
    if (err) {
      console.log("连接出错" + err);
    } else {
      res.send({
        'list': data
      })
    }
  }

  dbConfig.sqlConnect(sql, sqlArr, callBack)
}
// 随机生成32位token
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
// 随机生产6位数
function verCodeGenerate() {
  let res = ''
  // 生成6位随机数即可 由于仅为练习，不必用太高深的生成
  for (let i = 0; i < 6; i++) {
    res += Math.floor((Math.random() * 9) + 1)
  }
  return res
}
// 用户登录
// let Login = (req, res) => {
//   let email = req.query.email;
//   let password = req.query.password;
//   // console.log(req)
//   let sql = 'select * from user where user_email=?';
//   let sqlArr = [email];
//   let String = makeid(32);
//   let callBack = async (err, data) => {
//     if (err) {
//       // console.log(err);
//       res.send({
//         status: 400,
//         msg: '出错了'
//       });
//     } else if (data.length == 0) {
//       res.send({
//         status: 400,
//         msg: '用户名或者密码出错！'
//       });
//     } else {
//       if (data[0].user_password == password) {
//         res.send({
//           status: 200,
//           msg: '登录成功',
//           token: String
//         });
//         console.log(String);
//       } else {
//         res.send({
//           status: 400,
//           msg: '用户名或者密码出错！'
//         });
//       }
//     }
//   }

//   dbConfig.sqlConnect(sql, sqlArr, callBack)
// }
let Login = async (req,res) => {
  const String = makeid(32);
  const email = req.query.email;
  const password = req.query.password;
  const selectuser = async (email) => {
    const sql = "select user_password,user_id from user where user_email=?"
    const sqlArr = [email]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data;
  };
  const user = (await selectuser(email))[0]
  if( user.user_password === password ){
    res.send({
      status: 200,
      msg: '登录成功',
      token: String,
      user_id: user.user_id
    })
  }else if( user.user_password.length === 0 ){
      res.send({
        status: 400,
        msg: '用户名或者密码出错！'
      });
  }else{
      res.send({
        status: 400,
        msg: '用户名或者密码出错！'
      });
  }
}
// 验证邮箱是否被注册以及发送验证码
const isemail = (req, res) => {
  const email = req.query.user_email
  // 检查邮箱是否已经被注册
  const sql = 'SELECT * FROM user where user_email=?'
  const sqlArr = [email]
  const callBack = async (err, data) => {
    if (err) {
      console.log('连接出错' + err)
      res.send({
        status: 400,
        msg: err
      })
    } else if (data.length !== 0) {
      res.send({
        status: 401,
        msg: '该邮箱已被注册！'
      })
    } else {
      res.send({
        status: 200,
        msg: '该邮箱可以注册！'
      })
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}
// 发送验证码
const EmailCode = async (req, res) => {
  const email = req.query.user_email
  let verCode = ''
  // 判断session里面是否存在email(email为变量)这个key
  console.log(req.session[email]);
  console.log(req.session.emailVerificationCode);
  if (req.session[email]) {
    if ((Date.parse(new Date()) - req.session[email][1]) / 1000 > 60) {
      verCode = verCodeGenerate()
      req.session[email] = [verCode, Date.parse(new Date()), email]
      req.session.emailVerificationCode = req.session[email][0]
      req.session.ifemail = req.session[email][2]
      console.log(req.session[email])
      await nodemailer.emailSingUp(email, verCode, res).catch(e => {
        res.end('验证码发送失败')
      })
    } else {
      res.send({
        status: 408,
        msg: '60秒只能发一条'
      })
    }
  } else {
    console.log(req.session[email])
    verCode = verCodeGenerate()
    req.session[email] = [verCode, Date.parse(new Date()), email]
    req.session.emailVerificationCode = req.session[email][0]
    req.session.ifemail = req.session[email][2]
    console.log('emailVerificationCode验证码:' + req.session.emailVerificationCode)
    console.log(req.session[email])
    res.send({
      status: 200,
      email: req.session[email]
    })
    await nodemailer.emailSingUp(email, verCode, res).catch(e => {
      res.end('验证码发送失败')
    })
  }
}
// 注册用户
const register = (req, res) => {
  const name = req.query.user_name
  const email = req.query.user_email
  const password = req.query.user_password
  const verCode = req.query.verCode
  console.log(req.session[email])
  console.log(req.session.emailVerificationCode)
  console.log(req.session.ifemail)
  if (req.session.emailVerificationCode === verCode && req.session.ifemail === email) {
    const sql = 'INSERT INTO user (user_email,user_name,user_password,user_desc,user_avatar,user_blogs,user_follows,user_fans) VALUES (?,?,?,?,?,?,?,?)'
    const sqlArr = [email, name, password, '暂无个性签名', 'https://img1.baidu.com/it/u=2996250653,3603163890&fm=26&fmt=auto&gp=0.jpg', '0', '0', '0']
    const callBack = async (err, data) => {
      if (err) {
        console.log('连接出错' + err)
        res.send({
          status: 400,
          msg: err
        })
      } else {
        res.send({
          status: 200,
          msg: '用户注册成功！'
        })
      }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
  } else {
    res.send({
      status: 408,
      msg: '验证码出错',
      code: req.session.emailVerificationCode
    })
  }
}
// 首页的个人资料展示
const userData = (req, res) => {
  const user_id = req.query.user_id
  const sql = 'select * from user where user_id=?';
  const sqlArr = [user_id];
  let callBack = async (err, data) => {
    if (err) {
      res.send({
        status: 400,
        msg: '出错了'
      });
    } else {
      res.send({
        'data': data,
        status: 200
      })
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}
const userWeibo = (req, res) => {
  const user_id = req.query.user_id
  const sql = 'select weibo.*,weibo_image.weibo_imgUrl from weibo left join weibo_image on weibo.weibo_id= weibo_image.weibo_id where weibo.weibo_userid = ?';
  const sqlArr = [user_id];
  let callBack = async (err, data) => {
    if (err) {
      res.send({
        status: 400,
        msg: '出错了'
      });
    } else {
      res.send({
        'data': data,
        status: 200
      })
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}


// 修改资料
const edituser = async (req,res) =>{
  const user_id = req.query.user_id
  const user_name = req.query.user_name
  const user_desc = req.query.user_desc
  const user_avatar = req.query.user_avatar
  const edit = async (user_id,user_name,user_desc,user_avatar) => {
    const sql = "UPDATE user SET user_name=?,user_desc=?,user_avatar=? WHERE user_id=?"
    const sqlArr = [user_name,user_desc,user_avatar,user_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  const edituser = await edit(user_id,user_name,user_desc,user_avatar)
  if(edituser){
    res.send({
      msg : "修改成功",
      status : 200
    })
  }
}
// 读取资料
const getuser = (req, res) => {
  const user_id = req.query.user_id
  const sql = 'select user_name,user_avatar,user_desc from user where user_id=?'
  const sqlArr = [user_id];
  let callBack = async (err, data) => {
    if (err) {
      res.send({
        status: 400,
        msg: '出错了'
      });
    } else {
      res.send({
        'data': data[0],
        status: 200
      })
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}
module.exports = {
  getUser, getUserId, Login, register, EmailCode, isemail, userData, userWeibo, getuser,edituser
}