var numSelected = null;
var tileSelected = null;

var errors = 0;
var timerInterval = null;
var startTime = null;
var times = JSON.parse(localStorage.getItem('sudokuTimes')) || [];

var boards = [
    {
        board: [
            "--74916-5",
            "2---6-3-9",
            "-----7-1-",
            "-586----4",
            "--3----9-",
            "--62--187",
            "9-4-7---2",
            "67-83----",
            "81--45---"
        ],
        solution: [
            "387491625",
            "241568379",
            "569327418",
            "758619234",
            "123784596",
            "496253187",
            "934176852",
            "675832941",
            "812945763"
        ]
    },
    {
        board: [
            "1--6-8-7-",
            "-7--1--9-",
            "5-9--2-4-",
            "-4-5---3-",
            "9--1-8-6-",
            "-3---4-2-",
            "8-4-9--5-",
            "-2--6--1-",
            "7-1-5-4--"
        ],
        solution: [
            "132684975",
            "647591823",
            "598732614",
            "284953761",
            "916478253",
            "375216498",
            "814297356",
            "293645187",
            "761384592"
        ]
    },
    // Añade más tableros aquí
];

var currentBoard;
var currentSolution;

window.onload = function() {
    selectRandomBoard();
    setGame();
    startTimer();
    updateTimesList();
};

function selectRandomBoard() {
    // Selecciona un tablero al azar de la lista
    const randomIndex = Math.floor(Math.random() * boards.length);
    currentBoard = boards[randomIndex].board;
    currentSolution = boards[randomIndex].solution;
}

function setGame() {
    // Limpia el tablero actual antes de establecer uno nuevo
    document.getElementById("board").innerHTML = '';
    document.getElementById("digits").innerHTML = '';

    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (currentBoard[r][c] != "-") {
                tile.innerText = currentBoard[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }

    document.getElementById('check').addEventListener('click', checkSudoku);
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }

        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (currentSolution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
        } else {
            errors += 1;
            document.getElementById("errors").innerText = `Errores: ${errors}`;
        }
    }
}

// Función para iniciar el cronómetro
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(function() {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("timer").innerText = `Tiempo: ${elapsedTime} segundos`;
    }, 1000);
}

// Función para detener el cronómetro
function stopTimer() {
    clearInterval(timerInterval);
    return Math.floor((Date.now() - startTime) / 1000);
}

// Verifica si el Sudoku está completado correctamente
function checkSudoku() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if (tile.innerText != currentSolution[r][c]) {
                alert("Sudoku no completado correctamente");
                return;
            }
        }
    }

    // Si todo está correcto
    let timeTaken = stopTimer();
    let playerName = prompt("¡Sudoku completado! Ingresa tu nombre (3 letras):").toUpperCase();
    
    // Asegurarse de que el nombre tenga 3 letras
    while (!/^[A-Z]{3}$/.test(playerName)) {
        playerName = prompt("Por favor, ingresa un nombre de exactamente 3 letras:").toUpperCase();
    }

    alert(`¡Sudoku completado correctamente en ${timeTaken} segundos!`);
    saveTime(playerName, timeTaken);
    updateTimesList();
}

// Guarda el nombre y el tiempo en el LocalStorage
function saveTime(name, time) {
    times.push({ name: name, time: time });
    times.sort((a, b) => a.time - b.time); // Ordenar por tiempo
    localStorage.setItem('sudokuTimes', JSON.stringify(times));
}

// Actualiza la lista de los mejores tiempos
function updateTimesList() {
    const list = document.getElementById('times-list');
    list.innerHTML = '';
    times.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name}: ${entry.time} segundos`;
        list.appendChild(listItem);
    });
}
