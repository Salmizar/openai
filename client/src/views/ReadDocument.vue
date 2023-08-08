<template>
  <div class="chat">
    <aside class="side-panel">
      <button class="clear-history" v-on:click="clearHistory">Clear History</button>
      <p>Files to interact with</p>
      Add file: <input accept=".txt,.pdf" v-on:change="addFile" class="add-file" type="file" ref="fileToAdd" />
      <div class="file" v-bind:class="{ 'file-selected': index === selectedFile }" v-for="(file, index) in fileList"
        v-on:click="selectFile(index)" :key="index">
        {{ file.name }}
        <svg-icon v-if="index === selectedFile" v-on:click="deleteFile(file.fileName)" type="mdi" :path="deleteIconPath"
          size="15"></svg-icon>
      </div>
    </aside>
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
import { onMounted, ref } from "vue";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiClose } from '@mdi/js';
import Message from '@/components/MessageView.vue'; // @ is an alias to /src
import { docPromptGPT, promptGPT } from '@/chatGPT/chat';
import * as chatHistory from '@/chatGPT/chatHistory';
import * as savedFiles from '@/chatGPT/savedFiles';
const deleteIconPath = mdiClose;
const prompt = ref<string>('');
const fileToAdd = ref();
const disabled = ref<boolean>(false);
const firstLoad = ref<boolean>(true);
const chatDisplay = ref();
const messages = ref<any>([]);
const fileList = ref<any>([]);
const selectedFile = ref<number>(-1);
const UserInputTextArea = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    askGPT();
  }
};
const askGPT = () => {
  if (!disabled.value) {
    if (fileList.value.length === 0) {
      alert('Please upload and then select a file before asking a question');
    } else if (selectedFile.value === -1) {
      alert('Please select a file in the left column before asking a question');
    } else if (prompt.value === '') {
      alert(`You didn't ask anything`);
    } else {
      disabled.value = true;
      firstLoad.value = false;
      let message: object = {
        role: "user",
        content: prompt.value,
        document: fileList.value[selectedFile.value].fileName
      };
      addMsg(message);
      docPromptGPT(message).then((data: object) => {
        disabled.value = false;
        addMsg(data);
      })
        .catch((error: any) => {
          disabled.value = false;
          console.log('error', error);

        });
      prompt.value = '';
    }
  }
};
const addMsg = (msg: object) => {
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
const getSavedFiles = () => {
  selectedFile.value = -1;
  fileList.value = [];
  savedFiles.getFileList().then((data: []) => {
    data.map((file: any) => {
      fileList.value.push(file);
    })
  })
};
const deleteFile = (file: object) => {
  if (confirm('Are you sure you want to delete the selected file?')) {
    savedFiles.deleteFile(file).then(() => {
      selectedFile.value = -1;
      getSavedFiles();
    })
  }
};
const addFile = (e: any) => {
  savedFiles.uploadFile(e.target.files[0]).then(() => {
    fileToAdd.value = '';
    getSavedFiles();
  });
};
const selectFile = (index: number) => {
  selectedFile.value = index;
};
onMounted(() => {
  chatHistory.updateName('openai-readfile');
  getSavedFiles();
  messages.value = chatHistory.get();
});
</script>
<style scoped>
.chat {
  height: calc(100vh - 40px);
  font-size: 13px;
}

.side-panel {
  float: left;
  width: 25%;
  height: 100%;
  text-align: center;
}

p {
  padding: 5px;
  background-color: #E5E5E5;
}

input {
  width: 90px;
  overflow: hidden;
}

.file {
  text-align: left;
  margin: 5px 10px 5px 10px;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid white;
  cursor: pointer;
  position: relative;
}

.file svg {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

.file:hover {
  border: 1px solid #d5d5d5;
}

.file-selected {
  border: 1px solid grey;
  cursor: default;
}

.file-selected:hover {
  border: 1px solid grey;
}

.side-panel .clear-history {
  margin-top: 25px;
}

.add-file {
  margin-top: 0px;
}

.main-chat {
  float: right;
  width: 75%;
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