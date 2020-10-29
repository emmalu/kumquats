<script>
	import { onMount } from 'svelte';
	import GSheetReader from 'g-sheets-api';
	import Modal from './Components/Modal.svelte';
	//import { each } from 'svelte/types/runtime/internal/ssr';
	let showModal = false;
	let modalContents = {};
	let name = "Kumquats";
	let logo = "./kumquats.png";
	let books = [];
	let booksThisYear = [];
	let booksCurrentMembers = [];

	onMount(async () => {
		const options = {
			sheetId: '15kjHikPPLUsiaKa1lE9DY8uEoNiNcLjwvRAQcxspI9E',
			sheetNumber: 1,
			returnAllResults: true,
		}
		GSheetReader(options, results => {
			books = results;
			let d = new Date();
			let thisYear = d.getFullYear();
			booksThisYear = books.filter(function(book){
				return parseInt(book.year) === thisYear;
			});
			booksCurrentMembers = books.filter(function(book){
				return parseInt(book.year) >= 2017;
			});
			//debugger;
		});
	});
	
	$: document.title = name;

	async function handleModal(book, author) {
		modalContents.author = author;
		modalContents.book = book;
		modalContents.reviews = false;
		modalContents.history = false;
		showModal = true;
		let res = await fetch(`https://api.nytimes.com/svc/books/v3/reviews.json?title=${book}&author=${author}&api-key=S4GPgI6QHdDuodbA9Q0NGGk6BqtQN4vA`);
		let reviews = await res.json();
		let res2 = await fetch(`https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?title=${book}&author=${author}&api-key=S4GPgI6QHdDuodbA9Q0NGGk6BqtQN4vA`);
		let history = await res2.json();
		let res3 = await fetch(`https://www.goodreads.com/book/title.xml?author=Arthur+Conan+Doyle&key=CaKtrT6HTbus1r7qFCOUqg&title=Hound+of+the+Baskervilles&format=json`);
		let text = await res3.text();
		let parser = new DOMParser();
		let xml = parser.parseFromString(text,"text/xml");
		let goodreads = xml.getElementsByTagName("book")[0].childNodes[0].nodeValue;
		debugger;
		modalContents.reviews = reviews.results;
		modalContents.history = history.results;
	}
</script>

<main>
	<h1 class="text-kumquats uppercase">Hello {name}</h1>
	<p>Friends who read together, <strong>stay</strong> together.</p>
	<div class="bg-gray-800 h-1"></div>
</main>
<content class="p-5 mt-5 text-center">
	{#if books.length > 0}
		<h3 class="sm:hidden text-xl font-bold">Total Books Read</h3>
		<div class="grid grid-rows-1 sm:grid-rows-2 items-center bg-gray-500 my-5 py-2 rounded-3xl sm:rounded-full">
			<div class="hidden sm:block">
				<h3 class="text-xl font-bold">Total Books Read</h3>
			</div>
			<div class="grid grid-flow-row sm:grid-flow-col pb-10">
				<div class="text-center">
					<h3 class="text-5xl">{books.length}</h3>
					<span class="uppercase">since the beginning</span>
				</div>
				<div class="text-center">
					<h3 class="text-5xl">{booksCurrentMembers.length}</h3>
					<span class="uppercase">lately (since 2017)</span>
				</div>
			</div>
		</div>
	{/if}
	<div class="grid grid-cols-2 items-center">
		<div>
			<img class="h-26 object-contain" src={logo} alt="{logo} logo" />
		</div>
		<div class="text-left">
			<h6 class="text-1xl text-kumquats uppercase">on the shelf <span class="hidden sm:inline">this year</span>. . .</h6>
			<ul class="list-decimal list-outside">
			{#each booksThisYear as book}
				{#if book.queue == "yes"}
					<li on:click="{handleModal(book.title, book.author)}" class="font-bold text-kumquat cursor-pointer hover:text-kumquats">{book.title}</li>
				{:else}
					<li on:click="{handleModal(book.title, book.author)}" class="cursor-pointer hover:text-kumquats">{book.title}</li>
				{/if}
			{:else}
				<!-- this block renders when books.length === 0 -->
				<p class="animate-bounce">loading...</p>
			{/each}
			</ul>
		</div>
	</div>
</content>
{#if showModal}
	<Modal on:close="{() => showModal = false}">
		<h2 slot="header">
			<p class="font-bold">{modalContents.book}</p> by
			<small class="text-kumquats">{modalContents.author}</small>
		</h2>
		<div>
			{#if !modalContents.history && !modalContents.reviews}
				<p class="animate-bounce text-gray-700 pt-5">loading...</p>
			{:else}
				{#if modalContents.history.length > 0}
					<p class="pt-5 text-sm text-gray-700 font-extrabold">NYT Details</p>
					{#each modalContents.history as rec}
						<p>Publisher: {rec.publisher}</p>
						<p>{rec.description}</p>
					{/each}
				{/if}
				{#if modalContents.reviews.length > 0}
					<p class="pt-5 text-sm text-gray-700 font-extrabold">NYT Reviews</p>
					{#each modalContents.reviews as review}
						<p><a href="{review.url}" target="_blank">{review.publication_dt}</a></p>
					{/each}
				{/if}
			{/if}
		</div>
	</Modal>
{/if}

<style global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
	
	main{
		@apply text-center;
	}
	h1 {
		@apply text-5xl;
	}
</style>