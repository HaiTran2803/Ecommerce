import { Badge, Col, Popover } from "antd"
import React, { useState, useEffect } from "react"
import {WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall, WrapperContentPopup } from './style'
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch"
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import * as UserService from '../../services/UserService'
import { resetUser } from "../../redux/slides/userSlide"
import Loading from "../LoadingComponent/Loading"
import { searchProduct } from '../../redux/slides/productSlice'
import Logo from "../../assets/images/LOGO2.png"

const HeaderComponent = ({isHiddenSearch = false, isHiddenCart = false, isAdminHeader = false}) => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const dispatch = useDispatch()
    const [search,setSearch] = useState('')
    const order = useSelector((state) => state.order)
    const [loading, setLoading] = useState(false)

    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }
    //
    const handleNavigateMain = () => {
        navigate('/')
    }
    //

const handleLogout = async() =>{
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setLoading(false)
}
useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name, user?.avatar])


    const content = (
            <div>
                <WrapperContentPopup onClick={() => navigate('/profile-user')}>User Infor</WrapperContentPopup>
                {user?.isAdmin && (
                    <WrapperContentPopup onClick={() => navigate('/system/admin')}>System Management</WrapperContentPopup>
                )}
                <WrapperContentPopup onClick={handleLogout}>LogOut</WrapperContentPopup>
            </div>
      );
    const backgroundchange = isAdminHeader ? '#001529':'#001529'

    const onSearch = (e) => {
        setSearch(e.target.value)
        // console.log("searching", search)
        dispatch(searchProduct(e.target.value))
        // console.log("searchingproduct", searchProduct)
      }
    return(
        <div style={{width:'100%',background:backgroundchange ,display:'flex', justifyContent:'center'}}>
            <WrapperHeader style={{background:backgroundchange, justifyContent: isAdminHeader ? 'space-between' : 'unset'}} gutter={16}>
                <Col span={5}>
                    <WrapperTextHeader>
                        <div onClick={handleNavigateMain} style={{width:'130px', display: 'flex', flexDirection:"column",cursor: 'pointer'}} >
                            <img  src={Logo} width={90} height={50} />HomePage
                        </div>
                    </WrapperTextHeader>
                </Col>
                {!isHiddenSearch && (                
                    <Col span={13}>
                        <ButtonInputSearch
                            placeholder="Search..."
                            textButton="Search"
                            size="large"
                            // backgroundColorButton="#5a20c1"
                            backgroundColorButton="#33CCFF"
                            onChange={onSearch}                           
                        />
                    </Col> )}
 
                <Col span={6} style={{display: "flex", gap: '54px', alignItems:'center'}}>
                    <Loading isLoading={loading}>
                        <WrapperHeaderAccount>
                            {userAvatar ? (
                                <img src={userAvatar} alt="avatar" style={{
                                height: '30px',
                                width: '30px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                                }} />
                            ) : (
                                <UserOutlined style={{ fontSize: '30px' }} />
                            )}
                            {user?.access_token ? (
                                <div style={{float: 'left'}}>
                                    <Popover content={content} trigger='click'>
                                        <div style={{cursor: 'pointer', //textOverflow:"ellipsis", width:"20px", wordWrap:"break-all",
                                                    padding: "10px 10px 10px 0px"}}
                                        >{user.name !== "" ? user.name : user.email }</div>
                                    </Popover>
                                </div>
                            ) : <div onClick={handleNavigateLogin} style={{cursor: 'pointer'}}>
                                <WrapperTextHeaderSmall>Login/Register</WrapperTextHeaderSmall>
                                <div>
                                    <WrapperTextHeaderSmall>Account</WrapperTextHeaderSmall>
                                    <CaretDownOutlined />
                                </div>
                            </div>}
                        </WrapperHeaderAccount>
                    </Loading>

                    {!isHiddenCart && (
                        <div style={{marginTop:'8px'}}>
                            <div onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
                                <Badge count={order?.orderItems?.length}>
                                    <ShoppingCartOutlined style={{fontSize: '30px', color: '#fff'}}/>
                                </Badge>
                                <WrapperTextHeaderSmall>Cart</WrapperTextHeaderSmall>
                            </div>
                        </div>
                    )}
                </Col>
            </WrapperHeader>
        </div>
    )
}

export default HeaderComponent