let monsterArray;
const monsterDetails = {};
const baseUrl = "https://www.dnd5eapi.co";
const monsterStatDetails = {};

document
  .getElementById("challengeRatings")
  .addEventListener("change", function (event) {
    event.preventDefault();
    let cr = document.getElementById("challengeRatings").value;
    getMonsterWithCr(cr);
    function resetItemList(className) {
      let elements = document.getElementsByClassName("crResults");
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    }
    resetItemList();
  });

function getMonsterWithCr(cr) {
  let monsterUrl = `${baseUrl}/api/monsters?challenge_rating=${cr}`;
  mapMonsterData(monsterUrl);
}

const fetchMonsters = async (monsterUrl) => {
  const response = await fetch(`${monsterUrl}`);
  const monsterData = await response.json();
  return monsterData;
};

const mapMonsterData = async (monsterUrl) => {
  const data = await fetchMonsters(monsterUrl);
  data.results.forEach((monster) => {
    if (!monsterDetails[monster.name]) {
      fetchMonsterDetails(monster);
    }
  });
};

const fetchMonsterDetails = async (monster) => {
  const monsterListUrl = `${baseUrl}${monster.url}`;
  const response = await fetch(monsterListUrl);
  const data = await response.json();
  monsterDetails[monster.name] = data;
  const listItem = generateMonsterListItem(monsterDetails[monster.name]);
  document.querySelector("section.monster-list form").append(listItem);
};

const generateMonsterListItem = (data) => {
  document.querySelector('div#monster-list-container').classList.remove("hidden")
  document.querySelector('div#monster-list-container').classList.add("unhidden")
  let cr = document.getElementById("challengeRatings").value;
  if (cr === "0.125") {
    crText = "1/8";
  } else if (cr === "0.25") {
    crText = "1/4";
  } else if (cr === "0.5") {
    crText = "1/2";
  } else crText = cr;

  document.getElementById("crResults").innerHTML = `
  CR ${crText} Monsters
  `;
  buildCard(data); //.removeChild("undefined ");
};

const buildCard = (monster) => {
  let crList = `<div class="crResults">
    <span>
        <input type="radio" name="monsterCard" class="crResults" data-url="${baseUrl}${monster.url}/" id="${monster.name}" value="${monster.name}">
        <label for="${baseUrl}${monster.url}" id="${monster.name}" class="crResults">${monster.name}</label>
    </span><br>
</div>`;
  document.querySelector("section.monster-list form").innerHTML += `${crList}`;
  document.querySelector("section.monster-list form").removeChild(node);
};

const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
  let selected = document.querySelector(
    'input[type="radio"][class="crResults"]:checked'
  ).value;
  let statBlock = document.querySelector("div.modal");
  //   document.createTextNode(selected);
  //   statBlock.innerHTML = "";

  renderStatBlock(statBlock);
}

const renderStatBlock = (statBlock) => {
  let statUrl = document.querySelector(
    'input[type="radio"][class="crResults"]:checked'
  ).dataset.url;
  fetchStats(statUrl).then((res) => statBlock.append(renderStats(res)));
};

const renderStats = (stat) => {
  const monsterCard = document.createElement("div");
  monsterCard.className = "monster-card";
  monsterCard.dataset["name"] = stat.name;
  monsterCard.dataset["size"] = stat.size;
  monsterCard.dataset["type"] = stat.type;
  monsterCard.dataset["subtype"] = stat.subtype;
  monsterCard.dataset["alignment"] - stat.alignment;
  monsterCard.dataset["armor_class"] = stat.armor_class;
  monsterCard.dataset["hit_points"] = stat.hit_points;
  monsterCard.dataset["hit_dice"] = stat.hit_dice;
  monsterCard.dataset["speed"] = stat.speed;
  monsterCard.dataset["strength"] = stat.strength;
  monsterCard.dataset["dexterity"] = stat.dexterity;
  monsterCard.dataset["constitution"] = stat.constitution;
  monsterCard.dataset["intelligence"] = stat.intelligence;
  monsterCard.dataset["wisdom"] = stat.wisdom;
  monsterCard.dataset["charisma"] = stat.charisma;

  function resetStatBlock(className) {
    let elements = document.getElementsByClassName("monster-card");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }
  resetStatBlock()

  let statType = stat.type.charAt(0).toUpperCase() + stat.type.slice(1);
  let statSize = stat.size.charAt(0).toUpperCase() + stat.size.slice(1);

  let statSubType = stat.subtype;
  if (statSubType !== null) {
    statSubType = stat.subtype.charAt(0).toUpperCase() + stat.subtype.slice(1);
  }

  let monsterType = `${statSize} ${statType} (${statSubType}) , ${stat.alignment}`;

  let strMod = Math.floor((stat.strength - 10) / 2);
  if (strMod > 0) {
    strMod = `+${strMod}`;
  }
  strMod = `${strMod}`;
  let dexMod = Math.floor((stat.dexterity - 10) / 2);
  if (dexMod > 0) {
    dexMod = `+${dexMod}`;
  }
  dexMod = `${dexMod}`;
  let conMod = Math.floor((stat.constitution - 10) / 2);
  if (conMod > 0) {
    conMod = `+${conMod}`;
  }
  conMod = `${conMod}`;
  let intMod = Math.floor((stat.intelligence - 10) / 2);
  if (intMod > 0) {
    intMod = `+${intMod}`;
  }
  intMod = `${intMod}`;
  let wisMod = Math.floor((stat.wisdom - 10) / 2);
  if (wisMod > 0) {
    wisMod = `+${wisMod}`;
  }
  wisMod = `${wisMod}`;
  let chaMod = Math.floor((stat.charisma - 10) / 2);
  if (chaMod > 0) {
    chaMod = `+${chaMod}`;
  }
  chaMod = `${chaMod}`;

  let speeds = Object.entries(stat.speed).join(", ").replaceAll(",", " ");

  monsterCard.innerHTML = `
<div class="stats-base">
  <span class="statName">${stat.name}</span>
</div>
<div class="type-label">
  <p>${monsterType}</p>
</div>
<br>
<div class="stats-attr">
  <span class="attr-label">Armor Class: </span>
  <span class="attr-value">${stat.armor_class} </span>
</div>
<div class="stats-attr">
  <span class="attr-label">Hit Points: </span>
  <span class="attr-data">
      <span class="attr-value">${stat.hit_points}</span>
      <span class="attr-extra">(${stat.hit_dice})</span>
  </span>
</div>
<div class="stats-attr">
  <span class="attr-label">Speed: </span>
  <span class="attr-data">
      <span class="attr-value">${speeds}</span>
  </span>
</div>
<br>
<div class="abilities">
<div class="ability-block">
  <span class="ability-label">STR </span>
  <span class="ability-data">
      <span class="ability-value">${stat.strength}</span>
      <span class="ability-extra">(${strMod})</span>
  </span>
</div>
<div class="ability-block">
  <span class="ability-label">DEX </span>
  <span class="ability-data">
      <span class="ability-value">${stat.dexterity}</span>
      <span class="ability-extra">(${dexMod})</span>
  </span>
</div>
<div class="ability-block">
  <span class="ability-label">CON </span>
  <span class="ability-data">
      <span class="ability-value">${stat.constitution}</span>
      <span class="ability-extra">(${conMod})</span>
  </span>
</div>
<div class="ability-block">
  <span class="ability-label">INT </span>
  <span class="ability-data">
      <span class="ability-value">${stat.intelligence}</span>
      <span class="ability-extra">(${intMod})</span>
  </span>
</div>
<div class="ability-block">
  <span class="ability-label">WIS </span>
  <span class="ability-data">
      <span class="ability-value">${stat.wisdom}</span>
      <span class="ability-extra">(${wisMod})</span>
  </span>
</div>
<div class="ability-block">
  <span class="ability-label">CHA </span>
  <span class="ability-data">
      <span class="ability-value">${stat.charisma}</span>
      <span class="ability-extra">(${chaMod})</span>
  </span>
</div>
</div>
    `;
  card = document.querySelector("div.modal").appendChild(monsterCard);
  card.removeChild(node);
};

const fetchStats = async (statUrl) => {
  const response = await fetch(`${statUrl}`);
  const statData = await response.json();
  return statData;
};
