import React, { useContext, useEffect, useState } from 'react'
import { useForm } from '../../hooks/useForm';
import { useNavigate } from "react-router-dom";
import { GlobalConstants, MesssageType } from '../../helpers/Global';
import { MessageComponent } from '../general/MessageComponent';
import { AppContext } from '../../context/AppContext';

export const LoginComponent = () => {
  const { form, changed } = useForm({});
  const { setUserCtx, setIsAuthenticatedCtx, setRefreshDataCtx } = useContext(AppContext);
  const [messageParams, setMessageParams] = useState({ message: '', type: MesssageType.Info, title: '' });
  const navigate = useNavigate();

  // aqui logramos que al formzar la recarga del sitio, se redirija a private si ya esta logueado
  useEffect(() => {
    // If exist in local storage
    if(localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUserCtx(user);
      setIsAuthenticatedCtx(true);
      setRefreshDataCtx(true);
      navigate(`/social`);
    }
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault();
    const loginData = form;

    const request = await fetch(`${GlobalConstants.URL_SERVER}/user/login`, {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const response = await request.json();
    if (response.status === GlobalConstants.SUCCESS) {
      localStorage.setItem('user', JSON.stringify({...response.user, isAuthenticated:true}));      
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

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">User Login</h1>
      </header>

      {messageParams.message !== '' && (<MessageComponent messageParams={messageParams} />)}

      <div className="content__posts">

        <form className='register-form' onSubmit={submitHandler}>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email' onChange={changed} />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' name='password' onChange={changed} />
          </div>
          <input type='submit' value='Registrate' className='btn btn-success' />
        </form>

      </div>
    </>
  )
}
