let monsterArray
const monsterDetails = {}
const baseUrl = "https://www.dnd5eapi.co"
const modal = document.querySelector('#monster-modal')

document.getElementById("challengeRatings").addEventListener('change', function(event) {
    event.preventDefault();
    let cr = document.getElementById("challengeRatings").value;
    getMonsterWithCr(cr);
    function resetItemList(className){
        let elements = document.getElementsByClassName('crResults');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }
    resetItemList();
})

function getMonsterWithCr (cr) {
    let monsterUrl = `${baseUrl}/api/monsters?challenge_rating=${cr}`
    mapMonsterData(monsterUrl);
}

const fetchMonsters = async (monsterUrl) => {
    const response = await fetch(`${monsterUrl}`);
    const monsterData = await response.json();
    return monsterData;
}

const mapMonsterData = async (monsterUrl) => {
    const data = await fetchMonsters(monsterUrl);
    data.results.forEach(monster => {
        if (!monsterDetails[monster.name]) {
            fetchMonsterDetails(monster)
        }
    });
}

const fetchMonsterDetails = async monster => {
    const monsterListUrl = `${baseUrl}${monster.url}`
    const response = await fetch(monsterListUrl)
    const data = await response.json()
    monsterDetails[monster.name] = data
    const listItem = generateMonsterListItem(monsterDetails[monster.name])
    document.querySelector('section.monster-list form').append(listItem)
}

const generateMonsterListItem = (monster) => {

    let cr = document.getElementById("challengeRatings").value;
    if (cr === '0.125') {
        crText = "1/8"
    } else if (cr === '0.25') {
        crText = "1/4"
    } else if (cr === '0.5') {
        crText = "1/2"
    } else crText = cr

    document.getElementById('crResults').innerHTML = `CR ${crText} Monsters`;

    const radio = document.createElement('input');
        radio.setAttribute("type", "radio");
        radio.name = "monsterCard";
        radio.className = "crResults";
        radio.id = `${baseUrl}${monster.url}`;
        radio.value = `${monster.name}`;
    
    const label = document.createElement('label');
        label.setAttribute("for",`${baseUrl}${monster.url}`);
        label.innerHTML = `${monster.name}`;
        label.className = "crResults"
    document.querySelector('section.monster-list form').appendChild(label);

    return radio
}