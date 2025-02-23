<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import '@fontsource/lexend';
// import Logo from '@/assets/logo.svg?url'
import Logo from '@/assets/placeholder_rdle.png'
import isMobile from 'mobile-device-detect'
import MobileView from './views/MobileView.vue';
</script>

<template>
  <main v-if="!isMobile.isMobile">
    <div id="header-wrapper">
      <header>
        <img :src="Logo" alt="Logo de l'association">
        <h1>Association des Amis du Littoral</h1>
      </header>
    </div>
    <div id="main-wrapper">
      <RouterView />
    </div>
  </main>
  <MobileView v-else />
</template>

<style scoped>

  main {
    height: 100%;
    width: 100%;
    background-color: #82cdff;

    display: grid;
    grid-template-columns: 0.4fr 0.7fr;
    justify-content: center;
    align-items: center;
  }

  #header-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #31749e;
    border-right: 2px solid #1d338f;
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 25px;
    background-color: #31749e;
    color: #fff;
    max-width: 90%;
  }

  header img {
    max-width: 75%;
  }

  header h1 {
    font-family: 'Lexend', sans-serif;
    font-size: 3rem;
    text-align: center;
    margin-top: 4rem;
  }

  #main-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  
</style>
