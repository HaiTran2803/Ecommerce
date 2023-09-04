import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { routes } from './routes'; 
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
// import axios from 'axios';
// import { useQuery } from 'react-query';
import { isJsonString } from './utils';
import jwt_decode from "jwt-decode"
import * as UserService from './services/UserService'
import {useDispatch, useSelector } from 'react-redux'
import { updateUser } from "./redux/slides/userSlide"
import Loading from './components/LoadingComponent/Loading';

function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)
  useEffect(() =>{
    setIsLoading(true)
    const {storageData,decoded} = handleDecoded()
        // console.log('decoded', decoded)
        if(decoded?.id){
            handleGetDetailsUser(decoded?.id, storageData)
        }
        setIsLoading(false)
  },[])

  const handleDecoded = ()=>{
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if(storageData && isJsonString(storageData)){
      storageData = JSON.parse(storageData)
        decoded = jwt_decode(storageData)
    }
    return {decoded, storageData}
  }


  UserService.axiosJWT.interceptors.request.use(async(config) => {
    const currentTime = new Date()
    const {decoded} = handleDecoded()
    if(decoded?.exp < currentTime.getTime()/ 1000){
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config
  },(err) => {
    return Promise.reject(err)
  }
)

  const handleGetDetailsUser = async (id, token) => {
    // const storage = localStorage.getItem('refresh_token')
    // const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))

  }


  
  return (
    <div>
      <Loading isLoading={isLoading} >
        <Router>
          <Routes>
            {routes.map((route)=>{
              const Page = route.page
              // const ischeckAuth = !route.isPrivate || user.isAdmin
              const ischeckAuth = !route.isPrivate && user.isAdmin
              const Layout = route.isShowHeader ? DefaultComponent: Fragment
              return (
                <Route 
                  key={route.path} 
                  path={{ischeckAuth} && route.path}
                  element={
                  <Layout>
                    <Page />
                  </Layout>
                  }/>
              )
            })}
          </Routes>
        </Router>
      </Loading>

    </div>
  )
}

export default App;