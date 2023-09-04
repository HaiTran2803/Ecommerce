import React from "react"
import { Button } from "antd"

const ButtonComponent = ({ size, styleTextButton, styleButton, textButton, disable, ...rest}) => {// 
    return(
        <Button 
            style={{
                ...styleButton,
                background: disable ? '#ccc' : styleButton.background}}
                size={size}
                {...rest}>
            <span style={styleTextButton}>{textButton}</span>
        </Button>
    )
}

export default ButtonComponent
