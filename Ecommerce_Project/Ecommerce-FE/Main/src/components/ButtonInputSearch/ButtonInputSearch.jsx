import React from "react"
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from "../InputComponent/InputComponent"
import ButtonComponent from "../ButtonComponent/ButtonComponent"

const ButtonInputSearch = (props) => {
    const { size, placeholder, textButton, bordered, backgroundColorInput = '#fff', backgroundColorButton = 'rgb(13,92,182)', colorButton = '#fff' } = props
    return (
        <div style={{ display: "flex", backgroundColor: "#001529"}}>
            <InputComponent 
                size={size} 
                placeholder={placeholder} 
                bordered={bordered} 
                style={{ backgroundColor: backgroundColorInput}}
                {...props}
            />
            <ButtonComponent 
                size={size} 
                styleButton={{background: backgroundColorButton, border: !bordered && 'none'}}
                icon={<SearchOutlined style={{color: colorButton}}/>} 
                styleTextButton={{ color: colorButton }}
                textButton={textButton}
            />
        </div>
    )
}

export default ButtonInputSearch


