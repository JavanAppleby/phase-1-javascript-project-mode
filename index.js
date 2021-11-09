let monsterArray
const monsterDetails = {}
const baseUrl = "https://www.dnd5eapi.co/api/"

document.getElementById("challengeRating").addEventListener('click', function() {
    event.preventDefault();
    let cr = document.getElementById("challengeRatings").value;
    let monsterUrl = `${baseUrl}/monsters?challenge_rating=${cr}`
    
    const fetchMonsters = async () => {
        const response = await fetch(`${monsterUrl}`);
        const monsterData = await response.json();
        return monsterData;
    }
    
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
        
        const alphabet = monsterDetails[monster.name].charAt(0);
        card.innerHTML = `
        <h4>CR ${cr} Monsters</h4>
        `
        return card
    }
    
    mapMonsterData();
})