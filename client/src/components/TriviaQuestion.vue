<template>
    <div v-if="currentRound > 0">
        <br />
        <h3>{{ question }}</h3>
        <div class="answer" v-for="(answer, index) in answers" v-on:click="selectAnswer(answer)" :key="index">{{ answer }}
        </div>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits, onMounted, ref } from 'vue';
import * as trivia from '@/chatGPT/trivia';
import { IChatMSG } from '@/interfaces/interfaces';
const question = ref<string>('');
var correctAnswer = '';
const answers = ref<[]>([]);
const emits = defineEmits([
    'answerQuestion'
]);
const props = defineProps<{
    currentRound: number,
    triviaTopic: string,
    questions: []
}>();
const convertTriviaQuestions = () => {
    if (props.currentRound > 0 && props.currentRound <= props.questions.length) {
        let theAnswers: string = props.questions[Number(props.currentRound)];
        correctAnswer = theAnswers.substring(theAnswers.indexOf('{') + 1, theAnswers.indexOf('}'));
        question.value = theAnswers.substring(0, theAnswers.indexOf('a) '));
        let anwrs = [];
        anwrs[0] = theAnswers.substring(theAnswers.indexOf('a) '), theAnswers.indexOf('b) '));
        anwrs[1] = theAnswers.substring(theAnswers.indexOf('b) '), theAnswers.indexOf('c) '));
        if (theAnswers.indexOf('d) ') === -1) {
            anwrs[2] = theAnswers.substring(theAnswers.indexOf('c) '), theAnswers.indexOf('{'));
        } else {
            anwrs[2] = theAnswers.substring(theAnswers.indexOf('c) '), theAnswers.indexOf('d) '));
            anwrs[3] = theAnswers.substring(theAnswers.indexOf('d) '), theAnswers.indexOf('{'));
        }
        answers.value = anwrs;
    } else {
        correctAnswer = '';
    }
};
const selectAnswer = (answer: string) => {
    let theAnswers: string = props.questions[Number(props.currentRound)];
    let correctAnswer: string = theAnswers.substring(theAnswers.indexOf('{') + 1, theAnswers.indexOf('}'));
    if (answer.indexOf(correctAnswer)>-1) {
        console.log('CORRECT!');
    } else {
        console.log('sad trombone');
    }
};
onMounted(() => {
    convertTriviaQuestions();
    console.log('monted');
});
</script>
<style scoped>
.answer {
    border: 1px solid lightgrey;
    border-radius: 5px;
    cursor: pointer;

    padding: 5px;
    width: 400px;
    margin: 0 auto;
    margin-top: 20px;
}

.answer:hover {
    background-color: lightgrey;
    border-color: gray;
}
</style>