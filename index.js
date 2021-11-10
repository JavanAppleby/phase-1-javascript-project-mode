let monsterArray
const monsterDetails = {}
const baseUrl = "https://www.dnd5eapi.co/api/"

document.getElementById("challengeRatings").addEventListener('change', function(event) {
    event.preventDefault();
    let cr = document.getElementById("challengeRatings").value;
    getMonsterWithCr(cr);
})

function getMonsterWithCr (cr) {
    let monsterUrl = `${baseUrl}/monsters?challenge_rating=${cr}`
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

const generateMonsterListItem = (monsterName) => {
    const listItem = document.createElement('li')
    listItem.className = "monster-listByCr"
    
    const alphabet = monsterDetails[monster.name].charAt(0);
    console.log(alphabet)
    listItem.innerHTML = `
    <h4>CR ${cr} Monsters</h4>
        <h5>${alphabet}</h5>
    `
    return listItem
}