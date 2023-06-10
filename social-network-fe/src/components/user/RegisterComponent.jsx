import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { GlobalConstants, MesssageType } from '../../helpers/Global';
import { MessageComponent } from '../general/MessageComponent';

export const RegisterComponent = () => {
    const {form, changed} = useForm({});
    const [messageParams, setMessageParams] = useState({message: '', type: MesssageType.Info, title: ''});
    
    const submitHandler = async(e) => {
        e.preventDefault();
        const newUser = form;
        
        const request = await fetch(`${GlobalConstants.URL_SERVER}/user/create`, {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const response = await request.json();
        if(response.status === GlobalConstants.SUCCESS) {
            setMessageParams({message: response.message, type: MesssageType.Success});
            e.target.reset();
        } else {
            setMessageParams({message: response.message, type: MesssageType.Error});
        }
        
    } 

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Registro</h1>
                <button className="content__button">Mostrar nuevas</button>
            </header>

            { messageParams.message !== '' && (<MessageComponent messageParams={messageParams} />) }

            <div className="content__posts">

                <form className='register-form' onSubmit={submitHandler}>
                    <div className='form-group'>
                        <label htmlFor='name'>Nombre</label>
                        <input type='text' id='name' name='name' onChange={changed} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' id='email' name='email' onChange={changed} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password' name='password' onChange={changed} />
                    </div>
                    <input type='submit' value='Registrate' className='btn btn-success'/>
                </form>

            </div>
        </>
    )
}
