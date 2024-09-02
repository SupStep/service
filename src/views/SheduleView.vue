<template>
	<div class="custom-calendar">
		<div class="calendar-header">
			<button @click="prevMonth">&lt;</button>
			<span>{{ currentMonth }}</span>
			<button @click="nextMonth">&gt;</button>
		</div>

		<div class="calendar-grid">
			<div
				v-for="day in calendarDays"
				:key="day.number"
				class="calendar-cell"
				:class="{
					today: isToday(day.number),
					'event-day': hasEvents(day.number),
				}"
				@click="toggleEventList(day.number)"
			>
				<span class="day-number">{{ day.number }}</span>
				<div v-if="expandedDays.includes(day.number)" class="event-list">
					<div
						v-for="request in requestsOnDay(day.number)"
						:key="request.id_request"
						class="event-item"
					>
						<p>ФИО: {{ request.client_name }}</p>
						<p>Телефон: {{ request.client_phone }}</p>
						<p>
							Машина: {{ request.car_brand }} {{ request.car_model }}
							{{ request.car_license_plate }}
						</p>
						<p>{{ request.description }}</p>
						<p>
							{{
								formatTimeInterval(
									formatTime(request.completion_date),
									request.description
								)
							}}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

const currentMonthIndex = ref(new Date().getMonth())
const currentDate = new Date()
let currentYear = currentDate.getFullYear()
const expandedDays = ref([])
const requests = ref([])
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

const currentMonth = computed(() => {
	const months = [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь',
	]
	return months[currentMonthIndex.value]
})

const calendarDays = computed(() => {
	const firstDayOfWeek = new Date(
		currentYear,
		currentMonthIndex.value,
		1
	).getDay()
	const daysInMonth = new Date(
		currentYear,
		currentMonthIndex.value + 1,
		0
	).getDate()
	const days = []
	for (let i = 1; i <= daysInMonth; i++) {
		const day = {
			number: i,
			dayOfWeek: (firstDayOfWeek + i - 1) % 7,
		}
		days.push(day)
	}
	return days
})

const prevMonth = () => {
	currentMonthIndex.value = (currentMonthIndex.value - 1 + 12) % 12
}

const nextMonth = () => {
	currentMonthIndex.value = (currentMonthIndex.value + 1) % 12
}

const isToday = day => {
	const today = new Date()
	return (
		currentMonthIndex.value === today.getMonth() &&
		currentYear === today.getFullYear() &&
		day === today.getDate()
	)
}

const hasEvents = day => {
	const eventsOnDay = requests.value.filter(request => {
		const requestDate = new Date(request.completion_date)
		return (
			requestDate.getMonth() === currentMonthIndex.value &&
			requestDate.getFullYear() === currentYear &&
			requestDate.getDate() === day
		)
	})
	return eventsOnDay.length > 0
}

const requestsOnDay = day => {
	return requests.value.filter(request => {
		const requestDate = new Date(request.completion_date)
		return (
			requestDate.getMonth() === currentMonthIndex.value &&
			requestDate.getFullYear() === currentYear &&
			requestDate.getDate() === day
		)
	})
}

const toggleEventList = day => {
	if (expandedDays.value.includes(day)) {
		expandedDays.value = expandedDays.value.filter(d => d !== day)
	} else {
		expandedDays.value.push(day)
	}
}

const formatTime = time => {
	const formattedTime = new Date(time)
	const hours = formattedTime.getHours().toString().padStart(2, '0')
	const minutes = formattedTime.getMinutes().toString().padStart(2, '0')
	return `${hours}:${minutes}`
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
.custom-calendar {
	font-family: Arial, sans-serif;
}

.calendar-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.calendar-weekdays {
	display: flex;
	justify-content: space-between;
	margin-bottom: 5px;
}

.calendar-weekday {
	font-weight: bold;
}

.calendar-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 5px;
}

.calendar-cell {
	border: 1px solid #ccc;
	padding: 10px;
	position: relative;
}

.today {
	background-color: lightblue;
}

.event-day {
	background-color: lightgreen;
}

.day-number {
	font-weight: bold;
}

.event-list {
	position: absolute;
	background-color: white;
	border: 1px solid #ccc;
	padding: 5px;
	z-index: 1;
}

.event-item {
	margin-bottom: 5px;
	padding: 10px;
	border-bottom: 1px solid black;
	width: 300px;
}
</style>
