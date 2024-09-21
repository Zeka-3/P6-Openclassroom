const sectionProjets = document.querySelector(".gallery");
const conteneurLiensFiltres = document.querySelector('.filters');
let donnees = null;
let idCategorie = null;

// Fonction pour récupérer les catégories depuis l'API
async function recupererCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();
        genererMenuCategories(categories);
        remplirSelectCategories(categories)
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        afficherErreur("Une erreur est survenue lors de la récupération des catégories");
    }
}

// Fonction pour générer dynamiquement le menu des catégories
function genererMenuCategories(categories) {


    // Création du bouton "Tous" pour afficher tous les projets
    const lienTous = document.createElement('a');
    lienTous.classList.add('filter-link', 'active'); // Ajout de la classe 'active' par défaut
    lienTous.textContent = 'Tous';
    lienTous.href = '#';
    lienTous.dataset.categorie = 'tous';

    lienTous.addEventListener('click', function (event) {
        event.preventDefault();
        gererClicCategorie(null); // null pour afficher tous les projets
    });

    conteneurLiensFiltres.appendChild(lienTous);

    // Génération des boutons pour chaque catégorie
    categories.forEach(categorie => {
        const lien = document.createElement('a');
        lien.classList.add('filter-link');
        lien.textContent = categorie.name;
        lien.href = '#';
        lien.dataset.categorie = categorie.id;

        lien.addEventListener('click', function (event) {
            event.preventDefault();
            gererClicCategorie(this.dataset.categorie);
        });

        conteneurLiensFiltres.appendChild(lien);
    });
}

// Fonction pour gérer le clic sur une catégorie
function gererClicCategorie(categorieId) {
    const liensFiltres = document.querySelectorAll('.filter-link');
    liensFiltres.forEach(lien => lien.classList.remove('active'));

    // Si categorieId est null, activer le bouton "Tous"
    if (categorieId === null) {
        document.querySelector(`[data-categorie='tous']`).classList.add('active');
        idCategorie = null;
    } else {
        document.querySelector(`[data-categorie='${categorieId}']`).classList.add('active');
        idCategorie = parseInt(categorieId);
    }

    genererProjets(idCategorie);
}


// Fonction pour réinitialiser l'affichage des projets
function reinitialiserProjets() {
    sectionProjets.innerHTML = "";
}

// Fonction pour récupérer les projets depuis l'API
async function recupererProjets() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        donnees = await response.json();
        const contentModalsupr = document.querySelector("#galeri-foto-suprime")
        contentModalsupr.className = "works-modal"
        donnees.forEach(projet => {
            const figure = document.createElement("figure");
            contentModalsupr.appendChild(figure);
            figure.classList.add(`js-projet-${projet.id}`);

            const img = document.createElement("img");
            img.src = projet.imageUrl;
            let icon = document.createElement("i")
            icon.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
            figure.appendChild(icon)
            figure.appendChild(img);

            const figcaption = document.createElement("figcaption");
            figcaption.innerHTML = projet.title;

            figure.appendChild(figcaption);
            icon.addEventListener("click", (e) => { e.preventDefault(); deleteWork(projet.id) })


        });







        genererProjets(idCategorie);
    } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
        afficherErreur("Une erreur est survenue lors de la récupération des projets");
    }
}

// Fonction pour générer et afficher les projets filtrés par catégorie
function genererProjets(categorieId) {
    reinitialiserProjets();

    let donneesFiltrees = donnees;
    if (categorieId !== null) {
        donneesFiltrees = donnees.filter(projet => projet.categoryId == categorieId);
    }

    donneesFiltrees.forEach(projet => {
        const figure = document.createElement("figure");
        sectionProjets.appendChild(figure);
        figure.classList.add(`js-projet-${projet.id}`);

        const img = document.createElement("img");
        img.src = projet.imageUrl;
        figure.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = projet.title;
        figure.appendChild(figcaption);
    });
}

// Fonction pour afficher un message d'erreur
function afficherErreur(message) {
    const p = document.createElement("p");
    p.classList.add("error");
    p.innerHTML = message;
    sectionProjets.appendChild(p);
}

// Chargement initial des catégories et projets une fois le DOM chargé
document.addEventListener('DOMContentLoaded', () => {
    recupererCategories();
    recupererProjets();
});
const token = sessionStorage.getItem("token")
const logButton = document.querySelector("#log")
const edit = document.querySelector('#editMode');
const edit1 = document.querySelector('#edit2');
edit.style.visibility = "collapse"
edit1.style.visibility = "collapse"

function masqueCategory() {
    conteneurLiensFiltres.style.display = "none"
}
function conectet() {
    if (token) {
        logButton.innerHTML = '<a style="color: black; text-decoration: none;" href="login.html">logout</a>'
        masqueCategory()
        edit.style.visibility = "visible"
        edit1.style.visibility = "visible"
    }
}
conectet()
const openModal = function (e) {
    e.preventDefault();

    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener('click', openModal);
});

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
});

const modalDisp = document.querySelector('.modal-wrapper');

async function getJsonModal() {
    try {
        const hr = document.createElement('hr');
        const galleryEdit = document.createElement('div');
        galleryEdit.setAttribute('id', 'gallery-edit-buttons')
        galleryEdit.innerHTML = "<button class='gallery-edit'>Ajouter une photo</button>";
        modalDisp.append(hr);
        modalDisp.append(galleryEdit);
    } catch (error) {
        alert(error.message);
    }
}

getJsonModal();

async function deleteWork(projetId) {
    const url = `http://localhost:5678/api/works/${projetId}`; // Ajoute l'ID du projet dans l'URL

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Si l'API nécessite un token d'authentification
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            alert('Une erreur est survenue lors de la suppression du projet.');
        } else {
            // Supprimer le projet de la modale
            document.querySelector(`.js-projet-${projetId}`).remove();

            // Supprimer le projet de la galerie principale (si elle est visible)
            const projetDansGalerie = document.querySelector(`.js-projet-${projetId}`);
            if (projetDansGalerie) {
                projetDansGalerie.remove();
            }

            alert('Projet supprimé avec succès.');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du projet :', error);
        alert('Une erreur est survenue.');
    }
}
// Ouvrir le modal d'ajout de photo
// Fonction pour ouvrir le modal d'ajout de photo
document.querySelector('.gallery-edit').addEventListener('click', function () {
    openModalEdit(document.querySelector('#modalAddPhoto'));
});

// Fermer le modal lors du clic sur les boutons "Fermer" ou "Retour"
document.querySelector('#modal-photo-close').addEventListener('click', function () {
    closeModalEdit(document.querySelector('#modalAddPhoto'));
});
document.querySelector('#modal-return').addEventListener('click', function () {
    closeModalEdit(document.querySelector('#modalAddPhoto'));
    openFirstModal(document.querySelector('#modal1'));
});
function openFirstModal(modalElement) {
    modalElement.style.display = 'flex';
    modalElement.removeAttribute('aria-hidden');
    modalElement.setAttribute('aria-modal', 'true');
}
// Fonction pour ouvrir le modal
function openModalEdit(modalElement) {
    closeAllModals(); // Fermer tous les autres modals
    modalElement.style.display = 'block';
    modalElement.removeAttribute('aria-hidden');
    modalElement.setAttribute('aria-modal', 'true');
}

// Fonction pour fermer le modal
function closeModalEdit(modalElement) {
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.removeAttribute('aria-modal');
}

// Soumission du formulaire d'ajout de photo
document.querySelector('#addPhotoForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Empêcher la soumission du formulaire par défaut
    uploadPhoto(); // Appel à la fonction pour gérer l'envoi
});

// Fonction pour envoyer la photo au serveur
async function uploadPhoto() {
    const formData = new FormData(document.querySelector('#addPhotoForm'));
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Gérer le token
            },
            body: formData
        });
        if (response.ok) {
            const newWork = await response.json(); // Récupérer les données du nouveau projet
            alert('Photo ajoutée avec succès');
            closeModalEdit(document.querySelector('#modalAddPhoto'));

            // Ajouter dynamiquement la nouvelle photo à la galerie
            ajouterProjetGalerie(newWork);

        } else {
            throw new Error('Échec de l’envoi de la photo');
        }
    } catch (error) {
        console.error('Erreur lors de l’envoi de la photo:', error);
        alert('Erreur lors de l’envoi de la photo');
    }
}

// Fonction pour ajouter un projet dans la galerie dynamiquement
function ajouterProjetGalerie(projet) {
    const figure = document.createElement("figure");
    sectionProjets.appendChild(figure);
    figure.classList.add(`js-projet-${projet.id}`);

    const img = document.createElement("img");
    img.src = projet.imageUrl;
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = projet.title;
    figure.appendChild(figcaption);
}


// Fermer tous les modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modalElement => {
        modalElement.style.display = 'none';
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.removeAttribute('aria-modal');
    });
}

// Fonction pour remplir les catégories dans le formulaire
function remplirSelectCategories(categories) {
    const selectCategory = document.getElementById('modal-photo-category');
    categories.forEach(categorie => {
        const option = document.createElement('option');
        option.value = categorie.id;
        option.textContent = categorie.name;
        selectCategory.appendChild(option);
    });
}

// Vérification du formulaire et activation du bouton de validation
const titleInput = document.getElementById('modal-photo-title');
const categorySelect = document.getElementById('modal-photo-category');
const imageInput = document.getElementById('image');
const submitButton = document.getElementById('modal-valider');

function checkForm() {
    if (titleInput.value !== '' && categorySelect.value !== '' && imageInput.value !== '') {
        submitButton.style.backgroundColor = '#1D6154'; // Activer le bouton
        submitButton.disabled = false; // Activer le bouton de validation
    } else {
        submitButton.style.backgroundColor = ''; // Désactiver le bouton
        submitButton.disabled = true;
    }
}

titleInput.addEventListener('input', checkForm);
categorySelect.addEventListener('change', checkForm);
imageInput.addEventListener('change', checkForm);

// Prévisualisation de l'image
const labelImage = document.getElementById('label-image');
const pImage = document.querySelector("#form-photo-div > p");
const iconeImage = document.getElementById('iModalImage');

imageInput.addEventListener('change', function () {
    const selectedImage = imageInput.files[0];

    if (selectedImage) {
        const imgPreview = document.createElement('img');
        imgPreview.src = URL.createObjectURL(selectedImage);
        imgPreview.style.maxHeight = "100%";
        imgPreview.style.width = "auto";

        // Cacher l'icône, le label et le paragraphe de description
        labelImage.style.display = "none";
        pImage.style.display = "none";
        iconeImage.style.display = "none";
        imageInput.style.display = "none";

        // Ajouter l'image dans la div
        document.getElementById("form-photo-div").appendChild(imgPreview);
    }
});



