/*
// THIS IS THE WAY TO IMPORT WITH NODE
const users = require('./users.json');

// EXAMPLE OF DATE MANIPULATIONS
const todaysDate = new Date().toISOString().slice(0, 10);
console.log(todaysDate)
console.log(new Date(todaysDate))
 */

//SECTION - DOM Elements

const appHeader = document.querySelector(`#app-header`);

const legendDiv = document.querySelector(`div.legend`);

const calEl = document.querySelector(`div.cal`);
const addNoteEl = document.querySelector('#add-note');
const notesDiv = document.querySelector(`div.notes`);
const notesEl = document.querySelector(`p.notes`);
const notesForm = document.querySelector(`form.notes`);
const notesFormText = document.querySelector(`textarea.notes`);
const btnNotesCancel = document.querySelector(`#btn-notes-cancel`);
const btnNotesDone = document.querySelector(`#btn-notes-done`);

const planForm = document.querySelector(`#plan-form`);
const planNameEl = document.querySelector(`#plan-name`);
const startDateEl = document.querySelector(`#start-date`);
const durationEl = document.querySelector(`#duration`);
const planButtons = document.querySelector(`#plan-buttons`);
const btnPlanCancel = document.querySelector(`#btn-plan-cancel`);
const btnPlanDone = document.querySelector(`#btn-plan-done`);
const planConfirm = document.querySelector(`#plan-confirm`);
const planConfirmContinue = document.querySelector(`#plan-confirm-continue`);
const planConfirmCancel = document.querySelector(`#plan-confirm-cancel`);

const contForm = document.querySelector(`#cont-form`);
const contFormName = document.querySelector(`#cont-form-name`);
const contFormEditButton = document.querySelector(`#cont-form-edit-button`);
const contFormEditWrapper = document.querySelector(`#cont-form-edit-wrapper`);
const contFormNameInput = document.querySelector(`#cont-form-name-input`);
const contFormColorSelect = document.querySelector(`#cont-form-color-select`);
const contDelete = document.querySelector(`#cont-delete`);
const contDeleteConfirm = document.querySelector(`#cont-delete-confirm`);
const contDeleteYes = document.querySelector(`#cont-delete-yes`);
const contDeleteNo = document.querySelector(`#cont-delete-no`);
const contFormList = document.querySelector(`#cont-form-list`);

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
const swapMealEl = document.querySelector(`#swap-meal`);
const swapInstruction = document.querySelector(`#swap-instruction`);
//!SECTION - DOM Elements END

//SECTION - Starter Variables
let plan;
let selectedMeal;
let selectedMealEl;
let mealSwapMode = false;
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
const blankDay = {
	breakfast: {
		food: '',
		contributor: '',
	},
	lunch: {
		food: '',
		contributor: '',
	},
	supper: {
		food: '',
		contributor: '',
	},
};
//!SECTION - Starter Variables END

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
			console.log(data); //REMOVE WHEN DONE
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

//SECTION - Header
appHeader.innerText = plan.name;
appHeader.addEventListener('click', () => {
	renderPlanForm();
	changeInspectorView('plan');
});
//!SECTION - Header END

//SECTION - Legend

renderLegend();

function renderLegend() {
	legendDiv.innerHTML = '';

	plan.contributors.forEach((c, idx) => {
		const newLegend = document.createElement('p');
		newLegend.classList = 'legend-contributor txt-sm';
		newLegend.dataset.arrIdx = idx;
		newLegend.dataset.color = c.color;
		newLegend.innerText = c.name ? c.name : c.color;
		newLegend.addEventListener('click', legendContClick);
		legendDiv.appendChild(newLegend);
	});

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
			changeInspectorView('new-cont');
			newName.focus();
		});

		legendDiv.appendChild(newAddEl);
	}
}
//!SECTION - Legend END

//SECTION - Calendar

renderCalendar();

function renderCalendar() {
	// Clear previous calendar
	calEl.innerHTML = '';

	// Set calendar's CSS Grid to max of 7 columns
	const length = plan.days.length;
	const columns = length > 7 ? Math.ceil(length / 2) : length;
	document.querySelector(':root').style.setProperty('--calendar-columns', columns);

	// Generate startDate from YYYY-MM-DD format (account for timezone and DST offsets)
	let startDate = new Date(plan.startDate.slice(0, 10));
	let offset = new Date(startDate).getTimezoneOffset() * 60000; //offset of the plan's date, not the current date
	startDate = startDate.getTime() + offset; //this converts to ms
	startDate = new Date(startDate); //this converts ms back to date object

	// Render the Calendar
	let mealIndex = 0;
	plan.days.forEach((day, dayIndex) => {
		// Create day element
		const dayEl = document.createElement('div');
		dayEl.classList.add('day');

		// Determine the day's date
		let thisDate = new Date(startDate);
		thisDate.setDate(thisDate.getDate() + dayIndex);

		const thisDayName = thisDate.toDateString().slice(0, 3);
		const thisMonthAndDate = `${thisDate.toDateString().slice(4, 7)} ${thisDate.getDate()}`;

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
				color = plan.contributors.find(c => c.id == day[meal].contributor).color;//do not use strict equality
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
			mealEl.dataset.contributor = day[meal].contributor;

			// Click Event Listener
			mealEl.addEventListener('click', mealClick);

			// Append Meal Element to the Day
			dayEl.appendChild(mealEl);
		}
	});
}

// Meal Click Events (swap or make selection)
function mealClick(e) {
	if (mealSwapMode) {
		// Do nothing and return to defaults if same meal is selected
		if (e.target.id === selectedMeal.mealElId) {
			mealSwapMode = false;
			changeInspectorView();
			return;
		}

		// Hold data of second selection
		const holdMealElId = e.target.id;
		const holdColor = e.target.dataset.color;
		const holdContributor = e.target.dataset.contributor;
		const holdDay = e.target.dataset.day;
		const holdFood = e.target.dataset.food;
		const holdMeal = e.target.dataset.meal;

		// Update DOM element of first selection
		const firstSelection = document.getElementById(selectedMeal.mealElId);
		firstSelection.dataset.color = holdColor;
		firstSelection.dataset.contributor = holdContributor;
		firstSelection.dataset.food = holdFood;
		firstSelection.innerHTML = holdFood;
		// Update first selection in local data object
		plan.days[selectedMeal.day][selectedMeal.meal].food = holdFood;
		plan.days[selectedMeal.day][selectedMeal.meal].contributor = holdContributor;
		//TODO - PUT first selection changes to database

		// Update DOM element of second selection
		const secondSelection = document.getElementById(holdMealElId);
		secondSelection.dataset.color = selectedMeal.color;
		secondSelection.dataset.contributor = selectedMeal.contributor;
		secondSelection.dataset.food = selectedMeal.food;
		secondSelection.innerHTML = selectedMeal.food;
		// Update second selection in local data object
		plan.days[holdDay][holdMeal].food = selectedMeal.food;
		plan.days[holdDay][holdMeal].contributor = selectedMeal.contributor;
		//TODO - PUT second selection changes to database

		// Return defaults
		mealSwapMode = false;
		changeInspectorView();
	} else {
		selectedMeal = { ...e.target.dataset };
		selectedMeal.mealElId = e.target.id;
		selectedMealEl = document.getElementById(e.target.id);
		mealSelectionChange();
		changeInspectorView('meal');
	}
}

function mealSelectionChange() {
	mealForm.reset();
	renderContributors();
	mealForm.dataset.color = selectedMeal.color;
	mealFormMealNameEl.innerText = selectedMeal.meal;
	mealFormDateEl.innerText = `${selectedMeal.dayName}, ${selectedMeal.date}`;
	if (selectedMeal.color === 'white') {
		document.getElementById('none-option').selected = 'selected';
	} else {
		const selectedOption = document.querySelector(
			`.contributor-option[data-color="${selectedMeal.color}"]`
		);
		selectedOption.selected = 'selected';
	}

	mealFormFoodEl.innerText = selectedMeal.food;
}
//!SECTION - Calendar END

//SECTION - Notes

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
//!SECTION - Notes END

//SECTION - Inspector

// Choose what is visible in the inspector, Deselect calendar meals
function changeInspectorView(option) {
	planForm.classList.add('hidden');
	contForm.classList.add('hidden');
	newContForm.classList.add('hidden');
	mealForm.classList.add('hidden');
	document.querySelectorAll('.meal').forEach(m => m.classList.remove('selected')); // remove selection outline from all meal elements
	swapMealEl.classList.remove('hidden'); // reveal 'Swap Meal' text
	swapInstruction.classList.add('hidden'); // hide swap instructions

	switch (option) {
		case 'plan':
			planForm.classList.remove('hidden');
			break;
		case 'cont':
			contForm.classList.remove('hidden');
			break;
		case 'new-cont':
			newContForm.classList.remove('hidden');
			break;
		case 'meal':
			mealForm.classList.remove('hidden');
			document.querySelector(`#${selectedMeal.mealElId}`).classList.add('selected');
	}
	// }
}
//!SECTION - Inspector END

//SECTION - Plan Form

function renderPlanForm() {
	planNameEl.value = plan.name;
	startDateEl.value = plan.startDate.slice(0, 10);
	durationEl.value = plan.days.length;
}

btnPlanCancel.addEventListener('click', () => {
	changeInspectorView();
	planForm.reset();
});

btnPlanDone.addEventListener('click', e => {
	e.preventDefault();

	// Confirm reduction of days (validate lost data)
	if (durationEl.value < plan.days.length) {
		const eliminatedDays = plan.days.slice(durationEl.value);

		const allDayValues = eliminatedDays.map(day => Object.values(day)).flat();
		const allMealValues = allDayValues.map(meal => Object.values(meal)).flat();
		const mealsEmpty = allMealValues.every(value => value === '');

		if (mealsEmpty) {
			savePlanSettings();
		} else {
			planButtons.classList.add('hidden'); //hide cancel/done buttons
			planConfirm.classList.remove('hidden'); //reveal confirmation
		}
	} else {
		savePlanSettings();
	}
});

planConfirmContinue.addEventListener('click', e => {
	e.preventDefault();
	savePlanSettings();
	planButtons.classList.remove('hidden'); //reveal cancel/done buttons
	planConfirm.classList.add('hidden'); //hide confirmation
});

planConfirmCancel.addEventListener('click', () => {
	planButtons.classList.remove('hidden'); //reveal cancel/done buttons
	planConfirm.classList.add('hidden'); //hide confirmation
});

function savePlanSettings() {
	changeInspectorView();
	console.log(`plan settings saved!!!`); //REMOVE WHEN DONE

	// Save Plan name, startDate, duration-change to local data object
	plan.name = planNameEl.value;
	appHeader.innerText = planNameEl.value;
	plan.startDate = startDateEl.value;

	if (durationEl.value < plan.days.length) plan.days.splice(durationEl.value); //remove days if duration was decreased//FIXME - WHY THE REPEATS!?

	const additionalDays = Math.max(0, durationEl.value - plan.days.length);
	for (let i = 1; i <= additionalDays; i++) {
		plan.days.push(structuredClone(blankDay));
	}

	// Rerender calendar, Update plan name
	renderCalendar();

	//TODO - Save Plan name, startDate, duration-change to database
}

//!SECTION - Plan Form END

//SECTION - Cont Form

function legendContClick(e) {
	contForm.dataset.color = e.target.dataset.color;
	contForm.dataset.arrIdx = e.target.dataset.arrIdx;
	contFormName.innerText = e.target.innerText;
	contFormNameInput.value = plan.contributors[e.target.dataset.arrIdx].name;
	contFormColorSelect.innerHTML = '';
	const colorOption = document.createElement('option');
	colorOption.innerText = e.target.dataset.color;
	contFormColorSelect.appendChild(colorOption);
	renderContColorOptions();
	renderContList();
	contFormEditButton.classList.remove('hidden'); // reveal edit icon button
	contFormName.classList.remove('hidden'); //reveal name
	contFormEditWrapper.classList.add('hidden'); //hide inputs
	contDelete.classList.remove('hidden'); //reveal delete button
	contDeleteConfirm.classList.add('hidden'); // hide delete confirmation
	changeInspectorView('cont');
}

contDelete.addEventListener('click', () => {
	contDelete.classList.add('hidden'); //hide delete button
	contDeleteConfirm.classList.remove('hidden'); // reveal confirmation
});

contDeleteYes.addEventListener('click', () => {
	// change all this contributor's meals to white
	const allMeals = [...document.querySelectorAll('.meal')];
	const mealList = allMeals.filter(meal => meal.dataset.color === contForm.dataset.color);
	mealList.forEach(meal => (meal.dataset.color = 'white'));

	// splice this user from local data object
	changeInspectorView(); // No argument for clear inspector
	plan.contributors.splice(contForm.dataset.arrIdx, 1);

	// Rerender legend
	renderLegend();

	//TODO - DELETE user from database
});

contDeleteNo.addEventListener('click', () => {
	contDeleteConfirm.classList.add('hidden'); // hide confirmation
	contDelete.classList.remove('hidden'); //reveal delete button
});

function renderContColorOptions() {
	availableColors().forEach(c => {
		const newOption = document.createElement('option');
		newOption.innerText = c;
		contFormColorSelect.appendChild(newOption);
	});
}

contFormEditButton.addEventListener('click', e => {
	contFormEditButton.classList.add('hidden'); // hide edit icon button
	contFormName.classList.add('hidden'); //hide name
	contFormEditWrapper.classList.remove('hidden'); //reveal inputs
	contFormNameInput.focus();
});

// Prevent form from submitting when Enter is pressed
contForm.addEventListener('submit', e => {
	e.preventDefault();
	changeInspectorView();
});

contFormNameInput.addEventListener('input', event => {
	// Update name in the legend
	document.querySelectorAll('.legend-contributor')[contForm.dataset.arrIdx].innerText = event.target
		.value
		? event.target.value
		: contForm.dataset.color;

	// Clear/Start the typingTimer
	clearTimeout(typingTimer);
	typingTimer = setTimeout(doneTyping, doneTypingInterval, saveName);
	typingTimerActive = true;
});

function saveName() {
	// Update local object data
	plan.contributors[contForm.dataset.arrIdx].name = contFormNameInput.value;
	//TODO - PUT name change to database
	console.log('NAME SAVED'); //REMOVE WHEN DONE
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

// cont-form list of meals
function renderContList() {
	contFormList.innerHTML = '';

	const allMeals = [...document.querySelectorAll('.meal')];
	const mealList = allMeals.filter(meal => meal.dataset.color === contForm.dataset.color);

	mealList.forEach(meal => {
		const divEl = document.createElement('div');

		const dateEl = document.createElement('p');
		dateEl.classList = `list-date txt-sm`;
		dateEl.innerText = `${meal.dataset.dayName}, ${meal.dataset.date}, ${meal.dataset.meal}`;
		divEl.appendChild(dateEl);

		const foodEl = document.createElement('p');
		foodEl.classList.add('list-food');
		foodEl.innerText = meal.dataset.food;
		divEl.appendChild(foodEl);

		contFormList.appendChild(divEl);
	});
}
//!SECTION - Cont Form END

//SECTION - New Cont Form

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
		name: newName.value,
		color: newContColors.value,
	});

	//TODO - PUT New Contributor to database

	newContForm.classList.add('hidden');

	renderLegend();
});
//!SECTION - New Cont Form END

//SECTION - Meal Form

// Contributors drop-down selector
function renderContributors() {
	// Clear existing options
	mealFormContributorsEl.innerHTML = '';

	// Create the 'none' option first
	const noneOption = document.createElement('option');
	noneOption.id = 'none-option';
	noneOption.dataset.color = 'white';
	noneOption.dataset.contributor = '';
	noneOption.innerText = 'none';
	mealFormContributorsEl.appendChild(noneOption);

	// Create options list of current contributors
	plan.contributors.forEach(contributor => {
		const contributorOption = document.createElement('option');
		contributorOption.classList.add('contributor-option');
		contributorOption.dataset.color = contributor.color;
		contributorOption.dataset.contributor = contributor.id;
		contributorOption.innerText = contributor.name ? contributor.name : contributor.color;
		mealFormContributorsEl.appendChild(contributorOption);
	});
}

mealFormContributorsEl.addEventListener('change', e => {
	// New selection info
	const options = document.getElementById('meal-form-contributors').children;
	const selection = e.target.selectedIndex;

	// Set color of self
	mealForm.dataset.color = options[selection].dataset.color;

	// Set color and contributor of selected meal in calendar
	const mealElData = document.getElementById(selectedMeal.mealElId).dataset;
	mealElData.color = options[selection].dataset.color;
	mealElData.contributor = options[selection].dataset.contributor;

	// Save to local data object
	plan.days[selectedMeal.day][selectedMeal.meal].contributor =
		options[selection].dataset.contributor;

	// Update selectedMeal data
	selectedMeal.contributor = options[selection].dataset.contributor;
	selectedMeal.color = options[selection].dataset.color;

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

// When textarea loses focus, clear typingTimer and save
mealFormFoodEl.addEventListener('blur', () => {
	if (typingTimerActive) {
		saveFood();
		clearTimeout(typingTimer);
		typingTimerActive = false;
	}
});

function saveFood() {
	// Save to local data object
	plan.days[selectedMeal.day][selectedMeal.meal].food = mealFormFoodEl.value;

	// Update selectedMeal data
	selectedMeal.food = mealFormFoodEl.value;

	//TODO - Save food to database here
	console.log(`FOOD SAVED`); //REMOVE WHEN DONE
}

// Swap Meals
swapMealEl.addEventListener('click', e => {
	mealSwapMode = true;
	e.target.classList.add('hidden');
	swapInstruction.classList.remove('hidden');
});
//!SECTION - Meal Form END

//REMOVE WHEN DONE - TEST BUTTON START
document.getElementById('test-button').addEventListener('click', () => {
	console.log(`TEST BUTTON CLICK:`);
	// console.log(selectedMeal);
	console.log(plan);
});
//REMOVE WHEN DONE - TEST BUTTON END
