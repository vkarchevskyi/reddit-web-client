<script setup lang="ts">
defineProps<{
  label: string
  active: boolean
}>()
defineEmits(['click'])
</script>

<template>
  <button
    @click="$emit('click')"
    class="px-4 py-2 rounded border border-white transition-colors duration-300"
    :class="
      active ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white hover:text-black'
    "
  >
    {{ label }}
  </button>
</template>
