<template>
	<div class="request-wrapper">
		<h1 class="content-title">Актуальные заявки:</h1>
		<div>
			<Request />
		</div>
	</div>
	<div>
		<div class="post-cont">
			<div class="post" v-for="post in news.news" :key="post.id_news">
				<h2>{{ post.name }}</h2>
				<p>{{ post.text }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import Request from '@/components/Request.vue'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
const authStore = useAuthStore()

const news = ref([])
onMounted(async () => {
	try {
		const response = await authStore.getNews()
		news.value = response.news
	} catch (error) {
		console.error('Error getting user request information:', error)
	}
})
</script>

<style scoped>
.content-title {
	font-size: 16px;
	font-weight: normal;
}

.request-wrapper {
	display: flex;
	flex-direction: column;
	gap: 20px;
	border-bottom: 2px solid #ccc;
}

.post-cont {
	padding: 20px 0;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 40px;
}

.post {
	position: relative;
	padding: 20px;
	border-radius: 10px;
	border: 1px solid black;
	width: 35%;
}

.post h2 {
	text-align: center;
}
</style>
