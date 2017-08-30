import React, { Component } from 'react';
import './App.css';

import Counter from './Counter/Counter';
import GameField from './GameField/GameField';
import Face from './Face/Face';
import DropdownMenu from './DropdownMenu/DropdownMenu';

class App extends Component {
	constructor() {
		super();

		this.state = {
			topPosition: 0,
			leftPosition: 0,
			windowDragged: false,
			mouseTouchPoint: [0, 0],
			gameOver: false,
			gameStarted: false,
			gameWon: false,
			mines: [
					10,
					40,
					99
			],
			fieldSize: [
					[9, 9],
					[16, 16],
					[16, 30]
			],
			safeFields: 0,
			level: 0,
			fields: [],
			discoverdFields: 0,
			time: 0,
			minesLeft: 0,
			faceMouseDown: false,
			faceStatus: ''
		};

		this.bodyMouseMove = this.bodyMouseMove.bind( this );
		this.bodyElement = document.querySelector( 'body' )
		this.bodyElement.addEventListener( 'mouseup', () => {
			this.bodyElement.removeEventListener( 'mousemove', this.bodyMouseMove );
			this.dropWindow();
		} )

		this.fieldsTempState = null;
	}

	componentDidMount() {
			this.setState( {
					fields: this.createFields(),
					minesLeft: this.state.mines[ this.state.level ],
					safeFields: this.state.fieldSize[ this.state.level ][ 0 ] * this.state.fieldSize[ this.state.level ][ 1 ] - this.state.mines[ this.state.level ]
			} );
	}

	bodyMouseMove( event ) {
		this.moveWindow( event );
	}

	dragWindow( event ) {
		let appWindowPos = this.appWindow.getBoundingClientRect();
		this.setState( {
			windowDragged: true,
			mouseTouchPoint: [
				event.nativeEvent.pageX - appWindowPos.left,
				event.nativeEvent.pageY - appWindowPos.top
			]
		}, () => {
			this.bodyElement.addEventListener( 'mousemove', this.bodyMouseMove );
		} );
	}

	dropWindow( event ) {
		if ( !this.state.windowDragged ) {
			return;
		}

		this.setState( {
			windowDragged: false
		} );
	}

	moveWindow( event ) {
		if ( !this.state.windowDragged ) {
			return;
		}

		let pageX = event.nativeEvent ? event.nativeEvent.pageX : event.pageX;
		let pageY = event.nativeEvent ? event.nativeEvent.pageY : event.pageY;

		this.setState( {
			leftPosition: pageX - this.state.mouseTouchPoint[ 0 ],
			topPosition: pageY - this.state.mouseTouchPoint[ 1 ]
		} );
	}

	resetGame() {
			this.stopTimer();
			this.setState( {
					time: 0,
					discoverdFields: 0,
					gameOver: false,
					gameStarted: false,
					gameWon: false,
					safeFields: this.state.fieldSize[ this.state.level ][ 0 ] * this.state.fieldSize[ this.state.level ][ 1 ] - this.state.mines[ this.state.level ],
					minesLeft: this.state.mines[ this.state.level ],
					fields: this.createFields(),
					faceStatus: ''
			} );
	}

	startTimer() {
			this.timer = setInterval( () => {
					this.setState( ( prevState ) => {
							return {
									time: prevState.time < 999 ? prevState.time + 1 : 999
							}
					} );
			}, 1000 );
	}

	stopTimer() {
			clearInterval( this.timer );
	}

	createFields() {
			let fields = [];
			let bombs = this.chooseFieldsToBomb();

			for ( let x = 0; x < this.state.fieldSize[this.state.level][0]; x++ ) {
					fields[ x ] = [];
					for ( let y = 0; y < this.state.fieldSize[this.state.level][1]; y++ ) {
							fields[ x ][ y ] = {
									bomb: false,
									flag: false,
									dunno: false,
									mousedown: false,
									discoverd: false,
									markState: 0
							}
					}
			}

			for ( let i = 0; i < bombs.length; i++ ) {
					fields[ bombs[ i ][ 0 ] ][ bombs[ i ][ 1 ] ].bomb = true;
			}

			for ( let x = 0; x < fields.length; x++ ) {
					for ( let y = 0; y < fields[ x ].length; y++ ) {
							if ( !fields[ x ][ y ].bomb ) {
									let bombsAround = 0;
									let fieldsAround = this.getFieldsAround( x, y );

									for ( let i = 0; i < fieldsAround.length; i++ ) {
											if ( fields[ fieldsAround[ i ][ 0 ] ][ fieldsAround[ i ][ 1 ] ].bomb ) {
													bombsAround++
											}
									}

									fields[ x ][ y ].bombsAround = bombsAround;
							}
					}
			}

			this.fieldsTempState = fields;

			return fields;
	}

	chooseFieldsToBomb() {
			let bombsCoordinates = [];

			while ( bombsCoordinates.length !== this.state.mines[ this.state.level ] ) {
					let x = Math.round( Math.random() * ( this.state.fieldSize[ this.state.level ][ 0 ] - 1 ) );
					let y = Math.round( Math.random() * ( this.state.fieldSize[ this.state.level ][ 1 ] - 1 ) );

					let unique = true;

					for ( let i = 0; i < bombsCoordinates.length; i++ ) {
							if ( x === bombsCoordinates[ i ][ 0 ] && y === bombsCoordinates[ i ][ 1 ] ) {
									unique = false;
									break;
							}
					}

					if ( unique ) {
							bombsCoordinates.push( [ x, y ] );
					}
			}

			return bombsCoordinates;
	}

	getFieldsAround( x, y ) {
			let minX = 0;
			let minY = 0;
			let maxX = this.state.fieldSize[ this.state.level ][ 0 ];
			let maxY = this.state.fieldSize[ this.state.level ][ 1 ];

			return [
					[ x - 1, y - 1 ],
					[ x - 1, y ],
					[ x - 1, y + 1 ],
					[ x, y - 1 ],
					[ x, y + 1 ],
					[ x + 1, y - 1 ],
					[ x + 1, y ],
					[ x + 1, y + 1 ]
			].filter( ( field ) => {
					return field[ 0 ] >= minX && field[ 1 ] >= minY && field[ 0 ] < maxX && field[ 1 ] < maxY;
			} );
	}

	discoverFieldsAround( x, y ) {
			let fieldsAround = this.getFieldsAround( x, y );
			let discoverdFields = 0;

			for ( let i = 0; i < fieldsAround.length; i++ ) {
					let x = fieldsAround[ i ][ 0 ];
					let y = fieldsAround[ i ][ 1 ];

					if ( !this.fieldsTempState[ x ][ y ].discoverd && !this.fieldsTempState[ x ][ y ].bomb && !this.fieldsTempState[ x ][ y ].markState ) {
							this.fieldsTempState[ x ][ y ].discoverd = true;
							discoverdFields++

							if ( this.fieldsTempState[ x ][ y ].bombsAround === 0 ) {
									discoverdFields += this.discoverFieldsAround( x, y );
							}
					}
			}

			return discoverdFields;
	}

	fieldMouseDown( event, x, y ) {
			if ( this.state.gameOver || this.state.gameWon ) {
					return;
			}

			if ( !this.state.fields[ x ][ y ].discoverd && !this.state.fields[ x ][ y ].markState ) {
					if ( event.nativeEvent.which === 1 ) {
							this.fieldsTempState[ x ][ y ].mousedown = true;
					}

					this.setState( {
							fields: this.fieldsTempState,
							faceStatus: event.nativeEvent.which === 1 ? 'scared' : ''
					} );
			}
	}

	fieldMouseUp( event, x, y ) {
			if ( this.state.gameOver || this.state.gameWon ) {
					return;
			}

			if ( !this.state.gameStarted ) {
					this.setState( { gameStarted: true } );
					this.startTimer();
			}

			if ( !this.state.fields[ x ][ y ].discoverd ) {
					let gameOver = false;
					let gameWon = false;
					let discoverdFields = 0;
					let suspectedFields = 0;

					if ( event.nativeEvent.which === 1 && !this.state.fields[ x ][ y ].markState && !this.state.fields[ x ][ y ].bomb ) {
							this.fieldsTempState[ x ][ y ].mousedown = false;
							this.fieldsTempState[ x ][ y ].discoverd = true;
							discoverdFields++

							if ( this.fieldsTempState[ x ][ y ].bombsAround === 0 ) {
									discoverdFields += this.discoverFieldsAround( x, y );
							}

							if ( this.state.discoverdFields + discoverdFields === this.state.safeFields ) {
									gameWon = true;
									this.stopTimer();
							}
					} else if ( event.nativeEvent.which === 1 && !this.state.fields[ x ][ y ].markState && this.state.fields[ x ][ y ].bomb ) {
							gameOver = true;
							this.stopTimer();
							this.fieldsTempState[ x ][ y ].mousedown = false;
							this.fieldsTempState[ x ][ y ].discoverd = true;
					} else if ( event.nativeEvent.which === 3 ) {
							let markState = this.fieldsTempState[ x ][ y ].markState
							if ( markState === 1 ) {
									this.fieldsTempState[ x ][ y ].markState = 2;
									suspectedFields--;
							} else if ( markState === 0 ) {
									this.fieldsTempState[ x ][ y ].markState = 1;
									suspectedFields++;
							} else {
									this.fieldsTempState[ x ][ y ].markState = 0;
							}

					}

					this.setState( prevState => {
							return {
									fields: this.fieldsTempState,
									gameOver: gameOver,
									gameWon: gameWon,
									discoverdFields: prevState.discoverdFields + discoverdFields,
									minesLeft: prevState.minesLeft - suspectedFields,
									faceStatus: ''
							}
					} );
			}
	}

	fieldMouseLeave( event, x, y ) {
			if ( this.state.gameOver || this.state.gameWon ) {
					return;
			}

			if ( this.state.fields[ x ][ y ].mousedown ) {
					this.fieldsTempState[ x ][ y ].mousedown = false;

					this.setState( {
							fields: this.fieldsTempState
					} );
			}
	}

	fieldMouseEnter( event, x, y ) {
			if ( this.state.gameOver || this.state.gameWon ) {
					return;
			}

			if ( event.nativeEvent.which === 1 && !this.state.fields[ x ][ y ].markState ) {
					this.fieldsTempState[ x ][ y ].mousedown = true;

					this.setState( {
							fields: this.fieldsTempState
					} );
			}
	}

	faceMouseDown() {
			this.setState( {
					faceMouseDown: true
			} );
	}

	faceMouseUp() {
			this.setState( {
					faceMouseDown: false
			} );
			this.resetGame();
	}

	fieldsMouseLeave( event ) {
			if ( event.nativeEvent.which === 1 ) {
					this.setState( {
							faceStatus: ''
					} );
			}
	}

	fieldActionHandler( actionType, event, x, y ) {
		this[ actionType ]( event, x, y );
	}

	faceActionHandler( actionType ) {
		this[ actionType ]();
	}

	changeDifficulty( level ) {
		this.setState( { level: level }, () => {
			this.resetGame();
		} );
	}

  render() {
    return (
      <div
				className="app"
				style={{
					transform: `translate( ${this.state.leftPosition}px, ${this.state.topPosition}px)`,
				}}
				ref={(appWindow) => { this.appWindow = appWindow }}
			>
        <div
					className="app__top-bar"
					onMouseDown={(e) => {this.dragWindow(e)}}
					onMouseUp={(e) => {this.dropWindow(e)}}
				>
            <span className="app__minesweeper-icon"></span>
            Minesweeper
        </div>
        <div className="app__menu">
            <DropdownMenu
							title="Game"
							menuOptions={[
								{
									title: 'Begginer',
									action: (e) => {
										e.preventDefault();
										this.changeDifficulty( 0 )
									}
								},
								{
									title: 'Intermeditate',
									action: (e) => {
										e.preventDefault();
										this.changeDifficulty( 1 )
									}
								},
								{
									title: 'Expert',
									action: (e) => {
										e.preventDefault();
										this.changeDifficulty( 2 )
									}
								}
							]}
						/>
						<DropdownMenu
							title="Help"
							menuOptions={[
								{
									title: 'Github',
									link: 'https://github.com/noiff/minesweeper-react'
								}
							]}
						/>
        </div>
        <div className="app__game">
						<div className="app__game-status-bar">
								<Counter number={this.state.minesLeft} />
								<Face
									faceMouseDown={this.state.faceMouseDown}
									faceStatus={this.state.faceStatus}
									gameOver={this.state.gameOver}
									gameWon={this.state.gameWon}
									faceAction={this.faceActionHandler.bind( this )}
								/>
								<Counter number={this.state.time} />
						</div>
						<GameField
							mix={`app__game-field app__game-field--size-level_${this.state.level}`}
							fields={this.state.fields}
							fieldAction={this.fieldActionHandler.bind( this )}
							gameOver={this.state.gameOver}
						/>
        </div>
      </div>
    );
  }
}

export default App;
