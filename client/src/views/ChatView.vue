<template>
  <div class="chat">
    <aside class="side-panel">Side Panel</aside>
    <main class="main-chat">
      <section class="chat-display">
        <Message v-for="(message, index) in messages" :message="message" :key="index" />
      </section>
      <footer class="user-input">
          <input v-model="prompt" name="prompt" type="text" placeholder="Ask a question" />
          <button type="submit" v-on:click="SubmitEvent">Submit</button>
      </footer>
    </main>
  </div>
</template>
<script lang="ts" setup>
import Message from '@/components/MessageView.vue'; // @ is an alias to /src
import { ref, } from "vue";
import axios from "axios";
const prompt = ref<string>('');
const messages = ref<any>([[
    {
        "role": "user",
        "content": "say: this is a test!"
    },
    {
        "role": "assistant",
        "content": "This is a test!"
    },
    {
        "role": "user",
        "content": "Hi"
    },
    {
        "role": "assistant",
        "content": "Hello! How can I assist you today?"
    },
    {
        "role": "user",
        "content": "Write me a small poem"
    },
    {
        "role": "assistant",
        "content": "In the golden dawn, a whisper of light,\nA gentle breeze, dancing through the night.\nA symphony of stars, twinkling above,\nA canvas of dreams, painted with love.\n\nThe moon's soft glow, casting shadows on the ground,\nWhispering secrets, without making a sound.\nThe flowers bloom, their petals unfurl,\nNature's masterpiece, a gift to the world.\n\nA river flows, its melody serene,\nReflecting the beauty, like a mirror pristine.\nMountains stand tall, reaching for the sky,\nA testament to strength, that will never die.\n\nIn this small world, where wonders reside,\nWhere dreams take flight, and hopes coincide,\nLet us cherish each moment, big or small,\nFor life's true beauty lies within us all."
    }
]]);
const SubmitEvent = () => {
  let message:object = {
    role: "user",
    content: prompt.value
  };
  messages.value.push(message);
  axios.post(process.env.VUE_APP_API_URL + "/chat/", { message: prompt.value}, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          messages.value.push(response.data.data);

        }
      })
      .catch(error => {
        console.log('error',error);
      });
};
</script>
<style scoped>
.chat {
  height: calc(100vh - 40px);
}

.side-panel {
  float: left;
  width: 15%;
  height: 100%;
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

.user-input input {
  width: 600px;
  margin-right: 10px;
}
</style>