/*
// THIS IS THE WAY TO IMPORT WITH NODE
const users = require('./users.json');

// EXAMPLE OF DATE MANIPULATIONS
const todaysDate = new Date().toISOString().slice(0, 10);
console.log(todaysDate)
console.log(new Date(todaysDate))
 */

// DOM ELEMENTS
const headerEl = document.querySelector(`header`);
const calEl = document.querySelector(`div.cal`);
const addNoteEl = document.querySelector('#add-note');
const notesDiv = document.querySelector(`div.notes`);
const notesEl = document.querySelector(`p.notes`);
const notesForm = document.querySelector(`form.notes`);
const notesFormText = document.querySelector(`textarea.notes`);
const btnNotesCancel = document.querySelector(`#btn-notes-cancel`);
const btnNotesDone = document.querySelector(`#btn-notes-done`);
const inspectorForm = document.querySelector(`form.inspector`);
const inspectorMealNameEl = document.querySelector(`#inspector-meal-name`);
const inspectorDateEl = document.querySelector(`#inspector-date`);
const contributorsEl = document.querySelector(`#contributors`);
const inspectorFoodEl = document.querySelector(`#inspector-food`);

// STARTER VARIABLES
let plan;
let selectedMeal;
let selectedMealEl;
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

// MOCKAPI FETCH for individual meal plan
function getMealPlan(id) {
	const url = new URL('https://64af0f27c85640541d4e1b0c.mockapi.io/mealPlans');
	url.searchParams.append('id', id);

	fetch(url, {
		method: 'GET',
		headers: { 'content-type': 'application/json' },
	})
		.then(res => {
			if (res.ok) {
				return res.json();
			}
			// handle error
			console.log(`Error getting json from MockAPI`);
		})
		.then(data => {
			console.log(data); //TEST
			plan = data;
		})
		.catch(error => {
			// handle error
			console.log(`Error fetching meal plan`);
		});
}
// getMealPlan(2);

// LOCAL TESTER DATA
import { mealPlans } from './meal-plan-data.js';
plan = mealPlans[0];

//TEST - Examples
console.log(`There are plans ${mealPlans.length} in the test database.`);
console.log(`${plan.name} has ${plan.days.length} days scheduled.`);

// Set calendar name in header
headerEl.innerText = plan.name;

// Set calendar's CSS Grid to max of 7 columns
const length = plan.days.length;
// const length = 11; //TEST
const columns = length > 7 ? Math.ceil(length / 2) : length;
document.querySelector(':root').style.setProperty('--calendar-columns', columns);

// Generate startDate from YYYY-MM-DD format
let offset = (new Date().getTimezoneOffset() + 180) * 60000;
let startDate = new Date(plan.startDate.slice(0, 10));
startDate = startDate.getTime() + offset;
startDate = new Date(startDate);

// Render the Calendar
let mealIndex = 0;
plan.days.forEach((day, dayIndex) => {
	// Create day element
	const dayEl = document.createElement('div');
	dayEl.classList.add('day');

	// Determine the day's date
	let thisDate = new Date(startDate);
	thisDate.setDate(thisDate.getDate() + dayIndex);

	const thisDayName = dayNames[thisDate.getDay()];
	const thisMonthAndDate = `${monthNames[thisDate.getMonth()]} ${thisDate.getDate()}`;

	let dateText = `${thisDayName}\n${thisMonthAndDate}`;

	// Append the date to the day
	const dateEl = document.createElement('p');
	dateEl.classList.add('date');
	dateEl.classList.add('txt-sm');
	dateEl.innerText = dateText;

	// Append the day to the calendar
	dayEl.appendChild(dateEl);
	calEl.appendChild(dayEl);

	// Render meals

	for (let meal in day) {
		mealIndex++;
		const mealEl = document.createElement('p');
		mealEl.classList.add('meal');
		mealEl.classList.add('txt-sm');

		// innerText food
		mealEl.innerText = day[meal].food;

		// Determine color
		let color;
		if (day[meal].contributor) {
			color = plan.contributors.find(c => c.id === day[meal].contributor).color;
		} else {
			color = 'white';
		}
		mealEl.dataset.color = color;

		// Custom properties for selecting and targeting changes
		mealEl.id = `meal-${mealIndex}`;
		mealEl.dataset.day = dayIndex;
		mealEl.dataset.meal = meal;
		mealEl.dataset.dayName = thisDayName;
		mealEl.dataset.date = thisMonthAndDate;
		mealEl.dataset.food = day[meal].food;

		// Click Events
		mealEl.addEventListener('click', e => {
			document.querySelectorAll('.meal').forEach(m => m.classList.remove('selected'));
			e.target.classList.add('selected');
			selectedMeal = e.target.dataset;
			selectedMeal.mealElId = e.target.id;
			selectedMealEl = document.getElementById(e.target.id);
			mealSelectionChange();
			inspectorForm.classList.remove('hidden');
		});

		dayEl.appendChild(mealEl);
	}
});

function mealSelectionChange() {
	inspectorForm.reset();
	inspectorForm.dataset.color = selectedMeal.color;
	inspectorMealNameEl.innerText = selectedMeal.meal;
	inspectorDateEl.innerText = `${selectedMeal.dayName}, ${selectedMeal.date}`;
	if (selectedMeal.color === 'white') {
		document.getElementById('blank-option').selected = 'selected';
	} else {
		const selectedOption = document.querySelector(
			`.contributor-option[data-color="${selectedMeal.color}"]`
		);
		selectedOption.selected = 'selected';
	}

	inspectorFoodEl.innerText = selectedMeal.food;

	// console.log(selectedMeal); //TEST
}

//TEST Extra Day Blocks
let extraSpaces = length - plan.days.length;
for (let i = extraSpaces; i > 0; i--) {
	const extraBlock = document.createElement('p');
	extraBlock.classList.add('extra');
	extraBlock.innerText = `extra block ${i}`;
	calEl.appendChild(extraBlock);
}

// NOTES
// Render Notes
if (plan.notes) {
	notesEl.innerText = `Notes:\n${plan.notes}`;
	addNoteEl.classList.add('hidden'); // 'Add Note' hidden
	notesDiv.classList.remove('hidden'); // notes div visible
	notesEl.classList.remove('hidden'); // notes element visible
	notesForm.classList.add('hidden'); // notes form hidden
} else {
	addNoteEl.classList.remove('hidden'); // 'Add Note' visible
	notesDiv.classList.add('hidden'); // notes div hidden
	notesEl.classList.add('hidden'); // notes element hidden
	notesForm.classList.remove('hidden'); // notes form visible
}

addNoteEl.addEventListener('click', () => {
	addNoteEl.classList.add('hidden'); // 'Add Note' hidden
	notesDiv.classList.remove('hidden'); // notes div visible
	notesFormText.focus();
});

function toggleNotesEdit() {
	notesEl.classList.toggle('hidden');
	notesForm.classList.toggle('hidden');
}

notesEl.addEventListener('click', () => {
	notesForm.reset();
	notesFormText.innerText = plan.notes;
	toggleNotesEdit();
	notesFormText.focus();
	notesFormText.selectionStart = notesFormText.value.length;
});

btnNotesCancel.addEventListener('click', toggleNotesEdit);

btnNotesDone.addEventListener('click', e => {
	e.preventDefault();
	plan.notes = notesFormText.value; //TODO - PUT to database
	notesEl.innerText = `Notes:\n${notesFormText.value}`;
	toggleNotesEdit();
});

//Inspector Contributors
renderContributors();
function renderContributors() {
	const blankOption = document.createElement('option');
	blankOption.id = 'blank-option';
	blankOption.dataset.color = 'white';
	blankOption.dataset.contributor = '';
	blankOption.innerText = 'none';
	contributorsEl.appendChild(blankOption);

	plan.contributors.forEach(contributor => {
		const contributorOption = document.createElement('option');
		contributorOption.classList.add('contributor-option');
		contributorOption.dataset.color = contributor.color;
		contributorOption.dataset.contributor = contributor.id;
		contributorOption.innerText = contributor.name;
		contributorsEl.appendChild(contributorOption);
	});
}
contributorsEl.addEventListener('change', e => {
	// New selection info
	const options = document.getElementById('contributors').children;
	const selection = e.target.selectedIndex;
	// console.log(`Selected Contributor: ${options[selection].dataset.contributor}`); //TEST

	// Set color of self
	inspectorForm.dataset.color = options[selection].dataset.color;

	// Set color of selected meal in cal
	document.getElementById(selectedMeal.mealElId).dataset.color = options[selection].dataset.color;

	// Save data
	plan.days[selectedMeal.day][selectedMeal.meal].contributor =
		options[selection].dataset.contributor;
	//TODO - save contributor to database
});

// Typing Timer
let typingTimer;
let typingTimerActive = false;
const doneTypingInterval = 4000;

// Food textarea updates while typing
inspectorFoodEl.addEventListener('input', e => {
	selectedMealEl.innerText = e.target.value;
	selectedMealEl.dataset.food = e.target.value;

	// Clear/Start the typingTimer
	clearTimeout(typingTimer);
	typingTimer = setTimeout(() => {
		typingTimerActive = false;
		saveFood();
	}, doneTypingInterval);
	typingTimerActive = true;
});

//When textarea loses focus, clear typingTimer and save
inspectorFoodEl.addEventListener('blur', () => {
	if (typingTimerActive) {
		saveFood();
		clearTimeout(typingTimer);
		typingTimerActive = false;
	}
});

function saveFood() {
	plan.days[selectedMeal.day][selectedMeal.meal].food = inspectorFoodEl.value;
	//TODO - Save food to database here
	console.log(`SAVE FOOD NOW`); //TEST
}

//TEST - TEST BUTTON START
document.getElementById('test-button').addEventListener('click', () => {
	console.log(`TEST BUTTON CLICK:`);
	console.log(plan.days[selectedMeal.day][selectedMeal.meal].food);
	console.log(plan.days[selectedMeal.day][selectedMeal.meal].contributor);
});
//TEST - TEST BUTTON END
