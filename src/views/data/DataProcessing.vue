<template>
	<div></div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useFileStore } from '@/stores/filestore.ts';
const fileStore = useFileStore();

onMounted(() => {
	console.log(`output->`, fileStore.files);
});
</script>
<style></style>
