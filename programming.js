const personalize = document.querySelector('.personalize');
const p_remove = document.querySelector('.p_remove');
const loading = document.querySelector('.loading');
const popup = document.querySelector('.popup');
const searchLoading = document.querySelector('.searchLoading');
const defaultLoading = document.querySelector('.defaultLoading');
const popup_container = document.querySelector('.popup-container');

setTimeout(() => {
	defaultLoading.style.display = 'none';
}, 999);

p_remove.addEventListener('click', () => {
	personalize.style.display = 'none';
	setAllRecipes.style.display = 'block';
	setTimeout(() => {
		AllFavRecipes.style.display = 'none';
		showFav.innerText = 'SHOW FAVORITE';
	}, 300);
});

const refresh_button = document.getElementById('refresh_button');
refresh_button.addEventListener('click', function () {
	this.classList.add('spinning');
	setTimeout(() => {
		this.classList.remove('spinning');
	}, 999);
	setTimeout(() => {
		location.reload();
	}, 500);
});

const searchForm = document.getElementById('search_form');
const searchInput = document.querySelector('#search_form input');
const search_button = document.getElementById('search_button');
const allRecipes = document.getElementById('allRecipes');
let is = false;
search_button.addEventListener('click', function () {
	is = !is;
	if (is) {
		this.innerHTML = `<i class="fas fa-times"></i>`;
		allRecipes.classList.add('unShow');
		searchForm.classList.remove('unShow');
	} else {
		this.innerHTML = `<i class="fas fa-search"></i>`;
		allRecipes.classList.remove('unShow');
		searchForm.classList.add('unShow');
	}
});
////////////

async function getRandomMeal() {
	const all = [];
	for (let i = 0; i < 7; i++) {
		const randomMeal = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
		const resp = await randomMeal.json();
		const getData = await resp.meals[0];
		all.push(getData);
	}
	getAll(all);
}
getRandomMeal();

const AllFavRecipes = document.getElementById('AllFavRecipes');
const setAllRecipes = document.getElementById('setAllRecipes');
function getAll(all) {
	all.forEach((data) => {
		setData(data, setAllRecipes);
	});
}

function setData(getData, parentElement) {
	const single = document.createElement('div');
	single.className = 'single_recipe';
	single.innerHTML = ` 
 <div class="recipe_img">
 <img src="${getData.strMealThumb}" alt="" />
</div>
<div class="single_r_footer">
 <strong class="r_title">${getData.strMeal}</strong>
 <p class="r_review">
  <i class="fas fa-star"></i>
  <i class="fas fa-star"></i>
  <i class="fas fa-star"></i>
  <i class="fas fa-star"></i>
  <i class="fas fa-star-half"></i>
 </p>
</div>
<div class="heartView">
 <span style='display:none' class="itemID">${getData.idMeal}</span>
 <h2 class="viewinfo"> <i class="fas fa-info-circle"></i> </h2>
 <h2 data-id="${getData.idMeal}" onclick='heartClick(this, ${getData.idMeal})' class="heart ${isActive(
		getData.idMeal
	)}"> <i class="fas fa-heart"></i>
 </h2>
</div>
`;

	const allSingels = [...parentElement.querySelectorAll('.itemID')];
	const overWriteCloseId = [];
	allSingels.map((item) => {
		if (!overWriteCloseId.includes(item.innerText)) {
			overWriteCloseId.push(item.innerText);
		}
	});
	if (!overWriteCloseId.includes(getData.idMeal)) {
		parentElement.appendChild(single);
	}

	single.querySelector('.viewinfo').addEventListener('click', function () {
		showSpesific(getData);
	});
}

function isActive(id) {
	if (getIds.includes(Number(id))) {
		return 'active';
	}
	return '';
}

// favorite items & local storage functionality
const showFav = document.querySelector('#showFav');
showFav.addEventListener('click', () => {
	if (showFav.innerText === 'SHOW FAVORITE') {
		setAllRecipes.style.display = 'none';
		setTimeout(() => {
			AllFavRecipes.style.display = 'block';
			showFav.innerText = 'HIDE FAVORITE';
		}, 300);
	} else {
		setAllRecipes.style.display = 'block';
		setTimeout(() => {
			AllFavRecipes.style.display = 'none';
			showFav.innerText = 'SHOW FAVORITE';
		}, 300);
	}
});

const getIds = [];
function heartClick(e, id) {
	if (!getIds.includes(id)) {
		getIds.push(id);
		localStorage.setItem('ids', JSON.stringify(getIds));
	}
	if (e.classList.contains('active')) {
		e.parentElement.parentElement.style.display = 'none';
		const index = getIds.indexOf(e.dataset.id);
		getIds.splice(index, 1);
		localStorage.setItem('ids', JSON.stringify(getIds));
	} else {
		setLSItems();
	}
	e.classList.toggle('active');
	setTimeout(() => {
		e.classList.remove('active');
	}, 6000);
}

if (JSON.parse(localStorage.getItem('ids')) !== null) {
	JSON.parse(localStorage.getItem('ids')).map((id) => getIds.push(id));
}

async function getIdDetails(value) {
	let get = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${value}`);
	get = await get.json();
	get = get.meals;
	setData(get[0], AllFavRecipes);
}

function setLSItems() {
	if (getIds.length > 0) {
		getIds.map((id) => {
			getIdDetails(id);
		});
	}
}
setLSItems();

function showSpesific(getData) {
	let allList = '';
	for (let i = 0; i <= 20; i++) {
		if (getData[`strIngredient${i}`]) {
			allList += `<li> ${getData[`strIngredient${i}`]} </li>`;
		}
	}
	loading.style.display = 'block';
	setTimeout(() => {
		loading.style.display = 'none';
		popup.style.display = 'block';
	}, 500);
	popup_container.innerHTML = `
 <header>
 <h4 class="popup_title">${getData.strMeal}</h4>
 <h1 class="cursor" onclick="removePopup()"><i class="fas fa-times"></i></h1>
</header>
<div class="popup_info">
 <img src="${getData.strMealThumb}" alt="" />
 <div>${getData.strInstructions}</div>
 <div>
  <strong>Ingredients:</strong>
  <ul>
   ${allList}
  </ul>
 </div>
</div>
 `;
}

function removePopup() {
	popup.style.display = 'none';
}

async function getMealsBySearch(value) {
	const MealBySearch = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
	const res = await MealBySearch.json();
	return res.meals;
}

function seaLoaAct(getValue) {
	searchLoading.style.display = 'flex';
	setTimeout(() => {
		async function searchAction() {
			searchLoading.style.display = 'none';
			const searchData = await getMealsBySearch(getValue);
			if (searchData) {
				searchData.forEach((data) => {
					setData(data, setAllRecipes);
				});
			} else {
				alert('Not found!');
			}
		}
		searchAction();
	}, 1100);
}

searchForm.addEventListener('submit', () => {
	const getValue = searchInput.value;
	if (getValue.length > 0) {
		seaLoaAct(getValue);
	}
});

document.getElementById('cake').addEventListener('click', () => seaLoaAct('cake'));
document.getElementById('apples').addEventListener('click', () => seaLoaAct('apple'));
document.getElementById('chicken').addEventListener('click', () => seaLoaAct('chicken'));
document.getElementById('chocolate').addEventListener('click', () => seaLoaAct('chocolate'));
