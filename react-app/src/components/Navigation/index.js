import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OpenModalButton from '../OpenModalButton';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import LoginFormModal from '../LoginFormModal';
import CreateTextPost from '../Posts/CreateTextPost';
import SearchBar from '../ResultsPage/Searchbar';
// import logo from "../../assets/logo-spork.jpeg"

function Navigation({ isLoaded }) {
	const sessionUser = useSelector(state => state?.session?.user);
	const [showProfileButton, setShowProfileButton] = useState(false);

	const handleProfileButtonClick = () => {
		setShowProfileButton(!showProfileButton);
	};
	console.log('session-user', sessionUser)
	return (

		<ul className='home-whole-nav-bar'>
			<div className="left-nav-bar">
				<NavLink exact to="/"><div className="spork-logo">S</div></NavLink>
				<div className="search-bar">
					{/* <input type="text" placeholder=" Search Spork" /> */}
					< SearchBar />
				</div>
			</div>
			{sessionUser && isLoaded ? (
				<div className='right-nav-bar'>
					<li className="home-button-icons">
						{/* <NavLink exact to="/"><div className="spork-logo"></div></NavLink> */}
						<NavLink exact to="/"><i className="fa fa-home"></i></NavLink>
						<NavLink exact to="/"><i className="fa fa-video-camera"></i></NavLink>
						<NavLink exact to="/"><i className="fa fa-compass"></i></NavLink>
						<NavLink exact to="/"><i className='fas fa-store-alt'></i></NavLink>
						<NavLink exact to="/"><i className="fa fa-envelope"></i></NavLink>
						<NavLink exact to="/"><i className='fas fa-comment-dots'></i></NavLink>
						<NavLink exact to="/"><i className="fa fa-bolt"></i></NavLink>
						<ProfileButton user={sessionUser} />
						<OpenModalButton buttonText={<><i className="fa fa-pen-square"></i></>} modalComponent={<CreateTextPost />}></OpenModalButton>

					</li>
				</div>)
				: (
					<div>
						<OpenModalButton
							clasName="button-green-login"
							buttonText="Log In"
							modalComponent={<LoginFormModal />}
						/>
					</div>
				)

			}

		</ul>
	);
}

export default Navigation;
