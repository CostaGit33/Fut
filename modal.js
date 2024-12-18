// Obtendo os elementos necessários
const modal = document.getElementById('welcomeModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Exibir o modal assim que a página for carregada
window.onload = function() {
  modal.style.display = 'block';
}

// Fechar o modal ao clicar no botão de fechar
closeModalBtn.onclick = function() {
  modal.style.display = 'none';
}

// Script para alternar a visibilidade do menu
document.getElementById('menuButton').addEventListener('click', function() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('visible'); // Alterna a classe 'visible' para mostrar/ocultar o menu
});

// Fechar o modal ao clicar fora da área do conteúdo
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}
