<template>
	<div class="request-wrapper">
		<h1 class="content-title">Актуальные заявки:</h1>
		<div>
			<Request />
		</div>
	</div>
	<div class="page-container">
		<header>
			<h1 class="content-title">Мои Авто</h1>
			<n-button @click="showCarModal = true" type="primary" ghost
				>Добавить авто</n-button
			>
			<n-button @click="showSectionModal = true" type="primary" ghost
				>Добавить раздел</n-button
			>
			<n-button @click="addCarToSection" type="primary" ghost
				>Добавить авто в раздел</n-button
			>
			<n-button type="error" ghost @click="toggleDeleteMode"
				>Удалить авто</n-button
			>
			<n-button type="error" ghost v-if="deleteMode" @click="deleteSelectedCars"
				>Удалить выбранные авто</n-button
			>
		</header>

		<div class="container">
			<!-- Отображение автомобилей и секций -->

			<div v-for="section in carsInSections" :key="section.id_section">
				<h3 class="section-name">{{ section.section_name }}</h3>
				<ul class="car-list">
					<li
						class="car-item"
						v-for="car in section.cars"
						:key="car.id_car"
						@click="showCar(car)"
					>
						<input
							type="checkbox"
							v-if="deleteMode"
							class="car-checkbox"
							@change="toggleSelectCar(car.id_car)"
							:checked="isSelectedCar(car.id_car)"
							@click.stop
						/>
						<p>{{ car.brand }} {{ car.model }} {{ car.god_vipyska }}</p>
						<p>{{ car.gos_nomer }}</p>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<n-modal
		v-model:show="showCarModal"
		preset="card"
		title="Добавление авто"
		size="medium"
		:style="bodyStyle"
	>
		<template #header-extra></template>
		<form>
			<n-input type="text" placeholder="Марка" v-model:value="brand" />
			<n-input type="text" placeholder="Модель" v-model:value="model" />
			<n-input
				type="text"
				placeholder="Год выпуска"
				v-model:value="god_vipyska"
			/>
			<n-input type="text" placeholder="Госномер" v-model:value="gos_nomer" />
			<n-input type="text" placeholder="VIN" v-model:value="vin" />
			<n-input type="text" placeholder="Кузов" v-model:value="body" />
			<n-input type="text" placeholder="Цвет" v-model:value="color" />
			<n-input type="text" placeholder="Пробег" v-model:value="mileage" />
			<n-button type="primary" @click="AddCar">Добавить авто</n-button>
		</form>
	</n-modal>
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
				placeholder="Название раздела"
				v-model:value="name"
			/>
			<n-button type="primary" @click="AddSection">Добавить раздел</n-button>
		</form>
	</n-modal>
	<n-modal
		v-model:show="showSectionCarModal"
		preset="card"
		title="Добавление раздела"
		size="medium"
		:style="bodyStyle"
	>
		<template #header-extra></template>
		<form>
			<n-select
				v-model:value="selectedCar"
				:options="cars"
				placeholder="Выберите авто"
			></n-select>
			<n-select
				v-model:value="selectedSection"
				:options="sections"
				placeholder="Выберите раздел"
			></n-select>
			<n-button type="primary" @click="updateCarSection">Сохранить</n-button>
		</form>
	</n-modal>

	<n-modal
		v-model:show="showSectionUpdateCar"
		preset="card"
		title="Автомобиль"
		size="medium"
		:style="bodyStyle"
	>
		<template #header-extra></template>
		<form>
			<n-input
				type="text"
				placeholder="Марка"
				v-model:value="selectedCar.brand"
			/>
			<n-input
				type="text"
				placeholder="Модель"
				v-model:value="selectedCar.model"
			/>
			<n-input
				type="year"
				placeholder="Год выпуска"
				v-model:value="selectedCar.god_vipyska"
			/>
			<n-input
				type="text"
				placeholder="Госномер"
				v-model:value="selectedCar.gos_nomer"
			/>
			<n-input type="text" placeholder="VIN" v-model:value="selectedCar.vin" />
			<n-input
				type="text"
				placeholder="Кузов"
				v-model:value="selectedCar.body"
			/>
			<n-input
				type="text"
				placeholder="Цвет"
				v-model:value="selectedCar.color"
			/>
			<n-input-number
				placeholder="Пробег"
				v-model:value="selectedCar.mileage"
			/>
			<n-button type="primary" @click="updateSelectedCar">Изменить</n-button>
		</form>
	</n-modal>
</template>

<script setup>
import Request from '@/components/Request.vue'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
const showCarModal = ref(false)
const showSectionModal = ref(false)
const showSectionCarModal = ref(false)
const showSectionUpdateCar = ref(false)

const bodyStyle = {
	width: '400px',
}
const authStore = useAuthStore()

const brand = ref('')
const model = ref('')
const god_vipyska = ref('')
const gos_nomer = ref('')
const vin = ref('')
const body = ref('')
const color = ref('')
const mileage = ref('')

const name = ref('')

const carsInSections = ref([])

const cars = ref([])

const sections = ref([])

const selectedCar = ref(null)
const selectedSection = ref(null)

const selectedCars = ref([])
const deleteMode = ref(false)

const toggleDeleteMode = () => {
	deleteMode.value = !deleteMode.value
}

const toggleSelectCar = carId => {
	const index = selectedCars.value.indexOf(carId)
	if (index === -1) {
		selectedCars.value.push(carId)
	} else {
		selectedCars.value.splice(index, 1)
	}
}

const isSelectedCar = carId => {
	return selectedCars.value.includes(carId)
}

const showCar = car => {
	selectedCar.value = car
	brand.value = car.brand
	model.value = car.model
	god_vipyska.value = car.god_vipyska
	gos_nomer.value = car.gos_nomer
	vin.value = car.vin
	body.value = car.body
	color.value = car.color
	mileage.value = car.mileage
	showSectionUpdateCar.value = true
}

const updateSelectedCar = async () => {
	try {
		const mileageValue = mileage.value ? parseInt(mileage.value) : null
		const response = await authStore.updateCarInfo({
			brand: selectedCar.value.brand,
			model: selectedCar.value.model,
			god_vipyska: selectedCar.value.god_vipyska,
			gos_nomer: selectedCar.value.gos_nomer,
			vin: selectedCar.value.vin,
			body: selectedCar.value.body,
			color: selectedCar.value.color,
			mileage: mileageValue,
			carId: selectedCar.value.id_car,
		})
		if (response.success) {
			// Обновление прошло успешно
			location.reload()
		} else {
			// Ошибка при обновлении
			console.error('Failed to update car:', response.error)
			// Обработайте ошибку, отобразите сообщение пользователю и т. д.
		}
	} catch (error) {
		console.error('Error updating car:', error)
		// Обработайте ошибку, отобразите сообщение пользователю и т. д.
	}
}

const deleteSelectedCars = async () => {
	try {
		for (const carId of selectedCars.value) {
			const response = await authStore.deleteCar(carId)
			if (response.success) {
				location.reload()
			} else {
				// Ошибка при удалении автомобиля
				console.error('Failed to delete car:', response.error)
			}
		}
		// Очищаем список выбранных автомобилей после удаления
		selectedCars.value = []
	} catch (error) {
		console.error('Error deleting cars:', error)
	}
}

const updateCarSection = async () => {
	try {
		const response = await authStore.updateCarSection({
			carId: selectedCar.value,
			sectionId: selectedSection.value,
		})
		if (response.success) {
			// Обновление прошло успешно
			location.reload()
		} else {
			// Ошибка при обновлении
			console.error('Failed to update car section:', response.error)
			// Обработайте ошибку, отобразите сообщение пользователю и т. д.
		}
	} catch (error) {
		console.error('Error updating car section:', error)
		// Обработайте ошибку, отобразите сообщение пользователю и т. д.
	}
}

const addCarToSection = () => {
	showSectionCarModal.value = true
	getCarAndSection()
}

const AddSection = async () => {
	try {
		const response = await authStore.addSection({ name: name.value })
		if (response.success) {
			location.reload()
		} else {
			// Ошибка при добавлении
			console.error('Failed to add car:', response.error)
		}
	} catch (error) {
		console.error('Error adding car:', error)
	}
}

const AddCar = async () => {
	try {
		const response = await authStore.addCar({
			brand: brand.value,
			model: model.value,
			god_vipyska: god_vipyska.value,
			gos_nomer: gos_nomer.value,
			vin: vin.value,
			body: body.value,
			color: color.value,
			mileage: mileage.value,
		})

		if (response.success) {
			location.reload()
		} else {
			// Ошибка при добавлении
			console.error('Failed to add car:', response.error)
			// Обработайте ошибку, отобразите сообщение пользователю и т. д.
		}
	} catch (error) {
		console.error('Error adding car:', error)
		// Обработайте ошибку, отобразите сообщение пользователю и т. д.
	}
}

const getCarAndSection = async () => {
	try {
		const response = await authStore.getCarsAndSections()
		if (response.success) {
			// Если успешно получены данные, сохраняем их в переменные cars и sections
			cars.value = response.userCars.map(car => ({
				label: `${car.brand} - ${car.gos_nomer}`,
				value: car.id_car,
			}))

			sections.value = response.userSections.map(section => ({
				label: section.section_name,
				value: section.id_section,
			}))
		} else {
			// Если произошла ошибка при получении данных, выводим сообщение об ошибке
			console.error('Failed to get user cars and sections:', response.error)
		}
	} catch (error) {
		console.error('Error fetching user cars and sections:', error)
	}
}

onMounted(async () => {
	try {
		const token = localStorage.getItem('userToken')
		const response = await authStore.getUserCarsAndSections(token)
		if (response.success) {
			// Группируем машины по секциям
			response.carsAndSections.forEach(car => {
				const sectionIndex = carsInSections.value.findIndex(
					section => section.id_section === car.id_section
				)
				if (sectionIndex !== -1) {
					carsInSections.value[sectionIndex].cars.push(car)
				} else {
					// Создаем новую секцию и добавляем ее к массиву секций
					const newSection = {
						id_section: car.id_section,
						section_name: car.section_name,
						cars: [car], // Машина добавляется в массив машин новой секции
					}
					carsInSections.value.push(newSection)
				}
			})
		} else {
			// Ошибка при получении данных
			console.error('Failed to fetch user cars and sections:', response.error)
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
	gap: 20px;
	border-bottom: 2px solid #ccc;
}

.page-container {
	padding-top: 20px;
}

header {
	display: flex;
	gap: 20px;
}

form {
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
}

.container {
	padding: 40px;
	display: flex;
	flex-direction: column;
	gap: 40px;
	height: 230px;
	overflow: scroll;
	overflow-x: hidden;
}

.car-list {
	list-style-type: none;
	display: flex;
	flex-wrap: wrap;
	gap: 40px;
	border-bottom: 1px solid black;
	padding-bottom: 20px;
}

.car-item {
	text-align: center;
	width: 18%;
	position: relative;
	padding: 20px;
	border: 1px solid black;
	border-radius: 10px;
	cursor: pointer;
}

.car-checkbox {
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

.car-checkbox:checked {
	background-color: black;
}

.section-name {
	margin-bottom: 20px;
}
</style>
