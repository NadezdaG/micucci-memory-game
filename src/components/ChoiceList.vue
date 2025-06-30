<template>
<div class="choice-list">
    
    <ul class="difficulty">
            <li v-for="(item,index) in list" :key="index">
                <button @click="handleItemClick(item)" :class="{ active: selected === item }">
                    {{ item.toUpperCase()}} 
                </button>
            </li>
        </ul>
        </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    list: {
        type: Array,
        required: true,
    },
    selected: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['select']);

const handleItemClick = (itemId) => {
    emit('select', itemId);
};
</script>

<style lang="scss" scoped>

ul {
  width: 100%;
  display: grid;
  list-style: none;
  padding: 0;
  margin: 1em 0 0;
  grid-template: auto / 1fr 1fr 1fr;
  justify-items: stretch;
  gap: 5px;
  button {
    background-color: var(--color-lightgrey2);
    color: var(--body-color);
    Width:100%;
    cursor: pointer;
    transition: all 1s;
    padding: 0.2em 0.5em;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.8em;
    border: none;
    &:hover,
    &.active {
      background-color: var(--color-green);
      color: var(--color-white);
    }
  }
}
</style>