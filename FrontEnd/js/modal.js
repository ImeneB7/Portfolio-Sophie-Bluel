
document.addEventListener('DOMContentLoaded', function() {
                    /** ELEMENTS DU DOM **/
    const modifLink = document.querySelector("a.modif-link");
    const modal = document.getElementById("modal1");
    const modalAddImg = document.getElementById("modal2");
    const btnAddModal = document.querySelector(".btn-modal")
    const closeBtnModal1 = modal.querySelector(".fa-xmark")
    const closeBtnModal2 = modalAddImg.querySelector(".fa-xmark")
    const arrowLeft = modalAddImg.querySelector(".fa-arrow-left")


    /** CLICK POUR FAIRE APPARAITRE LA MODALE */
    modifLink.addEventListener('click', function(event) {
        event.preventDefault();
        modal.style.display = 'flex';
        loadImg();
    });

/*** CLICK sur l'icone croix pour fermer la modale */
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
   
/*** Fonction pour ajouter des images dans la modale ***/

   function addImgToModal(src, container, id) {
        const imgContainer = document.createElement("div")
        imgContainer.classList.add("img-container")

        
        const img = document.createElement('img');
        img.src = src;
        img.alt= 'image';

        /**Ajout de l'icone corbeille et deu delete au click*/
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
            loadMainGallery(); /** recharge la galerie après suppression */
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
    resetImagePreview();
   })

   closeBtnModal2.addEventListener('click', () => {
    modalAddImg.style.display = 'none';
    resetImagePreview();
   })

   arrowLeft.addEventListener('click', () => {
    modalAddImg.style.display = 'none';
    modal.style.display = 'flex';
    resetImagePreview();
   })

   /** Prévisualisation image */
   
   const previewImg = document.querySelector(".containerFile img.img-input")
   const inputFile  = document.querySelector(".containerFile input")
   const labelFile = document.querySelector(".containerFile label")
   const iconFile = document.querySelector(".containerFile .fa-image")
   const pFile = document.querySelector(".containerFile p")

   resetImagePreview();

   function resetImagePreview() {
    const previewImg = document.querySelector(".containerFile img.img-input");
    const labelFile = document.querySelector(".containerFile label");
    const iconFile = document.querySelector(".containerFile .fa-image");
    const pFile = document.querySelector(".containerFile p");

    previewImg.style.display = 'none';
    labelFile.style.display = 'block';
    iconFile.style.display = 'block';
    pFile.style.display = 'block';
    previewImg.src = ''; 
    inputFile.value = ''; 


   inputFile.addEventListener('change', () => {
    const file = inputFile.files[0]
    console.log(file)
    if (file) {
        const reader = new FileReader(); /** je lis le contenu du fichier */
        reader.onload = function (e) {
            previewImg.src = e.target.result
            previewImg.style.display = 'block'
            labelFile.style.display = 'none'
            iconFile.style.display = 'none'
            pFile.style.display = 'none'
        }
        reader.readAsDataURL(file); /** lis le contenu et le convertit en chaine */
    }
   })
   }
   function fetchCategories() {
    fetch('http://localhost:5678/api/categories')
    .then(res => res.json())
    .then(data => {
        categories = data;
        displayCategoryModal();
    })
    .catch(error => console.error('Erreur de chargement des catégories', error))
   }

   /**** Intégration des catégories dans le Input select ****/
   fetchCategories();

   function displayCategoryModal() {
    const select = document.querySelector(".form-modal .select-cat")
    categories.forEach(category => {
        const option = document.createElement("option")
        option.value = category.id
        option.textContent  = category.name
        select.appendChild(option)
    })
   }


/*** POST */
   
const modalForm = document.querySelector('.form-modal');

modalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(modalForm);
    const token = localStorage.getItem('token')

    fetch("http://localhost:5678/api/works/", {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Données envoyées')
            loadMainGallery();
            response.json().then(data => {
                const imgContainer = modal.querySelector(".img-container");
                addImgToModal(data.imageUrl, imgContainer, data.id)
            });
            modalAddImg.style.display = 'none';
            modal.style.display = 'flex';
            modalForm.reset();
            previewImg.style.display = 'none';
            labelFile.style.display = 'block';
            iconFile.style.display = 'block';
            pFile.style.display = 'block';
        } else {
            console.error('Erreur lors de l\'envoi des données')
        }
    })
    .catch(error => {
        console.error('Erreur lors de la requête fetch depuis la modale')
    })

    
})

/*** ACTIVATION DU BOUTON VALIDER SI CHAMPS COMPLETES */

const buttonImg = document.querySelector ('.button-img')
const inputTitle = document.querySelector('.input-title');
const selectCat = document.querySelector('.select-cat');

function checkChampForm() {
    const title = inputTitle.value.trim();
    const category = selectCat.value.trim();

    if (title !== '' && category !== '') {
        buttonImg.removeAttribute('disabled');
        buttonImg.style.cursor = 'pointer';
        buttonImg.style.backgroundColor = '#1D6154';
    } else {
        buttonImg.setAttribute('disabled', true);
        buttonImg.style.cursor = 'default';
        buttonImg.style.backgroundColor = '#A7A7A7';
    }
}

inputTitle.addEventListener('input', checkChampForm);
selectCat.addEventListener('change', checkChampForm);

checkChampForm();
});



