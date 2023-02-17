var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-btn");

/* function to get the search input data and fetch the resultant data from Meal API */
searchInput.addEventListener("input", function () {
  var inputVal = searchInput.value.trim();
  if (!searchInput.value) {
    document.getElementById("meal-type").innerText = "Favourite Meal:-";
    location.reload();
  } else {
    document.getElementById("meal-type").innerText = `Search by ${inputVal}:-`;
  }
  console.log(inputVal);
  const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputVal}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("middle-section").innerHTML = ``;
      document.getElementById("mealDetailSection").innerHTML = ``;
      mealDetailSection(data, inputVal);
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

/* Method to traverse over each resultant result and send to the function to create Card div*/
const mealDetailSection = (data, mealInput) => {
  const meal = data.meals;

  if (meal) {
    meal.forEach((element) => {
      createMealInfoDiv(element, mealInput);
    });
  } else {
    console.log("No meal found");
  }
};

/* Method to create the card div and add all required data to each card */
const createMealInfoDiv = (meal, mealInput) => {
  const mealPhoto = meal.strMealThumb;
  const mealName = meal.strMeal;
  let name = mealName.split(" ");
  let Mname = name.slice(0, 3);
  let MealN = Mname.join(" ");
  MealN = MealN + "...";
  //   console.log(meal.strMeal);
  const mealInfo = `
        <a href="#meal-type">
            <div onclick="getMealDetails(${meal.idMeal})">
                <div class="item-img"><img src="${mealPhoto}" alt="" /></div>
            </div>
        </a>
        <div id="iconDet" class="item-detail">
            <p id="item-name">${MealN}</p>
            <i onclick="saveFavorite(${meal.idMeal})" id="${meal.idMeal}" class="fa-regular fa-star"></i>
            <!-- <i id="${meal.idMeal}" class="fa-solid fa-star"></i> -->
        </div>
    `;
  const mealinfoSection = document.getElementById("middle-section");
  const mealInfoDiv = document.createElement("div");
  mealInfoDiv.className = "card-container";
  mealInfoDiv.innerHTML = mealInfo;
  mealinfoSection.appendChild(mealInfoDiv);
  const myfavorites = JSON.parse(localStorage.getItem("favorites"));
  if (Object.values(myfavorites).includes(parseInt(meal.idMeal))) {
    const myContainer = document.querySelector("#iconDet");
    const myIcon = myContainer.querySelector("i");
    myIcon.classList.remove("fa-regular");
    myIcon.className = "fa-solid fa-star";
  }
};

/* Method to get meal details from API using ID of the meal */
const getMealDetails = (mealID) => {
  const mealDetailsSection = document.getElementById("mealDetailSection");
  mealDetailsSection.innerHTML = ``;

  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showMealDetailsDiv(data);
    });
};

/** Function to create the detail div and set the required detail on the div */
const showMealDetailsDiv = (data) => {
  console.log(data);
  const meal = data.meals[0];
  const mealid = meal.idMeal;
  const mealImage = meal.strMealThumb;
  const mealSource = meal.strSource;
  const mealYoutube = meal.strYoutube;
  const mealName = meal.strMeal;
  const mealCategory = meal.strCategory;
  const mealArea = meal.strArea;
  var mealInstruction = meal.strInstructions;
  let words = mealInstruction.split(" ");
  let slicedWords = words.slice(0, 150);
  let slicedStr = slicedWords.join(" ");
  slicedStr = slicedStr + ".....";

  const mealDSection = document.getElementById("mealDetailSection");
  mealDSection.innerHTML = `
    <div id="meal-container">
        <div id="meal-image-source">
            <a href="${mealYoutube}" target="_black" id="image-link"><img src="${mealImage}" alt="" /></a>
            <a href="${mealSource}" target="_black" id="source-link">Click to visit source &gt;</a>
        </div>
        
        <div id="meal-instruction">
            <div id="fav">
                <span id="meal-name">${mealName}</span>
                <i onclick="saveFavorite(${mealid})" id="${mealid}" class="fa-regular fa-star"></i>
            </div>
            <div id="cat-area">
                <span id="cat">${mealCategory}, </span>
                <span> &nbsp;${mealArea}</span>
            </div>
            <p id="instruction">${slicedStr}</p>
            <div id="meal-ingredient">
                <span>Meal Ingredients:-</span>
                <ul id="meal-ingredients">  </ul>
            </div>
        </div>
    </div>
    `;
  // console.log(mealid);
  const myfavorites = JSON.parse(localStorage.getItem("favorites"));

  if (Object.values(myfavorites).includes(parseInt(mealid))) {
    const myContainer = document.querySelector("#fav");
    const myIcon = myContainer.querySelector("i");
    myIcon.classList.remove("fa-regular");
    myIcon.className = "fa-solid fa-star";
  }
  const mealIng = document.getElementById("meal-ingredients");

  for (let i = 1; meal[`strIngredient${i}`]; i++) {
    if (i === 12) {
      break;
    }
    const ingr = `
        ${meal[`strMeasure${i}`]}   ${meal[`strIngredient${i}`]}
        `;
    const mealDetialsP = document.createElement("li");
    mealDetialsP.innerText = ingr;
    mealIng.appendChild(mealDetialsP);
  }
};

/** Function to add the meal into Fav local storage and change the icon accordingly */
const saveFavorite = (favID) => {
  const iconID = document.getElementById(`${favID}`);
  if (iconID.className.includes("fa-regular")) {
    iconID.classList.remove("fa-regular");
    iconID.className = "fa-solid fa-star";

    // Get the existing item from local storage, or create an empty array if there are none
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    const index = favorites.indexOf(favID);

    if (index === -1) {
      // Add a new item to the array
      favorites.push(favID);
    }

    // Save the updated array to local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } else {
    iconID.classList.remove("fa-solid");
    iconID.className = "fa-regular fa-star";
    const favorites = JSON.parse(localStorage.getItem("favorites"));

    const index = favorites.indexOf(favID);

    if (index !== -1) {
      favorites.splice(index, 1);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    if (!searchInput.value) {
      document.getElementById("meal-type").innerText = "Favourite Meal:-";
      location.reload();
    }
  }

  //   console.log(favID);
};

/* To handle the dynamic App Name shown and fetch the fav meal detail from API using meal ID*/
const refreshFunction = () => {
  const showFav = JSON.parse(localStorage.getItem("favorites"));
  if (showFav.length === 0) {
    var headText = "Welcome to the MealFresh...";
    var target = document.getElementById("introduction");
    showText(target, headText, 0, 100);

    function showText(target, headText, index, interval) {
      if (index < headText.length) {
        if (index === 7 || index === 10 || index === 14) {
          target.innerHTML += headText[index] + " ";
          index++;
        } else {
          target.innerHTML += headText[index];
          index++;
        }
        setTimeout(function () {
          showText(target, headText, index, interval);
        }, interval);
      }
    }
  } else {
    for (var i = 0; i < showFav.length; i++) {
      const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${showFav[i]}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          showFavoriteMeal(data);
          //   console.log(data);
        });
    }
  }
};

/** Function to create the meal detail div and set the required data and show on screen */
const showFavoriteMeal = (data) => {
  const meal = data.meals[0];
  const mealPhoto = meal.strMealThumb;
  const mealName = meal.strMeal;
  let name = mealName.split(" ");
  let Mname = name.slice(0, 3);
  let MealN = Mname.join(" ");
  MealN = MealN + "...";
  //   console.log(meal.strMeal);
  const mealInfo = `
        <a href="#meal-type">
            <div onclick="getMealDetails(${meal.idMeal})">
                <div class="item-img"><img src="${mealPhoto}" alt="" /></div>
            </div>
        </a>
        <div class="item-detail">
            <p id="item-name">${MealN}</p>
            <i onclick="saveFavorite(${meal.idMeal})" id="${meal.idMeal}" class="fa-solid fa-star"></i>
        </div>
    `;
  const mealinfoSection = document.getElementById("middle-section");
  const mealInfoDiv = document.createElement("div");
  mealInfoDiv.className = "card-container";
  mealInfoDiv.innerHTML = mealInfo;
  mealinfoSection.appendChild(mealInfoDiv);
};

/** Execute when reload the page */
document.addEventListener("DOMContentLoaded", refreshFunction);

/** Reload when favourite nav is clicked */
function favClickLoad() {
  location.reload();
}
function mealClickLoad() {
  location.reload();
}

function homeClickLoad() {
  location.reload();
}
