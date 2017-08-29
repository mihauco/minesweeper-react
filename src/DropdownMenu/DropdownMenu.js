import React from 'react';
import './DropdownMenu.css';

function DropdownMenu( {title, menuOptions = []} ) {
	return (
		<div className="dropdown-menu">
			<span>{title[0]}</span>{title.substring(1)}
			<div className="dropdown-menu__menu">
				{
					menuOptions.map( ( option, index ) => {
						return (
								<a
									href={option.link ? option.link : '#'}
									onClick={ (e) => {
										if ( option.action ) {
											option.action( e );
										}
									} }
									key={index}
									className="dropdown-menu__item"
								>{option.title}</a>
						);
					} )
				}
			</div>
		</div>
	)
}

export default DropdownMenu;
