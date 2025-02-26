<script setup lang="ts">
import { usePersonStore } from '@/stores/person';
const person = usePersonStore();
</script>

<template>
    <div id="confirmation-wrapper">
        <h2>Confirmation</h2>
        <p>Merci pour votre adhésion {{ person.fullName }} !</p>
        <p>Votre numéro d'adhésion est le <span id="memberId">{{ person.id }}</span></p>
    </div>
</template>

<style scoped>

#confirmation-wrapper {
    padding: 20px 40px;
    border-radius: 25px;
    color: white;
    background-color: #2c7ba8;
    border: 2px solid #1d338f;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
}

h2 {
    font-family: 'Krona One', sans-serif;
    text-align: center;
    margin-bottom: 20px;
}

p {
    font-family: 'Lexend', sans-serif;
    text-align: center;
    margin-bottom: 2px;
    font-size: 120%;
}

#memberId {
    font-weight: bold;
    font-size: 140%;
}

</style>