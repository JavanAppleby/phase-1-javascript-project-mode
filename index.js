let cr = 0.25
let baseUrl = `https://www.dnd5eapi.co`
var apiUrl = `${baseUrl}/api/monsters?challenge_rating=${cr}`
let monsterArray
const monsterDetails = {}

const fetchMonsters = async () => {
    const response = await fetch(apiUrl);
    const monsterData = await response.json();
    console.log(monsterData);
    return monsterData;
}

fetchMonsters();

const mapMonsterData = async () => {
    const data = await fetchMonsters();
    data => {
        monsterArray = data.results

        monsterArray.forEach(monster => {
            if (!monsterDetails[monster.name]) {
                fetchMonsterDetails(monster)
            }
        });
    }
}

const fetchMonsterDetails = monster => {
    return fetch(monster.url)
    .then(res => res.json())
    .then(data => {
        monsterDetails[monster.name] = data
        const card = generateMonsterCard(monsterDetails[monster.name])
            document.querySelector('section.monster-list').append(card)
    })
}

const generateMonsterCard = () => {
    const card = document.createElement('div')
    card.className = "monster-card"

    card.innerHTML = `
        <ul>
            <li>${cr} Monsters: ${monster.name}</li>
        </ul>
    `
    return card
}

mapMonsterData();