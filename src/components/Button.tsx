import { ButtonHTMLAttributes } from "react"
import '../style/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
}

export function Button({isOutlined = false, ...props}: ButtonProps){
    return(
        <button {...props} className =  {`button ${isOutlined ? ' outlined': ''  }`}>
            
        </button>
    )
}