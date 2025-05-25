require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = createServer(app);

// CORS 설정
app.use(cors({
  origin: true, // 모든 도메인 허용
  credentials: true
}));

app.use(express.json());

// Supabase 클라이언트 설정
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Socket.io 설정
const io = new Server(server, {
  cors: {
    origin: true, // 모든 도메인 허용
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 연결된 사용자 관리
let connectedUsers = new Map();

// Socket.io 연결 처리
io.on('connection', (socket) => {
  console.log(`새로운 사용자 연결: ${socket.id}`);

  // 사용자 정보 등록
  socket.on('register_user', (userData) => {
    connectedUsers.set(socket.id, {
      userId: userData.userId,
      username: userData.username,
      socketId: socket.id
    });
    
    console.log(`사용자 등록: ${userData.username} (${socket.id})`);
    
    // 현재 온라인 사용자 수 브로드캐스트
    io.emit('user_count', connectedUsers.size);
  });

  // 메시지 전송 처리
  socket.on('send_message', async (messageData) => {
    try {
      const user = connectedUsers.get(socket.id);
      if (!user) {
        socket.emit('error', { message: '사용자 정보를 찾을 수 없습니다.' });
        return;
      }

      // Supabase에 메시지 저장
      const { data, error } = await supabase
        .from('public_chat_messages')
        .insert({
          user_id: user.userId,
          username: user.username,
          message: messageData.message,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('메시지 저장 오류:', error);
        socket.emit('error', { message: '메시지 저장에 실패했습니다.' });
        return;
      }

      // 모든 클라이언트에게 새 메시지 브로드캐스트
      io.emit('new_message', data);
      console.log(`메시지 전송: ${user.username}: ${messageData.message}`);

    } catch (error) {
      console.error('메시지 처리 오류:', error);
      socket.emit('error', { message: '메시지 처리 중 오류가 발생했습니다.' });
    }
  });

  // 과거 메시지 요청 처리
  socket.on('get_messages', async () => {
    try {
      const { data, error } = await supabase
        .from('public_chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.error('메시지 조회 오류:', error);
        socket.emit('error', { message: '메시지 조회에 실패했습니다.' });
        return;
      }

      socket.emit('messages_history', data);
    } catch (error) {
      console.error('메시지 조회 처리 오류:', error);
      socket.emit('error', { message: '메시지 조회 중 오류가 발생했습니다.' });
    }
  });

  // 연결 해제 처리
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`사용자 연결 해제: ${user.username} (${socket.id})`);
      connectedUsers.delete(socket.id);
      
      // 현재 온라인 사용자 수 브로드캐스트
      io.emit('user_count', connectedUsers.size);
    }
  });
});

// API 엔드포인트
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    connectedUsers: connectedUsers.size
  });
});

app.get('/stats', (req, res) => {
  res.json({
    connectedUsers: connectedUsers.size,
    users: Array.from(connectedUsers.values()).map(user => ({
      username: user.username,
      userId: user.userId
    }))
  });
});

// 서버 시작
const PORT = process.env.PORT || 3006;
server.listen(PORT, () => {
  console.log(`🚀 Bully Chat Server가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`📈 Stats: http://localhost:${PORT}/stats`);
}); 