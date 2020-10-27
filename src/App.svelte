<script>
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
					<li class="font-bold text-kumquat">{book.title}</li>
				{:else}
					<li>{book.title}</li>
				{/if}
			{:else}
				<!-- this block renders when books.length === 0 -->
				<p class="animate-bounce">loading...</p>
			{/each}
			</ul>
		</div>
	</div>
</content>

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