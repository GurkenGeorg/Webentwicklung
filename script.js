let aktuellesLevel = 1;
let leben = 3;
let highscore = 0;
let spielername = '';
const antworten = { 1: 'birne', 2: 'kern', 3: 'gefühle' };

window.onload = () => {
  const saved = JSON.parse(localStorage.getItem('spielstand'));
  if (saved) {
    highscore = saved.highscore || 0;
    document.getElementById('highscore').textContent = `Highscore: ${highscore}`;
  }
};

function spielStarten(neu) {
  spielername = document.getElementById('spielername').value || 'Spieler';
  if (!neu) {
    const saved = JSON.parse(localStorage.getItem('spielstand'));
    if (saved) {
      aktuellesLevel = saved.level;
      leben = saved.leben;
      highscore = saved.highscore || 0;
    }
  } else {
    aktuellesLevel = 1;
    leben = 3;
  }

  document.getElementById('startseite').style.display = 'none';
  document.querySelector('.zurueck-button').style.display = 'block';
  zeigeLevel(aktuellesLevel);
}

function zeigeLevel(level) {
  document.querySelectorAll('.spielbereich').forEach(b => b.style.display = 'none');
  const levelDiv = document.getElementById(`spielbereich${level}`);
  levelDiv.style.display = 'block';

  document.getElementById(`spieler${level}`).textContent = `Spieler: ${spielername}`;
  document.getElementById(`leben${level}`).innerHTML = '💙'.repeat(leben);

  const feldContainer = document.getElementById(`eingabefelder${level}`);
  feldContainer.innerHTML = '';
  for (let i = 0; i < antworten[level].length; i++) {
    const input = document.createElement('input');
    input.maxLength = 1;
    input.className = 'buchstabe';
    input.addEventListener('input', () => {
      if (input.value.length === 1 && input.nextElementSibling) {
        input.nextElementSibling.focus();
      }
    });
    feldContainer.appendChild(input);
  }

  document.getElementById(`ergebnis${level}`).textContent = '';
}

function checkAntwort(level) {
  const inputs = [...document.querySelectorAll(`#eingabefelder${level} .buchstabe`)];
  const antwort = inputs.map(i => i.value).join('').toLowerCase();

  const korrekt = antwort === antworten[level];
  const ergebnis = document.getElementById(`ergebnis${level}`);

  if (korrekt) {
    highscore += 10;
    ergebnis.textContent = 'Richtig!';
    ergebnis.style.color = 'green';
    speichereSpielstand();
  } else {
    leben--;
    ergebnis.textContent = 'Falsch!';
    ergebnis.style.color = 'red';
    document.getElementById(`leben${level}`).innerHTML = '💙'.repeat(leben);
    if (leben <= 0) {
      alert('Game Over');
      speichereSpieler(); // Spieler speichern bei Game Over
      zurueckZurStartseite();
    }
  }
}

function eingabeLöschen(level) {
  const inputs = document.querySelectorAll(`#eingabefelder${level} .buchstabe`);
  inputs.forEach(input => input.value = '');
  inputs[0]?.focus();
}

function naechstesLevel() {
  if (aktuellesLevel < 3) {
    aktuellesLevel++;
    zeigeLevel(aktuellesLevel);
  } else {
    alert(`Glückwunsch, ${spielername}! Spiel beendet.`);
    speichereSpieler(); // Spieler speichern nach letztem Level
    zurueckZurStartseite();
  }
  speichereSpielstand();
}

function zurueckZurStartseite() {
  document.querySelectorAll('.spielbereich').forEach(b => b.style.display = 'none');
  document.getElementById('startseite').style.display = 'block';
  document.querySelector('.zurueck-button').style.display = 'none';
  speichereSpielstand();
}

function speichereSpielstand() {
  const stand = { level: aktuellesLevel, leben, highscore };
  localStorage.setItem('spielstand', JSON.stringify(stand));
  document.getElementById('highscore').textContent = `Highscore: ${highscore}`;
}

function highscoreZurücksetzen() {
  if (confirm('Willst du den Highscore wirklich löschen?')) {
    highscore = 0;
    localStorage.removeItem('spielstand');
    document.getElementById('highscore').textContent = 'Highscore: 0';
  }
}

function speichereSpieler() {
  let spieler = {
    name: spielername,
    highscore,
    datum: new Date().toLocaleDateString('de-DE')
  };
  let alleSpieler = JSON.parse(localStorage.getItem('spielerHistorie')) || [];
  alleSpieler.push(spieler);
  localStorage.setItem('spielerHistorie', JSON.stringify(alleSpieler));
}

function zeigeSpielerHistorie() {
  const liste = document.getElementById('spielerliste-container');
  liste.innerHTML = '';
  const spieler = JSON.parse(localStorage.getItem('spielerHistorie')) || [];

  spieler.forEach((s, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${s.name}</strong> - ${s.highscore} Punkte am ${s.datum}
      <button onclick="loescheSpieler(${index})">Löschen</button>
    `;
    liste.appendChild(li);
  });

  document.getElementById('spielerliste').style.display = 'block';
}

function loescheSpieler(index) {
  let spieler = JSON.parse(localStorage.getItem('spielerHistorie')) || [];
  spieler.splice(index, 1);
  localStorage.setItem('spielerHistorie', JSON.stringify(spieler));
  zeigeSpielerHistorie(); // aktualisieren
}
