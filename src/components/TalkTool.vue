<template>
  <div class="talktool">
    <el-button class="icon" plain @click="dialogVisible = true">
        <el-icon>
            <ChatDotRound />
        </el-icon>
    </el-button>
  
    <el-dialog class="box" v-model="dialogVisible" title="Data Model Training" width="600" draggable>
      <div class="chat-container">
        <div class="chat-window">
          <div class="chat-log" v-for="(message, index) in messages" :key="index">
            <div :class="['message', message.sender]">{{ message.text }}</div>
          </div>
        </div>
        <div class="chat-input">
          <el-input
            v-model="inputMessage"
            placeholder="Type your message here..."
            @keyup.enter="sendMessage"
          ></el-input>
          <el-button type="primary" @click="sendMessage">Transmit</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ChatDotRound } from '@element-plus/icons-vue'
import { ref } from 'vue'

const dialogVisible = ref(false)
const inputMessage = ref('')
const messages = ref([])

const sendMessage = () => {
    if (inputMessage.value.trim() !== '') {
        // 添加用户消息
        messages.value.push({ text: inputMessage.value, sender: 'user' });
        inputMessage.value = '';

        // 模拟机器回复
        setTimeout(() => {
            const response = `Reply to: ${messages.value[messages.value.length - 1].text}`;
            messages.value.push({ text: response, sender: 'machine' });
        }, 1000); // 模拟延迟1秒收到机器回复
    }
}
</script>

<style scoped>
.talktool{
    position: fixed;
    bottom: 200px; 
    right: 10px;
}

.icon{
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.el-icon{
  font-size: 30px;
}

.box{
  position: fixed;
  top: 10px;
  right: 20px;
  z-index: 10000;
}

.chat-container {
    display: flex;
    flex-direction: column;
    height: 400px;
    background-color: rgb(240, 240, 240);
    color: white;
    padding: 10px;
}

.chat-window {
    display: flex; 
    flex-direction: column;  
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 10px;
}

.chat-log {
    margin: 7px 0;
}

.message {
    padding: 5px;
    border-radius: 5px;
}

.message.user {
    background-color: rgb(195, 150, 238); /* 用户消息背景色 */
    width: 75%;
    margin-left: auto;
}

.message.machine {
    background-color: rgb(119, 176, 216); /* 机器消息背景色 */
    width: 100%;
}

.chat-input {
    display: flex;
    align-items: center;
}

.el-input {
    flex-grow: 1;
    margin-right: 10px;
}
</style>