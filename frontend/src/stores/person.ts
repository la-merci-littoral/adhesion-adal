import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface PersonState {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  pi_secret: string;
  existsSince: Date;
}

export const usePersonStore = defineStore('person', {
  state: () => ({
    id: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    zip: '',
    city: '',
    country: '',
    pi_secret: '',
    existsSince: new Date(0),
  }),
  getters: {
    fullName: (state) => `${state.name} ${state.surname}`
  },
  actions: {
  },
  persist: true,
})
