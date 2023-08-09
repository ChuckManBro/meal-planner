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
const calendarEl = document.querySelector(`#calendar`);
const notesEl = document.querySelector(`#notes`);
const notesForm = document.querySelector(`#form-notes`);
const notesFormText = document.querySelector(`#ta-notes`);
const btnNotesCancel = document.querySelector(`#btn-notes-cancel`);
const btnNotesDone = document.querySelector(`#btn-notes-done`);
const contributorsEl = document.querySelector(`#contributors`);

// STARTER VARIABLES
let plan;
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
let offset = new Date().getTimezoneOffset() * 60000;
let startDate = new Date(plan.startDate.slice(0, 10));
startDate = startDate.getTime() + offset;
startDate = new Date(startDate);

// Render the Calendar
plan.days.forEach((day, idx) => {
	// Create day element
	const dayEl = document.createElement('div');
	dayEl.classList.add('day');

	// Determine the day's date
	let thisDate = new Date(startDate);
	thisDate.setDate(thisDate.getDate() + idx);

	let dateText = `${dayNames[thisDate.getDay()]}\n${
		monthNames[thisDate.getMonth()]
	} ${thisDate.getDate()}`;

	// Append the date to the day
	const dateEl = document.createElement('p');
	dateEl.classList.add('date');
	dateEl.innerText = dateText;

	// Append the day to the calendar
	dayEl.appendChild(dateEl);
	calendarEl.appendChild(dayEl);

	// Render meals
	for (let meal in day) {
		const mealEl = document.createElement('p');
		mealEl.classList.add('meal');

		// Determine color
		let color;
		if (day[meal].contributor) {
			color = plan.contributors.find(c => c.id === day[meal].contributor).color;
		} else {
			color = 'white';
		}
		mealEl.classList.add(color);

		// Custom properties for targeting changes
		mealEl.day = idx;
		mealEl.meal = meal;

		//TODO - Meal click event
		mealEl.addEventListener('click', e => {
			console.log(`${e.target.meal} of day ${e.target.day} clicked!!!`); //TEST
			document.querySelectorAll('.meal').forEach(m => m.classList.remove('selected'));
			e.target.classList.add('selected');
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
	calendarEl.appendChild(extraBlock);
}

// Render Notes
if (plan.notes) {
	notesEl.innerText = `Notes:\n${plan.notes}`;
	notesEl.classList.remove('empty');
	notesFormText.innerText = plan.notes;
} else {
	notesEl.innerText = `Add Note`;
	notesEl.classList.add('btn');
}

notesEl.addEventListener('click', toggleNotesEdit);

btnNotesCancel.addEventListener('click', () => {
	toggleNotesEdit();
	notesForm.reset();
});

//TODO -  Notes Form Done Events
btnNotesDone.addEventListener('click', e => {
	e.preventDefault();
	toggleNotesEdit();
});

function toggleNotesEdit() {
	notesEl.classList.toggle('hidden');
	notesForm.classList.toggle('hidden');
}

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
	console.log(options[selection].innerText); //TEST -
});
