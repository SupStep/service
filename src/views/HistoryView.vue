<template>
	<div class="request-wrapper">
		<h1 class="content-title">История заявок</h1>

		<div>
			<div class="request-list">
				<div
					class="request-item"
					v-for="request in userRequestInfo.requests"
					:key="request.id_request"
					@click="showRequest(request)"
				>
					<div
						class="circle"
						:class="{
							'green-circle': request.request_status === 'Подтверждена',
							'orange-circle': request.request_status === 'В ремонте',
							'blue-circle': request.request_status === 'В обработке',
							'black-circle': request.request_status === 'Завершена',
							'red-circle': request.request_status === 'Отклонена',
						}"
					></div>
					<p>№{{ request.id_request }}</p>
					<p>
						{{ formatDate(request.completion_date) }}
					</p>
					<p>
						{{ request.request_status }}
					</p>
				</div>
			</div>
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
		<form>
			<div
				class="data-cont"
				style="
					display: flex;
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
			<div class="data-cont">
				<p>Авто: {{ selectedRequest.car_brand }}</p>
				<p>{{ selectedRequest.car_model }}</p>
				<p>{{ selectedRequest.car_year }}</p>
				<p>{{ selectedRequest.car_gos_nomer }}</p>
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
		</form>
	</n-modal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const modalShowRequest = ref(false)
const authStore = useAuthStore()
const userRequestInfo = ref([])

const selectedRequest = ref([])

const bodyStyle = {
	width: '400px',
}

const showRequest = request => {
	selectedRequest.value = request
	modalShowRequest.value = true
}

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

const formatTime = dateString => {
	const date = new Date(dateString)
	return `${date.getHours().toString().padStart(2, '0')}:${date
		.getMinutes()
		.toString()
		.padStart(2, '0')}`
}

const formatDate = dateString => {
	const date = new Date(dateString)
	return `${date.getFullYear()}-${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

onMounted(async () => {
	try {
		const response = await authStore.getUserRequestInfo()
		userRequestInfo.value = response.requests
		console.log(userRequestInfo)
		allServices.value = response.services.services
	} catch (error) {
		console.error('Error getting user request information:', error)
	}
})
</script>

<style scoped>
.content-title {
	font-size: 16px;
	font-weight: normal;
	margin-bottom: 20px;
}

.request-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 40px;
	width: 100%;
}

.request-item {
	position: relative;
	padding: 12px;
	border-radius: 10px;
	border: 1px solid black;
	display: flex;
	justify-content: center;
	gap: 8px;
	width: 22%;
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

.blue-circle {
	background-color: blue;
}

.black-circle {
	background-color: black;
}

.red-circle {
	background-color: red;
}

.data-cont {
	display: flex;
	gap: 10px;
}
</style>
