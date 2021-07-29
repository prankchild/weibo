const mysql = require('mysql');

module.exports = {
    config: ({
        host: 'localhost',
        post: 3306,
        user: 'root',
        password: '123456',
        database: 'weibo'
    }),
    // 连接数据库 使用mysql的连接池
    sqlConnect: function (sql, sqlArr, callBack) {
        const pool = mysql.createPool(this.config)
        pool.getConnection((err, conn) => {
            console.log("good");
            if (err) {
                console.error(err);
                return false;
            }
            // 数据库驱动回调
            conn.query(sql, sqlArr, callBack);
            // 释放连接
            conn.release();
        })
    },
    // promise回调 
    //promise 回调
    SySqlConnect: function (sySql, sqlArr) {
        return new Promise((resolve, reject) => {
            var pool = mysql.createPool(this.config);
            pool.getConnection(function (err, conn) {
                console.log('123');
                if (err) {
                    reject(err);
                } else {
                    conn.query(sySql, sqlArr, (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(data);
                        }
                    });
                }

            })
            // pool.releaseConnection(conn)
        }).catch((err) => {
            console.log(err);
        })
    }
}
