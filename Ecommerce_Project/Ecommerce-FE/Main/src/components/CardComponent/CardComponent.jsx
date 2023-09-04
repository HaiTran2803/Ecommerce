import React from "react"
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from "./style"
import { useNavigate } from "react-router"
import { convertPrice } from "../../utils"

const CardComponent = (props) => {
    const {id,countInStock, descripstion, image, name, price, rating, type, discount, selled} = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    return(
        <WrapperCardStyle
            hoverable
            headStyle={{width:'200px', height:'200px'}}
            style={{ width: 240 }}
            bodyStyle={{padding:'10px'}}
            cover={<img alt="example" src={image} />}
            onClick={() =>  handleDetailsProduct(id)}
        >
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <WrapperStyleTextSell> |  {type}</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{marginRight:'8px'}}>{convertPrice(price) } vnđ</span>    
            </WrapperPriceText>
                <WrapperDiscountText>
                    * Discount: {discount} %
                </WrapperDiscountText>
        </WrapperCardStyle>
    )
}

export default CardComponent