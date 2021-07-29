const { createConnection } = require("mysql");
const dbConfig = require("../util/DBConfig");
const { userData } = require("./userController");
// 微博首页展示模块
const weiboHome = async (req, res) => {
  let allData = [];
  let user_id = req.query.user_id;
  // 查询关注的人的id
  let weibofollow = async (user_id) => {
    const sql = "select follow_userid from fans where fans_userid=?"
    const sqlArr = [user_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data;
  };
  // 首页显示所有微博的ID账号
  const homeWeiboid = []
  const weibofollows = await weibofollow(user_id)
  for (let i = 0; i < weibofollows.length; i++) {
    homeWeiboid[i] = weibofollows[i].follow_userid
  }
  // 查询点赞微博
  let weibolove = async (user_id) => {
    const sql = "select weibo_id from love where user_id=?"
    const sqlArr = [user_id]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data
  }
  // 记录点赞微博ID
  const loveweiboid = await weibolove(user_id);
  // 把自己和查询到的关注的人都整理到一个数组里，显示数组里所有的微博
  homeWeiboid.push(user_id);
  let weibo = async (user_id) => {
    const sql =
      'select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_image,weibo.weibo_time,weibo.weibo_forwords,weibo.weibo_comments,weibo.weibo_loves,user.user_name,user.user_avatar from weibo,user where weibo_userid in (?) and weibo.weibo_userid = user.user_id order by weibo.weibo_time desc'
    const sqlArr = [homeWeiboid];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  const weiboData = await weibo(user_id);
  // 循环在显示的所有微博里面找到点赞的微博id 添加islove状态
  for (let i = 0; i < weiboData.length; i++) {
    if (loveweiboid) {
      for (let j = 0; j < loveweiboid.length; j++) {
        if (weiboData[i].weibo_id === loveweiboid[j].weibo_id) {
          weiboData[i].weibo_islove = "1";
        }
      }
    }
    if (weiboData[i].weibo_ofwid) {
      let weibo = async (weibo_id) => {
        const sql = 'select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_image,weibo.weibo_time,weibo.weibo_forwords,weibo.weibo_comments,weibo.weibo_loves,user.user_name,user.user_avatar from weibo,user where weibo_id in (?) and weibo.weibo_userid = user.user_id order by weibo.weibo_time desc'
        const sqlArr = [weibo_id]
        let data = await dbConfig.SySqlConnect(sql, sqlArr);
        return data;
      };
      const weiboofw = await weibo(weiboData[i].weibo_ofwid);
      if (weiboofw) {
        weiboData[i].ofw = weiboofw[0];
      }
    }
  }
  res.send({
    list: weiboData,
  });
};
// 广场模块
const square = async (req, res) => {
  let allData = [];
  let user_id = req.query.user_id;
  // 查询关注的人的id
  let weibofollow = async (user_id) => {
    const sql = "select follow_userid from fans where fans_userid=?"
    const sqlArr = [user_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data;
  };
  // 首页显示所有微博的ID账号
  const homeWeiboid = []
  const weibofollows = await weibofollow(user_id)
  for (let i = 0; i < weibofollows.length; i++) {
    homeWeiboid[i] = weibofollows[i].follow_userid
  }
  // 查询点赞微博
  let weibolove = async (user_id) => {
    const sql = "select weibo_id from love where user_id=?"
    const sqlArr = [user_id]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data
  }
  // 记录点赞微博ID
  const loveweiboid = await weibolove(user_id);
  // 把自己和查询到的关注的人都整理到一个数组里，显示数组里所有的微博
  homeWeiboid.push(user_id);
  let weibo = async () => {
    const sql =
    'select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_image,weibo.weibo_time,weibo.weibo_forwords,weibo.weibo_comments,weibo.weibo_loves,user.user_name,user.user_avatar from weibo,user where weibo.weibo_userid = user.user_id order by weibo.weibo_time desc'
    const sqlArr = [];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  const weiboData = await weibo();
  // 循环在显示的所有微博里面找到点赞的微博id 添加islove状态
  for (let i = 0; i < weiboData.length; i++) {
    if (loveweiboid) {
      for (let j = 0; j < loveweiboid.length; j++) {
        if (weiboData[i].weibo_id === loveweiboid[j].weibo_id) {
          weiboData[i].weibo_islove = "1";
        }
      }
    }
    if (weiboData[i].weibo_ofwid) {
      let weibo = async (weibo_id) => {
        const sql = 'select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_image,weibo.weibo_time,weibo.weibo_forwords,weibo.weibo_comments,weibo.weibo_loves,user.user_name,user.user_avatar from weibo,user where weibo_id in (?) and weibo.weibo_userid = user.user_id order by weibo.weibo_time desc'
        const sqlArr = [weibo_id]
        let data = await dbConfig.SySqlConnect(sql, sqlArr);
        return data;
      };
      const weiboofw = await weibo(weiboData[i].weibo_ofwid);
      if (weiboofw) {
        weiboData[i].ofw = weiboofw[0];
      }
    }
  }
  res.send({
    list: weiboData,
  });
};
// 微博添加收藏模块
const addweibolove = async (req, res) => {
  // 从前端传入微博的ID号
  let weibo_id = req.query.weibo_id;
  // 从前端传入用户的ID号
  let user_id = req.query.user_id;
  // 先查询是否有点过赞
  let whetherlove = async (weibo_id, user_id) => {
    const sql = "select * from love where weibo_id=? and user_id = ?";
    const sqlArr = [weibo_id, user_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  // 存储这个点赞数据 再进行判断 如果为空 则可以添加 如果有值则返回flase
  const lovedata = await whetherlove(weibo_id, user_id);
  // 当它不存在的时候进行添加数据
  if (!lovedata.length) {
    // 提取出来微博表中的点赞数
    let selectweibo = async (weibo_id) => {
      const sql = "SELECT weibo_loves FROM weibo WHERE weibo_id=?";
      const sqlArr = [weibo_id];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    };
    // const loves = Number(await selectweibo(weibo_id)) + 1;
    const loves = Number((await selectweibo(weibo_id))[0].weibo_loves) + 1;
    // 把点赞数+1再进行存入
    let addweibo = async (weibo_id, loves) => {
      const sql = "UPDATE weibo SET weibo_loves = ? WHERE weibo_id = ?";
      const sqlArr = [loves, weibo_id];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    };
    const weibolove = addweibo(weibo_id, loves);
    // 把数据添加到love表中
    let addlove = async (weibo_id, user_id) => {
      const sql = "INSERT INTO love (weibo_id, user_id) VALUES (?, ?)";
      const sqlArr = [weibo_id, user_id];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    };
    const add = await addlove(weibo_id, user_id);

    if (add) {
      res.send({
        status: "200",
        msg: "点赞成功",
      });
    }
  } else {
    res.send({
      status: "208",
      msg: "当前已经点过赞",
    });
  }
};
// 微博取消收藏模块
const delweibolove = async (req, res) => {
  // 从前端传入微博的ID号
  let weibo_id = req.query.weibo_id;
  // 从前端传入用户的ID号
  let user_id = req.query.user_id;
  // 先查询是否有点过赞
  let whetherlove = async (weibo_id, user_id) => {
    const sql = "select * from love where weibo_id=? and user_id = ?";
    const sqlArr = [weibo_id, user_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  // 存储这个点赞数据 再进行判断 如果为空 则可以添加 如果有值则返回flase
  const lovedata = await whetherlove(weibo_id, user_id);
  // 当它存在的时候进行删除数据
  if (lovedata.length) {
    // 提取出来微博表中的点赞数
    let selectweibo = async (weibo_id) => {
      const sql = "SELECT weibo_loves FROM weibo WHERE weibo_id=?";
      const sqlArr = [weibo_id];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    };
    // const loves = Number(await selectweibo(weibo_id)) + 1;
    const loves = Number((await selectweibo(weibo_id))[0].weibo_loves) - 1;
    // 把点赞数+1再进行存入
    let addweibo = async (weibo_id, loves) => {
      const sql = "UPDATE weibo SET weibo_loves = ? WHERE weibo_id = ?";
      const sqlArr = [loves, weibo_id];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    };
    const weibolove = addweibo(weibo_id, loves);
    // 把数据给删除掉
    let dellove = async (weibo_id, user_id) => {
      const sql = "DELETE FROM love WHERE weibo_id = ? and user_id=?";
      const sqlArr = [weibo_id, user_id];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    };
    const del = await dellove(weibo_id, user_id);
    if (del) {
      res.send({
        status: "200",
        msg: "取消点赞成功",
      });
    }
  } else {
    res.send({
      status: "209",
      msg: "取消点赞失败",
    });
  }
};
// 喜欢受特微博展示模块
const loveHome = async (req, res) => {
  // 展现给前端的数据
  let ArrList = {};
  let user_id = req.query.user_id;
  let selectweiboid = async (user_id) => {
    const sql = "select weibo_id from love where user_id= ?";
    const sqlArr = [user_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };

  // 查询到喜欢的微博的ID数组
  const weiboid = await selectweiboid(user_id);
  // 查询微博数据
  let weibo = async (weibo_id) => {
    const sql =
      "select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_image,weibo.weibo_time,weibo.weibo_forwords,weibo.weibo_comments,weibo.weibo_loves,user.user_name,user.user_avatar from weibo,user where weibo_id in (?) and weibo.weibo_userid = user.user_id order by weibo.weibo_time desc";
    const sqlArr = [weibo_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  for (let i = 0; i < weiboid.length; i++) {
    ArrList[i] = (await weibo(weiboid[i].weibo_id))[0];
    ArrList[i].weibo_islove = "1";
    // 展现转发的情况
    if (ArrList[i].weibo_ofwid) {
      let weibo = async (weibo_id) => {
        const sql =
          "select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_image,weibo.weibo_time,weibo.weibo_forwords,weibo.weibo_comments,weibo.weibo_loves,user.user_name,user.user_avatar from weibo,user where weibo_id in (?) and weibo.weibo_userid = user.user_id order by weibo.weibo_time desc";
        const sqlArr = [weibo_id];
        let data = await dbConfig.SySqlConnect(sql, sqlArr);
        return data;
      };
      const weiboofw = await weibo(ArrList[i].weibo_ofwid);
      if (weiboofw) {
        ArrList[i].ofw = weiboofw[0];
      }
    }
  }

  if (ArrList) {
    res.send({
      status: 200,
      list: ArrList,
    });
  }
};
// 微博界面的所有数据模块
const weibolist = async (req, res) => {
  let weibolist = [];
  let weibo_id = req.query.weibo_id;
  let user_id = req.query.user_id;
  let selectweibo = async (weibo_id) => {
    const sql =
      "select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_image,weibo.weibo_time,weibo.weibo_forwords,weibo.weibo_comments,weibo.weibo_loves,user.user_name,user.user_avatar from weibo,user where weibo_id in (?) and weibo.weibo_userid = user.user_id order by weibo.weibo_time desc";
    const sqlArr = [weibo_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  weibolist = (await selectweibo(weibo_id))[0];
  // 判断是否转发 如是转发微博把原微博资料写到JSON里
  if (weibolist.weibo_ofwid) {
    const ofw = (await selectweibo(weibolist.weibo_ofwid))[0];
    weibolist.ofw = ofw;
  }
  // 判断点赞
  let selectlove = async (user_id,weibo_id) => {
    const sql = "select * from love where user_id=? and weibo_id=?";
    const sqlArr = [user_id,weibo_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  if((await selectlove(user_id,weibo_id)).length !== 0){
    const li = (await selectlove(user_id,weibo_id))[0].weibo_id.toString();
    if (weibo_id.toString() === li) {
      weibolist.islove = "1";
    }
  }
  if (weibolist) {
    res.send({
      status: 200,
      list: weibolist,
    });
  } else {
    res.send({
      status: 400,
      msg: "undefined",
    });
  }
}
// 微博界点赞显示参数模块
const weibolove = async (req, res) => {
  let love = [];
  let weibo_id = req.query.weibo_id;
  let selectlove = async (weibo_id) => {
    const sql = "select * from love where weibo_id=?";
    const sqlArr = [weibo_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  love = await selectlove(weibo_id);
  let loveuserid = [];
  for (let i = 0; i < love.length; i++) {
    loveuserid[i] = love[i].user_id;
  }

  if(!loveuserid){
    let selectuser = async (loveuserid) => {
      const sql = "select * from user where user_id=?";
      const sqlArr = [loveuserid];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    };
    const user = await selectuser(loveuserid);
    for (let i = 0; i < love.length; i++) {
      if (love[i].user_id === user[i].user_id) {
        love[i].user_avatar = user[i].user_avatar;
        love[i].user_name = user[i].user_name;
      }
    }
    if (love) {
      res.send({
        status: 200,
        list: love,
      });
    }
  }

}
// 微博界面转发显示模块
const weiboforword = async (req, res) => {
  let forword = []
  let forworddata = []
  // 获取这条微博ID
  const weiboId = req.query.weibo_id
  // 先查询转发过这个微博的所有转发数据
  let selectforword = async (weiboId) => {
    const sql = 'select * from forword where forword_weiboid=?'
    const sqlArr = [weiboId]
    const data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data
  }
  forword = await selectforword(weiboId)
  let forwordWeiboId = []
  if (forword.length) {
    for (let i = 0; i < forword.length; i++) {
      forwordWeiboId[i] = forword[i].forword_weiboid
    }
    let selectweibo = async (weiboId) => {
      // ";;
      const sql = 'select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_time,user.user_name,user.user_avatar from weibo,user where weibo_ofwid in (?) and weibo.weibo_userid = user.user_id'
      const sqlArr = [weiboId]
      const data = await dbConfig.SySqlConnect(sql, sqlArr)
      return data
    }
    forworddata = await selectweibo(forwordWeiboId)
    if (forworddata) {
      res.send({
        status: 200,
        list: forworddata
      })
    }
  }
}
// 微博界面评论显示模块
const weibocomment = async (req, res) => {
  // 获取这条微博ID
  const weiboId = req.query.weibo_id
  // 先查询这个微博的所有评论数据
  let selectforword = async (weiboId) => {
    const sql = 'select * from comment where commnet_weiboid=? Order By commnet_time Desc'
    const sqlArr = [weiboId]
    const data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data
  }
  const commentdate = await selectforword(weiboId)
  let useridArr = []
  for(let i = 0; i < commentdate.length; i++){
    useridArr[i] = commentdate[i].comment_userid 
  }
  if(!useridArr){
    let selectuser = async (user_id) => {
      const sql = 'select user_name,user_avatar,user_id from user where user_id in (?)'
      const sqlArr = [user_id]
      const data = await dbConfig.SySqlConnect(sql, sqlArr)
      return data
    }
    const userdata = await selectuser(useridArr)
    for(let i = 0; i < commentdate.length; i++){
      for(let j = 0; j < userdata.length; j++){
        if(commentdate[i].comment_userid ===userdata[j].user_id){
          commentdate[i].user_avatar = userdata[j].user_avatar
          commentdate[i].user_name = userdata[j].user_name
        }
      }
    }
    if(commentdate){
      res.send({
        status:200,
        list:commentdate
      })
    }
  }

}
// 个人微博界面数据模块
const personalweibo = async (req, res) => {
  let data = {};
  let user_id = req.query.user_id;
  let selectuser = async (user_id) => {
    const sql =
      "select user_id,user_avatar,user_name,user_desc,user_blogs,user_follows,user_fans from user where user_id=?";
    const sqlArr = [user_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  data.user = (await selectuser(user_id))[0];
  let selectweibo = async (user_id) => {
    const sql =
      "select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_image,weibo.weibo_time,weibo.weibo_forwords,weibo.weibo_comments,weibo.weibo_loves,user.user_name,user.user_avatar from weibo,user where user_id in (?) and weibo.weibo_userid = user.user_id order by weibo.weibo_time desc";
    const sqlArr = [user_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  let selectweiboid = async (weibo_id) => {
    const sql =
      "select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_image,weibo.weibo_time,weibo.weibo_forwords,weibo.weibo_comments,weibo.weibo_loves,user.user_name,user.user_avatar from weibo,user where weibo_id in (?) and weibo.weibo_userid = user.user_id order by weibo.weibo_time desc";
    const sqlArr = [weibo_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  // 查询点赞微博
  let weibolove = async (user_id) => {
    const sql = "select weibo_id from love where user_id=?"
    const sqlArr = [user_id]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data
  }
  // 记录点赞微博ID
  const loveweiboid = await weibolove(user_id);
  data.weibo = await selectweibo(user_id);
    // 循环在显示的所有微博里面找到点赞的微博id 添加islove状态
  for (let i = 0; i < data.weibo.length; i++) {
    if (loveweiboid) {
      for (let j = 0; j < loveweiboid.length; j++) {
        if (data.weibo[i].weibo_id === loveweiboid[j].weibo_id) {
          data.weibo[i].weibo_islove = "1";
        }
      }
    }
    if (data.weibo[i].weibo_ofwid) {
      data.weibo[i].ofw = (await selectweiboid(data.weibo[i].weibo_ofwid))[0];
    }
  }
  res.send({
    status: 200,
    list: data,
  });
}
// 个人微博界面删除模块
const delweibo = async ( req, res ) => {
  const weibo_id = req.query.weibo_id
  const user_id = req.query.user_id
  const del = async (weibo_id) => {
    const sql ="DELETE FROM weibo WHERE weibo_id = ?";
    const sqlArr = [weibo_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  const delweibos = await del(weibo_id)
  if(delweibos){
    const sel = async (user_id) => {
      const sql ="SELECT user_blogs FROM user where user_id = ?";
      const sqlArr = [user_id];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    };
    const num = Number((await sel(user_id))[0].user_blogs) - 1
    const updated = async (num,user_id) => {
      const sql ="UPDATE user SET user_blogs = ? WHERE user_id = ?";
      const sqlArr = [num,user_id];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    };
    const up = await updated(num,user_id)
    if(up){
      res.send({
        status : 200,
        msg : '删除微博成功'
      })
    }
  }
}
// 微博界面转发微博模块
const forword = async ( req, res ) => {
  const weibo_id = req.query.weibo_id
  const user_id = req.query.user_id
  const weibo_container = req.query.weibo_container
  const add = async (container,user_id,weibo_id) => {
    const sql ="INSERT INTO weibo (weibo_container,weibo_userid,weibo_ofwid,weibo_forwords,weibo_loves,weibo_comments) VALUES (?,?,?,?,?,?)"
    const sqlArr = [container,user_id,weibo_id,0,0,0];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  const fweibo = await add(weibo_container, user_id, weibo_id)
  if(fweibo){
    let sofwsql = async (weibo_id) => {
      const sql ="SELECT weibo_forwords FROM weibo WHERE weibo_id=?"
      const sqlArr = [weibo_id];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    };
    let Num = Number( (await sofwsql(weibo_id))[0].weibo_forwords) + 1 
    // UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
    let uofwsql = async (Num,weibo_id) => {
      const sql ="UPDATE weibo SET weibo_forwords = ?  WHERE weibo_id = ?"
      const sqlArr = [Num,weibo_id];
      let data = await dbConfig.SySqlConnect(sql, sqlArr);
      return data;
    };
    const uofw = await uofwsql(Num,weibo_id)
    if(uofw){
      let addforword = async (user_id,weibo_id) => {
        const sql ="INSERT INTO forword (forword_userid, forword_weiboid) VALUES (?,?)"
        const sqlArr = [user_id,weibo_id];
        let data = await dbConfig.SySqlConnect(sql, sqlArr);
        return data;
      };
      const ad = await addforword(user_id,fweibo.insertId)
      let susersql = async (user_id) => {
        const sql ="SELECT user_blogs FROM user WHERE user_id=?"
        const sqlArr = [user_id];
        let data = await dbConfig.SySqlConnect(sql, sqlArr);
        return data;
      };
      const suser = Number((await susersql(user_id))[0].user_blogs ) + 1 
      let uusersql = async (Num,ofwid) => {
        const sql ="UPDATE user SET user_blogs = ?  WHERE user_id = ?"
        const sqlArr = [Num,ofwid];
        let data = await dbConfig.SySqlConnect(sql, sqlArr);
        return data;
      };
      const uuser = uusersql(suser,user_id)
      if(uuser&&ad){
        res.send({
          status:200,
          msg: '转发成功'
        })
      }
    }
  }
}
// 关注界面显示所关注的人and 关注我的人
const followuser = async (req, res) => {
  let user_id = req.query.user_id
  // 查询我关注的人
  let selectuser = async (user_id) => {
    const sql = "select * from fans where fans_userid=?"
    const sqlArr = [user_id]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data;
  };
  // 查询关注我的人
  let selectfansuser = async (user_id) => {
    const sql = "select * from fans where follow_userid=?"
    const sqlArr = [user_id]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data;
  };
  const user = await selectuser(user_id)
  const fansuser = await selectfansuser(user_id)
  let userArr = []
  let fansArr = []
  if (user) {
    for (let i = 0; i < user.length; i++) {
      userArr[i] = user[i].follow_userid
    }
    for(let i = 0; i < fansuser.length; i++){
      fansArr[i] = fansuser[i].fans_userid
    }
    let selectdata = async (user_id) => {
      const sql = "select user_id,user_name,user_avatar,user_desc from user where user_id in (?)"
      const sqlArr = [user_id]
      let data = await dbConfig.SySqlConnect(sql, sqlArr)
      return data;
    };
    const followlist = await selectdata(userArr)
    const fanslist = await selectdata(fansArr)
    res.send({
      status: 200,
      followlist: followlist,
      fanslist: fanslist
    })
  } else {
    res.send({
      msg: '无关注对象'
    })
  }
}
// 评论模块
const addcomment = async (req, res) => {
  // 获取微博评论内容
  let weibo_comcontainer = req.query.weibo_comcontainer
  // 获取微博的id
  let weibo_id = req.query.weibo_id
  // 获取评论id
  let comment_id = req.query.comment_id
  // 获取评论人id
  let user_id = req.query.user_id
  // 先查询到微博的user_id和评论数+1
  let sel = async (weibo_id) => {
    const sql = "select weibo_userid, weibo_comments from weibo where weibo_id=?"
    const sqlArr = [weibo_id]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data;
  };
  // 保存查询到的微博user_id和评论数
  let seldata = await sel(weibo_id)
  // 保存评论
  let comm = async (comment_userid,commnet_weiboid,comment_container) => {
    const sql = "INSERT INTO comment (comment_userid, commnet_weiboid,comment_container,comment_comid) VALUES (?,?,?,?)"
    const sqlArr =[comment_userid,commnet_weiboid,comment_container,0]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data;
  };
  // 执行评论
  let actioncomm = await comm(user_id,weibo_id,weibo_comcontainer)
  // 评论数 + 1 再保存起来
  const weibo_comments = Number(seldata[0].weibo_comments) + 1
  let up = async (weibo_comments,weibo_id) => {
    const sql = "UPDATE weibo SET weibo_comments = ? WHERE weibo_id = ?"
    const sqlArr =[weibo_comments,weibo_id]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data;
  };
  let actionup = await up(weibo_comments,weibo_id)
  // 通知微博user_id有人评论
  let notice = async (notice_user_id,notice_container,notice_weiboid) => {
    const sql = "INSERT INTO notice (notice_user_id, notice_container,notice_state,notice_weiboid) VALUES (?, ?,?,?)"
    const sqlArr =[notice_user_id,notice_container,1,notice_weiboid]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data;
  };
  let actionnotice = await notice(seldata[0].weibo_userid,weibo_comcontainer,weibo_id)
  if(actionnotice&&actionup){
    res.send({
      status : 200,
      msg : '评论添加成功'
    })
  }
}
// 判断是否已关注用户模块
const judgefollow = async (req, res) => {
  let myid = req.query.myid
  let youid = req.query.youid
  let sel = async (myid) => {
    const sql = "select * from fans where fans_userid=? and follow_userid=?"
    const sqlArr = [myid,youid]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data;
  };
  if(youid === (await sel(myid))[0].follow_userid){
    res.send({
      status:200,
      msg:'已关注该用户'
    })
  }else{
    res.send({
      status:208,
      msg:'未关注该用户'
    })
  }
}
// 关注对方
const followpeople = async (req, res) => {
  let myid = req.query.myid
  let youid = req.query.youid
  let state = req.query.state
  // 关注对方
  if(Number(state) === 0){
    let sel = async (youid,myid) => {
      const sql = "select * from fans where follow_userid=? and fans_userid=? "
      const sqlArr = [youid,myid]
      let data = await dbConfig.SySqlConnect(sql, sqlArr)
      return data;
    };
    const follow = await sel(youid,myid)
    if(follow.length === 0){
      let add = async (myid,youid) => {
        const sql = "INSERT INTO fans (fans_userid, follow_userid) VALUES (?, ?)"
        const sqlArr = [myid,youid]
        let data = await dbConfig.SySqlConnect(sql, sqlArr)
        return data;
      };
      const addaction = await add(myid,youid)
      // 先查询我关注的人的数量然后+1
      let sel1 = async (myid) => {
        const sql = "select * from user where user_id = ? "
        const sqlArr = [myid]
        let data = await dbConfig.SySqlConnect(sql, sqlArr)
        return data;
      };
      const sel1action = Number((await sel1(myid))[0].user_follows) + 1
      let add1 = async (sel1action,myid) => {
        const sql = "UPDATE user SET user_follows = ? WHERE user_id = ?"
        const sqlArr = [sel1action,myid]
        let data = await dbConfig.SySqlConnect(sql, sqlArr)
        return data;
      };
      const add1action =await add1(sel1action,myid)
      // 后查询对方的粉丝数量然后+1
      let sel2 = async (youid) => {
        const sql = "select * from user where user_id = ? "
        const sqlArr = [youid]
        let data = await dbConfig.SySqlConnect(sql, sqlArr)
        return data;
      };
      const sel2action = Number((await sel2(youid))[0].user_fans) + 1
      let add2 = async (sel2action,myid) => {
        const sql = "UPDATE user SET user_fans = ? WHERE user_id = ?"
        const sqlArr = [sel2action,myid]
        let data = await dbConfig.SySqlConnect(sql, sqlArr)
        return data;
      };
      const add2action =await add2(sel2action,youid)
      if(addaction){
        res.send({
          status:200,
          msg:"关注对方成功"
        })
      }else{
        res.send({
          status:401,
          msg:"出现问题，请查看服务器"
        })
      }
    }else{
      res.send({
        status:400,
        msg:"已关注对方用户"
      })
    }
  }
  // 取消关注
  if(Number(state) === 1){
    let sel = async (youid,myid) => {
      const sql = "select * from fans where follow_userid=? and fans_userid=? "
      const sqlArr = [youid,myid]
      let data = await dbConfig.SySqlConnect(sql, sqlArr)
      return data;
    };
    const follow = await sel(youid,myid)
    if(follow.length === 0){
      res.send({
        status:402,
        msg:"您暂无关注对方,无法取消关注"
      })
    }else{
      let del = async (myid,youid) => {
          // DELETE FROM Websites WHERE name='Facebook' AND country='USA';
          const sql = "DELETE FROM fans WHERE fans_userid = ? and follow_userid = ?"
          const sqlArr = [myid,youid]
          let data = await dbConfig.SySqlConnect(sql, sqlArr)
          return data;
        };
        const delaction = await del(myid,youid)
      // 先查询我关注的人的数量然后+1
      let sel1 = async (myid) => {
      const sql = "select * from user where user_id = ? "
      const sqlArr = [myid]
      let data = await dbConfig.SySqlConnect(sql, sqlArr)
      return data;
      };
      const sel1action = Number((await sel1(myid))[0].user_follows) - 1
      let add1 = async (sel1action,myid) => {
        const sql = "UPDATE user SET user_follows = ? WHERE user_id = ?"
        const sqlArr = [sel1action,myid]
        let data = await dbConfig.SySqlConnect(sql, sqlArr)
        return data;
      };
      const add1action =await add1(sel1action,myid)
      // 后查询对方的粉丝数量然后+1
      let sel2 = async (youid) => {
        const sql = "select * from user where user_id = ? "
        const sqlArr = [youid]
        let data = await dbConfig.SySqlConnect(sql, sqlArr)
        return data;
      };
      const sel2action = Number((await sel2(youid))[0].user_fans) - 1
      let add2 = async (sel2action,myid) => {
        const sql = "UPDATE user SET user_fans = ? WHERE user_id = ?"
        const sqlArr = [sel2action,myid]
        let data = await dbConfig.SySqlConnect(sql, sqlArr)
        return data;
      };
      const add2action =await add2(sel2action,youid)
      if(delaction){
        res.send({
          status:200,
          msg:"取消关注对方成功"
        })
      }else{
        res.send({
          status:400,
          msg:"取消关注对方失败，请查看服务器"
        })
      }
      }
    }
}
// 他人微博界面模块
const othersweibo = async (req, res) => {
  let data = {};
  let user_id = req.query.user_id;
  let look_id = req.query.look_id;
  let selectuser = async (user_id) => {
    const sql =
      "select user_id,user_avatar,user_name,user_desc,user_blogs,user_follows,user_fans from user where user_id=?";
    const sqlArr = [user_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  data.user = (await selectuser(user_id))[0];
  let selectweibo = async (user_id) => {
    const sql =
      "select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_image,weibo.weibo_time,weibo.weibo_forwords,weibo.weibo_comments,weibo.weibo_loves,user.user_name,user.user_avatar from weibo,user where user_id in (?) and weibo.weibo_userid = user.user_id order by weibo.weibo_time desc";
    const sqlArr = [user_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  let selectweiboid = async (weibo_id) => {
    const sql =
      "select weibo.weibo_id,weibo.weibo_ofwid,weibo.weibo_container,weibo.weibo_userid,weibo.weibo_image,weibo.weibo_time,weibo.weibo_forwords,weibo.weibo_comments,weibo.weibo_loves,user.user_name,user.user_avatar from weibo,user where weibo_id in (?) and weibo.weibo_userid = user.user_id order by weibo.weibo_time desc";
    const sqlArr = [weibo_id];
    let data = await dbConfig.SySqlConnect(sql, sqlArr);
    return data;
  };
  // 查询点赞微博
  let weibolove = async (user_id) => {
    const sql = "select weibo_id from love where user_id=?"
    const sqlArr = [user_id]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data
  }
  // 记录点赞微博ID
  const loveweiboid = await weibolove(look_id);
  data.weibo = await selectweibo(user_id);
    // 循环在显示的所有微博里面找到点赞的微博id 添加islove状态
  for (let i = 0; i < data.weibo.length; i++) {
    if (loveweiboid) {
      for (let j = 0; j < loveweiboid.length; j++) {
        if (data.weibo[i].weibo_id === loveweiboid[j].weibo_id) {
          data.weibo[i].weibo_islove = "1";
        }
      }
    }
    if (data.weibo[i].weibo_ofwid) {
      data.weibo[i].ofw = (await selectweiboid(data.weibo[i].weibo_ofwid))[0];
    }
  }
  res.send({
    status: 200,
    list: data,
  });
}
// 移除粉丝
const delfans = async (req,res) => {
  // 粉丝ID
  let fans_id = req.query.fans_id
  // 我自己的ID
  let user_id = req.query.user_id
  let del = async (fans_id,user_id) => {
    const sql = "DELETE FROM fans WHERE fans_userid = ? and follow_userid = ?"
    const sqlArr = [fans_id,user_id]
    let data = await dbConfig.SySqlConnect(sql, sqlArr)
    return data;
  }
  const delaction = await del(fans_id,user_id)
  if(delaction){
     // 先查询我的粉丝的数量然后-1
     let sel1 = async (user_id) => {
      const sql = "select * from user where user_id = ? "
      const sqlArr = [user_id]
      let data = await dbConfig.SySqlConnect(sql, sqlArr)
      return data;
      };
      const sel1action = Number((await sel1(user_id))[0].user_fans) - 1
      let add1 = async (sel1action,user_id) => {
        const sql = "UPDATE user SET user_fans = ? WHERE user_id = ?"
        const sqlArr = [sel1action,user_id]
        let data = await dbConfig.SySqlConnect(sql, sqlArr)
        return data;
      };
      const add1action =await add1(sel1action,user_id)
      // 后查询对方的关注数量然后-1
      let sel2 = async (fans_id) => {
        const sql = "select * from user where user_id = ? "
        const sqlArr = [fans_id]
        let data = await dbConfig.SySqlConnect(sql, sqlArr)
        return data;
      };
      const sel2action = Number((await sel2(fans_id))[0].user_follows) - 1
      let add2 = async (sel2action,fans_id) => {
        const sql = "UPDATE user SET user_follows = ? WHERE user_id = ?"
        const sqlArr = [sel2action,fans_id]
        let data = await dbConfig.SySqlConnect(sql, sqlArr)
        return data;
      };
      const add2action =await add2(sel2action,fans_id)
      res.send({
        status:200,
        msg:"移除粉丝成功"
      })
  }

}
module.exports = {
  weiboHome,
  addweibolove,
  delweibolove,
  loveHome,
  weibolist,
  weibolove,
  personalweibo,
  weiboforword,
  followuser,delweibo,forword,square,addcomment,weibocomment,judgefollow,followpeople,othersweibo,delfans
}
