import React from 'react';

import Card from './Card.js';

class MemoryGame extends React.Component {
  constructor() {
    super();
    this.state = {
      cards: {},
      flipped: '',
      count: 0,
      highScore: 0
    }
    this.flipCard = this.flipCard.bind(this);
    this.checkWinner = this.checkWinner.bind(this);
    this.updateCount = this.updateCount.bind(this);
    this.checkCard = this.checkCard.bind(this);
  }

  componentWillMount() {
    const localStorageRef = localStorage.getItem('highScore');
    if (localStorageRef) {
      this.setState({
        highScore: JSON.parse(localStorageRef)
      })
    }
  }

  componentDidMount() {
    const cards = this.generateCards();
    let cardsObj = {};
    for (let i = 0; i < cards.length; i++) {
      cardsObj[i] = {
        'number': cards[i],
        'flipped': false,
        'hide': false,
        'color': ''
      };
    }
    this.setState({
      cards: cardsObj
    });
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('highScore', JSON.stringify(nextState.highScore));
  }

  randomNumber() {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  generateCards(amount = 24) {
    let setsLeft = amount / 2;
    let cards = [];
    while (setsLeft !== 0) {
      let randomNum = this.randomNumber();
      while (cards.includes(randomNum)) {
        randomNum = this.randomNumber();
      }
      cards.push(randomNum);
      cards.push(randomNum);
      setsLeft -= 1;
    }
    this.shuffleArray(cards);
    return cards;
  }

  flipCard(e, index) {
    let newCards = {...this.state.cards};
    newCards[index].flipped = true;
    this.setState({
      cards: newCards
    });
    setTimeout(() => this.checkCard(index), 1000);
  }

  cardsMatched(one, two) {
    let newCards = {...this.state.cards};
    newCards[one].hide = true;
    newCards[one].color = 'green';
    newCards[two].hide = true;
    newCards[two].color = 'green';
    this.setState({
      cards: newCards,
      flipped: ''
    });
  }

  cardsNotMatched(one, two) {
    let newCards = {...this.state.cards};
    newCards[one].flipped = false;
    newCards[one].color = 'red';
    newCards[two].flipped = false;
    newCards[two].color = 'red';
    this.setState({
      cards: newCards,
      flipped: ''
    });
    setTimeout(() => {
      newCards = {...this.state.cards};
      newCards[one].color = '';
      newCards[two].color = '';
      this.setState({
        cards: newCards
      });
    }, 1000);
  }

  checkWinner() {
    const cards = this.state.cards;
    let done = false;
    for (const card in cards) {
      if (cards[card].hide === true) {
        done = true;
      } else {
        done = false;
      }
    }
    if (done) {
      this.setState({
        highScore: this.state.count
      });
    }
  }

  updateCount() {
    this.setState({
      count: this.state.count + 1
    })
  }

  checkCard(index) {
    const flipped = this.state.flipped;
    if (flipped && flipped !== index + '') {
      if (this.state.cards[flipped].number === this.state.cards[index].number) {
        this.cardsMatched(index, flipped);
        this.updateCount();
        this.checkWinner();
      } else {
        this.cardsNotMatched(index, flipped);
        this.updateCount();
      }
    } else {
      this.setState({
        flipped: index + ''
      });
    }
  }

  render() {
    return (
      <div>
        <h1>Memory Game</h1>
        <div className="stats">
          High Score: {this.state.highScore}
        </div>
        <div className="game-board">
          {
            Object
              .keys(this.state.cards)
              .map(
                (card, index) => {
                  const thisCard = this.state.cards[card];
                  return <Card key={index} ref={index} id={index} hide={thisCard.hide} flipped={thisCard.flipped} number={thisCard.number} color={thisCard.color} flipCard={this.flipCard} checkCard={this.checkCard} />
                }
              )
          }
        </div>
      </div>
    )
  }
}

export default MemoryGame;
