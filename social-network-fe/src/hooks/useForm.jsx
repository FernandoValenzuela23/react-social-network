import { useState } from 'react'

// Custom Hook to form an object from form input fields 
export const useForm = (initialObject = {}) => {
    const [form, setForm] = useState(initialObject);

    const changed = ({ target }) => {
        const { name, value } = target;
        setForm({ 
            ...form, 
            [name]: value 
        });
    }

    return {
        form,
        changed
    };
}
