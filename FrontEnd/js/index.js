document.addEventListener("DOMContentLoaded", () =>
/** WORKS **/

fetch("http://localhost:5678/api/works")
    .then(res => res.json())                        
    .then(data => {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML='';
    data.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = work.title;
        figure.appendChild(img)
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    })

}))


/** CATEGORIES **/

const categories = ["objets", "appartements", "hôtels & restaurants"];

document.addEventListener("DOMContentLoaded", () => {
fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then((categories) => {
        console.log("Données reçues par l'API:", categories)
        const filter = document.querySelector(".filters");
        if (!filter) {
            console.error("Les élément avec la classe 'filters' n'apparaissent pas dans le DOM");
            return;
        }

        const allBtn = document.createElement("button");
        allBtn.innerText = "Tous";
        allBtn.className = "category-btn";
        filter.appendChild(allBtn);
    

        for (let i = 0; i < categories.length; i++){
            const category = categories[i];
            console.log(categories);

            const filter = document.querySelector(".filters");
            const button = document.createElement("button");
            button.className = "category-btn";
            button.textContent = category.name;
            filter.appendChild(button);
       }

    })
})