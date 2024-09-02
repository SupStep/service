<template>
	<div class="request-wrapper">
		<h1 class="content-title">Актуальные заявки:</h1>
		<div>
			<Request />
		</div>
	</div>
	<div class="page-container">
		<form class="request-form">
			<div class="form-header">
				<h1 class="content-title">Оформить заявку</h1>
			</div>
			<div class="form-wrapper">
				<div>
					<p class="wrapper-text">Укажите авто</p>
					<n-select
						size="small"
						v-model:value="selectedCar"
						:options="cars"
						placeholder="Выберите авто"
					></n-select>
				</div>
				<div>
					<p class="wrapper-text">Выберите услугу</p>
					<n-select
						size="small"
						v-model:value="selectedService"
						:options="allServices"
						placeholder="Выберите услугу"
					></n-select>
				</div>
				<div v-if="selectedService">
					<p>Выберите дату и время:</p>
					<div style="display: flex; gap: 10px">
						<n-input
							style="margin-bottom: 12px"
							readonly
							size="small"
							v-model:value="selectedDateFull"
							placeholder="Здесь появится выбранное время"
						></n-input>
						<n-button size="small" @click="showCalendarModal = true"
							>Выбрать</n-button
						>
					</div>
				</div>
			</div>
			<div class="form-footer">
				<n-button size="small" type="primary" @click="submitRequest"
					>Отправить заявку</n-button
				>
				<n-button size="small" @click="cancelRequest">Отмена</n-button>
			</div>
		</form>
	</div>

	<n-modal
		v-model:show="showCalendarModal"
		preset="card"
		title="Добавление раздела"
		size="medium"
		:style="bodyStyle"
	>
		<template #header-extra></template>
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
					}"
					@click="selectDay(day.number)"
				>
					<span class="day-number">{{ day.number }}</span>
				</div>
			</div>
		</div>
	</n-modal>

	<n-modal
		v-model:show="timeModal"
		preset="card"
		title="Выберите время"
		size="small"
		:style="bodyStyleSmall"
	>
		<div class="time-list">
			<template v-if="timeIntervals.length">
				<button
					v-for="time in timeIntervals"
					:key="time"
					@click="selectTime(time)"
					class="time-item"
				>
					{{ formatTimeInterval(time, selectedService) }}
				</button>
			</template>
			<template v-if="!timeIntervals.length">
				<p>нет свободного времени</p>
			</template>
		</div>
	</n-modal>
</template>

<script setup>
import Request from '@/components/Request.vue'
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const message = useMessage()
const authStore = useAuthStore()

const cars = ref([])

const allServices = ref([]) //это для селекта
const allServicesToFind = ref([]) //это для поиска
const requestDatesAll = ref([])
// Уникальные значения для каждого селектора
const selectedCar = ref(null)
const selectedService = ref(null)

// Здесь начало

const selectedDateFull = ref('')

const selectedDay = ref()

const selectDay = dayNumber => {
	selectedDay.value = dayNumber
	timeModal.value = true
}

const bodyStyle = {
	width: '1250px',
}

const bodyStyleSmall = {
	width: '550px',
}

const showCalendarModal = ref(false)

const timeModal = ref(false)

const getServiceDuration = serviceId => {
	const service = allServicesToFind.value.find(
		service => service.id_service === serviceId
	)
	return parseInt(service.during)
}

const getServiceDurationOfName = serviceName => {
	const service = allServicesToFind.value.find(
		service => service.name === serviceName
	)
	return parseInt(service.during)
}

const getServiceName = serviceId => {
	const service = allServicesToFind.value.find(
		service => service.id_service === serviceId
	)

	return service.name
}

const currentMonthIndex = ref(new Date().getMonth())
const currentDate = new Date()
let currentYear = currentDate.getFullYear()
const expandedDays = ref([])

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
			selectedDay: ref(null),
			selectedTime: ref(null), // Добавлено состояние для выбранного времени
		}
		days.push(day)
	}
	return days
})

const formatTimeInterval = (startTime, serviceDuration) => {
	console.log(startTime, ',', serviceDuration)
	const startHour = parseInt(startTime.split(':')[0])
	const startMinute = parseInt(startTime.split(':')[1])
	const dur = getServiceDuration(serviceDuration)
	const endHour = startHour + dur
	const endMinute = startMinute

	return `${startTime} - ${endHour.toString().padStart(2, '0')}:${endMinute
		.toString()
		.padStart(2, '0')}`
}

const timeIntervals = computed(() => {
	const intervals = []
	const startTime = 8 // Начальное время работы
	const endTime = 20 // Конечное время работы

	// Получение продолжительности выбранной услуги
	const selectedServiceDuration = ref(
		selectedService.value ? getServiceDuration(selectedService.value) : 0
	)

	// Формирование массива с занятыми временами для выбранного дня
	const selectedDate = new Date(
		currentYear,
		currentMonthIndex.value,
		selectedDay.value
	)

	// Преобразование времени из базы данных в текущую временную зону клиента
	const busyTimes = requestDatesAll.value
		.filter(date => {
			const busyDate = new Date(date.date)
			const selectedDate = new Date(
				currentYear,
				currentMonthIndex.value,
				selectedDay.value
			)
			return (
				busyDate.getDate() === selectedDate.getDate() &&
				busyDate.getMonth() === selectedDate.getMonth() &&
				busyDate.getFullYear() === selectedDate.getFullYear()
			)
		})
		.map(date => {
			const busyDate = new Date(date.date)
			busyDate.setUTCHours(
				busyDate.getUTCHours(),
				busyDate.getUTCMinutes(),
				0,
				0
			) // Обнуляем секунды и миллисекунды
			return { date: busyDate, description: date.description }
		})

	for (let hour = startTime; hour <= endTime; hour++) {
		// Пропускаем часы, которые не удовлетворяют продолжительности услуги
		if (hour + selectedServiceDuration.value > endTime) {
			continue
		}

		if (
			busyTimes.some(busyTime => {
				return (
					busyTime.date.getHours() === hour && busyTime.date.getMinutes() === 0
				)
			})
		) {
			continue // Пропускаем добавление занятого часа в массив intervals
		}

		for (let minutes = 0; minutes < 60; minutes += 60) {
			const time = `${hour.toString().padStart(2, '0')}:${minutes
				.toString()
				.padStart(2, '0')}`
			intervals.push(time)
		}
	}
	// Вычитаем часы перед занятым интервалом, если продолжительность выбранной услуги > 1

	busyTimes.forEach(busyTime => {
		const previousHour = busyTime.date.getHours() - 1
		const hours = previousHour.toString().padStart(2, '0')
		const minutes = busyTime.date.getMinutes().toString().padStart(2, '0')
		const busyHour = `${hours}:${minutes}`
		const busyIndex = intervals.findIndex(interval => interval === busyHour)
		if (busyIndex !== -1) {
			const busyIndexStart = busyIndex + 1
			for (let i = 0; i < selectedServiceDuration.value; i++) {
				const indexToRemove = busyIndexStart - i
				if (indexToRemove >= 0) {
					intervals.splice(indexToRemove, 1)
				}
			}
		}
	})

	busyTimes.forEach(busyTime => {
		const serviceName = busyTime.description // Получаем название услуги из занятого времени
		const serviceDuration = getServiceDurationOfName(serviceName) // Получаем продолжительность услуги

		const nextHour = busyTime.date.getHours() + 1 // Находим следующий час
		const hours = nextHour.toString().padStart(2, '0')
		const minutes = busyTime.date.getMinutes().toString().padStart(2, '0')
		const busyHour = `${hours}:${minutes}`

		const busyIndex = intervals.findIndex(interval => interval === busyHour)

		if (busyIndex !== -1) {
			const indexToRemoveStart = busyIndex + (serviceDuration - 2)
			for (let i = 0; i < serviceDuration; i++) {
				const indexToRemove = indexToRemoveStart - i

				if (indexToRemove < intervals.length) {
					intervals.splice(indexToRemove, 1)
				}
			}
		}
	})

	return intervals
})

const selectTime = time => {
	const selectedDate = new Date(
		currentYear,
		currentMonthIndex.value,
		selectedDay.value
	)
	const [selectedHour, selectedMinute] = time.split(':').map(Number)
	selectedDate.setHours(selectedHour, selectedMinute)
	selectedDate.setHours(selectedDate.getHours() + 3) // Добавляем 3 часа
	const isoString = selectedDate.toISOString()
	selectedDateFull.value = isoString.slice(0, 16).replace('T', ' ')

	showCalendarModal.value = false
	timeModal.value = false
}

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

// здесь конец

const cancelRequest = () => {
	selectedCar.value = null
	selectedService.value = null
	selectedDateFull.value = ''
}

const submitRequest = async () => {
	try {
		const requestInfo = {
			id_car: selectedCar.value,
			completion_date: selectedDateFull.value,
			description: getServiceName(selectedService.value),
		}

		const response = await authStore.createRequest(requestInfo)
		if (response.success) {
			selectedCar.value = null
			selectedService.value = null
			selectedDateFull.value = ''
			message.success('Заявка создана!')
		} else {
			console.error('Failed to create request:', response.error)
			message.error('Ошибка')
		}
	} catch (error) {
		console.error('Error creating request:', error)
	}
}

onMounted(async () => {
	try {
		const response = await authStore.getCarsAndSections()

		if (response.success) {
			cars.value = response.userCars.map(car => ({
				label: `${car.brand} ${car.model}, ${car.god_vipyska} ${car.gos_nomer}`,
				value: car.id_car,
			}))
			allServices.value = response.services.map(service => ({
				label: `${service.name} - ${service.during} часа`,
				value: service.id_service,
			}))
			requestDatesAll.value = response.requestDates
				.map(dateObj => {
					try {
						const completionDate = new Date(dateObj.completion_date)
						if (isNaN(completionDate.getTime())) {
							throw new Error(`Invalid date: ${dateObj.completion_date}`)
						}
						completionDate.setHours(completionDate.getHours() + 3) // Прибавляем 3 часа

						return {
							date: completionDate.toISOString().slice(0, 16).replace('T', ' '),
							description: dateObj.description,
						}
					} catch (error) {
						console.error('Error processing date:', error.message)
						return null
					}
				})
				.filter(date => date !== null)
			allServicesToFind.value = response.services
			console.log('Все услуги', allServicesToFind.value)
			console.log('Все даты', requestDatesAll.value)
		} else {
			console.error('Failed to get user cars and sections:', response.error)
		}
	} catch (error) {
		console.error('Error fetching user cars and sections:', error)
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
	gap: 12px;
	border-bottom: 2px solid #ccc;
}

.page-container {
	padding-top: 10px;
}

.request-form {
	padding: 8px;
	width: 40%;
	border: 1px solid black;
	border-radius: 10px;
	margin: 0 auto;
}

.form-header {
	text-align: center;
	padding-bottom: 4px;
	border-bottom: 1px solid black;
}

.form-wrapper {
	display: flex;
	flex-direction: column;
	gap: 5px;
	padding: 10px;
}

.form-footer {
	padding-top: 0px;
	display: flex;
	justify-content: space-around;
}

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
}

.time-list {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.time-item {
	width: 90px;
	height: 30px;
	background-color: none;
	border: 1px solid black;
	border-radius: 10px;
	cursor: pointer;
}

.time-item:hover {
	background-color: #ccc;
}
</style>
