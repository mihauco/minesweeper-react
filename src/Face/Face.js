import React from 'react';
import './Face.css';

function Face({ faceMouseDown, faceStatus, gameOver, gameWon, faceAction }) {
	return (
		<button
				className={`
						face
						${faceMouseDown ? ' face--mouse-down' : ''}
						${faceStatus !== '' ? ' face--' + faceStatus : ''}
						${gameOver ? ' face--dead' : ''}
						${gameWon ? ' face--cool' : ''}
				`}
				onMouseDown={() => { faceAction( 'faceMouseDown' ) }}
				onMouseUp={() => { faceAction( 'faceMouseUp' ) }}
		></button>
	)
}

export default Face;
