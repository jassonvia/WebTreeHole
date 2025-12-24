const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// 开启 JSON 解析中间件（关键！）
app.use(express.json());
app.use(express.static('public'));

// 初始化数据库
const db = new sqlite3.Database('treehole.db');
db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, time TEXT)");

// 接口1：获取所有留言
app.get('/api/messages', (req, res) => {
    
    db.all("SELECT * FROM messages ORDER BY id DESC", (err, rows) => {
        console.log('GET /api/messages/', rows);
        res.json(rows);
    });
});

// 接口2：提交新留言
app.post('/api/messages', (req, res) => {
    const content = req.body.content; // 获取前端发来的 content

    console.log('POST /api/messages/', content);

    const time = new Date().toLocaleString();

    if(!content) { return res.status(400).json({error: "内容不能为空"}); }

    const stmt = db.prepare("INSERT INTO messages (content, time) VALUES (?, ?)");
    stmt.run(content, time, function(err) {
        // this.lastID 可以拿到新插入数据的ID
        res.json({ id: this.lastID, content: content, time: time });
    });
    stmt.finalize();
});

// 删除留言接口
app.delete('/api/messages/:id', (req, res) => {
    const id = req.params.id;
    console.log('DELETE /api/messages/', id);
    const stmt = db.prepare("DELETE FROM messages WHERE id = ?");
    stmt.run(id, function(err) {
        if (err) {
            return res.status(500).json({ error: '删除失败' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: '未找到消息' });
        }
        res.json({ success: true });
    });
    stmt.finalize();
});

// 客户端页面的 DOM 交互（fetch / 按钮事件）位于 `public/script.js` 中，由浏览器加载并执行。

app.listen(port, () => console.log(`树洞启动: http://localhost:${port}`))
