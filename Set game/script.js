let board = [];
let choosen = [];
let playerslist = [];
let banlist = [];
const table = document.getElementById("table");
const max = 27;
let shown = 0;
let lines = 4;
let practice = true;
let helpexist = false;
let helpshowset = false;
let pointaset = false;
let autoadd = true;
let numberOfPlayers = 1;
let ACTIVEGAME = false;
let SELECTED = false;
let time = 0;
let currentID = "";
let succeed = 0;

/* D = Diamond, S = Squiggle, P = Oval */
let deck = [
    { shape: 'D', color: 'r', number: 1 }, { shape: 'D', color: 'r', number: 2 }, { shape: 'D', color: 'r', number: 3 },
    { shape: 'D', color: 'g', number: 1 }, { shape: 'D', color: 'g', number: 2 }, { shape: 'D', color: 'g', number: 3 },
    { shape: 'D', color: 'p', number: 1 }, { shape: 'D', color: 'p', number: 2 }, { shape: 'D', color: 'p', number: 3 },

    { shape: 'S', color: 'r', number: 1 }, { shape: 'S', color: 'r', number: 2 }, { shape: 'S', color: 'r', number: 3 },
    { shape: 'S', color: 'g', number: 1 }, { shape: 'S', color: 'g', number: 2 }, { shape: 'S', color: 'g', number: 3 },
    { shape: 'S', color: 'p', number: 1 }, { shape: 'S', color: 'p', number: 2 }, { shape: 'S', color: 'p', number: 3 },

    { shape: 'P', color: 'r', number: 1 }, { shape: 'P', color: 'r', number: 2 }, { shape: 'P', color: 'r', number: 3 },
    { shape: 'P', color: 'g', number: 1 }, { shape: 'P', color: 'g', number: 2 }, { shape: 'P', color: 'g', number: 3 },
    { shape: 'P', color: 'p', number: 1 }, { shape: 'P', color: 'p', number: 2 }, { shape: 'P', color: 'p', number: 3 }
];


function delegate(parent, type, selector, handler) {
    parent.addEventListener(type, function (event) {
        const targetElement = event.target.closest(selector);

        if(this.contains(targetElement)) {
            handler.call(targetElement, event);
        }
    })
}

function handleClick(event) {
    let element = event.target;
    let ind = 0;
    if((element.classList.contains("card") || element.classList.contains("help")) && SELECTED) {
        if(element.classList.contains("help")) {
            element.classList.remove("help");
        }
        if(element.classList.contains("choosen")) {
            element.classList.remove("choosen");
            ind = choosen.indexOf(element.id);
            choosen.splice(ind, 1);
        }
        else {
            choosen.push(element.id);
            element.classList.add("choosen");
            if(choosen.length == 3) {
                choosen.sort(function(a, b){return a - b});
                if(isSet(choosen[0], choosen[1], choosen[2])) {
                    if((max - shown) > 3) {
                       board[choosen[0]] = deck[shown + 1]; 
                       board[choosen[1]] = deck[shown + 2];
                       board[choosen[2]] = deck[shown + 3];
                       shown += 3;
                    }
                    else {
                        if((max - shown) == 3) {
                            shown += 3;
                        }
                        board[choosen[0]] = null;
                        board[choosen[1]] = null;
                        board[choosen[2]] = null;
                    }
                    alert("SET!");
                    succeed = 1;
                    choosen = [];
                    renderTable();
                }
                else {
                    document.getElementById(choosen[0]).classList.remove("choosen");
                    document.getElementById(choosen[1]).classList.remove("choosen");
                    document.getElementById(choosen[2]).classList.remove("choosen");
                    succeed = -1;
                    choosen = [];
                    alert("Nem SET!");
                }
            }
        }
    }
}

delegate(table, 'click', 'img', handleClick);

function shuffle() {
    deck.sort(() => Math.random() - 0.5);
}

function getSVG(index) {
    if(board[index] == null) {
        return '<img id="' + index + '" class="nocard" src="cards/nocard.svg">';
    }
    else {
        return '<img id="' + index + '" class="card" src="cards/' + board[index].number + 'S' + board[index].color + board[index].shape + '.svg">';
    }
}

function renderTable() {
    table.innerHTML = "";
    if(ACTIVEGAME) {
        for(let i = 0; i < board.length; i += 3) {
            table.innerHTML += '<tr><td>' + getSVG(i) + '</td><td>' + getSVG(i + 1) + '</td><td>' + getSVG(i + 2) + '</td></tr>';
        }

        if(max - shown < 3 && !findSet()) { //GAME OVER
            SELECTED = false;
            ACTIVEGAME = false;
            if(numberOfPlayers > 1) {
                playerslist[currentID].points += 1;
                document.getElementById("point" + currentID).innerHTML = playerslist[currentID].points;
                document.getElementById("player" + currentID).classList.remove("selectedButton");
                document.getElementById("player" + currentID).innerHTML = playerslist[currentID].name;
                playerslist.sort((a, b) => (a.points < b.points) ? 1 : -1);
                alert('VÉGE\n\nElső: ' + playerslist[0].name + '\nMásodik: ' + playerslist[1].name + '\nHarmadik: ' + playerslist[2].name);
            } else {
                alert("VÉGE!");
            }
        }
        else if(!findSet() && autoadd) {
            newLine();
        }
        document.getElementById("remain").innerHTML = '<br><a>Pakliban maradt kártyák száma: ' + (max-shown) + '</a>'
        document.getElementById("remain").innerHTML += '<br><button class="startButton" onclick="reset()">FŐOLDAL</button>';
    }
    else {
        for(let i = 0; i < 4; i ++) {
            table.innerHTML += '<tr><td><img src="cards/back.png" style="width: 120px; border: 5px solid #ffffff00;"></td><td><img src="cards/back.png" style="width: 120px; border: 5px solid #ffffff00;"></td><td><img src="cards/back.png" style="width: 120px; border: 5px solid #ffffff00;"></td></tr>';
        }
    }
}

function reset() {
    location.reload();
}

function timer() {
    setInterval(function(){ 
        if(ACTIVEGAME) {
            if(numberOfPlayers == 1) {
                if(!practice) {
                    document.getElementById("elapsedtime").innerHTML = 'Eltelt idő: ' + (++time) + 'mp';
                }
            }
            else if(SELECTED) {
                ++time;
                if(time == 11 || succeed == -1) {
                    if(time == 11) {
                        alert("Lejárt az idő!");
                    }
                    SELECTED = false;
                    playerslist[currentID].points -= 1;
                    document.getElementById("point" + currentID).innerHTML = playerslist[currentID].points;
                    document.getElementById("player" + currentID).classList.remove("selectedButton");
                    document.getElementById("player" + currentID).classList.add("myButtonInactive");
                    document.getElementById("player" + currentID).innerHTML = playerslist[currentID].name;
                    banlist.push(currentID);
                    succeed = 0;

                    if(banlist.length == numberOfPlayers) {
                        for(let i = 0; i < banlist.length; i++) {
                            document.getElementById("player" + banlist[i]).classList.remove("myButtonInactive");
                        }
                        banlist = [];
                    }
                }
                else if(succeed) {
                    SELECTED = false;
                    playerslist[currentID].points += 1;
                    document.getElementById("point" + currentID).innerHTML = playerslist[currentID].points;
                    document.getElementById("player" + currentID).classList.remove("selectedButton");
                    document.getElementById("player" + currentID).innerHTML = playerslist[currentID].name;
                    succeed = 0;
                    for(let i = 0; i < banlist.length; i++) {
                        document.getElementById("player" + banlist[i]).classList.remove("myButtonInactive");
                    }
                    banlist = [];
                }
                else {
                    document.getElementById("player" + currentID).innerHTML = playerslist[currentID].name + ' [' + (10 - time) + ']';
                }
            }
        }
    }, 1000);    
}

function startGame() {
    for(let i = 0; i < numberOfPlayers; i++) {
        let _name = document.getElementById('p' + i).value;
        let _player = { name: _name, points: 0 };
        playerslist.push(_player);
    }

    ACTIVEGAME = true;
    document.getElementById("settings").classList.add("hidden");
    document.getElementById("activegame").classList.remove("hidden");
    document.getElementById("activegame").innerHTML = "";
    newTable();
    
    if(numberOfPlayers == 1) {
        SELECTED = true;
        if(!practice) {
            document.getElementById("activegame").innerHTML += '<a>' + playerslist[0].name + '</a><br><a id="elapsedtime">Eltelt idő: 0mp</a>';
        } else {
            document.getElementById("activegame").innerHTML += '<a>' + playerslist[0].name + '</a>';
        }
    }
    else {
        for(let i = 0; i < numberOfPlayers; i++) {
            if(i % 3 == 0 && i != 0) {
                document.getElementById("activegame").innerHTML += '<br><br>';
            }
            document.getElementById("activegame").innerHTML += '<button class="myButton" onclick="playerSelect(' + i + ')" id="' + ('player' + i) + '" name="players">' + playerslist[i].name + '</button><a>: </a><a id="' + ('point' + i) + '">0</a><a> pont   </a>';
        }
    }
    document.getElementById("activegame").innerHTML += '<br><br>';
    if(!autoadd) {
        document.getElementById("activegame").innerHTML += '<button class="helpButton" onclick="newLine()">+3 LAP</button>';
    }
    if(helpexist) {
        document.getElementById("activegame").innerHTML += '<button class="helpButton" onclick="helpSetExist()">VAN SET?</button>';
    }
    if(helpshowset) {
        document.getElementById("activegame").innerHTML += '<button class="helpButton" onclick="showSet()">HOL A SET?</button>';
    }
    time = 0;
    timer();
}

function playerSelect(n) {
    let isBanned = false;
    if(!SELECTED && ACTIVEGAME) {
        for(let i = 0; i < banlist.length; i++) {
            if(n == banlist[i]) {
                isBanned = true;
                break;
            }
        }
        if(!isBanned) {
            SELECTED = true;
            document.getElementById("player" + n).classList.add("selectedButton");
            document.getElementById("player" + n).innerHTML = playerslist[n].name + ' [' + 10 + ']'
            currentID = n;
            time = 0;
        }
    }
}

function newTable() {
    shuffle();
    console.log(deck);
    board = [];
    shown = 0;
    for(let i = 0; i < lines; i++) {
        board.push(deck[shown], deck[shown + 1], deck[shown + 2]);
        shown += 3;
    }
    renderTable();
}

function newLine() {
    if(shown < max) {
        ++lines;
        board.push(deck[shown], deck[shown + 1], deck[shown + 2]);
        shown += 3;
        renderTable();
    }   
}

function isSet(i, j, k) {
    if(board[i] != null && board[j] != null && board[k] != null) {
        /* Compare by same color */
        if(board[i].color == board[j].color && board[j].color == board[k].color) {
            return true;
        }
        /* Compare by same number */
        else if(board[i].number == board[j].number && board[j].number == board[k].number) {
            return true;
        }
        /* Compare by same shape */
        else if(board[i].shape == board[j].shape && board[j].shape == board[k].shape) {
            return true;
        }
        /* Compare by difference */
        else if(board[i].shape != board[j].shape && board[i].shape != board[k].shape && board[k].shape != board[j].shape && board[i].color != board[j].color && board[i].color != board[k].color && board[k].color != board[j].color) {
            return true;
        }
        else {
            return false;
        }
    }
}

function findSet() {
    let found = false;
    mainloop:
    for(let i = 0; i < board.length; i++) {
        for(let j = 1; j < board.length; j++) {
            for(let k = 2; k < board.length; k++) {
                if(i != j && j != k && k != i && isSet(i, j, k)) {
                    if(pointaset) {
                        document.getElementById(i).classList.add("help");
                        document.getElementById(j).classList.add("help");
                        document.getElementById(k).classList.add("help");
                        pointaset = false;
                    }
                    found = true;
                    break mainloop;
                }
            }
        }
    }
    return found;
}

function changeMode() {
    practice = !practice;
    if(practice) {
        document.getElementById("changemode").innerHTML = "GYAKORLÓ";

        document.getElementById("setexist").classList.remove("myButtonInactive");
        document.getElementById("setexist").classList.add("myButton");

        document.getElementById("showset").classList.remove("myButtonInactive");
        document.getElementById("showset").classList.add("myButton");

        document.getElementById("autoadd").classList.remove("myButtonInactive");
        document.getElementById("autoadd").classList.add("myButton");
    }
    else {
        document.getElementById("changemode").innerHTML = "VERSENY";

        document.getElementById("setexist").classList.remove("myButton");
        document.getElementById("setexist").classList.add("myButtonInactive");

        document.getElementById("showset").classList.remove("myButton");
        document.getElementById("showset").classList.add("myButtonInactive");

        document.getElementById("autoadd").classList.remove("myButton");
        document.getElementById("autoadd").classList.add("myButtonInactive");
        if(helpexist) {
            helpexist = false;
            document.getElementById("setexist").innerHTML = "NEM";
        }
        if(helpshowset) {
            helpshowset = false;
            document.getElementById("showset").innerHTML = "NEM";
        }
        if(!autoadd) {
            autoadd = true;
            document.getElementById("autoadd").innerHTML = "IGEN";
        }
    }
}

function setHelpExist() {
    if(practice) {
        helpexist = !helpexist;
        if(helpexist) {
            document.getElementById("setexist").innerHTML = "IGEN";
        } else {
            document.getElementById("setexist").innerHTML = "NEM";
        }
    }
}

function setShowExist() {
    if(practice) {
        helpshowset = !helpshowset;
        if(helpshowset) {
            document.getElementById("showset").innerHTML = "IGEN";
        } else {
            document.getElementById("showset").innerHTML = "NEM";
        }
    }
}

function setAutoAdd() {
    if(practice) {
        autoadd = !autoadd;
        if(autoadd) {
            document.getElementById("autoadd").innerHTML = "IGEN";
        } else {
            document.getElementById("autoadd").innerHTML = "NEM";
        }
    }
}

function helpSetExist() {
    if(findSet()) {
        alert("Van SET az asztalon.");
    }
    else {
        alert("Nincs SET az asztalon.");
    }
}

function showSet() {
    pointaset = true;
    findSet();
}

document.getElementById("playernum").addEventListener('mousemove',(e)=>{
    const place = document.getElementById("players");
    place.innerHTML = "";
    document.getElementById("range").innerHTML = " " + e.target.value;
    for(let i = 0; i < e.target.value; i++) {
        place.innerHTML += '<input id="p' + i + '" type="text" value="Játékos' + (i + 1) + '">'
    }
    numberOfPlayers = e.target.value;
});

renderTable();