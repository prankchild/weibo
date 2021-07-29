const express = require('express')
const router = express.Router()
const User = require('../controllers/userController')
const weibo = require('../controllers/weiboController')
const upImage = require('../controllers/img')
const path = require('path')
const multer = require('multer');
// const avatarUpload = multer({ dest: 'public/avatar/' }).single('file')
// 文件上传路径
const uploads = multer({ dest: path.join(__dirname, '../public/uploads') }).single('file')
// 头像上传路径
const upavatarloads = multer({ dest: path.join(__dirname, '../public/uploads/avatar') }).single('file')
router.get('/', User.getUser)
router.get('/getUserId', User.getUserId)
router.post('/Login', User.Login)
router.post('/user/EmailCode', User.EmailCode)
router.post('/user/isemail', User.isemail)
router.post('/user/register', User.register)
router.post('/user/userData', User.userData)
router.post('/user/userWeibo', User.userWeibo)
// 修改资料
router.post('/user/edituser', User.edituser)
// router.post('/upswiperimage', uploads, upImage.upSwiperImage)
// router.get('/seewiperimgage', upImage.seeSwiperImage)
// router.post('/delwiperimgage', upImage.delSwiperImage)
// router.post('/newUpSwiperImage', upImage.newUpSwiperImage)
// 个人界面读取用户资料接口
router.post('/user/getuser', User.getuser)
router.post('/weibo/weiboHome', weibo.weiboHome)
// 广场square
router.post('/weibo/square', weibo.square)
router.post('/weibo/addlove', weibo.addweibolove)
router.post('/weibo/dellove', weibo.delweibolove)
router.post('/weibo/loveHome', weibo.loveHome)
router.post('/weibo/weibolist', weibo.weibolist)
router.post('/weibo/weibolove', weibo.weibolove)
router.post('/weibo/personalweibo', weibo.personalweibo)
router.post('/weibo/weiboforword', weibo.weiboforword)
router.post('/weibo/followuser', weibo.followuser)
router.post('/weibo/delweibo', weibo.delweibo)
router.post('/weibo/forword', weibo.forword)
// 评论添加功能comment
router.post('/weibo/addcomment', weibo.addcomment)
// 显示评论weibocomment
router.post('/weibo/weibocomment', weibo.weibocomment)
// 查询是否关注用户judgefollow
router.post('/weibo/judgefollow', weibo.judgefollow)
router.post('/weibo/followpeople', weibo.followpeople)
// 查询他人微博界面othersweibo
router.post('/weibo/othersweibo', weibo.othersweibo)
// 
router.post('/weibo/upAvatar', upavatarloads, upImage.upAvatar)
// 移除粉丝delfans
router.post('/weibo/delfans', weibo.delfans)
module.exports = router
router.post('/file_upload', upImage.arrup)
router.post('/weibo/storageSql',upImage.storageSql)
// var express = require('express');
// var fs = require('fs');
// var multer = require('multer');
// var router = express.Router();
// const moment = require('moment');






