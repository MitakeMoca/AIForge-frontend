import { defineStore } from 'pinia';

export const useFileStore = defineStore('fileStore', {
	state: () => ({
		files: [], // 存储文件元数据
	}),
	actions: {
		setFiles(fileList) {
			this.files = fileList;
		},
		addFile(file) {
			this.files.push(file);
		},
		removeFile(file) {
			const index = this.files.indexOf(file);
			if (index !== -1) {
				this.files.splice(index, 1);
			}
		},
		clearFiles() {
			this.files = [];
		}
	}
});