<script>
	import { onMount } from 'svelte';
	import Modal from './Components/Modal.svelte';
	
	let showModal = false;
	const modalContents = {};
	const name = "Kumquats";
	const logo = "./kumquats.png";
	const books = {};

	onMount(async () => {
		fetch(`https://la-paix.onrender.com/kumquats`)
			.then(response => { 
				if(response.ok) return response.json();
			}).then(json => {
				//console.log(json);
				parseData(json.sheetData);
			});
	});
	
	function parseData(sheet_data) {
		let results = sheet_data.rows;
		books.all = results;
		let d = new Date();
		let thisYear = d.getFullYear();
		books.allThisYear = results.filter(function(book){
			return parseInt(book.year) === thisYear;
		});
		books.leftThisYear = results.filter(function(book){
			return parseInt(book.year) === thisYear && book.queue == "yes";
		});
		books.currentMembers = results.filter(function(book){
			return parseInt(book.year) >= 2017;
		});
		let theYears = [...new Set(results.map(book => parseInt(book.year)))];
		theYears.sort(function(a, b){return b-a}); 
		let booksByYear = [];
		theYears.forEach(year => {
			if(year != thisYear){
				let thisYears = results.filter(function(book){
					return parseInt(book.year) == year;
				});
				booksByYear.push({
					year: year,
					books: thisYears,
					count: thisYears.length,
					visible: false
				});
			}
		});
		books.allByYears = booksByYear;
		//console.log(books);
	}
	$: document.title = name;

	function clearModal(){
		modalContents.author = '';
		modalContents.book = ''; 
		modalContents.grBookLink = '';
		modalContents.grAuthorLink = '';
		modalContents.reviews = false;
		modalContents.history = false;
		modalContents.facts = false;
	}

	async function handleModal(book, author) {
		if (modalContents.author !== author){
			clearModal();
		}
		modalContents.author = author;
		modalContents.book = book; 
		showModal = true;
		modalContents.grBookLink = `https://www.goodreads.com/search?utf8=%E2%9C%93&query=${book}`;
		modalContents.grAuthorLink = `https://www.goodreads.com/search?utf8=%E2%9C%93&query=${author}`;
		modalContents.reviews = false;
		modalContents.history = false;
		let res = await fetch(`https://api.nytimes.com/svc/books/v3/reviews.json?title=${book}&author=${author}&api-key=S4GPgI6QHdDuodbA9Q0NGGk6BqtQN4vA`);
		let reviews = await res.json();
		let res2 = await fetch(`https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?title=${book}&author=${author}&api-key=S4GPgI6QHdDuodbA9Q0NGGk6BqtQN4vA`);
		let history = await res2.json();
		let res3 = await fetch(`https://openlibrary.org/search.json?title=${book}&author=${author}`);
		let openLibraryFacts = await res3.json();
		modalContents.reviews = reviews.results;
		modalContents.history = history.results;
		let facts = await openLibraryFacts.docs;
		if(facts.length > 1){
			let oldestData = facts.reduce(function(prev, curr) {
				return prev.first_publish_year < curr.first_publish_year ? prev : curr;
			});
			modalContents.facts = oldestData;
		} else{
			modalContents.facts = facts[0];
		}
	}
	function show(year){
		let id = "list"+year;
		let collapseList = document.getElementById(id);
		if(collapseList.classList.contains("hidden")){
			collapseList.classList.remove("hidden");
		}
		else{
			collapseList.classList.add("hidden");
		}
	}
</script>

<main>
	<h1 class="text-kumquats uppercase">Hello {name}</h1>
	<p>Friends who read together, <strong>stay</strong> together.</p>
	<div class="bg-gray-800 h-1 my-1"></div>
</main>
<content class="text-center">
	{#if books.all}
		<h3 class="text-xl font-bold">By the Books</h3>
		<div class="grid grid-rows-1 items-center bg-gray-300 my-1 py-2 rounded-3xl md:rounded-full">
			<div class="grid grid-flow-row sm:grid-flow-col pb-5">
				<div class="text-center">
					<h3 class="text-5xl">{books.all.length - books.leftThisYear.length}</h3>
					<span class="uppercase">read since the beginning</span>
				</div>
				<div class="text-center">
					<h3 class="text-5xl">{books.currentMembers.length - books.leftThisYear.length}</h3>
					<span class="uppercase">read by current members</span>
				</div>
				<div class="text-center">
					<h3 class="text-5xl">{books.leftThisYear.length}</h3>
					<span class="uppercase">this year's queue</span>
				</div>
			</div>
		</div>
	{:else if !books.all}
		<p class="animate-bounce text-gray-700 pt-5">loading...</p>
	{/if}
	<div class="grid grid-cols-1 sm:grid-cols-2 items-center">
		<div class="hidden sm:block">
			<img class="h-26 object-contain" src={logo} alt="{logo} logo" />
		</div>
		<div class="text-center sm:text-left">
			<h6 class="text-1xl text-kumquats uppercase py-2">this year's shelf</h6>
			<ul class="list-decimal list-inside">
			{#if books.allThisYear}
				{#each (books.allThisYear) as book}
					{#if book.queue == "yes"}
						<li on:click="{handleModal(book.title, book.author)}" on:keyup="{handleModal(book.title, book.author)}" class="border-solid border-1 border-gray-700 py-2 pl-2 shadow-md mb-2 sm:mb-3 lg:mb-1 font-bold text-kumquat cursor-pointer hover:text-kumquats">{book.title}</li>
					{:else}
						<li on:click="{handleModal(book.title, book.author)}" on:keyup="{handleModal(book.title, book.author)}"class="border-solid border-1 border-gray-700 py-2 pl-2 shadow-md mb-2 sm:mb-3 lg:mb-1 cursor-pointer hover:text-kumquats">{book.title}</li>
					{/if}
				{/each}
			{/if}
			</ul>
			<div class="block sm:hidden">
				<img class="h-26 object-contain" src={logo} alt="{logo} logo" />
			</div>
		</div>
	</div>
	<hr>
	<div class="text-center pb-2">
		<h6 class="text-1xl text-kumquats uppercase py-2">shelf from years past</h6>
		{#if books.allByYears}
			{#each (books.allByYears) as year}
			<div class="border-solid border-2 border-gray-700 py-2 shadow-lg rounded-xl cursor-pointer">
				<h6 class="py-2" id="{year.year}" on:click={show(year.year)} on:keyup={show(year.year)}>
					{year.count} books in <span class="font-extrabold">{year.year}</span></h6>
				<ul class="list-none list-inside text-left hidden" id="list{year.year}">
				{#each year.books as book}
					<li on:click="{handleModal(book.title, book.author)}" on:keyup="{handleModal(book.title, book.author)}" class="border-solid border-2 border-gray-200 py-2 pl-2 cursor-pointer hover:text-kumquats motion-safe:animate-bounce shadow-inner" id="{year.year}{book.title}">
						{book.title} <small class="text-kumquats"><em>by <strong>{book.author}</strong></em></small>
					</li>
				{/each}
				</ul>
			</div>
			{/each}
		{/if}
	</div>
	<div class="pb-2">
	</div>
</content>
{#if showModal}
	<Modal on:close="{() => showModal = false}">
		<h2 slot="header">
			<p class="font-bold">{modalContents.book}</p> by
			<small class="text-kumquats">{modalContents.author}</small>
		</h2>
		<div>
			{#if !modalContents.history && !modalContents.reviews && !modalContents.facts}
				<p class="animate-bounce text-gray-700 pt-5">Searching...</p>
			{:else}
				<div class="pt-2 pb-1">
					<p class="text-sm text-gray-700 font-extrabold">Open GoodReads Search</p>
					<button class="bg-white hover:bg-green-200 text-gray-700 font-semibold py-2 px-4 border border-gray-400 rounded shadow" on:click="{window.open(modalContents.grBookLink, "_blank")}" on:keyup="{window.open(modalContents.grBookLink, "_blank")}">By Book Title</button>
					<button class="bg-white hover:bg-green-200 text-gray-700 font-semibold py-2 px-4 border border-gray-400 rounded shadow" on:click="{window.open(modalContents.grAuthorLink, "_blank")}" on:keyup="{window.open(modalContents.grAuthorLink, "_blank")}">By Author</button>
				</div>
				{#if modalContents.facts}
					<p class="pt-5 text-sm text-gray-700 font-extrabold">Open Library Facts</p>
					{#if modalContents.facts.first_publish_year}
						<p>
							First Published in <span class="font-extrabold">{modalContents.facts.first_publish_year}</span>
						</p>
					{/if}
					{#if modalContents.facts.publish_place && modalContents.facts.publish_place?.length < 6}
						<p>
							Places Published: <span class="font-extrabold">{modalContents.facts.publish_place}</span>
						</p>
					{/if}
					{#if modalContents.facts.language && modalContents.facts.language?.length > 1}
						<p>Available
							in <span class="font-extrabold">{modalContents.facts.language.length} languages</span>
						</p>
					{/if}			
					
					{#if modalContents.facts.publisher && modalContents.facts.publisher?.length < 6}
						<p class="pt-5 text-kumquats">Publishers</p>
						<span>{modalContents.facts.publisher.join(', ')}</span>
					{:else}
						<p class="pt-5 text-kumquats">>{(Math.ceil(modalContents.facts.publisher.length / 10) * 10)} Publishers!</p>
					{/if}
				{/if}
				{#if modalContents.history.length > 0}
					<p class="pt-5 text-sm text-gray-700 font-extrabold">Book Details by the NYT</p>
					{#each modalContents.history as rec}
						<p>Publisher: {rec.publisher}</p>
						<p>{rec.description}</p>
					{/each}
				{/if}
				{#if modalContents.reviews.length > 0}
					<p class="pt-5 text-sm text-gray-700 font-extrabold">NYT Reviews</p>
					{#each modalContents.reviews as review}
						<p><a href="{review.url}" target="_blank" class="inline-flex" rel="noreferrer">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
								<path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
							</svg>&nbsp;
							{review.publication_dt}
						</a></p>
					{/each}
				{/if}
			{/if}
		</div>
	</Modal>
{/if}

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
	
	main{
		@apply text-center;
	}
	main,
	.map-view {
		padding: 0;
		margin: 0;
		max-height: 100%;
		width: 100%;
	}
	h1 {
		@apply text-5xl;
	}
</style>