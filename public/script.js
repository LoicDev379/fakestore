
// Active automatiquement le input au chargement de la page
document.body.onload = init = () => {
  document.form.title.focus();
}

// SELECTEURS
const titleValue = document.querySelector("#title");
const descriptionValue = document.querySelector("#description");
const categoryValue = document.querySelector("#category");
const priceValue = document.querySelector("#price");
const articlesList = document.querySelector("#articlesList");
const addArticleForm = document.querySelector("#form");
const btnAdd = document.querySelector("#btnAdd");
const btnUpdate = document.querySelector("#btnUpdate");
var output = "";

btnUpdate.classList.add("btnUpdate");

// ECOUTEURS D'EVENEMENTS
addArticleForm.addEventListener("submit", createArticleForm);
articlesList.addEventListener("click", deleteEditArticle)

const url = "http://localhost:3000/articles";
// const url = "https://fakestoreapi.com/products";


// FONCTIONS

/**
   * GET - Read the articles
   * Method: GET
   */
fetch(`${url}?limit=3&sort=desc`)
  .then((res) => res.json()
    .then((data) => renderArticles(data))
  ).catch((error) => console.log("Probleme : " + error));

function deleteEditArticle(e) {
  e.preventDefault();
  let deletePostIsPressed = e.target.id == "delete-article";
  var editPostIsPressed = e.target.id == "edit-article";

  // Delete - Remove a existing article
  if (deletePostIsPressed) {
    let id = e.target.parentNode.parentNode.dataset.id;
    console.log(id);
    fetch(`${url}/${id}`, {
      method: "DELETE"
    })
      .then((res) => res.json()
        .then(() => location.reload())
      ).catch((error) => console.log("Le Probleme : " + error));
  }

  if (editPostIsPressed) {
    btnAdd.classList.add("btnAdd");
    btnUpdate.classList.remove("btnUpdate");

    const parent = e.target.parentElement.parentElement;
    const titleContent = parent.querySelector(".Title").textContent;
    const descriptionContent = parent.querySelector(".Description").textContent;
    const priceContent = parent.querySelector(".Price").textContent;
    const categoryContent = parent.querySelector(".Category").textContent;

    title.value = titleContent;
    description.value = descriptionContent;
    category.value = categoryContent;
    price.value = priceContent;
    init();

    /**
     * Update - Update the existing Article
     * Method : PATCH
     */
    btnUpdate.addEventListener("click", function (e) {
      e.preventDefault;
      let id = document.querySelector("#articlesList .container").dataset.id;
      fetch(`${url}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.value,
          category: categoryValue.value,
          price: priceValue.value,
          description: description.value
        })
      })
        .then((res) => res.json()
          .then(() => location.reload())
        ).catch((error) => console.log("Le Probleme : " + error));
    })
  }
}

/**
  * Insert - Create new article
  * Method: POST
  */
function createArticleForm(e) {
  e.preventDefault()

  header = {
    "Content-Type": "application/json"
  }

  data = JSON.stringify({
    title: titleValue.value,
    category: categoryValue.value,
    price: priceValue.value,
    description: descriptionValue.value
  });

  fetch(url + "?sort=desc", {
    method: "POST",
    headers: header,
    body: data
  })
    .then((res) => res.json()
      .then((data) => {
        const dataArray = [];
        dataArray.push(data);
        renderArticles(dataArray);
      })
    ).catch((error) => console.log("Le Probleme : " + error));
}

function renderArticles(articles) {
  articles.forEach(article => {
    output += `
    <div class="container" data-id=${article.id}>
      <h1>Article n°${article.id} : <span class="Title">${article.title}</span></h1>
      <hr>
      <div class="body-article">
        <p class="img"></p>
        <p class="Description">${article.description}</p>
      </div>
      <hr>
      <p>Price : <b><span class="Price">${article.price}</span>$</b>   |   Category: <b class="Category">${article.category}</b></p>
      <br> 
      <p style="text-align:left">
        <a href="#" id="delete-article" class="btn delete"><i class="far fa-trash-alt"></i>Delete</a>
        <a href="#" id="edit-article" class="btn edit"><i class="far fa-edit"></i>Edit</a></i>
      </p>
    </div><br>`;
    articlesList.innerHTML = output;
  });
};