
document.addEventListener('DOMContentLoaded', function() {
    const modifLink = document.querySelector("a.modif-link");
    const modal = document.getElementById("modal1");
    const modalAddImg = document.getElementById("modal2");
    const btnAddModal = document.querySelector(".btn-modal")
    const closeBtnModal1 = modal.querySelector(".fa-xmark")
    const closeBtnModal2 = modalAddImg.querySelector(".fa-xmark")
    const arrowLeft = modalAddImg.querySelector(".fa-arrow-left")

    
    modifLink.addEventListener('click', function(event) {
        event.preventDefault();
        modal.style.display = 'flex';
        loadImg();
    });

/*** click sur l'icone croix pour fermer la modale */
    closeBtnModal1.addEventListener('click', () => {
        modal.style.display = 'none';
    });

/**empêche la fenêtre modale de se fermer si on clique n'importe où dans la fenêtre */
   modal.addEventListener('click', (e) => {
    e.stopPropagation();
   })

   /*** récupération des données works pour insérer les images dans la modale ***/
   function loadImg() {
    const imgContainer = modal.querySelector(".img-container");
    if (imgContainer) {
        imgContainer.innerHTML = '';

        fetch('http://localhost:5678/api/works')
        .then(res => res.json())
        .then (data => {
            data.forEach(work => {
                addImgToModal(work.imageUrl, imgContainer, work.id)
            });
        })
        .catch(error => console.error('erreur de chargement des images'))
    } else {
        console.error("Conteneur d'images inexistant dans la modale")
    }
   }
   
/*** Création de l'emplacement des images dans le DOM ***/

   function addImgToModal(src, container, id) {
        const imgContainer = document.createElement("div")
        imgContainer.classList.add("img-container")

        
        const img = document.createElement('img');
        img.src = src;
        img.alt= 'image';

        /**Ajout de l'icone corbeille */
        const binIcon = document.createElement("i");
        binIcon.classList.add('fa-solid', 'fa-trash-can')
        binIcon.addEventListener('click', () => {
            deletePhoto(id, imgContainer);
            imgContainer.remove();
        })

        imgContainer.appendChild(img)
        imgContainer.appendChild(binIcon)
        container.appendChild(imgContainer);
   } 


//** SUPPRESSION DES IMAGES DANS LA MODALE ET SUR LE SITE **//

   function deletePhoto(id, imgContainer) {
    const token = localStorage.getItem('token')
    fetch('http://localhost:5678/api/works/' +id,{
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            imgContainer.remove();
            console.log("photo et id supprimé")
            loadMainGallery();
        } else {
            console.error('erreur de suppresion')
        }
    })
    .catch(error => console.error('erreur de supression', error))
   }

   function loadMainGallery() {
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
    .catch(error => console.error('Erreur de chargement des images', error))
    }
    loadMainGallery();

    loadImg()

   btnAddModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalAddImg.style.display = 'flex';
   })

   closeBtnModal2.addEventListener('click', () => {
    modalAddImg.style.display = 'none';
   })

   arrowLeft.addEventListener('click', () => {
    modalAddImg.style.display = 'none';
    modal.style.display = 'flex';
   })

   

});



