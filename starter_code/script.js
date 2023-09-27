const input = document.querySelector('#fruit');
const suggestions = document.querySelector('.suggestions ul');
const fruit = ['Apple', 'Apricot', 'Avocado 🥑', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Coconut', 'Cranberry', 'Cucumber', 'Custard apple', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Juniper berry', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Mangosteen', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Miracle fruit', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Plantain', 'Plum', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];

function search(str) {
	let results = fruit.filter(f => f.toLowerCase().includes(str.toLowerCase()));
	return results;
}

function showSuggestions(results, inputVal) {
	suggestions.innerHTML = '';

	// Limit the number of suggestions to 3
	const limitedResults = results.slice(0, 5);

	if (limitedResults.length > 0) {
		limitedResults.forEach(result => {
			const li = document.createElement('li');
			const suggestionText = result.replace(new RegExp(inputVal, 'gi'), match => `<strong>${match}</strong>`);
			li.innerHTML = suggestionText;
			// li.addEventListener('mouseenter', () => {
			// 	li.classList.add('hovered');
			// });
			// li.addEventListener('mouseleave', () => {
			// 	li.classList.remove('hovered');
			// });
			suggestions.appendChild(li);
		});
		suggestions.classList.add('has-suggestions');
	} else {
		suggestions.classList.remove('has-suggestions');
	}
}


// Add this function to close suggestions when clicking outside
// Issue 1: this function will only run on the first click, where it isn't clicking on the suggestions
function closeSuggestionsOnClickOutside(e) {
	if (!document.querySelector('.suggestions').contains(e.target)) {
		suggestions.classList.remove('has-suggestions');
	}
}

// Update the useSuggestion function to only set the input value
function useSuggestion(e) {
	if (e.target.tagName === 'LI') {
		const selectedSuggestion = e.target.textContent;
		input.value = selectedSuggestion;
		suggestions.classList.remove('has-suggestions');
	}
}

input.addEventListener('keyup', (e) => {
	const inputVal = e.target.value;
	const results = search(inputVal);
	showSuggestions(results, inputVal);
});

// Add an event listener to close suggestions when clicking outside
// this will only run once, when we load the page
document.addEventListener('click', closeSuggestionsOnClickOutside);

// Remove the click event listener for closing suggestions from useSuggestion
suggestions.addEventListener('click', useSuggestion);