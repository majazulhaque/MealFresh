var searchInput = document.getElementById("search-input");
var searchBtn = document.getElementById("search-btn");

searchInput.addEventListener("input", function () {
  var inputVal = searchInput.value.trim();
//   document.getElementById('middle-section').innerHTML = ``;
//   document.getElementById('mealDetailSection').innerHTML = ``;
  console.log(inputVal);
  const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputVal}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('middle-section').innerHTML = ``;
      document.getElementById('mealDetailSection').innerHTML = ``;
      mealDetailSection(data, inputVal);
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

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

const createMealInfoDiv = (meal, mealInput) => {
  const mealPhoto = meal.strMealThumb;
  const mealName = meal.strMeal;
  let name = mealName.split(' ');
  let Mname = name.slice(0,3);
  let MealN = Mname.join(' ');
  console.log(meal.strMeal);
  const mealInfo = `
        <a href="#meal-type">
            <div onclick="getMealDetails(${meal.idMeal})">
                <div class="item-img"><img src="${mealPhoto}" alt="" /></div>
            </div>
            <div class="item-detail">
                <p id="item-name">${mealName}</p>
                <i class="fa-regular fa-star"></i>
                <!-- <i class="fa-solid fa-star"></i> -->
            </div>
        </a>
    `;
  const mealinfoSection = document.getElementById("middle-section");
  const mealInfoDiv = document.createElement('div');
  mealInfoDiv.className = 'card-container';
  mealInfoDiv.innerHTML = mealInfo;
  mealinfoSection.appendChild(mealInfoDiv);
};

const getMealDetails = (mealID) =>{
    const mealDetailsSection = document.getElementById('mealDetailSection');
    mealDetailsSection.innerHTML = ``;

    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        showMealDetailsDiv(data)
    });
}

const showMealDetailsDiv = (data) => {
    console.log(data);
    const meal = data.meals[0];
    const mealImage = meal.strMealThumb;
    const mealName = meal.strMeal;
    const mealCategory = meal.strCategory;
    const mealArea = meal.strArea;
    var mealInstruction = meal.strInstructions;
    let words = mealInstruction.split(' ');
    let slicedWords = words.slice(0, 150);
    let slicedStr = slicedWords.join(' ');

    const mealDSection = document.getElementById('mealDetailSection');
    mealDSection.innerHTML = `
    <div id="meal-container">
        <img src="${mealImage}" alt="" />
        <div id="meal-instruction">
        <div id="fav">
        <span id="meal-name">${mealName}</span>
        <i class="fa-regular fa-star"></i>
        </div>
          <div id="cat-area">
            <span id="cat">${mealCategory}, </span>
            <span> &nbsp;${mealArea}</span>
          </div>
          <p id="instruction">${slicedStr}</p>
          <div id="meal-ingredient">
            <ul id="meal-ingredients">
              
            </ul>
          </div>
        </div>
      </div>
    `
    const mealIng = document.getElementById('meal-ingredients');

    for(let i = 1; meal[`strIngredient${i}`]; i++){
        if(i === 12){
            break;
        }
        const ingr = `
        ${meal[`strMeasure${i}`]}   ${meal[`strIngredient${i}`]}
        `
        const mealDetialsP = document.createElement('li');
        mealDetialsP.innerText = ingr;
        mealIng.appendChild(mealDetialsP);
    }

}

// To handle the dynamic App Name shown.
document.addEventListener('DOMContentLoaded', function() {
    var headText = "Welcome to the MealFresh...";
    var target = document.getElementById("introduction");
    showText(target, headText, 0, 100);
  
    function showText(target, headText, index, interval) {
      if (index < headText.length) {
        if(index === 7 || index === 10 || index === 14){
            target.innerHTML += headText[index] + " ";
            index++;
        }
        else{
            target.innerHTML += headText[index];
            index++;
        }
        setTimeout(function() {
          showText(target, headText, index, interval);
        }, interval);
      }
    }
  });
  
