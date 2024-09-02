<template>
	<div class="request-wrapper">
		<h1 class="content-title">Актуальные заявки:</h1>
		<div>
			<Request />
		</div>
	</div>

	<div class="contact-cont">
		<h1>Контактная информация:</h1>
		<p>Расписание: 8:00 до 20:00</p>
		<p>Почта для обращения: service@mail.com</p>
		<p>Контактный номер телефона: +7(409)-324-23-31</p>
		<p>Адрес: ул. Центральная, д5, стр1</p>
	</div>
</template>

<script setup>
import Request from '@/components/Request.vue'
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

.contact-cont {
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.contact-cont p {
	font-size: 18px;
}
</style>
