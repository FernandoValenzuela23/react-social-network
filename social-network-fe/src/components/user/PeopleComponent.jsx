import React, { useContext, useEffect, useState } from 'react'
import { GlobalConstants, MesssageType } from '../../helpers/Global';
import avatar from "../../assets/img/user.png"
import {AppContext} from "../../context/AppContext";
import { useNavigate } from 'react-router-dom';

export const PeopleComponent = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [people, setPeople] = useState([]);
    const { userCtx, setUserCtx, refreshDataCtx, setRefreshDataCtx} = useContext(AppContext)
    const token = localStorage.getItem('token');
    const [messageParams, setMessageParams] = useState({ message: '', type: MesssageType.Info, title: '' });

    useEffect(() => {
        if (page === 1) {
            getPeople();
        } else {
            getMorePeople();
        }
    }, [page]);

    const getPeople = async () => {
        const request = await fetch(`${GlobalConstants.URL_SERVER}/user/?page=${page}&pagesize=${GlobalConstants.PAGE_SIZE}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });

        const response = await request.json();

        if (response.status === GlobalConstants.SUCCESS) {
            setPeople(response.data)
        }
    }

    const getMorePeople = async () => {
        const request = await fetch(`${GlobalConstants.URL_SERVER}/user?page=${page}&pagesize=${GlobalConstants.PAGE_SIZE}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });

        const response = await request.json();

        if (response.status === GlobalConstants.SUCCESS && response.data.length > 0) {
            setPeople([...people, ...response.data]);
        }
    }

    const getNext = () => {
        setPage(page + 1);
    }

    const followUser = async (id) => {
        const data = {
            "follower": userCtx._id,
            "followed": id
        };

        const request = await fetch(`${GlobalConstants.URL_SERVER}/follow/create`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        const response = await request.json();
        if (response.status === GlobalConstants.SUCCESS) {
            setRefreshDataCtx(true);
            navigate(`/social`);
        } else {
            setMessageParams({ message: response.message, type: MesssageType.Error });
        }
    }

    const unfollowUser = async (id) => {
        const request = await fetch(`${GlobalConstants.URL_SERVER}/follow/remove/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        const response = await request.json();
        if (response.status === GlobalConstants.SUCCESS) {
            setRefreshDataCtx(true);
            navigate(`/social`);
        } else {
            setMessageParams({ message: response.message, type: MesssageType.Error });
        }
    }


    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Gente</h1>
            </header>

            <div className="content__posts">

                {
                    people.map((p, i) => {
                        const imgAvatar = (p.image !== 'default.png') ? `${GlobalConstants.URL_SERVER}/user/avatar/${p.image}` : avatar;

                        return (
                            <article key={p._id} className="posts__post">

                                <div className="post__container">

                                    <div className="post__image-user">
                                        <a href="#" className="post__image-link">
                                            {
                                                <img src={imgAvatar} className="post__user-image" alt="Foto de perfil" />
                                            }
                                        </a>
                                    </div>

                                    <div className="post__body">

                                        <div className="post__user-info">
                                            <a href="#" className="post__content">{p.name}</a>
                                        </div>

                                        <h5 className="user-info__name">{p.email}</h5>

                                    </div>

                                </div>


                                <div className="post__buttons">

                                    { (p.following !== true) ?
                                        <button className="follow__button" onClick={e => followUser(p._id)}>
                                            <i className="fa-sharp fa-solid fa-user-plus"></i>
                                        </button>
                                    :
                                        <button className="unfollow__button" onClick={e => unfollowUser(p._id)}>
                                            <i className="fa-sharp fa-solid fa-user-minus"></i>
                                        </button>
                                    }
                                    

                                </div>

                            </article>
                        );
                    })
                }

            </div>

            <div className="content__container-btn">
                <button className="content__btn-more-post" onClick={getNext}>
                    Cargar mas personas
                </button>
            </div>

        </>

    )
}
