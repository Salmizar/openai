<template>
  <div class="trivia">
    <br />
    <h2>Let's play trivia!</h2>
    <br />
    <h3>{{ triviaInstructions }} <span v-if="currentRound > 0">Round {{ currentRound }}</span></h3>
    <br />
    <w-progress v-if="loading" class="ma1" circle></w-progress>
    <w-transition-scale-fade>
      <div v-if="topics.length > 0">
        <div v-on:click="selectTopic(topic)" class="trivia-topic" v-for="(topic, index) in topics" :topic="topic"
          :key="index">
          {{ topic }}
        </div>
        <w-button v-if="currentRound === -1" class="ma1 mt10" xl bg-color="info" type="submit" v-on:click="newGame()">
          New Game
        </w-button>
      </div>
    </w-transition-scale-fade>
    <w-transition-fade>
      <div class="score" v-bind:class="{ 'final-score': currentRound === -1 }" v-if="currentRound != 0">{{ score }}/{{
        totalRounds }}</div>
    </w-transition-fade>
    <w-transition-scale y>
      <w-button v-if="currentRound === -1" class="ma1 mt10" xl bg-color="info" type="submit" v-on:click="newGame()">
        New Game
      </w-button>
    </w-transition-scale>
    <TriviaQuestion :totalRounds="totalRounds" v-on:nextRound="nextRound" v-on:answerQuestion="answerQuestion"
      :currentRound="currentRound" :questions="questions" :triviaTopic="triviaTopic" />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as trivia from '@/chatGPT/trivia';
import TriviaQuestion from '@/components/TriviaQuestion.vue'; // @ is an alias to /src
import { IChatMSG } from '../interfaces/interfaces';
const topics = ref<[]>([]);
const questions = ref<any>([]);
const loading = ref<boolean>(true);
const score = ref<number>(0);
const totalRounds = ref<number>(10);
const currentRound = ref<number>(0);
const triviaTopic = ref<string>('nothing');
const triviaInstructions = ref<string>(`First, we'll generate some topic's you can choose from`);
var formattedQuestions = new Array(10);
const getTriviaTopics = () => {
  trivia.getTriviaTopics().then((data: IChatMSG) => {
    currentRound.value = 0;
    loading.value = false;
    triviaInstructions.value = `Select a topic for the trivia game`;
    topics.value = Object(data).content.split('\n');
  })
};
const getTriviaQuestions = () => {
  loading.value = true;
  trivia.getTriviaQuestions(triviaTopic.value, totalRounds.value).then((data: IChatMSG) => {
    loading.value = false;
    formatQuestions(data.content);
    nextRound();
  })
};
const formatQuestions = (ques:string) => {
  let bits = [];
  bits = ques.split('2. ');
  formattedQuestions[0] = bits[0].substring(3);
  recursiveFormatQuestions(bits,1);
  questions.value = formattedQuestions;
};
const recursiveFormatQuestions = (bits:any, pos:number) => {
  let tBits = String(bits[1]).split((pos+2)+'. ');
  formattedQuestions[pos] = tBits[0];
  if (pos < 8) {
    recursiveFormatQuestions(tBits, pos+1);
  } else {
    formattedQuestions[9] = tBits[1];
  }
};
const newGame = () => {
  loading.value = true;
  currentRound.value = 0;
  score.value = 0;
  triviaInstructions.value = `First, we'll generate some topic's you can choose from`;
  getTriviaTopics();
};
const nextRound = () => {
  if (currentRound.value < totalRounds.value) {
    currentRound.value++;
  }
};
const selectTopic = (topic: string) => {
  triviaTopic.value = topic.substring(topic.indexOf(".") + 2, topic.indexOf(":"));
  triviaInstructions.value = triviaTopic.value;
  topics.value = [];
  getTriviaQuestions();
};
const gameOver = () => {
  triviaInstructions.value = `Game over. ${((score.value / totalRounds.value > 0.7) ? 'Nice! ' : 'Better luck next time. ')}Your final score is:`;
  currentRound.value = -1;
};
const answerQuestion = (answer: boolean) => {
  if (answer) {
    score.value++;
  }
  if (currentRound.value === totalRounds.value) {
    setTimeout(gameOver, 1000);
  }
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

.score {
  position: absolute;
  left: 10px;
  top: 10px;
}

.final-score {
  position: relative;
  font-size: 40px;
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