import React, { useState, useEffect } from "react"
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from "./style"
import InputForm from "../../components/InputForm/InputForm"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import { Image } from "antd"
import imageLogo from '../../assets/images/sign_in.png'
import {EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from "react-router-dom"
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook"
import Loading from "../../components/LoadingComponent/Loading"
import jwt_decode from "jwt-decode"
import {useDispatch, useSelector } from 'react-redux'
import { updateUser } from "../../redux/slides/userSlide"
import * as message from '../../components/Message/Message'


const SignInPage = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [isShowPassword, setIsShowPassword] = useState(false)
    const location = useLocation()
    const dispatch = useDispatch()
    const user  = useSelector((state) => state.user)
    const navigate = useNavigate()


    const mutation = useMutationHooks(
         data => UserService.loginUser(data)
    )
    
    const {data, isLoading, isSuccess} = mutation

    
    useEffect(()=>{
        if(isSuccess && data.status !== "ERR"){
            if(location?.state) {
                navigate(location?.state)
            }else {
                message.success()
                navigate('/')
            }
            
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
            if(data?.access_token){
                const decoded = jwt_decode(data?.access_token)
                if(decoded?.id){
                    handleGetDetailsUser(decoded?.id, data?.access_token)
                }
            }
        }else if(isSuccess && data.status === "ERR"){
            message.error()
        }
    },[isSuccess])

    const handleGetDetailsUser = async (id, token) => {
        // const storage = localStorage.getItem('refresh_token')
        // const refreshToken = JSON.parse(storage)
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleNavigateSignUp = () =>{
        navigate('/sign-up')
    }
    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangePassword = (value) => {
        setPassword(value)
    }

    const handleSignIn = () => {
        // console.log('logingloin')
        mutation.mutate({email,password})
    }

    return(
        <div style={{display:'flex',alignItems:'center',justifyContent:'center', background:'rgba(0,0,0,0.53)',height:'100vh'}}>
            <div style={{display:'flex',width:'800px',height:'445px',borderRadius:'6px',background:'#fff'}}>
                <WrapperContainerLeft>
                    <h1>Xin chào,</h1>
                    <p style={{fontSize:'13px'}}>Đăng nhập hoặc tạo tài khoản</p>
                    <InputForm style={{marginBottom:'10px'}} placeholder='abc@gmail.com' 
                            value={email} onChange={handleOnchangeEmail}/>
                    <div style={{position:'relative'}}>
                        <span 
                            onClick={()=> setIsShowPassword(!isShowPassword)}
                            style={{
                            zIndex:10,
                            position: "absolute",
                            top: '9px',
                            right:'9px'
                        }}>
                            {isShowPassword ? (<EyeFilled />):(<EyeInvisibleFilled />)}
                        </span>
                        <InputForm 
                            placeholder='password' 
                            type={isShowPassword ? 'text':'password'}  
                            value={password} onChange={handleOnchangePassword}
                        />
                    </div>
                    {data?.status === 'ERR' && <span style={{color: 'red', fontSize:'15px'}}>{data?.message}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                            disabled = {!email.length || !password.length}
                            disable = {!email.length || !password.length}
                            onClick={handleSignIn}
                            size={20} 
                            styleButton={{background: 'rgb(255,57,69)',height:'48px',width:'100%',border:'none', margin:'26px 0 10px'}}
                            styleTextButton={{ color: '#fff', fontSize:'15px', fontWeight:'700' }}
                            textButton={'Đăng nhập'}
                        >
                        </ButtonComponent>
                    </Loading>
                    <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
                    <p style={{fontSize:'13px'}}>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}>Đăng ký ngay</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={imageLogo} preview={false} alt='sign in' height='203px' width='203px' />
                    <h2>Alway The Best Choice</h2>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignInPage