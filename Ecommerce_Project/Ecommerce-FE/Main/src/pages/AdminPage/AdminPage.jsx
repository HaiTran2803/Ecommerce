import React, { useEffect, useState } from 'react'
import { PieChartOutlined, TeamOutlined, ShoppingCartOutlined, GoldOutlined } from '@ant-design/icons'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import AdminProduct from '../../components/AdminProduct/AdminProduct'
import AdminUser from '../../components/AdminUser/AdminUser'
import { useSelector } from 'react-redux';
import * as ProductService from '../../services/ProductService'
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading';
import OrderAdmin from '../../components/OrderAdmin/OrderAmin'
import AdminDefault from '../../components/AdminDefault/AdminDefault'


const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {token: { colorBgContainer }} = theme.useToken()
  const [keySelected, setKeySelected] = useState('');
  const [keyPage,setKeyPage] = useState(0) 
  const showHeader = () =>{
    if(keyPage === '1'){
      return(<>Users</>)
    }else if(keyPage === '2'){
      return(<>Product</>)
    }else if(keyPage === '3'){
      return(<>Shopping Cart</>)
    }
  } 
  const { Header, Content, Footer, Sider } = Layout;
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  
  const items = [
    getItem('Users', '1', <TeamOutlined />),
    getItem('Products', '2',<GoldOutlined /> ),
    getItem('Shopping Cart', '3', <ShoppingCartOutlined/>),
  ];


  const user = useSelector((state) => state?.user)
  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct()
    console.log('res1', res)
    return {data: res?.data, key: 'products'}
  }
  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    console.log('res', res)
    return {data: res?.data, key: 'users'}
  }
  const renderPage = (key) => {
    switch(key){
        case '1':
            return (
                <AdminUser/>
            )
        case '2':
            return (
                <AdminProduct/>
            )
        case '3':
          return (
              <OrderAdmin/>
          )
        default:
            return <AdminDefault/>
    }
  }

  const handleOnClick = (label, key, icon, children) => {
    setKeySelected(label.key)
    setKeyPage(label.key)
  }

  return (
        <>
        <HeaderComponent isHiddenSearch={true} isHiddenCart={true} isAdminHeader={true}/>
            <Layout style={{minHeight: '100vh',}}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu 
                    style={{}}
                    theme="dark" 
                    defaultSelectedKeys={['0']} 
                    mode="inline" 
                    items={items} 
                    onClick={handleOnClick}
                    />
            </Sider>
            <Layout>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    textAlign: "center",
                    fontSize: "35px"}}> {showHeader()} Management </Header> 
                <Content style={{margin: '0 16px',}}>
                <Breadcrumb style={{margin: '16px 0',}}>
                    {/* <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
                </Breadcrumb>
                  <div style={{padding: 24, minHeight: 360, background: colorBgContainer,}}>
                      {renderPage(keySelected)}
                  </div>
                </Content>
                <Footer style={{textAlign: 'center',}}>
                    ©2023
                </Footer>
            </Layout>
            </Layout>
        </>
  );
};
export default AdminPage;