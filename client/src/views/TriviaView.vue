<template>
  <div class="trivia">
    <h2>Let's play trivia!</h2>
    <h3>{{triviaTopic}}</h3>
    <div v-on:click="selectTopic(topic)" class="trivia-topic" v-for="(topic, index) in topics" :topic="topic" :key="index">{{ topic }}</div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { promptGPT } from '@/chatGPT/chat';
const topics = ref<[]>([]);
const triviaTopic = ref<string>('Select a topic for the trivia game');
const getTriviaTopics = () => {
  let message: object = {
    //system, user, assistant, function
    role: "user",
    content: "Please suggest 5 topics for a trivia game. keep the descriptions short."
  };
  promptGPT(message).then((data: object) => {
    
    topics.value = Object(data).content.split('\n');
  }).catch((error: object) => {
      console.log('error',error);
    });
};
const selectTopic = (topic:string) => {
  triviaTopic.value = topic.substring(topic.indexOf(".")+2, topic.indexOf(":"));
}
onMounted(() => {
  getTriviaTopics();
});
</script>
<style scoped>
.trivia {
  text-align: center;
  position: relative;
}
.trivia-topic {
  cursor: pointer;
  width: 500px;
  position: inherit;
  margin-left: calc(50% - 250px);
  padding: 5px;
  margin-bottom: 15px;
  border: 1px solid lightgrey;
  border-radius: 5px;
}
.trivia-topic:hover {
  border: 1px solid grey;

}
</style>