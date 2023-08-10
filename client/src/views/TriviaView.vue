<template>
  <div class="trivia">
    <br />
    <h2>Let's play trivia!</h2>
    <br />
    <h3>{{ triviaInstructions }} <span v-if="currentRound > 0">- Round {{ currentRound }}!</span></h3>
    <br />
    <w-progress v-if="loading" class="ma1" circle></w-progress>
    <div v-on:click="selectTopic(topic)" class="trivia-topic" v-for="(topic, index) in topics" :topic="topic"
      :key="index">
      {{ topic }}
    </div>
    <TriviaQuestion :currentRound="currentRound" :questions="questions" :triviaTopic="triviaTopic" />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as trivia from '@/chatGPT/trivia';
import TriviaQuestion from '@/components/TriviaQuestion.vue'; // @ is an alias to /src
import { IChatMSG } from '@/interfaces/interfaces';
const topics = ref<[]>([]);
const questions = ref<any>([]);
const loading = ref<boolean>(true);
const totalRounds = ref<number>(10);
const currentRound = ref<number>(0);
const triviaTopic = ref<string>('nothing');
const triviaInstructions = ref<string>(`First, we'll generate some topic's you can choose from`);
const getTriviaTopics = () => {
  trivia.getTriviaTopics().then((data: IChatMSG) => {
    loading.value = false;
    triviaInstructions.value = `Select a topic for the trivia game`;
    topics.value = Object(data).content.split('\n');
  })
};
const getTriviaQuestions = () => {
  loading.value = true;
  trivia.getTriviaQuestions(triviaTopic.value, totalRounds.value).then((data: IChatMSG) => {
    loading.value = false;
    console.log('questions',data.content);
    questions.value = data.content.split('. ');
    nextRound();
    console.log('data.content',questions.value);
  })
};
const nextRound = () => {
  totalRounds.value++;
};
const selectTopic = (topic: string) => {
  triviaTopic.value = topic.substring(topic.indexOf(".") + 2, topic.indexOf(":"));
  triviaInstructions.value = triviaTopic.value;
  topics.value = [];
  getTriviaQuestions();
};
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