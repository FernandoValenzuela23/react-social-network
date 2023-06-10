import React, { useContext, useEffect, useState } from 'react'
import avatar from "../../../assets/img/user.png"
import { GlobalConstants, MesssageType } from '../../../helpers/Global';
import { useForm } from '../../../hooks/useForm';
import { AppContext } from '../../../context/AppContext';

export const SidebarComponent = () => {
    const { setLoadingCtx, refreshDataCtx, setRefreshDataCtx } = useContext(AppContext);
    const { form, changed } = useForm({});
    const [counters, setCounters] = useState({
        following: 0,
        followers: 0,
        publications: 0
    });
    const token = localStorage.getItem('token');
    const userLogged = JSON.parse(localStorage.getItem('user'));   
    const imgAvatar = (userLogged && userLogged.image !== 'default.png') ? `${GlobalConstants.URL_SERVER}/user/avatar/${userLogged.image}` : avatar;
    const [messageParams, setMessageParams] = useState({ message: '', type: MesssageType.Info, title: '' });

    useEffect(() => {
        getCounters();
        setLoadingCtx(false);
    }, []);

    useEffect(() => {
        console.log('notificado...')
        getCounters();
    }, [refreshDataCtx]);

    const getCounters = async() => {
        const request = await fetch(`${GlobalConstants.URL_SERVER}/user/counters/get/values`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });
        const response = await request.json();
        if(response.status === GlobalConstants.SUCCESS) {
            setCounters(response)
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const data = form;

        const request = await fetch(`${GlobalConstants.URL_SERVER}/publication/create`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              Authorization: token
            }
          });
          const response = await request.json();
          if (response.status === GlobalConstants.SUCCESS) {
            setRefreshDataCtx(!refreshDataCtx);
            if(e.target.file0.files[0]) {
                await saveImage(response.publication._id, e.target.file0.files[0]);
            }

            e.target.reset(); 

            
          } else {
            setMessageParams({ message: response.message, type: MesssageType.Error });
          }

    }

    const saveImage = async(id, fileObj) => {

        const data = new FormData()
        data.append('file0', fileObj)

        const request = await fetch(`${GlobalConstants.URL_SERVER}/publication/upload/${id}`, {
            method: 'POST',
            body: data,
            headers: {
                "Authorization": token
            }
        });
        const response = await request.json();
        if (response.status === GlobalConstants.SUCCESS) {
            return true;
        } else {
            console.log(response.message);
            return false;
        }
    }

    return (
        <aside className="layout__aside">

            <header className="aside__header">
                <h1 className="aside__title">Hola, {userLogged.name}</h1>
            </header>

            <div className="aside__container">

                <div className="aside__profile-info">

                    <div className="profile-info__general-info">
                        <div className="general-info__container-avatar">
                            {
                                userLogged.image && (
                                    <img src={imgAvatar} className="container-avatar__img" alt="Foto de perfil"></img>
                                )
                            }
                        </div>

                        <div className="general-info__container-names">
                            <a href="#" className="container-names__name">{userLogged.name}</a>
                            <p className="container-names__nickname">{userLogged.email}</p>
                        </div>
                    </div>

                    <div className="profile-info__stats">

                        <div className="stats__following">
                            <a href="#" className="following__link">
                                <span className="following__title">Siguiendo</span>
                                <span className="following__number">{counters.following}</span>
                            </a>
                        </div>
                        <div className="stats__following">
                            <a href="#" className="following__link">
                                <span className="following__title">Seguidores</span>
                                <span className="following__number">{counters.followers}</span>
                            </a>
                        </div>


                        <div className="stats__following">
                            <a href="#" className="following__link">
                                <span className="following__title">Publicaciones</span>
                                <span className="following__number">{counters.publications}</span>
                            </a>
                        </div>


                    </div>
                </div>


                <div className="aside__container-form">

                    <form className="container-form__form-post" onSubmit={ submitHandler }>

                        <div className="form-post__inputs">
                            <label htmlFor="post" className="form-post__label">¿Que estas pesando hoy?</label>
                            <textarea id='post' name="text" className="form-post__textarea" onChange={changed}></textarea>
                        </div>

                        <div className="form-post__inputs">
                            <label htmlFor="fileImg" className="form-post__label">Sube tu foto</label>
                            <input type='file' id='fileImg' name='file0' className="form-post__image" />
                        </div>

                        <input type="submit" value="Enviar" className="form-post__btn-submit" />

                    </form>

                </div>

            </div>

        </aside>
    )
}
