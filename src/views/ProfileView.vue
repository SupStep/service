<template>
	<div class="request-wrapper">
		<h1 class="content-title">Актуальные заявки:</h1>
		<div>
			<Request />
		</div>
	</div>
	<div class="page-container">
		<h1 class="content-title">Мой профиль</h1>
		<div class="profile-container">
			<n-button strong secondary class="change-btn" @click="modalShow = true"
				>Изменить</n-button
			>
			<ul class="profile-list">
				<li class="profile-item">
					<img
						v-if="userInfo.photos && userInfo.photos.length > 0"
						:src="getPhotoUrl(userInfo.photos[0])"
						:alt="'Фото ' + userInfo.photos[0]"
						class="prof-img"
					/>
				</li>
				<li class="profile-item">
					<p class="profile-text">Логин: {{ userInfo.login }}</p>
				</li>
				<li class="profile-item">
					<p class="profile-text">Телефон: {{ userInfo.telephone }}</p>
				</li>
				<li class="profile-item">
					<p class="profile-text">Почта: {{ userInfo.email }}</p>
				</li>
				<li class="profile-item">
					<p class="profile-text">ИНН: {{ userInfo.inn }}</p>
				</li>
				<li class="profile-item">
					<p class="profile-text">ОГРН: {{ userInfo.ogrn }}</p>
				</li>
				<li class="profile-item">
					<p class="profile-text">
						Название компании: {{ userInfo.company_name }}
					</p>
				</li>
			</ul>
		</div>
	</div>

	<n-modal
		v-model:show="modalShow"
		preset="card"
		title="Изменение"
		size="medium"
		:style="bodyStyle"
	>
		<template #header-extra></template>
		<form>
			<input type="file" multiple @change="handleFileUpload" />
		</form>
	</n-modal>
</template>

<script setup>
import Request from '@/components/Request.vue'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const modalShow = ref(false)

const bodyStyle = {
	width: '400px',
}
const authStore = useAuthStore()
const userInfo = ref([])

const getPhotoUrl = photoName => {
	return `http://localhost:5001/uploads/${photoName}`
}

const handleFileUpload = async event => {
	const files = event.target.files
	const formData = new FormData()
	for (let i = 0; i < files.length; i++) {
		formData.append('photos', files[i])
	}

	try {
		const res = await authStore.uploadPhotos(formData)
		if (res === true) {
			location.reload()
		}
	} catch (error) {
		console.error('Ошибка при загрузке фотографий:', error)
		// Обработка ошибок при загрузке фотографий
	}
}

onMounted(async () => {
	try {
		const token = localStorage.getItem('userToken')
		if (token) {
			const response = await authStore.getUserInfo(token)
			if (response.success) {
				userInfo.value = response.user
			} else {
				console.error('Failed to fetch user information:', response.error)
			}
		} else {
			console.error('Access token not found in local storage')
		}
	} catch (error) {
		console.error('Error fetching user information:', error)
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

.page-container {
	padding-top: 20px;
	display: flex;
	flex-direction: column;
}

.profile-container {
	position: relative;
	display: flex;
	flex-direction: column;
	border: 1px solid black;
	padding: 20px;
	border-radius: 20px;
	margin: 0 auto;
	width: 30%;
}

.profile-list {
	list-style-type: none;
	text-align: center;
}

.prof-img {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	background-color: #ccc;
}

.change-btn {
	position: absolute;
	top: 10px;
	right: 10px;
}
</style>
