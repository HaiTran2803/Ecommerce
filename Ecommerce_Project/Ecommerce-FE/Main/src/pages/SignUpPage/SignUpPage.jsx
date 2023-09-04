import React,{ useEffect, useState } from "react"
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from "../SignUpPage/style"
import InputForm from "../../components/InputForm/InputForm"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import { Image } from "antd"
import imageLogo from '../../assets/images/sign_in.png'
import {EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from "react-router-dom"
import Loading from "../../components/LoadingComponent/Loading"
import { useMutationHooks } from "../../hooks/useMutationHook"
import * as UserService from '../../services/UserService'
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
    const navigate = useNavigate()
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')

    const mutation = useMutationHooks(
        data => UserService.signupUser(data)
    )
    const {data, isLoading, isSuccess, isError} = mutation

    useEffect(() =>{
        if(isSuccess && data.status !== "ERR"){
            message.success()
            handleNavigateSignIn()
        }else if (isSuccess && data.status === "ERR") {
            message.error()
        }
    },[isSuccess, isError])
    
    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangePassword = (value) => {
        setPassword(value)
    }
    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }
    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }
    const handleSignUp = () => {
        mutation.mutate({email,password,confirmPassword})
    }

    return(
        <div style={{display:'flex',alignItems:'center',justifyContent:'center', background:'rgba(0,0,0,0.53)',height:'100vh'}}>
            <div style={{display:'flex',width:'800px',height:'445px',borderRadius:'6px',background:'#fff'}}>
                <WrapperContainerLeft>
                    <h1 style={{fontSize:'25px'}}>Chào mừng</h1>
                    <p style={{fontSize:'15px'}}>Tạo tài khoản mới</p>
                    <InputForm style={{marginBottom:'10px'}} placeholder='abc@gmail.com'  
                        value={email}  onChange = {handleOnchangeEmail}/>
                
                    <div style={{position:'relative'}}>
                        <span onClick={()=> setIsShowPassword(!isShowPassword)}
                            style={{
                            zIndex:10,
                            position: "absolute",
                            top: '9px',
                            right:'9px'
                        }}>
                            {isShowPassword ? (<EyeFilled />):(<EyeInvisibleFilled />)}
                        </span>
                        
                        <InputForm style={{marginBottom:'10px'}} placeholder='password' type={isShowPassword ? 'text':'password'}
                                    value={password}  onChange = {handleOnchangePassword}/>
                        </div>

                        <div style={{position:'relative'}}>
                        <span 
                            onClick={()=> setIsShowConfirmPassword(!isShowConfirmPassword)}
                            style={{
                            zIndex:10,
                            position: "absolute",
                            top: '9px',
                            right:'9px'
                        }}>
                            {isShowConfirmPassword ? (<EyeFilled />):(<EyeInvisibleFilled />)}
                        </span>
                        <InputForm placeholder='Confirm password' type={isShowConfirmPassword ? 'text':'password'}
                                    value={confirmPassword}  onChange = {handleOnchangeConfirmPassword}/>                        
                    </div>
                    {data?.status === 'ERR' && <span style={{color: 'red', fontSize: '16px'}}>{data?.message}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
                            disabled = {!email.length || !password.length || !confirmPassword.length}
                            disable = {!email.length || !password.length || !confirmPassword.length}
                            onClick={handleSignUp}
                            size={20} 
                            styleButton={{background: 'rgb(255,57,69)',height:'48px',width:'100%',border:'none', margin:'26px 0 10px'}}
                            styleTextButton={{ color: '#fff', fontSize:'15px', fontWeight:'700' }}
                            textButton={'Đăng ký'}
                        >
                        </ButtonComponent>
                    </Loading>
                    <p style={{fontSize:'13px'}}>Đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}>Đăng nhập</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={imageLogo} preview={false} alt='sign in' height='203px' width='203px' />
                    <h2>Alway The Best Choice </h2>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignUpPage