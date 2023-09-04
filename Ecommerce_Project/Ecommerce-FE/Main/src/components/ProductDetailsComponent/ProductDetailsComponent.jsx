import { Col, Image, Rate, Row } from 'antd'
import React from 'react'
import {  WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct, WrapperPriceTextProduct, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber } from './style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from 'react-query'
import Loading from '../LoadingComponent/Loading'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct,resetOrder } from '../../redux/slides/orderSlice'
import { convertPrice, initFacebookSDK } from '../../utils'
import { useEffect } from 'react'
import * as message from '../Message/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'


const ProductDetailsComponent = ({idProduct}) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [errorLimitOrder,setErrorLimitOrder] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const onChange = (value) => {
        setNumProduct(Number(value))
    }
    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if(id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    useEffect(() => {
        initFacebookSDK()
    }, [])

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id) 
        if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if(productDetails?.countInStock === 0){
            setErrorLimitOrder(true)
        }
    },[numProduct])

    useEffect(() => {
        if(order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSucessOrder])

    const handleChangeCount = (type, limited) => {
        if(type === 'increase') {
            if(!limited) {
                setNumProduct(numProduct + 1)
            }
        }else {
            if(!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }
    const handleChangeAddress = () =>{
        navigate('/profile-user')
    }

    const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled : !!idProduct})
    const handleAddOrderProduct = () => {
        if(!user?.id) {
            message.error("Chua dang nhap")
            navigate('/sign-in', {state: location?.pathname})
        }else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInstock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    }
    // console.log('add', productDetails, user)
    return (
        <div style={{height:"80vh"}}>
            <Loading isLoading={isLoading}>
                <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px', height:'100%' }}>
                    <Col span={10} style={{display:"flex", alignItems:"center", justifyContent:"center", borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                        <Image src={productDetails?.image} alt="image prodcut" preview={false} />
                        {/* <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                        </Row> */}
                    </Col>
                    <Col span={14} style={{ paddingLeft: '10px' }}>
                        <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                        <div>
                            <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                            <WrapperStyleTextSell> | Da ban {productDetails?.selled}</WrapperStyleTextSell>
                        </div>
                        <WrapperPriceProduct>
                            <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                        </WrapperPriceProduct>
                        <WrapperAddressProduct>
                            <span>Giao đến </span>
                            <span className='address'>{user?.address}</span> -
                            <span className='change-address' style={{cursor:"pointer"}} onClick={handleChangeAddress}> Đổi địa chỉ?</span>
                        </WrapperAddressProduct>
                        <LikeButtonComponent
                        dataHref={ process.env.REACT_APP_IS_LOCAL 
                                    ? "https://developers.facebook.com/docs/plugins/" 
                                    : window.location.href
                                } 
                        />
                        <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                            <div style={{ marginBottom: '10px' }}>Số lượng</div>
                            <WrapperQualityProduct>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',numProduct === 1)}>
                                    <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                </button>
                                <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" />
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',  numProduct === productDetails?.countInStock)}>
                                    <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                </button>
                            </WrapperQualityProduct>
                        </div>
                        <div style={{ display: 'flex', aliggItems: 'center', gap: '12px' }}>
                            <div>
                                <ButtonComponent
                                    size={40}
                                    styleButton={{
                                        background: 'rgb(255, 57, 69)',
                                        height: '48px',
                                        width: '220px',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                    onClick={handleAddOrderProduct}
                                    textButton={'Chọn mua'}
                                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                ></ButtonComponent>
                                {errorLimitOrder && <div style={{color: 'red'}}>San pham het hang</div>}
                            </div>
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: '#fff',
                                    height: '48px',
                                    width: '220px',
                                    border: '1px solid rgb(13, 92, 182)',
                                    borderRadius: '4px'
                                }}
                                textButton={'Mua trả sau'}
                                styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
                            ></ButtonComponent>
                        </div>
                    </Col>
                    <CommentComponent 
                        dataHref={process.env.REACT_APP_IS_LOCAL 
                            ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                            : window.location.href
                        } 
                        width="1270" 
                    />
                </Row >                
            </Loading>            
        </div>

    )
}

export default ProductDetailsComponent


// import { Col, Image, Rate, Row } from 'antd'
// import React from 'react'
// // import imageProductSmall from '../../assets/images/imagesmall.webp'
// import { WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct, WrapperPriceTextProduct, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber, WrapperBtnQualityProduct } from './style'
// import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
// import ButtonComponent from '../ButtonComponent/ButtonComponent'
// import * as ProductService from '../../services/ProductService'
// import { useQuery } from '@tanstack/react-query'
// import Loading from '../LoadingComponent/Loading'
// import { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { addOrderProduct,resetOrder } from '../../redux/slides/orderSlice'
// // import { convertPrice, initFacebookSDK } from '../../utils'
// import { convertPrice } from '../../utils'
// import { useEffect } from 'react'
// import * as message from '../Message/Message'
// // import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
// // import CommentComponent from '../CommentComponent/CommentComponent'
// // import { useMemo } from 'react'

// const ProductDetailsComponent = ({idProduct}) => {
//     const [numProduct, setNumProduct] = useState(1)
//     const user = useSelector((state) => state.user)
//     const order = useSelector((state) => state.order)
//     const [errorLimitOrder,setErrorLimitOrder] = useState(false)
//     const navigate = useNavigate()
//     const location = useLocation()
//     const dispatch = useDispatch()

//     const onChange = (value) => { 
//         setNumProduct(Number(value))
//     }

//     const fetchGetDetailsProduct = async (context) => {
//         const id = context?.queryKey && context?.queryKey[1]
//         if(id) {
//             const res = await ProductService.getDetailsProduct(id)
//             return res.data
//         }
//     }

//     useEffect(() => {
//         // initFacebookSDK()
//     }, [])

//     useEffect(() => {
//         const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id) 
//         if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
//             setErrorLimitOrder(false)
//         } else if(productDetails?.countInStock === 0){
//             setErrorLimitOrder(true)
//         }
//     },[numProduct])

//     useEffect(() => {
//         if(order.isSucessOrder) {
//             message.success('Đã thêm vào giỏ hàng')
//         }
//         return () => {
//             dispatch(resetOrder())
//         }
//     }, [order.isSucessOrder])

//     const handleChangeCount = (type, limited) => {
//         if(type === 'increase') {
//             if(!limited) {
//                 setNumProduct(numProduct + 1)
//             }
//         }else {
//             if(!limited) {
//                 setNumProduct(numProduct - 1)
//             }
//         }
//     }

//     const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled : !!idProduct})
//     const handleAddOrderProduct = () => {
//         if(!user?.id) {
//             navigate('/sign-in', {state: location?.pathname})
//         }else {
//             // {
//             //     name: { type: String, required: true },
//             //     amount: { type: Number, required: true },
//             //     image: { type: String, required: true },
//             //     price: { type: Number, required: true },
//             //     product: {
//             //         type: mongoose.Schema.Types.ObjectId,
//             //         ref: 'Product',
//             //         required: true,
//             //     },
//             // },
//             const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
//             if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
//                 dispatch(addOrderProduct({
//                     orderItem: {
//                         name: productDetails?.name,
//                         amount: numProduct,
//                         image: productDetails?.image,
//                         price: productDetails?.price,
//                         product: productDetails?._id,
//                         discount: productDetails?.discount,
//                         countInstock: productDetails?.countInStock
//                     }
//                 }))
//             } else {
//                 setErrorLimitOrder(true)
//             }
//         }
//     }

//     return (
//         <Loading isLoading={isLoading}>
//             <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px', height:'100%' }}>
//                 <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
//                     <Image src={productDetails?.image} alt="image prodcut" preview={false} />
//                     <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
//                         {/* <WrapperStyleColImage span={4} sty>
//                             <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
//                         </WrapperStyleColImage>
//                         <WrapperStyleColImage span={4}>
//                             <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
//                         </WrapperStyleColImage>

//                         <WrapperStyleColImage span={4}>
//                             <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
//                         </WrapperStyleColImage>

//                         <WrapperStyleColImage span={4}>
//                             <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
//                         </WrapperStyleColImage>

//                         <WrapperStyleColImage span={4}>
//                             <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
//                         </WrapperStyleColImage>

//                         <WrapperStyleColImage span={4}>
//                             <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
//                         </WrapperStyleColImage> */}

//                     </Row>
//                 </Col>
//                 <Col span={14} style={{ paddingLeft: '10px' }}>
//                     <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
//                     <div>
//                         <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
//                         <WrapperStyleTextSell> | Da ban 1000+</WrapperStyleTextSell>
//                     </div>
//                     <WrapperPriceProduct>
//                         <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
//                     </WrapperPriceProduct>
//                     <WrapperAddressProduct>
//                         <span>Giao đến </span>
//                         <span className='address'>{user?.address}</span> -
//                         <span className='change-address'>Đổi địa chỉ</span>
//                     </WrapperAddressProduct>
//                     {/* <LikeButtonComponent
//                      dataHref={ process.env.REACT_APP_IS_LOCAL 
//                                 ? "https://developers.facebook.com/docs/plugins/" 
//                                 : window.location.href
//                             } 
//                     /> */}
//                     <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
//                         <div style={{ marginBottom: '10px' }}>Số lượng</div>
//                         <WrapperQualityProduct>
//                             <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',numProduct === 1)}>
//                                 <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
//                             </button>
//                             <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" />
//                             <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',  numProduct === productDetails?.countInStock)}>
//                                 <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
//                             </button>
//                         </WrapperQualityProduct>
//                     </div>
//                     <div style={{ display: 'flex', aliggItems: 'center', gap: '12px' }}>
//                         <div>
//                             <ButtonComponent
//                                 size={40}
//                                 styleButton={{
//                                     background: 'rgb(255, 57, 69)',
//                                     height: '48px',
//                                     width: '220px',
//                                     border: 'none',
//                                     borderRadius: '4px'
//                                 }}
//                                 onClick={handleAddOrderProduct}
//                                 textbutton={'Chọn mua'}
//                                 styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
//                             ></ButtonComponent>
//                             {errorLimitOrder && <div style={{color: 'red'}}>San pham het hang</div>}
//                         </div>
//                         <ButtonComponent
//                             size={40}
//                             styleButton={{
//                                 background: '#fff',
//                                 height: '48px',
//                                 width: '220px',
//                                 border: '1px solid rgb(13, 92, 182)',
//                                 borderRadius: '4px'
//                             }}
//                             textbutton={'Mua trả sau'}
//                             styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
//                         ></ButtonComponent>
//                     </div>
//                 </Col>
//                 {/* <CommentComponent 
//                     dataHref={process.env.REACT_APP_IS_LOCAL 
//                         ? "https://developers.facebook.com/docs/plugins/comments#configurator"
//                         : window.location.href
//                     } 
//                     width="1270" 
//                 /> */}
//             </Row >
            
//         </Loading>
//     )
// }

// export default ProductDetailsComponent


// import { Col, Image, Rate, Row } from 'antd'
// import React from 'react'
// import { WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleNameProduct } from './style'
// import * as ProductService from '../../services/ProductService'
// import { useQuery } from 'react-query'
// import Loading from '../LoadingComponent/Loading'
// import { useSelector } from 'react-redux'

// const ProductDetailsComponent = ({idProduct}) => {
//     const user = useSelector((state) => state.user)
//     const fetchGetDetailsProduct = async (context) => {
//         const id = context?.queryKey && context?.queryKey[1]
//         if(id) {
//             const res = await ProductService.getDetailsProduct(id)
//             return res.data
//         }
//     }
//     const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled : !!idProduct})
//     return (
//         <Loading isLoading={isLoading}>
//             <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px', height:'100%' }}>
//                 <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
//                     <Image src={productDetails?.image} alt="image prodcut" preview={false} />
//                     <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
//                         <WrapperStyleColImage span={4} sty>
//                             <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
//                         </WrapperStyleColImage>
//                         <WrapperStyleColImage span={4}>
//                             <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
//                         </WrapperStyleColImage>
//                         <WrapperStyleColImage span={4}>
//                             <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
//                         </WrapperStyleColImage>
//                         <WrapperStyleColImage span={4}>
//                             <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
//                         </WrapperStyleColImage>
//                         <WrapperStyleColImage span={4}>
//                             <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
//                         </WrapperStyleColImage>
//                         <WrapperStyleColImage span={4}>
//                             <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
//                         </WrapperStyleColImage>
//                     </Row>
//                 </Col>
//                 <Col span={14} style={{ paddingLeft: '10px' }}>
//                         <WrapperStyleNameProduct>Name: {productDetails?.name}</WrapperStyleNameProduct>
//                         <WrapperStyleNameProduct>Price: {productDetails?.price}</WrapperStyleNameProduct>
//                         <WrapperStyleNameProduct>Count In Stock: {productDetails?.countInStock}</WrapperStyleNameProduct>
//                         <WrapperStyleNameProduct>Discount: {productDetails?.discount}</WrapperStyleNameProduct>
//                         <WrapperStyleNameProduct>Type: {productDetails?.type}</WrapperStyleNameProduct>
//                     <div>
//                         <WrapperStyleNameProduct>Rating: <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} /></WrapperStyleNameProduct>
//                     </div>
//                     <div>
//                         <WrapperStyleNameProduct>Description: {productDetails?.description}</WrapperStyleNameProduct>
//                     </div>
                    
//                 </Col>
//             </Row > 
//         </Loading>
//     )
// }
// export default ProductDetailsComponent





// // import {StarFilled, PlusOutlined, MinusOutlined} from '@ant-design/icons'
// // import React from "react"
// // import imageProduct from "../../assets/images/pd.webp"
// // import imageProductSmall from '../../assets/images/pdSmall.webp'
// // import { WrapperAddressProduct, WrapperBtnQualityProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from "./style"
// // import ButtonComponent from "../ButtonComponent/ButtonComponent"

// // const ProductDetailsComponent = () => {
// //     const onChange=()=>{}
// //     return(
// //         <Row style={{padding:'16px', backgroundColor:'#fff',borderRadius:'4px'}}>
// //             <Col span={10} style={{padding:'5px', border:'1px solid #e5e5e5', paddingRight:'8px'}}>
// //                 <Image src={imageProduct} alt='pd' preview={false} />
// //                 <Row style={{paddingTop:'10px', justifyContent:'space-between'}}>
// //                     <WrapperStyleColImage span={4}>
// //                         <WrapperStyleImageSmall src={imageProductSmall} alt='pd' preview={false} />
// //                     </WrapperStyleColImage>
// //                     <WrapperStyleColImage span={4}>
// //                         <WrapperStyleImageSmall src={imageProductSmall} alt='pd' preview={false} />
// //                     </WrapperStyleColImage>
// //                     <WrapperStyleColImage span={4}>
// //                         <WrapperStyleImageSmall src={imageProductSmall} alt='pd' preview={false} />
// //                     </WrapperStyleColImage>
// //                     <WrapperStyleColImage span={4}>
// //                         <WrapperStyleImageSmall src={imageProductSmall} alt='pd' preview={false} />
// //                     </WrapperStyleColImage>
// //                     <WrapperStyleColImage span={4}>
// //                         <WrapperStyleImageSmall src={imageProductSmall} alt='pd' preview={false} />
// //                     </WrapperStyleColImage>
// //                     <WrapperStyleColImage span={4}>
// //                         <WrapperStyleImageSmall src={imageProductSmall} alt='pd' preview={false} />
// //                     </WrapperStyleColImage>
// //                 </Row>
// //             </Col>
// //             <Col span={14} style={{paddingLeft:'10px'}}>
// //                 <WrapperStyleNameProduct>Máy tính laptop</WrapperStyleNameProduct>
// //                 <div>
// //                     <StarFilled style={{fontSize:'12px', color:'rgb(253,216,54)'}} />
// //                     <StarFilled style={{fontSize:'12px', color:'rgb(253,216,54)'}} />
// //                     <StarFilled style={{fontSize:'12px', color:'rgb(253,216,54)'}} />
// //                     <StarFilled style={{fontSize:'12px', color:'rgb(253,216,54)'}} />
// //                     <StarFilled style={{fontSize:'12px', color:'rgb(253,216,54)'}} />
// //                     <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
// //                 </div>
// //                 <WrapperPriceProduct>
// //                     <WrapperPriceTextProduct>200.000</WrapperPriceTextProduct>
// //                 </WrapperPriceProduct>
// //                 <WrapperAddressProduct>
// //                     <span>Giao đến </span>
// //                     <span className="address">your location</span> -
// //                     <span className="change-address">Đổi địa chỉ</span>
// //                 </WrapperAddressProduct>
// //                 <div style={{margin:'10px 0 20px', borderTop:'1px solid #e5e5e5', borderBottom:'1px solid #e5e5e5', padding:'10px 0'}}>
// //                     <div style={{marginBottom:'10px'}}>Số lượng</div>
// //                     <WrapperQualityProduct>
// //                         <button style={{border:'none',background:'transparent'}}>
// //                             <MinusOutlined style={{color: '#000'}} fontSize='20px' />
// //                         </button>

// //                         <WrapperInputNumber defaultValue={3} onChange={onChange} size='small' />

// //                         <button style={{border:'none',background:'transparent'}}>
// //                             <PlusOutlined style={{color: '#000'}} fontSize='5px' />
// //                         </button>
// //                     </WrapperQualityProduct>
// //                 </div>
// //                 <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
// //                     <ButtonComponent
// //                         size={20} 
// //                         styleButton={{background: 'rgb(255,57,69)',height:'48px',width:'220px',border:'none'}}
// //                         styleTextButton={{ color: '#fff', fontSize:'15px', fontWeight:'700' }}
// //                         textButton={'Chọn mua'}
// //                     >
// //                     </ButtonComponent>
// //                     <ButtonComponent
// //                         size={20} 
// //                         styleButton={{background: '#fff',height:'48px',width:'220px',border:'1px solid rgb(13,92,182)'}}
// //                         styleTextButton={{ color: 'rgb(13,92,182)', fontSize:'15px'}}
// //                         textButton={'Mua trả sau'}
// //                     >
// //                     </ButtonComponent>
// //                 </div>
// //             </Col>
// //         </Row>
// //     )
// // }

// // export default ProductDetailsComponent