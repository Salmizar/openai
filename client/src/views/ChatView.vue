<template>
  <div class="chat">
    <aside class="side-panel"><button v-on:click="clearHistory">Clear History</button></aside>
    <main class="main-chat">
      <section ref="chatDisplay" class="chat-display">
        <Message v-for="(message, index) in messages" :index="index" :firstLoad="firstLoad"
          :isLast="index + 1 === messages.length" :message="message" :key="index" v-on:scrollToBottom="scrollToBottom" />
      </section>
      <footer class="user-input">
        <textarea :readonly="disabled" rows="1" v-model="prompt" v-on:keyup.enter="UserInputTextArea" name="prompt"
          type="text" placeholder="Ask a question"></textarea>
        <button :disabled="disabled" type="submit" v-on:click="askGPT">Submit</button>
      </footer>
    </main>
  </div>
</template>
<script lang="ts" setup>
import Message from '@/components/MessageView.vue'; // @ is an alias to /src
import { onMounted, ref } from "vue";
import { promptGPT } from '@/chatGPT/chat';
import * as chatHistory from '@/chatGPT/chatHistory';
import type { IChatMSG, IChatMessages } from '../interfaces/interfaces'
const prompt = ref<string>('');
const disabled = ref<boolean>(false);
const firstLoad = ref<boolean>(true);
const chatDisplay = ref();
const messages = ref<IChatMessages>([]);
const UserInputTextArea = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    askGPT();
  }
};
const askGPT = () => {
  if (!disabled.value && prompt.value != '') {
    disabled.value = true;
    firstLoad.value = false;
    let message:IChatMSG = {
      //system, user, assistant, function
      role: "user",
      content: prompt.value,
      document: null
    };
    addMsg(message);
    promptGPT(message).then((data: IChatMSG) => {
      disabled.value = false;
      addMsg(data);
    })
      .catch((error: object) => {
        disabled.value = false;
        console.log('error', error);

      });
    prompt.value = '';
  }
};
const addMsg = (msg: IChatMSG) => {
  messages.value.push(msg);
  chatHistory.set(messages.value);
};
const scrollToBottom = () => {
  var objDiv = chatDisplay.value;
  objDiv.scrollTop = objDiv.scrollHeight;
};
const clearHistory = () => {
  chatHistory.clear();
  messages.value = [];
};
onMounted(() => {
  messages.value = chatHistory.get();
});
</script>
<style scoped>
.chat {
  height: calc(100vh - 40px);
}

.side-panel {
  float: left;
  width: 15%;
  height: 100%;
  text-align: center;
}

.side-panel button {
  margin-top: 25px;
}

.main-chat {
  float: right;
  width: 85%;
  height: 100%;
  position: relative;
}

.chat-display {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 40px;
  border-radius: 10px;
  border: 1px solid lightgray;
  padding: 10px;
  overflow: auto;
}

.user-input {
  text-align: center;
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: calc(100% - 40px);
  border-radius: 10px;
  padding: 5px;
}

.user-input textarea {
  width: 70%;
  max-width: 500px;
  margin-right: 10px;
}

.user-input button {
  position: relative;
  top: -6px;
}
</style>