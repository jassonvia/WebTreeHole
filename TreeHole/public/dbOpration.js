const sqlite3 = require('sqlite3').verbose();

// const db = new sqlite3.Database('./treehole.db'); // 1. 打开文件

const db = new sqlite3.Database('./1stSimple.db'); // 1. 打开文件

// 2. 发送指令
db.run("INSERT INTO messages (content) VALUES (?)", ['Nodejs存入的数据'], function(err) {
    if (!err) console.log("存入成功！");
});

db.run("INSERT INTO messages (content, time) VALUES ('娱乐消息', '2024-12-10')", [], function(err) {
    if (!err) console.log("存入数据到数据库成功！");
});

db.run("INSERT INTO messages (content, time) VALUES ('科技消息', '2024-12-10')", function(err) {
    if (!err) console.log("存入科技到数据库成功！");
});

// 3. 读取指令
db.all("SELECT * FROM messages", [], (err, rows) => {
    console.log("查到的数据：", rows);
});