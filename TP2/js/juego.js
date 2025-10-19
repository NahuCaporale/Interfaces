const corazon = document.getElementById('corazon');

corazon.addEventListener('mouseenter', () => {
    corazon.classList.remove('fa-regular');
    corazon.classList.add('fa-solid');
    corazon.classList.add('solido');
});

corazon.addEventListener('mouseleave', () => {
    corazon.classList.remove('fa-solid'); // 
    corazon.classList.remove('solido');
    corazon.classList.add('fa-regular');
});