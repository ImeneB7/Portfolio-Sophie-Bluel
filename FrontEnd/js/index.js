document.addEventListener("DOMContentLoaded", () => {
/*********************************** WORKS *******************************************/

/** Récupération des données works et insertion dans le DOM + définition de la data-category*/


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
        figure.setAttribute("data-category", work.categoryId);
        gallery.appendChild(figure);
    })

})


/********************************** CATEGORIES ****************************************/

const categories = ["objets", "appartements", "hôtels & restaurants"];


fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then((categories) => {
        console.log("Données reçues par l'API:", categories)
        const filter = document.querySelector(".filters");
        if (!filter) {
            console.error("Les élément avec la classe 'filters' n'apparaissent pas dans le DOM");
            return;
        }

        /*** Création du bouton TOUS */

        const allBtn = document.createElement("button");        
        allBtn.innerText = "Tous";
        allBtn.className = "category-btn";
        filter.appendChild(allBtn);

        allBtn.addEventListener("click", () =>{
            console.log(`Button ${"Tous"} clicked`)
            document.querySelectorAll(".gallery figure").forEach(figure => {
                figure.style.display = "block";
            })
        })

        /*** Création des autres boutons + data-category pour identifier la categorie */

        categories.forEach(category => {
            const filter = document.querySelector(".filters");
            const button = document.createElement("button");
            button.className = "category-btn";
            button.textContent = category.name;
            button.setAttribute("data-category-id", category.id)
            filter.appendChild(button);
            
            button.addEventListener("click", () =>{
                const selectedCategory = category.id;
                document.querySelectorAll(".gallery figure").forEach(figure => {
                    if (figure.getAttribute("data-category") == selectedCategory) {
                        figure.style.display = "block";
                    } else {
                        figure.style.display= "none";
                    }
                })
                console.log(`Button ${category.name} clicked`)
            })
       })


       /********************* TRIER PAR CATEGORIES **********************/

       
       categoryFilter();

    })

        function categoryFilter() {
            const buttons = document.querySelectorAll(".filters button")
            console.log(buttons)
            buttons.forEach((button, index) => {
                button.addEventListener("click",() => {
                    console.log(button);  
                    buttons.forEach(button => button.classList.remove("btn-selected"))
                    button.classList.add("btn-selected")
                });   
            });
        }
})


