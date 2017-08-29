import React from 'react';
import './GameField.css';

function GameField({ mix, fields, fieldAction, gameOver }) {
	return (
		<div
				className={`${mix} game-field`}
				onContextMenu={(e) => {e.preventDefault()}}
				onMouseLeave={(e) => {fieldAction( 'fieldsMouseLeave', e )}}
		>
				{
						fields.map((row, x) => {
								return (
										<div className="game-field__fields-row" key={x}>
												{
														row.map((field, y) => {
																return (
																		<div
																				className={`
																						game-field__field
																						${field.mousedown ? ' game-field__field--mousedown' : ''}
																						${field.discoverd || ( field.bomb && gameOver ) || ( field.markState === 1 && !field.bomb && gameOver ) ? ' game-field__field--discoverd' : ''}
																						${field.discoverd && field.bombsAround ? ' game-field__field--num_' + field.bombsAround : ''}
																						${field.markState ? ' game-field__field--mark_' + field.markState : ''}
																						${field.bomb && gameOver ? ' game-field__field--bomb': ''}
																						${field.bomb && field.discoverd ? ' game-field__field--blow' : ''}
																						${field.markState === 1 && !field.bomb && gameOver ? ' game-field__field--bomb-wrong' : ''}
																				`}
																				key={`${x}-${y}`}
																				onMouseDown={( e ) => { fieldAction( 'fieldMouseDown', e, x, y ) }}
																				onMouseUp={( e ) => { fieldAction( 'fieldMouseUp', e, x, y ) }}
																				onMouseLeave={( e ) => { fieldAction( 'fieldMouseLeave', e, x, y ) }}
																				onMouseEnter={( e ) => { fieldAction( 'fieldMouseEnter', e, x, y ) }}
																		>
																		</div>
																)
														})
												}
										</div>
								)
						})
				}
		</div>
	);
}

export default GameField;
