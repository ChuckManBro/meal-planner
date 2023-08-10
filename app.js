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
const selectedMealNameEl = document.querySelector(`#selected-meal-name`);
const selectedDateEl = document.querySelector(`#selected-date`);
const contributorsEl = document.querySelector(`#contributors`);
const selectedFoodEl = document.querySelector(`#selected-food`);

// STARTER VARIABLES
let plan;
let selectedMeal = {};
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

		// Determine color
		let color;
		if (day[meal].contributor) {
			color = plan.contributors.find(c => c.id === day[meal].contributor).color;
		} else {
			color = 'white';
		}
		mealEl.classList.add(color);

		// Custom properties for targeting changes
		mealEl.id = `meal-${mealIndex}`;
		mealEl.day = dayIndex;
		mealEl.meal = meal;
		mealEl.date = `${thisDayName}, ${thisMonthAndDate}`;

		//TODO - Meal click event
		mealEl.addEventListener('click', e => {
			document.querySelectorAll('.meal').forEach(m => m.classList.remove('selected'));
			e.target.classList.add('selected');
			selectedMeal.index = e.target.id;
			selectedMeal.day = e.target.day;
			selectedMeal.meal = e.target.meal;
			selectedMeal.date = e.target.date;
			mealSelectionChange();
		});

		mealEl.innerText = day[meal].food;
		dayEl.appendChild(mealEl);
	}
});

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
	blankOption.innerText = '(blank)';
	contributorsEl.appendChild(blankOption);

	plan.contributors.forEach(contributor => {
		const contributorOption = document.createElement('option');
		contributorOption.color = contributor.color;
		contributorOption.innerText = contributor.name;
		contributorsEl.appendChild(contributorOption);
	});
}
contributorsEl.addEventListener('change', e => {
	const options = document.getElementById('contributors').children;
	const selection = e.target.selectedIndex;
});

//TEST - selectedMeal = {index: 'meal-1', day: 0, meal: 'breakfast', date: 'Sat, Aug 5'}
function mealSelectionChange() {
	// Set the inspector color
	let selectedColor;

	const selectedContributor = plan.days[selectedMeal.day][selectedMeal.meal].contributor;

	if (selectedContributor) {
		selectedColor = plan.contributors.find(c => c.id === selectedContributor).color;
		inspectorForm.classList = `inspector ${selectedColor}`;
	} else {
		inspectorForm.classList = `inspector white`;
	}

	// Set meal name
	selectedMealNameEl.innerText = selectedMeal.meal;

	// Set date
	selectedDateEl.innerText = `${selectedMeal.date}`;

	// Set contributor //TODO

	// Set foods
	selectedFoodEl.innerText = plan.days[selectedMeal.day][selectedMeal.meal].food;
}
