<template>
	<div>
		<header>
			<h1 class="title">Новости/Реклама</h1>
			<n-button
				style="margin-right: 20px"
				@click="showSectionModal = true"
				type="primary"
				ghost
				>Добавить пост</n-button
			>
			<n-button
				style="margin-right: 20px"
				type="error"
				ghost
				@click="toggleDeleteMode"
				>Удалить пост</n-button
			>

			<n-button type="error" ghost v-if="deleteMode" @click="deleteSelectedNews"
				>Удаление</n-button
			>
		</header>

		<div class="post-cont">
			<div class="post" v-for="post in news.news" :key="post.id_news">
				<input
					type="checkbox"
					v-if="deleteMode"
					class="new-checkbox"
					@change="toggleSelectNews(post.id_news)"
					:checked="isSelectedNews(post.id_news)"
					@click.stop
				/>
				<h2>{{ post.name }}</h2>
				<p>{{ post.text }}</p>
			</div>
		</div>
	</div>

	<n-modal
		v-model:show="showSectionModal"
		preset="card"
		title="Добавление раздела"
		size="medium"
		:style="bodyStyle"
	>
		<template #header-extra></template>
		<form>
			<n-input
				type="text"
				placeholder="Название поста"
				v-model:value="name"
				style="margin-bottom: 20px"
			/>

			<n-input
				type="textarea"
				placeholder="Текст поста"
				v-model:value="text"
				style="margin-bottom: 20px"
			/>
			<n-button type="primary" @click="addNews">Добавить пост</n-button>
		</form>
	</n-modal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
const authStore = useAuthStore()

const showSectionModal = ref(false)

const bodyStyle = {
	width: '400px',
}

const name = ref('')
const text = ref('')
const deleteMode = ref(false)

const selectedNews = ref([])

const toggleDeleteMode = () => {
	deleteMode.value = !deleteMode.value
}

const toggleSelectNews = id_news => {
	const index = selectedNews.value.indexOf(id_news)
	if (index === -1) {
		selectedNews.value.push(id_news)
	} else {
		selectedNews.value.splice(index, 1)
	}
}

const isSelectedNews = id_news => {
	return selectedNews.value.includes(id_news)
}

const news = ref([])

const deleteSelectedNews = async () => {
	try {
		for (const id_news of selectedNews.value) {
			const response = await authStore.deleteNew(id_news)
			if (response.success) {
				location.reload()
			} else {
				// Ошибка при удалении автомобиля
				console.error('Failed to delete news:', response.error)
			}
		}
		// Очищаем список выбранных автомобилей после удаления
		selectedNews.value = []
	} catch (error) {
		console.error('Error deleting news:', error)
	}
}

const addNews = async () => {
	try {
		const response = await authStore.createNews(name.value, text.value)
		if (response.success) {
			location.reload()
		} else {
			console.error('Failed to create news:', response.error)
		}
	} catch (error) {
		console.error('Error creating news:', error)
	}
}

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
.title {
	font-size: 18px;
	margin-bottom: 20px;
}

.btn-wrapper {
	display: flex;
	gap: 40px;
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

.new-checkbox {
	position: absolute;
	top: -8px;
	right: -8px;
	cursor: pointer;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: #efefef;
	border: 1px solid #ddd;
	appearance: none;

	cursor: pointer;
}

.new-checkbox:checked {
	background-color: black;
}
</style>
