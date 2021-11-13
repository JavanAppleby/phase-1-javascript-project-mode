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
    
    const buildCard = () => {
        document.querySelector('section.monster-list form').innerHTML += `
            <div class="crResults">
                <span>
                    <input type="radio" name="monsterCard" class="crResults" id="${baseUrl}${monster.url}" value="${monster.name}">
                    <label for="${baseUrl}${monster.url}" id="${monster.name}" class="crResults">${monster.name}</label>
                </span><br>
            </div>
        `
    }
    buildCard().remove = "undefined"
}

const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
      const modal = document.querySelector(button.dataset.modalTarget)
      openModal(modal)
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
    let selected = document.querySelector('input[type="radio"][name="monsterCard]:checked');
    let statBlock = document.querySelector('h2.modal-header');
    
    statBlock.innerText = selected.parentElement.textContent;
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}