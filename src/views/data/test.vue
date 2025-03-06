<template>
  <div>
    <p v-for="file in files" :key="file.name">{{ file.name }} - {{ file.size }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 假设这个是你的对象
const data = {
  children: [
    { size: "129.80 KB", name: "val_dataset.csv", type: "file" },
    {
      size: "454.07 KB",
      name: "train_dataset.csv",
      type: "file",
      children: [
        { size: "200 KB", name: "subfile1.csv", type: "file" },
        { size: "300 KB", name: "subfile2.csv", type: "file" },
      ]
    }
  ],
  name: "1",
  type: "directory"
};

// 用于存储所有文件的数组
const files = ref([]);

// 递归函数
function getFiles(node) {
  if (node.type === "file") {
    files.value.push(node);
  } else if (node.children && node.children.length > 0) {
    node.children.forEach(child => getFiles(child));
  }
}

// 在组件挂载时调用递归函数
onMounted(() => {
  getFiles(data);
});
</script>
