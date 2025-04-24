import { createRouter, createWebHistory } from 'vue-router'
import Project from "@/views/project/Project.vue";
import ModelDetail from '../views/Model/ModelDetail.vue';
import ProjectConfig from "@/views/project/ProjectConfig.vue";
import MyProject from "@/views/project/MyProject.vue";
import MyCollect from "@/views/project/MyCollect.vue";

import Manage from '@/views/manage/Manage.vue';
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/model/:modelId',
			name: 'ModelDetail',
			component: ModelDetail,
		},
		{
			path: '/square',
			name: 'square',
			component: () => import('@/views/Model/ModelSquare.vue'),
			meta: {
				index: 1
			}
		},
		{
			path: '/',
			redirect: '/home'
		},
		{
			path: '/home',
			name: 'home',
			component: () => import('@/views/Home.vue'),
			meta: {
				index: 1
			}
		},
		{
			path: '/project',
			name: 'project',
			component: Project,
			meta: {
				index: 1
			},
			children: [
				{
					path: '',
					name: 'myProject',
					component: MyProject,
				},
				{
					path: 'myProject',
					component: MyProject,
				},
				{
					path: 'myCollect',
					name: 'myCollect',
					component: MyCollect,
				}
			]
		},
		{
			path: '/search',
			name: 'search',
			component: () => import('@/views/other/Search.vue'),
			meta: {
				index: 1
			}
		},
		{
			path: '/project/projectConfig/:id?',
			name: 'projectConfig',
			component: ProjectConfig,
			meta: {
				index: 1
			}
		},
		{
			path: '/runProject/:id',
			name: 'runProject',
			component: () => import('@/views/project/RunProject.vue'),
		},
		{
			path: '/models',
			name: 'model',
			component: () => import('@/views/Model/Models.vue'),
			meta: {
				index: 1
			}
		},
		{
			path: '/manage',
			name: 'manage',
			component: Manage,
		},
		{
			path: '/data',
			name: 'data',
			component: () => import('@/views/data/DataSet.vue'),
			meta: {
				index: 1
			}
		},
		{
			path: '/data/dataContent/:id',
			name: 'Data-view',
			component: () => import('@/views/data/Data.vue'),
			meta: {
				index: 2
			}
		},
		{
			path: '/pay',
			name: 'pay',
			component: () => import('@/views/other/Pay.vue'),
			meta: {
				index: 1
			}
		},
		{
			path: '/dataProcessing',
			name: 'dataProcessing',
			component: () => import('@/views/data/DataProcessing.vue'),
		}
	]
})

export default router
