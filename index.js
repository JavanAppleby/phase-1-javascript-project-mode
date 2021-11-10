let monsterArray
const monsterDetails = {}
const baseUrl = "https://www.dnd5eapi.co"

document.getElementById("challengeRatings").addEventListener('change', function(event) {
    event.preventDefault();
    let cr = document.getElementById("challengeRatings").value;
    getMonsterWithCr(cr);
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
    document.querySelector('section.monster-list ul').append(listItem)
}

const generateMonsterListItem = (monster) => {
    const listItem = document.createElement('li')
    listItem.className = "monster-listAlphabetical"
    
    let cr = document.getElementById("challengeRatings").value
    document.getElementById('crResults').innerHTML = `CR ${cr} Monsters`

    listItem.innerHTML = `

        <li class="monsterList">${monster.name}</li><br>
    `
    return listItem
}