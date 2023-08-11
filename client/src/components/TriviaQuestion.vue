<template>
    <w-transition-scale-fade>
        <div v-if="currentRound > 0">
            <br />
            <h3>{{ question }}</h3>
            <div class="answer" v-for="(answer, index) in answers" v-on:click="selectAnswer(answer)" :key="index"
                v-bind:class="{
                    'correctAnswer': answer.correctAnswer && selected > -1,
                    'incorrectAnswer': !answer.correctAnswer && selected === index,
                    'disabled': selected > -1
                }">
                {{ answer.text }}
            </div>
            <br />
            <w-transition-scale>
                <w-button v-if="answered && props.currentRound < props.totalRounds" class="ma1" xl bg-color="info" type="submit" v-on:click="nextQuestion()">Next
                    Question</w-button>
            </w-transition-scale>
        </div>
    </w-transition-scale-fade>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import type { IAnswer, IAnswers } from '../interfaces/interfaces';
const question = ref<string>('');
var correctAnswer = '';
const selected = ref<number>(-1);
const answers = ref<IAnswers>([]);
const answered = ref<boolean>(false);
const emits = defineEmits([
    'answerQuestion',
    'nextRound'
]);
const props = defineProps<{
    totalRounds: number,
    currentRound: number,
    triviaTopic: string,
    questions: []
}>();
const nextQuestion = () => {
    emits('nextRound');
};
const convertTriviaQuestions = () => {
    answered.value = false;
    selected.value = -1;
    if (props.currentRound > 0 && props.currentRound <= props.questions.length) {
        let theAnswers: string = props.questions[Number(props.currentRound)-1];
        console.log(theAnswers);
        correctAnswer = theAnswers.substring(theAnswers.indexOf('{') + 1, theAnswers.indexOf('}')).replace('Answer: ', '');
        question.value = theAnswers.substring(0, theAnswers.indexOf('a) '));
        let anwrs = [];
        anwrs[0] = getAnswer(theAnswers, 0, 'a) ', 'b) ');
        anwrs[1] = getAnswer(theAnswers, 1, 'b) ', 'c) ');
        if (theAnswers.indexOf('d) ') === -1) {
            //some questions only have 3 answers
            anwrs[2] = getAnswer(theAnswers, 2, 'c) ', '{');
        } else {
            anwrs[2] = getAnswer(theAnswers, 2, 'c) ', 'd) ');
            anwrs[3] = getAnswer(theAnswers, 3, 'd) ', '{');
        }
        answers.value = anwrs;
        console.log('anwer',correctAnswer);
    } else {
        correctAnswer = '';
    }
};
const getAnswer = (answers: string, index: number, startChar: string, endChar: string): IAnswer => {
    let answer = answers.substring(answers.indexOf(startChar), answers.indexOf(endChar));
    return { text: answer, index: index, correctAnswer: answer.indexOf(correctAnswer) > -1 };
}
const selectAnswer = (answer: IAnswer) => {
    if (!answered.value) {
        answered.value = true;
        selected.value = answer.index;
        emits('answerQuestion', answer.text.indexOf(correctAnswer) > -1);
    }
};
watch(() => props.currentRound, () => {
    convertTriviaQuestions();
});
onMounted(() => {
    convertTriviaQuestions();
});
</script>
<style scoped>
.answer {
    border: 1px solid lightgrey;
    border-radius: 5px;
    cursor: pointer;
    padding: 15px;
    width: 400px;
    margin: 0 auto;
    margin-top: 20px;
    -webkit-transition: background-color 300ms linear;
    -ms-transition: background-color 300ms linear;
    transition: background-color 300ms linear;
}

.answer:hover {
    background-color: lightgray;
    border-color: gray;
}

.disabled:hover {
    background-color: white;
    cursor: default;
    border: 1px solid lightgrey;
}

.correctAnswer {
    background-color: green;
    color: white;
}

.correctAnswer:hover {
    background-color: green;
}

.incorrectAnswer {
    background-color: red;
    color: white;
}

.incorrectAnswer:hover {
    background-color: red;
}</style>