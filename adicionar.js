// Seletores encapsulados em um objeto para organização
const selectors = {
    inputs: {
        playerName: document.getElementById("playerName"),
        victories: document.getElementById("playerVitorias"),
        goals: document.getElementById("playerGols"),
        defenses: document.getElementById("playerDefesas"),
        draws: document.getElementById("playerEmpates"),
    },
    containers: {
        playerList: document.getElementById("playerList"),
        feedback: document.getElementById("feedback"),
    },
};

// Função para calcular os pontos do jogador
function calculatePoints(victories, draws, defenses, goals) {
    return victories * 3 + draws + defenses + goals * 2;
}

// Script para alternar a visibilidade do menu
document.getElementById('menuButton').addEventListener('click', function() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('visible'); // Alterna a classe 'visible' para mostrar/ocultar o menu
});

// Exibe um feedback visual após a ação
function showFeedback(message, type = "success") {
    const feedbackContainer = selectors.containers.feedback;
    if (!feedbackContainer) return;

    // Limpa o feedback anterior
    feedbackContainer.innerHTML = "";

    const feedback = document.createElement("div");
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;

    feedbackContainer.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
}

// Carrega a lista de jogadores do LocalStorage
function loadPlayersFromStorage() {
    return JSON.parse(localStorage.getItem("players")) || [];
}

// Salva a lista de jogadores no LocalStorage
function savePlayersToStorage(players) {
    localStorage.setItem("players", JSON.stringify(players));
}

// Função para renderizar jogadores na tabela
function renderPlayers() {
    const playerListContainer = selectors.containers.playerList;
    if (!playerListContainer) return;

    const players = loadPlayersFromStorage();
    playerListContainer.innerHTML = ""; // Limpa a tabela

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
                <button class="delete-btn" onclick="removePlayer('${player.name}')">
                    &#128465;
                </button>
            </td>
        `;
        playerListContainer.appendChild(row);
    });
}

// Função para adicionar um jogador
function addPlayer() {
    const playerName = selectors.inputs.playerName?.value.trim();
    const victories = parseInt(selectors.inputs.victories?.value, 10) || 0;
    const draws = parseInt(selectors.inputs.draws?.value, 10) || 0;
    const defenses = parseInt(selectors.inputs.defenses?.value, 10) || 0;
    const goals = parseInt(selectors.inputs.goals?.value, 10) || 0;

    // Validação de campos
    if (!playerName) {
        showFeedback("Por favor, insira um nome para o jogador.", "error");
        return;
    }

    if (victories < 0 || draws < 0 || defenses < 0 || goals < 0) {
        showFeedback("Os valores de vitórias, gols, defesas e empates devem ser positivos.", "error");
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

    renderPlayers();
    showFeedback(`Jogador ${playerName} adicionado com sucesso!`);
    clearInputs();
}

// Limpa os campos de entrada após adicionar o jogador
function clearInputs() {
    Object.values(selectors.inputs).forEach(input => {
        if (input) input.value = "";
    });
}

// Função para remover jogador
function removePlayer(playerName) {
    const players = loadPlayersFromStorage();
    const updatedPlayers = players.filter(player => player.name !== playerName);

    savePlayersToStorage(updatedPlayers);
    renderPlayers();
    showFeedback(`Jogador ${playerName} removido com sucesso!`);
}

// Inicializa as funções necessárias em cada página
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
