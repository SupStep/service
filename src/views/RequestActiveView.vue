<template>
	<div class="request-wrapper">
		<header style="display: flex">
			<h1 class="content-title">Активные заявки:</h1>
			<n-input
				type="text"
				placeholder="Поиск"
				v-model:value="searchFio"
				@keyup.enter="find"
				style="margin-right: 20px; width: 20%"
			/>
		</header>

		<div
			style="
				padding-bottom: 20px;
				border-bottom: 1px solid black;
				margin-bottom: 20px;
			"
			v-if="isFind"
		>
			<h1 class="content-title" style="margin-bottom: 20px">
				Результат поиска
			</h1>
			<div
				v-for="request in searchedKlient.find"
				:key="request.id_request"
				class="user-item"
				@click="showRequest(request)"
			>
				<div class="circle"></div>
				<div class="data-cont">
					<p>ID{{ request.id_request }}</p>
					<p>{{ formatDate(request.completion_date) }}</p>
					<p>{{ request.status }}</p>
				</div>
			</div>
			<p v-if="!searchedKlient.find.length">заявка не найдена</p>
		</div>

		<div>
			<ul style="list-style-type: none" class="user-list">
				<li
					v-for="request in requests"
					:key="request.id_request"
					class="user-item"
					@click="showRequest(request)"
				>
					<div
						class="circle"
						:class="{
							'green-circle': request.status === 'Подтверждена',
							'orange-circle': request.status === 'В ремонте',
						}"
					></div>
					<div class="data-cont">
						<p>ID{{ request.id_request }}</p>
						<p>{{ formatDate(request.completion_date) }}</p>
						<p>{{ request.status }}</p>
					</div>
				</li>
			</ul>
		</div>
	</div>

	<n-modal
		v-model:show="modalShowRequest"
		preset="card"
		title="Заявка"
		size="medium"
		:style="bodyStyle"
	>
		<template #header-extra></template>
		<form class="form">
			<div
				class="data-cont"
				style="
					margin-bottom: 10px;
					border-bottom: 1px solid black;
					padding-bottom: 10px;
					justify-content: center;
				"
			>
				<p>ID{{ selectedRequest.id_request }}</p>
				<p>{{ formatDate(selectedRequest.completion_date) }}</p>
				<p>{{ selectedRequest.status }}</p>
			</div>
			<p>ID клиента: {{ selectedRequest.id_klient }}</p>
			<p>ФИО клиента: {{ selectedRequest.client_name }}</p>
			<p>Номер телефона: {{ selectedRequest.client_phone }}</p>
			<div class="data-cont">
				<p>Авто: {{ selectedRequest.car_brand }}</p>
				<p>{{ selectedRequest.car_model }}</p>
				<p>{{ selectedRequest.car_year }}</p>
				<p>{{ selectedRequest.car_license_plate }}</p>
			</div>
			<p>
				Дата:
				{{
					formatDate(selectedRequest.completion_date) +
					' ' +
					formatTimeInterval(
						formatTime(selectedRequest.completion_date),
						selectedRequest.description
					)
				}}
			</p>

			<p style="margin-bottom: 20px">
				Проблема: {{ selectedRequest.description }}
			</p>
			<n-button
				@click="startSelectedRequest"
				v-if="selectedRequest.status === 'Подтверждена'"
				>Изменить статус</n-button
			>
			<n-button
				@click="endSelectedRequest"
				v-if="selectedRequest.status === 'В ремонте'"
				>Изменить статус</n-button
			>
		</form>
	</n-modal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
const modalShowRequest = ref(false)
const authStore = useAuthStore()

const selectedRequest = ref([])

const requests = ref([])

const searchFio = ref('')
const searchedKlient = ref([])
const isFind = ref(false)

const allServices = ref([])

const getServiceDurationOfName = serviceName => {
	console.log(serviceName)
	const service = allServices.value.find(
		service => service.name === serviceName
	)
	return parseInt(service.during)
}

const formatTimeInterval = (startTime, serviceDuration) => {
	console.log(startTime, ',', serviceDuration)
	const startHour = parseInt(startTime.split(':')[0])
	const startMinute = parseInt(startTime.split(':')[1])
	const dur = getServiceDurationOfName(serviceDuration)
	const endHour = startHour + dur
	const endMinute = startMinute

	return `${startTime} - ${endHour.toString().padStart(2, '0')}:${endMinute
		.toString()
		.padStart(2, '0')}`
}

const bodyStyle = {
	width: '400px',
}

const formatDate = dateString => {
	const date = new Date(dateString)
	return `${date.getFullYear()}-${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

const formatTime = dateString => {
	const date = new Date(dateString)
	return `${date.getHours().toString().padStart(2, '0')}:${date
		.getMinutes()
		.toString()
		.padStart(2, '0')}`
}

const showRequest = request => {
	selectedRequest.value = request
	modalShowRequest.value = true
}

const startSelectedRequest = async () => {
	try {
		const response = await authStore.startRequest(
			selectedRequest.value.id_request
		)
		if (response.success) {
			location.reload()
		} else {
			console.error('Failed to confirm request:', response.error)
			// Обработка ошибки, если подтверждение заявки не удалось
		}
	} catch (error) {
		console.error('Error confirming request:', error)
		// Обработка ошибки при выполнении запроса
	}
}

const endSelectedRequest = async () => {
	try {
		const response = await authStore.endRequest(
			selectedRequest.value.id_request
		)
		if (response.success) {
			location.reload()
		} else {
			console.error('Failed to confirm request:', response.error)
			// Обработка ошибки, если подтверждение заявки не удалось
		}
	} catch (error) {
		console.error('Error confirming request:', error)
		// Обработка ошибки при выполнении запроса
	}
}

const find = async () => {
	isFind.value = true
	try {
		const response = await authStore.getAllRequestsFIO(searchFio.value)
		if (response.success) {
			searchedKlient.value = response.find
			console.log(searchedKlient.value)
		} else {
			console.error('Failed to get unconfirmed users:', response.error)
		}
	} catch (error) {
		console.error('Error getting confirmed users:', error)
	}
}

onMounted(async () => {
	try {
		const response = await authStore.getAllRequests()
		if (response.success) {
			requests.value = response.requests.requests
			console.log(requests.value)
			allServices.value = response.services.services
			console.log(allServices.value)
		} else {
			console.error('Failed to fetch requests:', response.error)
		}
	} catch (error) {
		console.error('Error fetching requests:', error)
	}
})
</script>

<style scoped>
.content-title {
	font-size: 16px;
	font-weight: normal;
}

header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.user-list {
	display: flex;
	justify-content: center;
	gap: 40px;
	flex-wrap: wrap;
}

.user-item {
	position: relative;
	padding: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 10px;
	border: 1px solid black;
	width: 22%;
	font-size: 14px;
}

.circle {
	position: absolute;
	top: -5px;
	right: -5px;
	width: 15px;
	height: 15px;
	border-radius: 50%;
}

.green-circle {
	background-color: green;
}

.orange-circle {
	background-color: orange;
}

.data-cont {
	display: flex;
	gap: 10px;
}

.form p {
	font-size: 14px;
}

.btn-cont {
	display: flex;
	padding-top: 20px;
	justify-content: space-between;
}
</style>
