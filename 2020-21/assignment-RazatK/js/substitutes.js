menuToggler.addEventListener('click', ev => {
  menu.classList.toggle('open');
});

let pageSize = 12;
let currentPage;
let objectIDs;

async function loadObject(id) {
  const url = "https://www.themealdb.com/api/json/v1/1/filter.php?";
  const response = await fetch(url);
  return response.json();
}

async function loadSearch(query, isHighlight) {
  let url = "https://www.themealdb.com/api/json/v1/1/filter.php?";

  if(isHighlight) {
    url = `${url}&isHighlight=${isHighlight}`;
  }
  url = `${url}c=${query}`;
  const response = await fetch(url);
  return response.json();
}

// This function converts object data into DOM elements
function buildArticleFromData(obj) {
  console.log("obj=", obj );
  const article = document.createElement("article");
  const title = document.createElement("h3");
  const primaryImageSmall = document.createElement("img");
  const objectInfo = document.createElement("p");
  const objectName = document.createElement("span");
  const objectDate = document.createElement("span");
  const medium = document.createElement("p");

  title.textContent = obj.strMeal;
  primaryImageSmall.src = obj.strMealThumb;
  primaryImageSmall.alt = `${obj.strMeal} (small image)`;
  primaryImageSmall.className = `thumbnail`;
  objectName.textContent = obj.objectName;
  objectDate.textContent = `, ${obj.objectDate}`;
  medium.textContent = obj.medium;
  article.appendChild(title);
  article.appendChild(primaryImageSmall);
  article.appendChild(objectInfo);
  article.appendChild(medium);

  objectInfo.appendChild(objectName);
  if(obj.objectDate) {
    objectInfo.appendChild(objectDate);
  }

  return article;
}

async function insertArticles(objects) {
  const articles = objects.map(buildArticleFromData);
  articles.forEach(a => results.appendChild(a));
}

async function doSearch(ev) {
  clearResults();
  loader.classList.add("waiting");
  const result = await loadSearch(query.value);
  console.log("result =", result);
  objectIDs = result.meals;
  if(objectIDs === null){
    count.textContent = `found no results for "${query.value}"`;
    nPages.textContent = 0;
    loader.classList.remove("waiting");
  }
  else{
  count.textContent = `found ${objectIDs.length} results for "${query.value}"`;
  nPages.textContent = Math.ceil(objectIDs.length / pageSize);
  currentPage = 1;
  loadPage();
}
}
async function loadPage() {
  clearResults();
  const myObjects = objectIDs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  loader.classList.add("waiting");
  console.log("myobject:", myObjects);
  await insertArticles(myObjects);
  loader.classList.remove("waiting");
  pageIndicator.textContent = currentPage;
}

function nextPage() {
  currentPage += 1;
  const nPages = Math.ceil(objectIDs.length / pageSize);
  if(currentPage > nPages) { currentPage = 1;}
  loadPage();
}
function prevPage() {
  currentPage -= 1;
  const nPages = Math.ceil(objectIDs.length / pageSize);
  if(currentPage < 1) { currentPage = nPages;}
  loadPage();
}

function clearResults() {
  while(results.firstChild) {
    results.firstChild.remove();
  }
}

query.addEventListener('change', doSearch);
prev.addEventListener('click', prevPage);
next.addEventListener('click', nextPage);
