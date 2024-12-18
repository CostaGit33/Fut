// global.js

import MenuModal from "./menuModal.js"; // Importa o módulo do menu modal

const StorageUtil = {
  get(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
  clear(key) {
    localStorage.removeItem(key);
  },
};

// Script para alternar a visibilidade do menu
document.getElementById('menuButton').addEventListener('click', function() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('visible'); // Alterna a classe 'visible' para mostrar/ocultar o menu
});

function setActiveMenu() {
  const menuItems = document.querySelectorAll("header .menu li a");
  const currentPage = window.location.pathname.split("/").pop();

  menuItems.forEach((item) => {
    const itemHref = item.getAttribute("href");
    item.classList.toggle("active", itemHref === currentPage);
  });
}

function welcomeMessage() {
  console.info("%cBem-vindo ao Futpontos!", "color: #005f73; font-size: 16px; font-weight: bold;");
  console.log("Explore as páginas do site e aproveite os recursos disponíveis.");
}

function smoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function updateFooterYear() {
  const footer = document.querySelector("footer");
  if (footer) {
    const currentYear = new Date().getFullYear();
    footer.innerHTML = `&copy; ${currentYear} Romulo Costa. Todos os direitos reservados.`;
  }
}

// Inicialização global
function initializeGlobalScripts() {
  MenuModal.initialize(); // Inicializa o menu modal
  setActiveMenu();
  welcomeMessage();
  smoothScroll();
  updateFooterYear();
}

document.addEventListener("DOMContentLoaded", initializeGlobalScripts);
