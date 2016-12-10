import React from 'react';

class Card extends React.Component {
  render() {
    return (
      <div className={`flip-container ${this.props.color ? this.props.color : ''} ${this.props.hide ? 'hide' : ''} ${this.props.flipped ? 'flip' : ''}`} onClick={(e) => {
        this.props.flipCard(e, this.props.id);
      }}>
        <div className="flipper">
          <div className="front">♤♡♧♢</div>
          <div className="back">
            {this.props.number}
          </div>
        </div>
      </div>
    )
  }
}

Card.propTypes = {
  number: React.PropTypes.number.isRequired
}

export default Card;
