<script>
	import "typeface-raleway";
	import { onMount } from 'svelte';
	import GSheetReader from 'g-sheets-api';
	let name = "Kumquats";
	let logo = "./kumquats.png";
	let books = [];
	let booksThisYear = [];
	let booksCurrentMembers = [];

	onMount(async () => {
		//const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
		//books = await res.json();
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
</script>

<main>
	<h1 class="text-kumquats uppercase">Hello {name}</h1>
	<p>Friends who read together, <strong>stay</strong> together.</p>
	<div class="bg-gray-800 h-1"></div>
</main>
<content class="p-5 mt-5 text-center">
	{#if books.length > 0}
		<div class="grid grid-rows-2 items-center bg-gray-500 m-5 p-2 rounded-full">
			<div>
				<h2 class="font-bold">Total Books Read</h2>
			</div>
			<div class="grid grid-flow-col">
				<div class="text-center">
					<h3 class="text-2xl">{books.length}</h3>
					<span class="uppercase">since the beginning</span>
				</div>
				<div class="text-center">
					<h3 class="text-2xl">{booksCurrentMembers.length}</h3>
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
			<h6 class="text-1xl text-kumquats uppercase">On the shelf this year</h6>
			{#each booksThisYear as book}
				{#if book.queue == "yes"}
					<p class="font-bold text-kumquat">{book.title}</p>
				{:else}
					<p>{book.title}</p>
				{/if}
			{:else}
				<!-- this block renders when books.length === 0 -->
				<p class="animate-bounce">loading...</p>
			{/each}
		</div>
	</div>
</content>

<style global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
	
	body{
		@apply font-sans;
	}
	main{
		@apply text-center;
	}
	h1 {
		@apply text-5xl;
	}
</style>