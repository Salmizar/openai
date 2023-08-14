<template>
    <nav>
        <label for="api_action">Choose API Project: </label>
        <select v-on:change="LoadChatAction">
            <option v-for="(option, index) in options" :selected="option.model === $route.name" :key="index"
                :value="option.model">{{ option.name }}
            </option>
        </select>
    </nav>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
const options = [
    { model: "", name: "Select One" },
    { model: "Chat", name: "Chat" },
    { model: "ReadDocument", name: "Read Document" },
    { model: "Trivia", name: "Trivia Game" },
];
const router = useRouter();
const LoadChatAction = (e: Event) => {
    let target = e.currentTarget as HTMLOptionElement;
    router.push({ name: target.value });
}
</script>
<style>
nav {
    height: 40px;
    padding: 10px 0 0 10px;
    background-color: gray;
    color: white;
}
</style>