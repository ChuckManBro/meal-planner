/*
// THIS IS THE WAY TO IMPORT WITH NODE
const users = require('./users.json');

// EXAMPLE OF DATE MANIPULATIONS
const todaysDate = new Date().toISOString().slice(0, 10);
console.log(todaysDate)
console.log(new Date(todaysDate))
 */

// DOM ELEMENTS
const appHeaderEl = document.querySelector(`#app-header`);

const legendDiv = document.querySelector(`div.legend`);

const calEl = document.querySelector(`div.cal`);
const addNoteEl = document.querySelector('#add-note');
const notesDiv = document.querySelector(`div.notes`);
const notesEl = document.querySelector(`p.notes`);
const notesForm = document.querySelector(`form.notes`);
const notesFormText = document.querySelector(`textarea.notes`);
const btnNotesCancel = document.querySelector(`#btn-notes-cancel`);
const btnNotesDone = document.querySelector(`#btn-notes-done`);

const contForm = document.querySelector(`#cont-form`);
const contFormName = document.querySelector(`#cont-form-name`);
const contFormInputs = document.querySelector(`#cont-form-inputs`);
const contFormNameInput = document.querySelector(`#cont-form-name-input`);
const contFormColorSelect = document.querySelector(`#cont-form-color-select`);

const newContForm = document.querySelector(`#new-cont-form`);
const newName = document.querySelector(`#new-name`);
const newContColors = document.querySelector(`#new-cont-form-colors`);
const btnNewContCancel = document.querySelector(`#btn-new-cancel`);
const btnNewContAdd = document.querySelector(`#btn-new-add`);

const mealForm = document.querySelector(`#meal-form`);
const mealFormMealNameEl = document.querySelector(`#meal-form-meal-name`);
const mealFormDateEl = document.querySelector(`#meal-form-date`);
const mealFormContributorsEl = document.querySelector(`#meal-form-contributors`);
const mealFormFoodEl = document.querySelector(`#meal-form-food`);

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
const colorOptions = [
	'red',
	'orange',
	'yellow',
	'green',
	'blue',
	'purple',
	'brown',
	'gray',
	'black',
];

// TYPING TIMER
let typingTimer;
let typingTimerActive = false;
const doneTypingInterval = 4000;

// REUSABLE FUNCTIONS
function availableColors() {
	let used = [];
	plan.contributors.forEach(c => used.push(c.color));
	return colorOptions.filter(c => !used.includes(c));
}

function doneTyping(next) {
	typingTimerActive = false;
	next();
}

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

//***** HEADER *****
appHeaderEl.innerText = plan.name;

//***** LEGEND *****

renderLegend();

function renderLegend() {
	legendDiv.innerHTML = '';

	plan.contributors.forEach((c, idx) => {
		const newLegend = document.createElement('p');
		newLegend.classList = 'legend-contributor txt-sm';
		newLegend.dataset.arrIdx = idx;
		newLegend.dataset.color = c.color;
		newLegend.innerText = c.name;
		newLegend.addEventListener('click', legendContClick);
		legendDiv.appendChild(newLegend);
	});
}

// 'Add Contributor' button at end of legend list
if (plan.contributors.length < colorOptions.length) {
	const newAddEl = document.createElement('p');
	newAddEl.classList = 'legend-contributor txt-sm';
	newAddEl.dataset.color = 'white';

	if (plan.contributors.length < 1) {
		newAddEl.innerText = 'Add Contributor';
	} else {
		newAddEl.innerText = '+';
	}

	newAddEl.addEventListener('click', () => {
		newContForm.reset();
		renderNewColorOptions();
		newContForm.classList.remove('hidden');
		newName.focus();
	});

	legendDiv.appendChild(newAddEl);
}

//***** CALENDAR *****

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
			mealForm.classList.remove('hidden');
		});

		dayEl.appendChild(mealEl);
	}
});

function mealSelectionChange() {
	mealForm.reset();
	mealForm.dataset.color = selectedMeal.color;
	mealFormMealNameEl.innerText = selectedMeal.meal;
	mealFormDateEl.innerText = `${selectedMeal.dayName}, ${selectedMeal.date}`;
	if (selectedMeal.color === 'white') {
		document.getElementById('blank-option').selected = 'selected';
	} else {
		const selectedOption = document.querySelector(
			`.contributor-option[data-color="${selectedMeal.color}"]`
		);
		selectedOption.selected = 'selected';
	}

	mealFormFoodEl.innerText = selectedMeal.food;

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

//***** NOTES *****

renderNotes();

function renderNotes() {
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
}

addNoteEl.addEventListener('click', () => {
	addNoteEl.classList.add('hidden'); // 'Add Note' hidden
	notesDiv.classList.remove('hidden'); // notes div visible
	notesFormText.focus();
});

notesEl.addEventListener('click', () => {
	notesFormText.innerText = plan.notes;
	notesEl.classList.add('hidden');
	notesForm.classList.remove('hidden');
	notesFormText.focus();
	notesFormText.selectionStart = notesFormText.value.length;
});

btnNotesCancel.addEventListener('click', () => {
	notesForm.reset();
	renderNotes();
});

btnNotesDone.addEventListener('click', e => {
	e.preventDefault();
	//TODO - PUT notes to database
	plan.notes = notesFormText.value;
	renderNotes();
});

//***** INSPECTOR *****

//***** CONT-FORM *****

function legendContClick(e) {
	contForm.dataset.color = e.target.dataset.color;
	contForm.dataset.arrIdx = e.target.dataset.arrIdx;
	contFormName.innerText = e.target.innerText;
	contFormColorSelect.innerHTML = '';
	const colorOption = document.createElement('option');
	colorOption.innerText = e.target.dataset.color;
	contFormColorSelect.appendChild(colorOption);
	renderContColorOptions();
	contFormName.classList.remove('hidden'); //reveal name
	contFormInputs.classList.add('hidden'); //hide inputs
	contForm.classList.remove('hidden'); //reveal form
}

function renderContColorOptions() {
	availableColors().forEach(c => {
		const newOption = document.createElement('option');
		newOption.innerText = c;
		contFormColorSelect.appendChild(newOption);
	});
}

contFormName.addEventListener('click', e => {
	contFormNameInput.value = e.target.innerText;
	e.target.classList.add('hidden'); //hide name
	contFormInputs.classList.remove('hidden'); //reveal inputs
	contFormNameInput.focus();
});

contFormNameInput.addEventListener('input', event => {
	// Update name in the legend
	document.querySelectorAll('.legend-contributor')[contForm.dataset.arrIdx].innerText =
		event.target.value;

	// Clear/Start the typingTimer
	clearTimeout(typingTimer);
	typingTimer = setTimeout(doneTyping, doneTypingInterval, saveName);
	typingTimerActive = true;
});

function saveName() {
	// Update local object data
	plan.contributors[contForm.dataset.arrIdx].name = contFormNameInput.value;
	//TODO - PUT name change to database
	console.log('NAME SAVED'); //TEST
}

//When name input loses focus, clear typingTimer and save
contFormNameInput.addEventListener('blur', () => {
	if (typingTimerActive) {
		saveName();
		clearTimeout(typingTimer);
		typingTimerActive = false;
	}
});

contFormColorSelect.addEventListener('change', event => {
	// Update color of all this contributor's cells
	document
		.querySelectorAll(`[data-color="${contForm.dataset.color}"]`)
		.forEach(cell => (cell.dataset.color = event.target.value));

	// Update local object data
	plan.contributors[contForm.dataset.arrIdx].color = event.target.value;

	//TODO - PUT color change to database
});

//***** NEW-CONT-FORM *****

function renderNewColorOptions() {
	newContColors.innerHTML = '';

	newContForm.dataset.color = availableColors()[0];

	availableColors().forEach(c => {
		const newOption = document.createElement('option');
		newOption.innerText = c;
		newContColors.appendChild(newOption);
	});
}

newContColors.addEventListener('change', e => {
	newContForm.dataset.color = e.target.value;
});

btnNewContCancel.addEventListener('click', () => newContForm.classList.add('hidden'));

btnNewContAdd.addEventListener('click', e => {
	e.preventDefault();

	plan.contributors.push({
		id: new Date().valueOf(),
		name: newName.value ? newName.value : `Contributor ${plan.contributors.length + 1}`,
		color: newContColors.value,
	});

	//TODO - PUT New Contributor to database

	newContForm.classList.add('hidden');

	renderLegend();
});

//***** MEAL-FORM *****

// Contributors drop-down selector
renderContributors();
function renderContributors() {
	const noneOption = document.createElement('option');
	noneOption.id = 'blank-option';
	noneOption.dataset.color = 'white';
	noneOption.dataset.contributor = '';
	noneOption.innerText = 'none';
	mealFormContributorsEl.appendChild(noneOption);

	plan.contributors.forEach(contributor => {
		const contributorOption = document.createElement('option');
		contributorOption.classList.add('contributor-option');
		contributorOption.dataset.color = contributor.color;
		contributorOption.dataset.contributor = contributor.id;
		contributorOption.innerText = contributor.name;
		mealFormContributorsEl.appendChild(contributorOption);
	});
}

mealFormContributorsEl.addEventListener('change', e => {
	// New selection info
	const options = document.getElementById('meal-form-contributors').children;
	const selection = e.target.selectedIndex;
	// console.log(`Selected Contributor: ${options[selection].dataset.contributor}`); //TEST

	// Set color of self
	mealForm.dataset.color = options[selection].dataset.color;

	// Set color of selected meal in cal
	document.getElementById(selectedMeal.mealElId).dataset.color = options[selection].dataset.color;

	// Save data
	plan.days[selectedMeal.day][selectedMeal.meal].contributor =
		options[selection].dataset.contributor;
	//TODO - save  meal-contributor to database
});

// Food textarea updates while typing
mealFormFoodEl.addEventListener('input', e => {
	selectedMealEl.innerText = e.target.value;
	selectedMealEl.dataset.food = e.target.value;

	// Clear/Start the typingTimer
	clearTimeout(typingTimer);
	typingTimer = setTimeout(doneTyping, doneTypingInterval, saveFood);
	typingTimerActive = true;
});

//When textarea loses focus, clear typingTimer and save
mealFormFoodEl.addEventListener('blur', () => {
	if (typingTimerActive) {
		saveFood();
		clearTimeout(typingTimer);
		typingTimerActive = false;
	}
});

function saveFood() {
	plan.days[selectedMeal.day][selectedMeal.meal].food = mealFormFoodEl.value;
	//TODO - Save food to database here
	console.log(`FOOD SAVED`); //TEST
}

//TEST - TEST BUTTON START
document.getElementById('test-button').addEventListener('click', () => {
	console.log(`TEST BUTTON CLICK:`);
	console.log(plan.contributors);
});
//TEST - TEST BUTTON END
