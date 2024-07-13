let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
   // Fetch toys and render them
   fetch('http://localhost:3000/toys')
   .then(response => response.json())
   .then(toys => {
     toys.forEach(toy => {
       renderToy(toy);
     });
   });

 // Function to render a toy
 function renderToy(toy) {
   const div = document.createElement("div");
   div.className = "card";
   
   div.innerHTML = `
     <h2>${toy.name}</h2>
     <img src="${toy.image}" class="toy-avatar" />
     <p>${toy.likes} Likes</p>
     <button class="like-btn" id="${toy.id}">Like ❤️</button>
   `;
   
   toyCollection.appendChild(div);

   // Like button event listener
   const likeBtn = div.querySelector(".like-btn");
   likeBtn.addEventListener("click", () => {
     toy.likes++;
     fetch(`http://localhost:3000/toys/${toy.id}`, {
       method: 'PATCH',
       headers: {
         "Content-Type": "application/json",
         Accept: "application/json"
       },
       body: JSON.stringify({ likes: toy.likes })
     })
     .then(response => response.json())
     .then(updatedToy => {
       div.querySelector("p").innerText = `${updatedToy.likes} Likes`;
     });
   });
 }

 // Add new toy
 toyForm.addEventListener("submit", (e) => {
   e.preventDefault();
   const toyName = e.target.name.value;
   const toyImage = e.target.image.value;

   fetch('http://localhost:3000/toys', {
     method: 'POST',
     headers: {
       "Content-Type": "application/json",
       Accept: "application/json"
     },
     body: JSON.stringify({
       name: toyName,
       image: toyImage,
       likes: 0
     })
   })
   .then(response => response.json())
   .then(newToy => {
     renderToy(newToy);
     toyForm.reset();
   });
 });
});
