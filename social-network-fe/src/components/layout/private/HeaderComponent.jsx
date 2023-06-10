import React, { useContext } from 'react'
import avatar from "../../../assets/img/user.png"
import { AppContext } from '../../../context/AppContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { GlobalConstants } from '../../../helpers/Global';

export const HeaderComponent = () => {
    const navigate = useNavigate();
    const { setUserCtx, setIsAuthenticatedCtx, setRefreshDataCtx } = useContext(AppContext);
    const userLogged = JSON.parse(localStorage.getItem('user'));
    const imgAvatar = (userLogged && userLogged.image !== 'default.png') ? `${GlobalConstants.URL_SERVER}/user/avatar/${userLogged.image}` : avatar;
        
    const endSession = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUserCtx({});
        setIsAuthenticatedCtx(false);
        setRefreshDataCtx(false);
        navigate('/');
    }

    return (
        <header className="layout__navbar">

            <div className="navbar__header">
                <a href="#" className="navbar__title">SOCIALNET</a>
            </div>

            <nav className="navbar__container-lists">

                <ul className="container-lists__menu-list">
                    <li className="menu-list__item">
                        <NavLink to="/social" className="menu-list__link">
                            <i className="fa-solid fa-house"></i>
                            <span className="menu-list__title">Inicio</span>
                        </NavLink>
                    </li>

                    <li className="menu-list__item">
                        <NavLink to="/social/feed" className="menu-list__link">
                            <i className="fa-solid fa-list"></i>
                            <span className="menu-list__title">Feed</span>
                        </NavLink>
                    </li>

                    <li className="menu-list__item">
                        <NavLink to="/social/people" className="menu-list__link">
                            <i className="fa-solid fa-user"></i>
                            <span className="menu-list__title">People</span>
                        </NavLink>
                    </li>
                </ul>

                <ul className="container-lists__list-end">
                    <li className="list-end__item">
                        <a href="#" className="list-end__link-image">
                            <img src={imgAvatar} className="list-end__img" alt="Imagen de perfil"></img>
                        </a>
                    </li>
                    <li className="list-end__item">
                        <a href="#" className="list-end__link">
                            <span className="list-end__name">{userLogged.name}</span>
                            
                        </a>
                    </li>
                    <li className="list-end__item">
                        <NavLink to="/social/config" className="list-end__link">
                            <i className='fa-solid fa-gear' ></i>
                            <span className="list-end__name">Ajustes</span>
                            
                        </NavLink>
                    </li>
                    <li className="list-end__item">
                        <button className="list-end__button" onClick={ endSession }>
                            <i className='fa-solid fa-arrow-right-from-bracket' ></i>
                            <span className="list-end__name">Cerrar sesion</span>
                            
                        </button>
                    </li>
                </ul>

            </nav>

        </header>
    )
}
