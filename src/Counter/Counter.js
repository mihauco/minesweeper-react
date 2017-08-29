import React, {Component} from 'react';
import './Counter.css';

class Counter extends Component {
    getSpriteClassName( position ) {
        let stringNumber = this.props.number < -99 ? '-99' : ( this.props.number > 999 ? '999' : this.props.number.toString() );
        let arrayOfNumbers = stringNumber.split('');

        while ( arrayOfNumbers.length < 3 ) {
            arrayOfNumbers.unshift( null );
        }

        return arrayOfNumbers[ position ] === '-' ? ' counter__number--negative' : ` counter__number--${arrayOfNumbers[ position ]}`;
    }

    render() {
        return (
            <div className="counter">
                <div className={`counter__number${this.getSpriteClassName(0)}`}></div>
                <div className={`counter__number${this.getSpriteClassName(1)}`}></div>
                <div className={`counter__number${this.getSpriteClassName(2)}`}></div>
            </div>
        )
    }
}

export default Counter;
