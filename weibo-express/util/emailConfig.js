// nodemailer.js
const nodemailer = require('nodemailer')

// 创建一个smtp服务器
const config = {
  host: 'smtp.sohu.com',
  port: 465,
  secure: true,
  auth: {
    user: 'hiboluo@sohu.com',
    // 邮箱的授权码，不是注册时的密码,等你开启的stmp服务自然就会
    pass: '81KZMG7ECXL'
  }
}
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config)

exports.emailSingUp = async function (email, verCode, res) {
  const options = {
    from: '<hiboluo@sohu.com>',
    subject: 'Boluo-WeiBo 接受凭证——验证码',
    to: email,
    text: '您好，您使用 Boluo-WeiBo 正在进行邮箱验证,本次验证码为：' + verCode + '（为了保证您的数据安全，请在5分钟内完成）'
  }
  // 发送邮件
  await transporter.sendMail(options, function (err, msg) {
    if (err) {
      console.log(err)
    } else {
      res.send({
        status: 200,
        msg: '发送成功'
      })
    }
  })
}
