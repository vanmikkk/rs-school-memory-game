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

let mismatchTimeout

let moves = 0;
let pairs = 0;

let activeModal = null

let main_moves = document.createElement('h3')
let main_pairs = document.createElement('h3')

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
    buttonNewGame.addEventListener('click', newGame)
    buttonLeaderBoard.textContent = 'Leaderboard'
    buttonLeaderBoard.addEventListener('click', createLeaderboardModal)

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

    let main_header = document.createElement('div')
    main_header.classList.add('main_header')

    main_moves.textContent = "Moves: 0"

    main_pairs.textContent = "Pairs: 0/8"

    main_header.appendChild(main_moves)
    main_header.appendChild(main_pairs)

    shuffle(cardsDoubles)

    for(let i = 0; i < 16; i++){
        main_inner.appendChild(createCard(cardsDoubles[i]))
    }

    container.appendChild(main_header)
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
        if(!card.classList.contains('open') && !lockBoard && !card.classList.contains('find')){
            card.classList.add('open')
            selectedCards.push(card)
            if (selectedCards.length === 2) {
                moves++
                main_moves.textContent = `Moves: ${moves}`
                lockBoard = true
                if(selectedCards[0].dataset.card === selectedCards[1].dataset.card){
                    pairs++
                    main_pairs.textContent = `Pairs: ${pairs}/8`
                    selectedCards[0].classList.add("find")
                    selectedCards[1].classList.add("find")
                    selectedCards.length = 0
                    lockBoard = false
                    if(pairs === 8){
                        saveResult()
                        setTimeout(() => {
                            createVictoryModal()
                        }, 300)
                    }
                } else {
                    mismatchTimeout = setTimeout(() => {
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

function createVictoryModal() {
    let modalData = createModal()

    if (!modalData) {
        return
    }

    let { modalContent, closeModal } = modalData

    let title = document.createElement('h2')
    title.textContent = 'Congratulations!'
    modalContent.appendChild(title)

    let result = document.createElement('p')
    result.textContent = `Moves: ${moves}`
    modalContent.appendChild(result)

    let closeButton = document.createElement('button')
    closeButton.textContent = 'Close'
    closeButton.addEventListener('click', closeModal)
    modalContent.appendChild(closeButton)

    let newButton = document.createElement('button')
    newButton.textContent = 'New game'
    newButton.addEventListener('click', () => {
        closeModal()
        newGame()
    })
    modalContent.appendChild(newButton)

}

function newGame() {
    clearTimeout(mismatchTimeout)
    mismatchTimeout = null

    moves = 0
    pairs = 0
    selectedCards.length = 0
    lockBoard = false

    let main = document.querySelector('main')
    main.replaceWith(createMain())
}

function saveResult() {
    let savedResults = localStorage.getItem('results')
    let results = savedResults ? JSON.parse(savedResults) : []

    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    day = String(day).padStart(2, '0')
    month = String(month).padStart(2, '0')
    let timestamp = date.getTime()

    let gameDate = `${day}.${month}.${year}`

    results.push({
        moves: moves,
        date: gameDate,
        timestamp: timestamp
    })

    results.sort((a, b) => {
        if (a.moves !== b.moves) {
            return a.moves - b.moves
        }

        return a.timestamp - b.timestamp
    })
    results = results.slice(0, 10)

    localStorage.setItem('results', JSON.stringify(results))
}

function createLeaderboardModal() {
    let modalData = createModal()

    if (!modalData) {
        return
    }

    let { modalContent, closeModal } = modalData

    let title = document.createElement('h2')
    title.textContent = 'Leaderboard'
    modalContent.appendChild(title)

    let savedResults = localStorage.getItem('results')
    let results = savedResults ? JSON.parse(savedResults) : []

    if (results.length === 0) {
        let emptyMessage = document.createElement('p')
        emptyMessage.textContent = 'No results yet'
        modalContent.appendChild(emptyMessage)
    } else {
        let list = document.createElement('ol')

        results.forEach((result) => {
            let item = document.createElement('li')
            item.textContent = `${result.moves} moves — ${result.date}`

            list.appendChild(item)
        })

        modalContent.appendChild(list)
    }

    let closeButton = document.createElement('button')
    closeButton.textContent = 'Close'
    closeButton.addEventListener('click', closeModal)

    modalContent.appendChild(closeButton)
    
}

function createModal() {
    if (activeModal) {
        return
    }

    let modal = document.createElement('div')
    modal.classList.add('modal')
    
    activeModal = modal

    let modalContent = document.createElement('div')
    modalContent.classList.add('modal_content')

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal()
        }
    })

    modal.appendChild(modalContent)
    body.prepend(modal)
    document.body.style.overflow = 'hidden'

    function closeModal() {
        modal.remove()
        activeModal = null
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleEscape)
    }

    function handleEscape(event) {
        if (event.key === 'Escape') {
            closeModal()
        }
    }

    document.addEventListener('keydown', handleEscape)

    return {
        modalContent,
        closeModal
    }
}



body.appendChild(createApp())