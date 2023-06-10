import React, { useContext, useEffect, useState } from 'react'
import { useForm } from '../../hooks/useForm';
import { AppContext } from '../../context/AppContext';
import { GlobalConstants, MesssageType } from '../../helpers/Global';
import { MessageComponent } from '../general/MessageComponent';
import avatar from "../../assets/img/user.png"
import { useNavigate } from 'react-router-dom';

export const ConfigComponent = () => {
    const { form, changed } = useForm({});
    const { userCtx, setUserCtx, setIsAuthenticatedCtx, setRefreshDataCtx } = useContext(AppContext);
    const [messageParams, setMessageParams] = useState({ message: '', type: MesssageType.Info, title: '' });
    let token = localStorage.getItem('token');
    const [imgAvatar, setImgAvatar] = useState(avatar);
    const navigate = useNavigate();

    useEffect(() => {
        setImgAvatar((userCtx && userCtx.image !== 'default.png') ? `${GlobalConstants.URL_SERVER}/user/avatar/${userCtx.image}` : avatar);
    }, [userCtx])

    const submitHandler = async (e) => {
        e.preventDefault();
        const data = form;

        const request = await fetch(`${GlobalConstants.URL_SERVER}/user/${userCtx._id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        const response = await request.json();
        if (response.status === GlobalConstants.SUCCESS) {
            // Se regenero la data y el token
            localStorage.setItem('user', JSON.stringify({ ...response.user, isAuthenticated: true }));
            localStorage.setItem('token', response.token);
            setUserCtx(response.user);
            setIsAuthenticatedCtx(true);
            setRefreshDataCtx(true);
            e.target.reset();
            navigate(`/social`);
        } else {
            setMessageParams({ message: response.message, type: MesssageType.Error });
        }
    }

    const imgChanged = async(e) => {

        const data = new FormData()
        data.append('file0', e.target.files[0])

        const request = await fetch(`${GlobalConstants.URL_SERVER}/user/upload`, {
            method: 'POST',
            body: data,
            headers: {
                "Authorization": token
            }
        });
        const response = await request.json();
        if (response.status === GlobalConstants.SUCCESS) {
            localStorage.setItem('user', JSON.stringify({ ...response.user, isAuthenticated: true }));
            setUserCtx(response.user);
            setRefreshDataCtx(true);
            setImgAvatar((userCtx && userCtx.image !== 'default.png') ? `${GlobalConstants.URL_SERVER}/user/avatar/${userCtx.image}` : avatar);
        } else {
            setMessageParams({ message: response.message, type: MesssageType.Error });
        }
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">User Profile</h1>
            </header>

            {messageParams.message !== '' && (<MessageComponent messageParams={messageParams} />)}

            <div className="content__posts">

                <form className='edit-user-form' onSubmit={submitHandler}>
                    <div id='form_content_user'>
                        <div>
                            <div className='form-group'>                                
                                <img src={imgAvatar} className='edit_user_img'></img>
                                <input type='file' id='file' name='file0' onChange={imgChanged} />                                
                            </div>
                        </div>
                        <div>
                            <div className='form-group'>
                                <label htmlFor='nameI'>name</label>
                                <input type='text' id='nameI' name='name' defaultValue={userCtx.name} onChange={changed} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='email'>Email</label>
                                <input type='email' id='email' name='email' defaultValue={userCtx.email} onChange={changed} disabled />
                            </div>
                            <div className='form-group'>
                            <label htmlFor='password'>Password</label>
                                <input type='password' id='password' name='password' onChange={changed} />
                            </div>
                            <input type='submit' value='Actualizar' className='btn btn-success' />
                        </div>
                    </div>

                </form>

            </div>
        </>
    )
}
