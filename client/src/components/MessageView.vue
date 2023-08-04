<template>
    <div class="message" :class="[props.message.role]">
        <svg-icon v-if="isAssistant" type="mdi" :path="iconPath" size="15"></svg-icon>
        <div class="copy-icon" v-on:click="copyResponse">
            <svg-icon v-if="isAssistant" type="mdi" alt="Text" :path="copyIconPath" size="15"></svg-icon>
        </div>
        <div v-html="messageContent"></div>
    </div>
</template>
<script lang="ts" setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiRobot, mdiContentCopy } from '@mdi/js';
import { defineProps, defineEmits, onMounted, ref, onUpdated } from 'vue';
const emits = defineEmits([
    'scrollToBottom'
]);
const props = defineProps<{
    message: any,
    index: number,
    isLast: boolean,
    firstLoad: boolean
}>();
const content = props.message.content.replace(/(?:\r\n|\r|\n)/g, '<br/>').split(' ');
let  wordCount = 0;
const messageContent = ref<string>('');
const isAssistant = (props.message.role === 'assistant');
const iconPath = mdiRobot;
const copyIconPath = mdiContentCopy;
const scrollToBottom = () => {
    if (props.isLast) {
        emits('scrollToBottom');
    }
}
const typeOutText = () => {
    if (wordCount+1 <= content.length) {
        messageContent.value += content[wordCount]+' ';
        setTimeout(typeOutText, Math.random()*(content[wordCount].length*20));
        wordCount += 1;
    }
};
const copyResponse = () => {
    navigator.clipboard.writeText(props.message.content);
};
onUpdated(() => {
    scrollToBottom();
});
onMounted(() => {
    if (!props.firstLoad && props.isLast && props.message.role==='assistant') {
        typeOutText();
    } else {
        messageContent.value = content.join(' ');
    }
});
</script>
<style scoped>
.message {
    max-width: 600px;
    margin: 10px auto 10px auto;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid lightgray;
    text-align: right;
}
.message div {
    margin-left: 25px;
}
.message svg {
    float:left;
}
.assistant {
    text-align: left;
    background-color: lightsteelblue;
}
.copy-icon {
    float: right;
    cursor: pointer;
    opacity: 0.5;
}
</style>