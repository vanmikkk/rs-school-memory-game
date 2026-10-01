const body = document.querySelector('body')

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

    main_inner.appendChild(createCard())

    container.appendChild(main_inner)

    main.appendChild(container)

    return main
}

function createFooter(){
    let footer = document.createElement('footer')

    return footer
}

function createCard(){
    let card = document.createElement('div')
    card.classList.add('card')

    return card
}

body.appendChild(createApp())