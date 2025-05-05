
const dropArea = document.getElementById("drop-area");
const blocks = document.querySelectorAll(".block");
const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

function random(max) {
    return Math.floor(Math.random() * max);
}

const tileSize = 40;
const gridSize = 10;
let player = { x: 0, y: 0 };
let goal = { x: random(10), y: random(10) };
while (goal.x === 0 && goal.y === 0) {
    goal = { x: random(10), y: random(10) };
}

blocks.forEach(block => {
    block.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("type", block.dataset.type);
    });
});

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    const newBlock = document.createElement("div");
    newBlock.className = "block dropped";
    newBlock.dataset.type = type;

    const label = document.createElement("span");
    label.innerText = blockLabel(type);

    // Botão de deletar
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "x";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => newBlock.remove();

    // Botões de mover
    const upBtn = document.createElement("button");
    upBtn.innerText = "<";
    upBtn.className = "move-btn";
    upBtn.onclick = () => moveBlock(newBlock, "up");

    const downBtn = document.createElement("button");
    downBtn.innerText = ">";
    downBtn.className = "move-btn";
    downBtn.onclick = () => moveBlock(newBlock, "down");

    // Container de botões
    const controls = document.createElement("div");
    controls.className = "block-controls";
    controls.appendChild(upBtn);
    controls.appendChild(downBtn);
    controls.appendChild(deleteBtn);

    newBlock.appendChild(label);
    newBlock.appendChild(controls);
    dropArea.appendChild(newBlock);

    newBlock.addEventListener("dragstart", handleInternalDragStart);
    newBlock.addEventListener("dragover", (e) => e.preventDefault());
});

let draggedBlock = null;

function handleInternalDragStart(e) {
  draggedBlock = e.target;
}

function moveBlock(block, direction) {
    const parent = block.parentNode;
    if (!parent) return;

    if (direction === "up" && block.previousElementSibling) {
      parent.insertBefore(block, block.previousElementSibling);
    } else if (direction === "down" && block.nextElementSibling) {
      parent.insertBefore(block.nextElementSibling, block);
    }
  }

function blockLabel(type) {
    switch(type) {
        case "up": return "acima";
        case "down": return "abaixo";
        case "left": return "Esquerda";
        case "right": return "Direita";
        // case "repeat": return "Repetir 2x";
        // case "if": return "Se Frente Livre";
        default: return type;
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#ccc";
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.strokeRect(i * tileSize, j * tileSize, tileSize, tileSize);
        }
    }
    // Desenhar objetivo
    // ctx.fillStyle = "gold";
    // ctx.fillRect(goal.x * tileSize + 10, goal.y * tileSize + 10, 20, 20);
    ctx.fillStyle = 'gold';
    ctx.beginPath();
    ctx.arc(goal.x * tileSize + tileSize / 2, goal.y * tileSize + tileSize / 2, tileSize / 4, 0, 2 * Math.PI);
    ctx.fill();

    // Desenhar personagem
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x * tileSize + 5, player.y * tileSize + 5, 30, 30);
}

function resetPlayer() {
    player.x = 0;
    player.y = 0;
    drawGrid();
}

function frenteLivre() {
    return player.x + 1 < gridSize;
}

const up = () => player.y--;
const down = () => player.y++;
const left = () => player.x--;
const right = () => player.x++;

async function runProgram() {
    resetPlayer();
    const commands = [...dropArea.querySelectorAll(".block")];
    for (const block of commands) {
        const type = block.dataset.type;
        if (type === "up") {
            player.y--;
            drawGrid();
            await sleep(500);
        }
        if (type === "down") {
            player.y++;
            drawGrid();
            await sleep(500);
        }
        if (type === "left") {
            if (player.x - 1 >= 0) player.x--;
            drawGrid();
            await sleep(500);
        }
        if (type === "right") {
            if (player.x + 1 < gridSize) player.x++;
            drawGrid();
            await sleep(500);
        }
        // if (type === "repeat") {
        //     for (let i = 0; i < 2; i++) {
        //         if (player.x + 1 < gridSize) player.x++;
        //         drawGrid();
        //         await sleep(500);
        //     }
        // }
        // if (type === "if") {
        //     if (frenteLivre()) {
        //         player.x++;
        //         drawGrid();
        //         await sleep(500);
        //     }
        // }
    }
    if (player.x === goal.x && player.y === goal.y) {
        setTimeout(() => alert("Vitória! Você chegou ao objetivo!"), 200);
    } else {
        setTimeout(() => alert("Não chegou ao objetivo."), 200);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

drawGrid();
