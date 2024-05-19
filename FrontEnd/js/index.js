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

})


fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(data => {
        data.forEach(categories=> {
            
        })

        
})





