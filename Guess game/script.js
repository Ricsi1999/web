let list = ["TOYOTA", "MAZDA", "NISSAN", "MITSUBISHI", "LEXUS", "SUZUKI", "INFINITI", "SUBARU", "HONDA"];
let winlist = [4, 4, 4, 7, 5, 5, 4, 5, 5];
let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; //26
let num;
let failcounter; //max 8
let correctcounter;

start();

function start() {
    num = parseInt(Math.random() * 9);

    document.getElementById('word').innerHTML = "";
    document.getElementById('buttons').innerHTML = "";
    document.getElementById('hearts').innerHTML = "Életek száma: 8"
    document.getElementById('buttons').classList.remove('hidden');
    document.getElementById('image').src = "pic/0.jpg";

    failcounter = 0;
    correctcounter = 0;

    for(let i = 0; i < list[num].length; i++) {
        document.getElementById('word').innerHTML += '<a id="' + i + '">_ </a>';
    }

    for(let i = 0; i < 26; i++) {
        document.getElementById('buttons').innerHTML += '<button id="' + alphabet[i] + '">' + alphabet[i] + '</button>';
    }
}

document.getElementById('buttons').addEventListener('click',(e)=>{
    check(e.target.id);
    document.getElementById(e.target.id).classList.add('hidden');
});

function check(id) {
    let correct = false;
    for(let i = 0; i <list[num].length; i++) {
        if(list[num].substring(i, i + 1) == id) {
            document.getElementById(i).innerHTML = id + ' ';
            correct = true;
        }
    }

    if(!correct) {
        document.getElementById('image').src = "pic/" + ++failcounter + ".jpg";
        document.getElementById('hearts').innerHTML = "Életek száma: " + (8 - failcounter);
        if(failcounter == 8) {
            document.getElementById('buttons').classList.add('hidden');
            alert("Game Over! The solution is: " + list[num]);
        }
    } else if (++correctcounter == winlist[num]) {
            document.getElementById('buttons').classList.add('hidden');
            alert("Congratulations!");
    }
}