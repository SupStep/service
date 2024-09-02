<template>
	<div>
		<input type="text" v-model="searchQuery" placeholder="Поиск" />
		<table>
			<thead>
				<tr>
					<th @click="sort('id_request')">ID заявки</th>
					<th @click="sort('client_name')">ФИО клиента</th>
					<th @click="sort('client_phone')">Номер клиента</th>
					<th @click="sort('car_brand')">Бренд и модель авто</th>
					<th @click="sort('car_license_plate')">Госномер авто</th>
					<th @click="sort('car_year')">Год выпуска авто</th>
					<th @click="sort('completion_date')">Дата ремонта</th>
					<th @click="sort('description')">Описание</th>
					<th>Статус</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="request in filteredRequests" :key="request.id_request">
					<td>{{ request.id_request }}</td>
					<td>{{ request.client_name }}</td>
					<td>{{ request.client_phone }}</td>
					<td>{{ request.car_brand }} {{ request.car_model }}</td>
					<td>{{ request.car_license_plate }}</td>
					<td>{{ request.car_year }}</td>
					<td>
						{{
							formatDate(request.completion_date) +
							' ' +
							formatTimeInterval(
								formatTime(request.completion_date),
								request.description
							)
						}}
					</td>
					<td>{{ request.description }}</td>
					<td>{{ request.status }}</td>
				</tr>
			</tbody>
		</table>
		<p v-if="!requests.length">Нет данных</p>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const requests = ref([])
const searchQuery = ref('')

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

const sortKey = ref('')
const sortOrder = ref(1)

const sort = key => {
	if (sortKey.value === key) {
		sortOrder.value *= -1
	} else {
		sortKey.value = key
		sortOrder.value = 1
	}
}

const sortedRequests = computed(() => {
	if (!sortKey.value) return requests.value

	return [...requests.value].sort((a, b) => {
		const valueA = a[sortKey.value]
		const valueB = b[sortKey.value]

		if (valueA < valueB) return -1 * sortOrder.value
		if (valueA > valueB) return 1 * sortOrder.value
		return 0
	})
})

const filteredRequests = computed(() => {
	const query = searchQuery.value.trim().toLowerCase()
	if (!query) return sortedRequests.value

	return sortedRequests.value.filter(request => {
		// Проверяем каждое значение заявки на соответствие запросу
		return Object.values(request).some(value => {
			return String(value).toLowerCase().includes(query)
		})
	})
})

onMounted(async () => {
	try {
		const response = await authStore.getAllRequestsTable()
		if (response.success) {
			requests.value = response.requests.requests
			allServices.value = response.services.services
		} else {
			console.error('Failed to fetch requests:', response.error)
		}
	} catch (error) {
		console.error('Error fetching requests:', error)
	}
})
</script>

<style scoped>
/* стилизуйте таблицу по вашему усмотрению */
table {
	width: 100%;
	border-collapse: collapse;
}

th,
td {
	padding: 8px;
	border-bottom: 1px solid #ddd;
	text-align: left;
	border-right: 1px solid #ddd;
}

th {
	cursor: pointer; /* делаем заголовки столбцов кликабельными */
}
</style>
