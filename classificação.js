// Seletores encapsulados em um objeto para organização
const selectors = {
  containers: {
    playerList: document.getElementById("playerList"),
    feedback: document.getElementById("feedback"),
  },
  inputs: {
    playerName: document.getElementById("playerName"),
    victories: document.getElementById("playerVitorias"),
    goals: document.getElementById("playerGols"),
    defenses: document.getElementById("playerDefesas"),
    draws: document.getElementById("playerEmpates"),
  },
};

// Script para alternar a visibilidade do menu
document.getElementById('menuButton').addEventListener('click', function() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('visible'); // Alterna a classe 'visible' para mostrar/ocultar o menu
});


// Função para carregar jogadores do LocalStorage
function loadPlayersFromStorage() {
  return JSON.parse(localStorage.getItem("players")) || [];
}

// Função para salvar jogadores no LocalStorage
function savePlayersToStorage(players) {
  localStorage.setItem("players", JSON.stringify(players));
}

// Função para exibir feedback visual de ações realizadas
function showFeedback(message, type = "success") {
  if (!selectors.containers.feedback) return;

  const feedback = document.createElement("div");
  feedback.className = `feedback ${type}`;
  feedback.textContent = message;

  selectors.containers.feedback.appendChild(feedback);
  setTimeout(() => feedback.remove(), 3000); // Remove após 3 segundos
}

// Função para calcular os pontos do jogador
function calculatePoints(victories, draws, defenses, goals) {
  return victories * 3 + draws + defenses + goals * 2;
}

// Função para renderizar jogadores na tabela
function renderPlayers() {
  const players = loadPlayersFromStorage();

  // Ordena os jogadores pela pontuação (decrescente)
  players.sort((a, b) => b.points - a.points);

  selectors.containers.playerList.innerHTML = ""; // Limpa a tabela

  players.forEach(player => {
    const row = document.createElement("tr");
    row.dataset.name = player.name;
    row.dataset.points = player.points;

    row.innerHTML = `
      <td>${player.name}</td>
      <td>${player.points}</td>
      <td>${player.victories}</td>
      <td>${player.goals}</td>
      <td>${player.defenses}</td>
      <td>${player.draws}</td>
      <td>
        <button class="edit-btn" onclick="editPlayer('${player.name}')">✏️</button>
      </td>
    `;

    selectors.containers.playerList.appendChild(row);
  });
}

// Função para adicionar um jogador
function addPlayer() {
  const playerName = selectors.inputs.playerName.value.trim();
  const victories = parseInt(selectors.inputs.victories.value, 10) || 0;
  const draws = parseInt(selectors.inputs.draws.value, 10) || 0;
  const defenses = parseInt(selectors.inputs.defenses.value, 10) || 0;
  const goals = parseInt(selectors.inputs.goals.value, 10) || 0;

  if (!playerName) {
    showFeedback("Por favor, insira um nome para o jogador.", "error");
    return;
  }

  const players = loadPlayersFromStorage();
  if (players.some(player => player.name === playerName)) {
    showFeedback("O jogador já existe na lista.", "error");
    return;
  }

  const points = calculatePoints(victories, draws, defenses, goals);
  const newPlayer = { name: playerName, victories, draws, defenses, goals, points };

  players.push(newPlayer);
  savePlayersToStorage(players);

  renderPlayers(); // Chama a função para renderizar os jogadores novamente
  showFeedback(`Jogador ${playerName} adicionado com sucesso!`);
  clearInputs();
}

// Limpa os campos de entrada após adicionar o jogador
function clearInputs() {
  Object.values(selectors.inputs).forEach(input => {
    if (input) input.value = "";
  });
}

// Função para editar um jogador
function editPlayer(playerName) {
  const players = loadPlayersFromStorage();
  const player = players.find(p => p.name === playerName);

  if (!player) {
    showFeedback(`Jogador ${playerName} não encontrado.`, "error");
    return;
  }

  // Criação de um formulário de edição
  const playerRow = document.querySelector(`[data-name="${playerName}"]`);
  if (!playerRow) return;

  playerRow.innerHTML = `
    <td><input type="text" value="${player.name}" id="editName"></td>
    <td><input type="number" value="${player.points}" id="editPoints" disabled></td>
    <td><input type="number" value="${player.victories}" id="editVictories"></td>
    <td><input type="number" value="${player.goals}" id="editGoals"></td>
    <td><input type="number" value="${player.defenses}" id="editDefenses"></td>
    <td><input type="number" value="${player.draws}" id="editDraws"></td>
    <td>
      <button class="save-btn" onclick="savePlayerEdits('${playerName}')">💾</button>
      <button class="cancel-btn" onclick="renderPlayers()">❌</button>
    </td>
  `;
}

// Função para salvar as edições feitas no jogador
function savePlayerEdits(originalName) {
  const players = loadPlayersFromStorage();
  const playerIndex = players.findIndex(p => p.name === originalName);

  if (playerIndex === -1) {
    showFeedback(`Jogador ${originalName} não encontrado.`, "error");
    return;
  }

  // Captura os novos valores
  const editedName = document.getElementById("editName").value.trim();
  const editedVictories = parseInt(document.getElementById("editVictories").value, 10) || 0;
  const editedGoals = parseInt(document.getElementById("editGoals").value, 10) || 0;
  const editedDefenses = parseInt(document.getElementById("editDefenses").value, 10) || 0;
  const editedDraws = parseInt(document.getElementById("editDraws").value, 10) || 0;

  // Recalcula os pontos com base nas edições
  const editedPoints = calculatePoints(editedVictories, editedDraws, editedDefenses, editedGoals);

  // Atualiza o jogador com os novos valores
  players[playerIndex] = {
    name: editedName,
    points: editedPoints,
    victories: editedVictories,
    goals: editedGoals,
    defenses: editedDefenses,
    draws: editedDraws,
  };

  savePlayersToStorage(players);
  renderPlayers();
  showFeedback(`Jogador ${editedName} atualizado com sucesso!`);
}

// Inicializa as funções necessárias para a página
document.addEventListener("DOMContentLoaded", () => {
  const playerForm = document.getElementById("playerForm");

  if (playerForm) {
    // Página de Adicionar Jogador
    playerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      addPlayer();
    });
  }

  if (selectors.containers.playerList) {
    // Página de Classificação
    renderPlayers();
  }
});
