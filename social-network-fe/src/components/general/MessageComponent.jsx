import React, { useEffect, useState } from 'react'
import { MesssageType } from "../../helpers/Global";

export const MessageComponent = (input = { message: '', type: MesssageType.Info, title: '', classname: ''} ) => {
    const {messageParams} = input

    const [state, setState] = useState({        
        message: messageParams.message,
        title: messageParams.title,
        classname: messageParams.classname
    });

    let classname = ''

    useEffect(() => {
        console.log(messageParams)
        switch (messageParams.type) {
            case MesssageType.Success:
                classname = 'message success-message';
                break;
            case MesssageType.Error:
                classname = 'message error-message';
                break;
            case MesssageType.Warning:
                classname = 'message warning-message';
                break;
            default:
                classname = 'message neutral-message';
                break;
        }
        setState({
            message: messageParams.message,
            title: messageParams.title,
            classname: classname
        });
        console.log(state)
    }, [messageParams]);



    return (
        <div className={state.classname}>
            {state.title !== '' && (<h2>{state.title}</h2>)}
            <p>{state.message}</p>
        </div>
    )
}
