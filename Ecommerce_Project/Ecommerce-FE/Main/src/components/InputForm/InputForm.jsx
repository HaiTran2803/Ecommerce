import React from "react"
import { WrapperInputStyle } from "./style"

const InputForm = (props) => {

    const {placeholder='Nhập text', ...rests} = props
    const handleOnchangeInput =(e)=>{
        props.onChange(e.target.value)
        console.log()
    }
    return(
        <div>
            <WrapperInputStyle placeholder={placeholder} value={props.value} {...rests} onChange={handleOnchangeInput}/>

        </div>
    )
}

export default InputForm