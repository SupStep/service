<template>
	<div class="request-list" v-if="isLoggedIn">
		<div v-for="request in userRequestInfo.requests" :key="request.id_request">
			<template v-if="request.request_status !== 'Завершена'">
				<div class="request-item">
					<div
						class="circle"
						:class="{
							'green-circle': request.request_status === 'Подтверждена',
							'orange-circle': request.request_status === 'В ремонте',
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
			</template>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
const isLoggedIn = computed(() => !!authStore.token)
const authStore = useAuthStore()
const userRequestInfo = ref([])

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
		console.log(response.requests)
	} catch (error) {
		console.error('Error getting user request information:', error)
	}
})
</script>

<style scoped>
.request-list {
	margin-bottom: 20px;
	display: flex;
	flex-wrap: wrap;

	gap: 40px;
	width: 100%;
	padding-top: 20px;
	max-height: 110px;
	overflow-y: scroll;
}

.request-item {
	height: 20px;
	position: relative;
	padding: 12px;
	border-radius: 10px;
	border: 1px solid black;
	display: flex;
	justify-content: center;
	gap: 8px;
	width: 100%;
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
</style>
