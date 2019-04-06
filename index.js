window.onload = function () {

    let boardSizeSelector = document.getElementById("board_size_selector");
    let boatQuantitySelector = document.getElementById("boat_quantity_selector");
    let letThemDecideButton = document.getElementById("let_them_decide_button");
    let placeYourBoatsButton = document.getElementById('place_your_boats_button');
    let boatsPlacedButton = document.getElementById('boats_placed_button');

    let boatsPerPlayer = 1;
    let boardLength = 3;

    let rowBootstrap = document.getElementById('row_bootstrap');
    let rowSetup = document.getElementById('row_setup');

    let playerBoatCells;
    let computerBoatCells;
    let computerBoard = [];
    let playerBoard = [];
    let playerShotsFired = 0;
    let computerShotsFired = 0;

    let rowBootstrapResults = document.getElementById('row_bootstrap_results');
    let results = '';

    let timeElapsed;
    let intervalFunction;

    if (!localStorage.getItem('results')) {
        results = '';
    } else {
        results = localStorage.getItem('results');
        console.log(results);
        let par = '<p>' + results + '</p>';
        row_bootstrap_results.innerHTML = par;
    }

    if (rowBootstrapResults && results) {
        let par = '<p>' + results + '</p>';
        rowBootstrapResults.innerHTML += par;
    }


    if (boardSizeSelector) {
        for (let i = 3; i <= 10; i++) {
            let option = document.createElement("option");
            option.text = i + "X" + i;
            option.value = i;
            boardSizeSelector.add(option);
        }
    }

    if (boardSizeSelector && boatQuantitySelector) {
        boardSizeSelector.addEventListener("click", function () {
            boatQuantitySelector.innerHTML = '';
            boardLength = boardSizeSelector.value;
            for (let i = 1; i < boardLength; i++) {
                let option = document.createElement("option");
                option.text = i;
                option.value = i;
                boatQuantitySelector.add(option);
            }
        });
    }

    /*if (boatQuantitySelector) {
        boatQuantitySelector.addEventListener("click", function () {
            boatQuantitySelector.innerHTML = '';
            for (let i = 1; i < boardLength; i++) {
                let option = document.createElement("option");
                option.text = i;
                option.value = i;
                boatQuantitySelector.add(option);
            }
        });
    }
    */

    function initiateGame() {
        playerShotsFired = 0;
        computerShotsFired = 0;
        clearInterval(intervalFunction);
    }

    function createBoard(board) {
        for (let i = 0; i < boardLength; i++) {
            board[i] = [];
            for (let j = 0; j < boardLength; j++) {
                board[i][j] = 0;
            }
        }
    }

    function printArrays(board) {
        for (let i = 0; i < boardLength; i++) {
            for (let j = 0; j < boardLength; j++) {
                if (board[i][j] == 1) {
                    console.log('Boat on ' + i + '.' + j);
                }
            }
        }
        console.log('Now computers boats');
    }

    if (boatQuantitySelector) {
        boatQuantitySelector.addEventListener("click", function () {
            boatsPerPlayer = boatQuantitySelector.value;
        });
    }

    if (letThemDecideButton) {
        letThemDecideButton.addEventListener("click", function () {
            initiateGame();
            startTheClock();

            createBoard(playerBoard);
            createBoard(computerBoard);
            placeBoats(playerBoard);
            placeBoats(computerBoard);

            printArrays(playerBoard);
            printArrays(computerBoard);

            loadBothBoards();
        });
    }

    if (placeYourBoatsButton) {
        placeYourBoatsButton.addEventListener("click", function () {
            rowBootstrap.innerHTML = '';
            initiateGame();
            createBoard(playerBoard);
            createBoard(computerBoard);
            loadBoard('player_board_div');

            let boatsPlacedDiv = document.createElement('div');
            boatsPlacedDiv.id = 'boats_placed_div';
            boatsPlacedDiv.className = 'mx-auto';

            let boatsPlacedButton = document.createElement('button');
            boatsPlacedButton.id = 'boats_placed_button';
            boatsPlacedButton.className = 'btn btn-primary btn-sm';
            boatsPlacedButton.innerHTML = "Lets blast 'em";

            document.getElementById('row_bootstrap').appendChild(boatsPlacedDiv);
            document.getElementById('boats_placed_div').appendChild(boatsPlacedButton);

        });
    }

    if (boardSizeSelector && boatQuantitySelector && boatsPlacedButton) {
        boatsPlacedButton.addEventListener("click", function () {
            loadBothBoards();
            startTheClock();
        });
    }

    let loadBothBoards = function () {
        rowBootstrap.innerHTML = '';
        console.log("Input for board length and number of ships is: " + boardLength, boatsPerPlayer);
        playerBoatCells = 2 * boatsPerPlayer;
        computerBoatCells = 2 * boatsPerPlayer;
        loadBoard('computer_board_div');
        loadBoard('player_board_div');
    }

    let loadBoard = function (boardDivName) {
        let boardDiv = document.createElement('div');
        boardDiv.id = boardDivName;
        boardDiv.className = 'col-sm col-sm-offset-2';

        let boardIdentifier = document.createElement('h5');
        boardIdentifier.className = "text-center";
        if (boardDivName === 'player_board_div') {
            boardIdentifier.innerHTML = 'Your boats, sir';
        }
        if (boardDivName === 'computer_board_div') {
            boardIdentifier.innerHTML = 'Fire at your opponent!';
        }

        boardDiv.appendChild(boardIdentifier);

        document.getElementById('row_bootstrap').appendChild(boardDiv);

        let table = document.createElement('table');
        table.setAttribute('border', '4px');
        table.setAttribute('style:border-color', 'solid white');
        table.className = 'cell-board mx-auto';
        boardDiv.appendChild(table);

        for (let y = 0; y < boardLength; y++) {
            let row = table.insertRow(y);
            row.setAttribute('height', '30');
            for (let x = 0; x < boardLength; x++) {
                let cell = row.insertCell(x);
                cell.setAttribute('width', '30');
                cell.y = y;
                cell.x = x;

                if (boardDivName === 'player_board_div') {
                    cell.id = 'p' + y + "." + x;
                    console.log(cell.id);
                    if (playerBoard[y][x] == 1 && playerBoard[y][x - 1] == 1) {
                        cell.setAttribute('class', 'boatRight');
                        document.getElementById('p' + y + '.' + (x - 1))
                            .setAttribute('class', 'boatLeft');
                    }
                }
                if (boardDivName === 'computer_board_div') {
                    cell.id = 'c' + y + "." + x;
                    console.log('this is cell.id ' + cell.id);
                    cell.onclick = function () {
                        console.log(boardDivName + " cell " + this.id + " clicked");
                        bombCell(this.id);
                    };
                }
            }
        }
    }

    function bombCell(cellId) {

        //let cellId = cell.id;
        //console.log(' prints cell ' + cell);
        let cell = document.getElementById(cellId);
        let newCell = cell.cloneNode(true);

        cell.parentNode.replaceChild(newCell, cell);

        console.log("in bombCell " + cellId);

        let boardThatWasHit = cellId.substring(0, 1);
        let col = cellId.substring(1, 2);
        let row = cellId.substring(3);
        console.log(col + ' ' + row);

        if (boardThatWasHit == 'c') {
            playerShotsFired++;
            if (computerBoard[col][row] == 1) {
                console.log('player hit computers boat');
                colorCell(cellId, 'red', 'computer');
                computerBoatCells--;
                if (computerBoatCells == 0) {
                    alert('Player wins having fired ' + playerShotsFired
                        + ' shots. Computer fired ' + computerShotsFired
                        + ' times. The shootout commenced for '
                        + timeElapsed + ' seconds.');
                    winner = 'Player';
                    document.getElementById('timeDiv').innerHTML = '';
                    storeResult('Player', 'computer');
                }
            } else {
                console.log('player missed');
                colorCell(cellId, 'blue');
                computerStrike();
            }
        }
        if (boardThatWasHit == 'p') {
            computerShotsFired++;
            if (playerBoard[col][row] == 1) {
                console.log('computer hit players boat');
                colorCell(cellId, 'red', 'player');
                playerBoatCells--;
                if (playerBoatCells == 0) {
                    alert('Computer wins having fired ' + computerShotsFired
                        + ' shots. You fired ' + playerShotsFired
                        + ' times. The shootout commenced for '
                        + timeElapsed + ' seconds.');
                    document.getElementById('timeDiv').innerHTML = '';
                    storeResult('Computer', 'player');
                }
                computerStrike();
            } else {
                console.log('player missed');
                colorCell(cellId, 'blue', playerBoard);
            }
        }
    }

    function startTheClock() {

        let startTime = new Date().getTime();
        display = document.getElementById('timeDiv');

        intervalFunction = setInterval(function () {
            let nowTime = new Date().getTime();

            timeElapsed = Math.ceil((nowTime - startTime) / 1000);
            display.innerHTML = 'Here now, take yer time: ' + timeElapsed;
        }, 1000);
    }

    function checkCell(cellId) {

    }

    function storeResult(winner, loser) {
        //let key = Date.now();
        let resultsString = winner + ' wins on ' + boardLength + 'X' + boardLength
            + ' boards, with ' + boatsPerPlayer + ' boats per player. Having fired '
            + playerShotsFired + ' shots, while ' + loser + ' fired '
            + computerShotsFired + ' shots. The shootout commenced for '
            + timeElapsed + ' seconds.</br>';

        console.log('we are in storeResults, this the string ' + resultsString);

        if (localStorage.getItem('results')) {
            results = localStorage.getItem('results');
            resultsString = resultsString + results;
        }
        localStorage.setItem('results', resultsString);

        let par = '<p style="font-size: 12px;">' + resultsString + '</p>';
        row_bootstrap_results.innerHTML = par;

        console.log(localStorage.getItem('results'));
    }

    function computerStrike() {
        let i = 1;
        let j = 1;
        cellId = 'p' + i + '.' + j;

        while (document.getElementById(cellId).style.backgroundColor === 'blue'
            || document.getElementById(cellId).style.backgroundColor === 'red') {
            i = Math.floor((Math.random() * boardLength));
            j = Math.floor((Math.random() * boardLength));
            cellId = 'p' + i + '.' + j;
        }
        console.log('computer bombs ' + cellId);
        bombCell(cellId);
    }

    function colorCell(cellId, color, boardThatWasHit) {
        let cell = document.getElementById(cellId);
        if (color === 'red' && boardThatWasHit == 'player') {
            if (cell.className == 'boatLeft') {
                cell.className = 'boatLeftHit';
            }
            if (cell.className == 'boatRight') {
                cell.className = 'boatRightHit';
            }
        }
        if (color === 'red' && boardThatWasHit == 'computer') {
            cell.style.backgroundColor = color;
        } else {
            cell.style.backgroundColor = color;
        }
    }

    function placeBoats(board) {
        let placedBoats = 0;
        while (placedBoats < boatsPerPlayer) {
            let i = Math.floor((Math.random() * boardLength));
            let j = Math.floor((Math.random() * boardLength));

            if (board[i][j] == 0 && board[i][j + 1] == 0
                && (j - 1 == -1 || board[i][j - 1] == 0)
                && (j + 2 >= boardLength || board[i][j + 2] == 0)
                && (i - 1 == -1 || (board[i - 1][j] == 0 && board[i - 1][j + 1] == 0))
                && (i + 1 >= boardLength || (board[i + 1][j] == 0 && board[i + 1][j + 1] == 0)
                    && (boardLength != 3 || (i != 1)))
                && (boardLength != 4 || ((i != 1 && j != 1) || (i != 2 && j != 1)))) {
                board[i][j] = 1;
                board[i][j + 1] = 1;
                placedBoats++
            }
        }
    }
}
