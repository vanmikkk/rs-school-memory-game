const body = document.querySelector('body')

const cards = [
    'apple',
    'banana',
    'orange',
    'pineapple',
    'watermelon',
    'melon',
    'strawberry',
    'blueberry',
]

const cardsDoubles = cards.flatMap((card) => [card, card])

let selectedCards = []

let lockBoard = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]]
    }

    return array
}

function createApp(){
    let app = document.createElement('div')
    app.appendChild(createHeader())
    app.appendChild(createMain())
    app.appendChild(createFooter())
    app.classList.add("app")

    return app
}

function createHeader(){
    let header = document.createElement('header')
    let container = document.createElement('div')
    container.classList.add('container')

    let nav_links = document.createElement('div')
    nav_links.classList.add('nav_links')

    let buttonNewGame = document.createElement('button')
    let buttonLeaderBoard = document.createElement('button')
    buttonNewGame.textContent = 'New game'
    buttonLeaderBoard.textContent = 'Leaderboard'

    nav_links.appendChild(buttonNewGame)
    nav_links.appendChild(buttonLeaderBoard)

    container.appendChild(nav_links)
    
    header.appendChild(container)
    return header
}

function createMain(){
    let main = document.createElement('main')

    let container = document.createElement('div')
    container.classList.add('container')

    let main_inner = document.createElement('div')
    main_inner.classList.add('main_inner')

    shuffle(cardsDoubles)

    for(let i = 0; i < 16; i++){
        main_inner.appendChild(createCard(cardsDoubles[i]))
    }

    container.appendChild(main_inner)

    main.appendChild(container)

    return main
}

function createFooter(){
    let footer = document.createElement('footer')

    return footer
}

function createCard(cardValue){
    let card = document.createElement('div')
    card.classList.add('card')

    card.addEventListener('click', () => {
        if(!card.classList.contains('open') && !lockBoard){
            card.classList.add('open')
            selectedCards.push(card)
            if (selectedCards.length === 2) {
                lockBoard = true
                if(selectedCards[0].dataset.card === selectedCards[1].dataset.card){
                    console.log('Пара')
                    selectedCards.length = 0
                    lockBoard = false
                } else {
                    setTimeout(() => {
                        selectedCards[0].classList.remove('open')
                        selectedCards[1].classList.remove('open')
                        selectedCards.length = 0
                        lockBoard = false
                    }, 1000)
                }
            } 
        }
    })

    let card_front = document.createElement('div')
    card_front.classList.add('card_front')

    let card_back = document.createElement('div')
    card_back.classList.add('card_back')

    card_back.textContent = cardValue

    card.appendChild(card_front)
    card.appendChild(card_back)

    card.setAttribute("data-card", cardValue)
 
    return card

}

body.appendChild(createApp())