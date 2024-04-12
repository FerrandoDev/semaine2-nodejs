
    document.querySelectorAll('.addCategorie').forEach(button => {
        button.addEventListener('click', function () {
                    document.getElementById('addCategorie').style.display = 'block'
        });
    });

// Ajouter un événement pour fermer la modal
    document.getElementById('closeModal').addEventListener('click', function () {
        document.getElementById('addCategorie').style.display = 'none'
    });

