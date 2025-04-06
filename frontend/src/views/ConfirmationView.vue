<script setup lang="ts">
import { usePersonStore } from '@/stores/person';
const person = usePersonStore();
localStorage.removeItem('person');
</script>

<template>
    <div id="confirmation-wrapper">
        <h2>Confirmation</h2>
        <p id="thanks">
            Merci pour votre adhésion {{ person.fullName }} !
            <br>
            Votre numéro est le <span id="memberId">{{ person.id }}</span>
        </p>
        <p id="email-info">
            Vous allez recevoir un email de confirmation à l'adresse suivante : <span style="font-style: italic;">{{ person.email }}</span>
            <br>
            <span id="junk-warning">Pensez à vérifier vos spams !</span>
        </p>
        <div id="inscription">
            <p>Voulez-vous aussi vous inscrire aux évènements ?</p>
            <button><a href="https://inscription.amis-du-littoral.fr">Aller à l'inscription</a></button>
        </div>
        <p id="session-end">Cette session s'est vidée, vous pouvez à présent fermer l'onglet ou la fenêtre.</p>
    </div>
</template>

<style scoped>

#confirmation-wrapper {
    padding: 20px 40px;
    border-radius: 25px;
    color: white;
    background-color: #2c7ba8;
    border: 2px solid white;

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

p#email-info {
    font-size: 110%;
    width: 80%;
    max-width: 600px; /* Added to limit the width */
}

span#junk-warning {
    font-size: 90%;
}

p#session-end {
    font-size: 90%;
    margin-top: 30px;
    font-style: italic;
}

div#inscription {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
}

div#inscription button {
    padding: 20px;
    border-radius: 25px;
    border: 2px solid white;
    background-color: #1d338f;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    gap: 15px;
    margin-top: 10px;
    font-family: 'Lexend', sans-serif;
    transition: background-color ease-in .1s;
}

div#inscription button a {
    color: white;
    text-decoration: none;
    font-size: 120%;
}

div#inscription button:hover {
    background-color: #1d4e6a;
    transition: background-color ease-in .1s;
}

</style>