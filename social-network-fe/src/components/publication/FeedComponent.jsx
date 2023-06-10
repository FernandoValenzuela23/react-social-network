import React, { useEffect, useState } from 'react'
import avatar from "../../assets/img/user.png"
import { GlobalConstants } from '../../helpers/Global';

export const FeedComponent = () => {
    const [publications, setPublications] = useState([]);
    const token = localStorage.getItem('token');
    const [page, setPage] = useState(1);

    useEffect(() => {
        if(page === 1) {
            getFeed();
        } else {
            getMoreFeed();
        }
    }, [page]);

    const getFeed = async () => {
        const request = await fetch(`${GlobalConstants.URL_SERVER}/publication/feed/list?page=${page}&pagesize=${GlobalConstants.PAGE_SIZE}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });
        
        const response = await request.json();
        
        if (response.status === GlobalConstants.SUCCESS) {
            setPublications(response.data)
        }
    }

    const getMoreFeed = async () => {
        const request = await fetch(`${GlobalConstants.URL_SERVER}/publication/feed/list?page=${page}&pagesize=${GlobalConstants.PAGE_SIZE}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });
        
        const response = await request.json();
        
        if (response.status === GlobalConstants.SUCCESS && response.data.length > 0) {
            setPublications([...publications, ...response.data]);
        }
    }

    const getNews = () => {
        setPage(1);
    }

    const getNext = () => {
        setPage(page +1);
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Feed</h1>
                <button className="content__button" onClick={ getNews }>Mostrar nuevas</button>
            </header>

            <div className="content__posts">

                {
                    publications.map((p, i) => {
                        const imgAvatar = (p.publisher.image !== 'default.png') ? `${GlobalConstants.URL_SERVER}/user/avatar/${p.publisher.image}` : avatar;
                        const imgPublication = (p.file) ? `${GlobalConstants.URL_SERVER}/publication/file/${p.file}` : '';

                        return (
                            <div key={p._id} className="posts__post">

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
                                            <a href="#" className="user-info__name">{p.publisher.name}</a>
                                            <span className="user-info__divider"> | </span>
                                            <a href="#" className="user-info__create-date">Hace 1 hora</a>
                                        </div>

                                        <h4 className="post__content">{p.text}</h4>

                                        {
                                            imgPublication !== '' && (
                                                <img src={imgPublication} className='publication_img'></img>
                                            )
                                        }

                                    </div>

                                </div>


                                <div className="post__buttons">

                                    <a href="#" className="post__button">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </a>

                                </div>

                            </div>
                        );
                    })
                }

            </div>

            <div className="content__container-btn">
                <button className="content__btn-more-post" onClick={ getNext }>
                    Ver mas publicaciones
                </button>
            </div>

        </>

    )
}
