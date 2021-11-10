let monsterArray
const monsterDetails = {}
const baseUrl = "https://www.dnd5eapi.co"
const modal = document.querySelector('#monster-modal')

document.getElementById("challengeRatings").addEventListener('change', function(event) {
    event.preventDefault();
    let cr = document.getElementById("challengeRatings").value;
    getMonsterWithCr(cr);
    function resetItemList(className){
        let elements = document.getElementsByClassName('monsters-listed');
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
    document.querySelector('section.monster-list ul').append(listItem)
}

const generateMonsterListItem = (monster) => {
    const listItem = document.createElement('li')
    listItem.className = "monsters-listed"
    
    let cr = document.getElementById("challengeRatings").value;
    if (cr === '0.125') {
        crText = "1/8"
    } else if (cr === '0.25') {
        crText = "1/4"
    } else if (cr === '0.5') {
        crText = "1/2"
    } else crText = cr

    document.getElementById('crResults').innerHTML = `CR ${crText} Monsters`

    listItem.innerHTML = `

        <li class="monsterList">${monster.name}</li><br>
    `
    return listItem
}

const generateMonsterCard = (monster) => {
    const card = document.createElement('div')
    card.className = "monster-card"
    card.dataset['name'] = monster.name
    card.dataset['type'] = JSON.stringify(monster.type)

    card.innerHTML = `
        <h2 data-name="${monster.name} class="monsterName">${monster.name}</h2>
    `
    return card
}


document.querySelector('section.monster-list').addEventListener('click',event => {
    const element = event.target

    if (element.className.match('monsterList')) {
        modal.classList.toggle('hidden')

        document.querySelector('#monster-name').innerText = monsterDetails[element.dataset['name']].name
        document.querySelector('#monster-type').innerText = monsterDetails[element.dataset['name']].type
        document.querySelector('#monster-subType').innerText = monsterDetails[element.dataset['name']].subtype
        document.querySelector('#monster-size').innerText = monsterDetails[element.dataset['name']].size
        document.querySelector('#monster-armorClass').innerText = monsterDetails[element.dataset['name']].armor_class
        document.querySelector('#monster-hitDice').innerText = monsterDetails[element.dataset['name']].hit_dice
        document.querySelector('#monster-hitPoints').innerText = monsterDetails[element.dataset['name']].hit_points
        document.querySelector('#monster-speed').innerText = monsterDetails[element.dataset['name']].speed

        document.querySelector('#monster-scores').innerText = monsterDetails[element.dataset['name']].strength
        document.querySelector('#monster-scores').innerText = monsterDetails[element.dataset['name']].dexterity
        document.querySelector('#monster-scores').innerText = monsterDetails[element.dataset['name']].constitution
        document.querySelector('#monster-scores').innerText = monsterDetails[element.dataset['name']].intelligence
        document.querySelector('#monster-scores').innerText = monsterDetails[element.dataset['name']].wisdom
        document.querySelector('#monster-scores').innerText = monsterDetails[element.dataset['name']].charisma

        document.querySelector('#monster-prof').innerText = monsterDetails[element.dataset['name']].proficiencies.proficiency.name
        document.querySelector('#monster-dmgResist').innerText = monsterDetails[element.dataset['name']].damage_resistances
        document.querySelector('#monster-dmgVuln').innerText = monsterDetails[element.dataset['name']].damage_vulnerabilities
        document.querySelector('#monster-dmgImmune').innerText = monsterDetails[element.dataset['name']].damage_immunities
        document.querySelector('#monster-condImmune').innerText = monsterDetails[element.dataset['name']].condition_immunities

        const proficiencies = monsterDetails[element.dataset['name']].proficiencies.reduce((array, item) => {
            array.push(item.proficiencies.proficiency.name)
            return array
        }, [])
        document.querySelector('#monster-prof').innerText = proficiencies.join(', ')

        document.querySelector('#monster-senses').innerText = monsterDetails[element.dataset['name']].senses
        document.querySelector('#monster-languages').innerText = monsterDetails[element.dataset['name']].languages
        document.querySelector('#monster-xp').innerText = monsterDetails[element.dataset['name']].xp
    }
})

modal.addEventListener('click', event => {
    modal.classList.toggle('hidden')
})