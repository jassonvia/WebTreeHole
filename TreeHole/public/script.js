/* 
 * 树洞前端逻辑演示版 
 * 连接了 Node.js 后端。
 */
// 1. 消息数据（动态从后端获取）
let msgData = []; // 会通过 loadMessages() 填充来自 /api/messages 的数据（形状：{id, content, time}）

// 2. 获取DOM元素
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const msgList = document.getElementById('msgList');
const charCount = document.getElementById('charCount');

// 3. 渲染函数：把数据变成HTML
function renderMessages() {
    msgList.innerHTML = ''; 
    // 清空当前列表
    // 倒序遍历（新消息在上面）
    // Slice()是为了复制一份数组，防止reverse影响原数组
    msgData.slice().reverse().forEach(msg => {
        // 创建卡片容器
        const li = document.createElement('li');
        li.className = 'message-card';

        // 安全地处理内容 (防XSS攻击的伏笔)
        // 使用 textContent 而不是 innerHTML
        const divContent = document.createElement('div');
        divContent.className = 'msg-content';
        divContent.textContent = msg.content; 

        // 创建元数据区 (时间 + 删除按钮)
        const divMeta = document.createElement('div');
        divMeta.className = 'msg-meta';
        divMeta.innerHTML = `
            <span class="time">${msg.time}</span>
            <button class="btn-delete" onclick="deleteMessage(${msg.id})">删除</button>
        `;

        // 组装
        li.appendChild(divContent);
        li.appendChild(divMeta);
        msgList.appendChild(li);
    });
}


// 5. 字数统计功能 (提升用户体验的小细节)
msgInput.addEventListener('input', function() {
    const len = this.value.length;
    charCount.textContent = `${len}/200`;
    if(len >= 200) {
        charCount.style.color = 'red';
    } else {
        charCount.style.color = '#888';
    }
});

// 6. 删除功能 (全局函数，以便HTML中的onclick调用)
window.deleteMessage = function(id) {
    if (!confirm("确定要删除这条树洞吗？")) return;
    fetch(`/api/messages/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('删除失败');
        return res.json();
      })
      .then(() => {
        // 删除成功后重新从后端加载并渲染
        loadMessages();
      })
      .catch(err => {
        console.error('删除失败', err);
        alert('删除失败，请稍后重试');
      });
};

// --- 初始化 ---
// 页面加载完成后，将通过 loadMessages() 从后端获取并渲染数据

// --- 客户端：通过 HTTP 请求与后端交互（浏览器环境） ---

// 加载留言函数（从后端 /api/messages 获取数据）
function loadMessages() {
    fetch('/api/messages')
        .then(res => res.json())
        .then(data => {
            // 将后端返回的数据映射到 msgData 并使用 renderMessages 保持样式一致
            msgData = data.map(m => ({ id: m.id, content: m.content, time: m.time }));
            renderMessages();
        }).catch(err => {
            console.error('加载留言失败', err);
        });
}

// 发送留言事件
sendBtn.onclick = () => {
    const content = msgInput.value.trim();
    if (!content) {
        alert('请输入内容后再发送哦~');
        return;
    }
    sendBtn.disabled = true;
    fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content })
    }).then(res => res.json())
      .then(() => {
        msgInput.value = '';
        charCount.textContent = '0/200';
        loadMessages();
      }).catch(err => console.error('发送失败', err))
      .finally(() => sendBtn.disabled = false);
};

// 页面一打开就加载
loadMessages();
