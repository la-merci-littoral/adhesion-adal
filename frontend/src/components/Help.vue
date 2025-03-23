<script setup lang="ts">

import { ref } from 'vue'
import { X } from 'lucide-vue-next';

const modalOpen = ref(false)
const closing = ref(false)

function closeModal() {
    closing.value = true
    setTimeout(() => {
        modalOpen.value = false
        closing.value = false
    }, 150) // Match animation duration
}

</script>

<template>
    <div v-if="!modalOpen" id="question-indicator" class="section">
        <img src="@/assets/questionmark.svg" alt="Help Icon" @click="modalOpen = true" />
    </div>
    <div v-if="modalOpen" :class="['section', { closing }]" id="help-modal">
        <div id="help-modal-content">
            <h2>Besoin d'aide ?</h2>
            <p>Nos différentes adresses emails :</p>
            <ul>
                <li>Des questions générales : <a
                        href="mailto:contact@amis-du-littoral.fr">contact@amis-du-littoral.fr</a></li>
                <li>Un problème technique : <a
                        href="mailto:dev@amis-du-littoral.fr">dev@amis-du-littoral.fr</a></li>
            </ul>
        </div>
        <X @click="closeModal" :size="30" id="close-modal"/>
    </div>
</template>

<style scoped>
    .section {
        position: fixed;
        bottom: 0;
        right: 0;
        margin: 1.6rem;
        background-color: #2c7ba8;
        border: 2px white solid;
        color: white;
    }

    #question-indicator {
        cursor: pointer;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #2c7ba8;
        border-radius: 50%;
    }

    #question-indicator img {
        width: 30px;
        transition: width 0.1s;
    }

    #question-indicator:hover img {
        width: 40px;
        transition: width 0.1s;
    }

    #help-modal {
        z-index: 100;
        padding: 30px;
        border-radius: 20px;
        display: flex;
        flex-direction: row;
        font-family: 'Lexend', sans-serif;
        animation: grow-from-corner 0.15s ease-out;
    }

    #help-modal.closing {
        animation: shrink-to-corner 0.15s ease-in forwards;
    }

    #help-modal h2 {
        margin: 0 0 10px;
    }

    #help-modal a {
        color: white;
    }

    #close-modal:hover {
        cursor: pointer;
    }

    @keyframes grow-from-corner {
        0% {
            transform: scale(0);
            transform-origin: bottom right;
        }
        100% {
            transform: scale(1);
            transform-origin: bottom right;
        }
    }

    @keyframes shrink-to-corner {
        0% {
            transform: scale(1);
            transform-origin: bottom right;
        }
        100% {
            transform: scale(0);
            transform-origin: bottom right;
        }
    }
</style>