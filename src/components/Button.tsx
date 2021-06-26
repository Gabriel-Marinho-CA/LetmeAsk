import { ButtonHTMLAttributes } from 'react'
import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes <HTMLButtonElement> &{
    isOutlined?: boolean
};



export function Button({isOutlined = false, ...props}: ButtonProps){ 
        return (
        <button className={`button ${isOutlined ? 'outlined' : ''}`}
         {...props} />
    )
}


//sempre que quiser incluir um codigo js dentro do html do jsx temos que colocar {}