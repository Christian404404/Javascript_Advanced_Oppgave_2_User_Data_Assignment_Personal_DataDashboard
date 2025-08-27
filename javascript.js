const form = document.querySelector("#serier-form");
const list = document.querySelector("#serier-liste");

const tittelInn = document.getElementById("tittel");
const statusInn = document.getElementById("status");
const sjangerInn = document.getElementById("sjanger");
const episoderInn = parseInt(document.getElementById("episoder"));

let serierData = [];

function lagreTilLocalStorage() {
  localStorage.setItem("serierData", JSON.stringify(serierData));
  console.log("Data lagret til localStorage", serierData);
}

function hentFraLocalStorage() {
  const lagretLokalt = localStorage.getItem("serierData");
  if (lagretLokalt) {
    serierData = JSON.parse(lagretLokalt);
    visSerier();
  }
}

function slettSerier(id) {
  serierData = serierData.filter((serierID) => serierID.id !== id);
  lagreTilLocalStorage();
  visSerier();
}

function endreMenyValg(feltTekst, verdi, valgListe, lagre) {
  const beholder = document.createElement("div");

  const felt = document.createElement("label");
  felt.textContent = feltTekst;

  const velg = document.createElement("select");
  velg.disabled = true;

  valgListe.forEach((opt) => {
    const menyValg = document.createElement("option");
    menyValg.value = opt;
    menyValg.textContent = opt;
    if (opt === verdi) menyValg.selected = true;
    velg.appendChild(menyValg);
  });

  const redigerKnapp = document.createElement("button");
  redigerKnapp.textContent = "Rediger";
  redigerKnapp.classList.add("rediger-knapp");

  redigerKnapp.addEventListener("click", () => {
    if (velg.disabled) {
      velg.disabled = false;
      redigerKnapp.textContent = "Lagre";
    } else {
      velg.disabled = true;
      redigerKnapp.textContent = "Rediger";
      lagre(velg.value);
      lagreTilLocalStorage(); // Assumes this is defined in your script
    }
  });

  beholder.append(felt, velg, redigerKnapp);
  return beholder;
}

function redigerFelt(feltText, verdi, lagre) {
  const beholder = document.createElement("div");

  const felt = document.createElement("label");
  felt.textContent = feltText;

  const innData = document.createElement("input");
  innData.value = verdi;
  innData.readOnly = true;

  const redigerKnapp = document.createElement("button");
  redigerKnapp.textContent = "Rediger";
  redigerKnapp.classList.add("rediger-knapp");

  redigerKnapp.addEventListener("click", () => {
    if (innData.readOnly) {
      innData.readOnly = false;
      redigerKnapp.textContent = "Lagre";
    } else {
      innData.readOnly = true;
      redigerKnapp.textContent = "Rediger";
      lagre(innData.value);
      lagreTilLocalStorage();
    }
  });
  beholder.append(felt, innData, redigerKnapp);
  return beholder;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const tittel = document.getElementById("tittel").value;
  const status = document.getElementById("status").value;
  const sjanger = document.getElementById("sjanger").value;
  const episoder = parseInt(document.getElementById("episoder").value || 0);

  const serier = {
    id: Date.now(),
    tittel,
    status,
    sjanger,
    episoder,
  };

  serierData.push(serier);
  lagreTilLocalStorage();
  visSerier();
  form.reset();
});

function visSerier() {
  list.replaceChildren();

  serierData.forEach((s) => {
    const div = document.createElement("div");
    div.className = "serier-kort";

    const tittelFelt = redigerFelt(
      "Tittel",
      s.tittel,
      (val) => (s.tittel = val)
    );
    const statusFelt = endreMenyValg(
      "Status",
      s.status,
      ["Planlegges å se", "Følger med på nå", "Sett ferdig"],
      (val) => (s.status = val)
    );
    const episoderFelt = redigerFelt("Episoder", s.episoder, (val) => {
      s.episoder = parseInt(val) || 0;
    });
    const sjangerFelt = endreMenyValg(
      "Sjanger",
      s.sjanger || "",
      ["Drama", "Komedie", "Krim", "Fantasy", "Dokumentar", "Annet"],
      (val) => (s.sjanger = val)
    );

    // Delete button
    const slettKnapp = document.createElement("button");
    slettKnapp.textContent = "Slett serie";
    slettKnapp.classList.add("slett-knapp");
    slettKnapp.addEventListener("click", () => slettSerier(s.id));

    div.append(tittelFelt, statusFelt, episoderFelt, sjangerFelt, slettKnapp);
    list.appendChild(div);
  });
}

hentFraLocalStorage();
