import React from "react";
import { PieChartOutlined, TeamOutlined, ShoppingCartOutlined, GoldOutlined } from '@ant-design/icons'
const AdminDefault = () =>{
    return(
        <div style={{display:"flex" ,flexDirection:"column", gap:"20px", fontSize:"20px"}}>
            <div style={{display:"flex",gap:"20px", alignItems:"center"}}>
                <TeamOutlined style={{fontSize:"40px"}}/> 
                Quản lý người dùng            
            </div>
            <div style={{display:"flex",gap:"20px", alignItems:"center"}}>
                <GoldOutlined style={{fontSize:"40px"}}/>  
                Quản lý sản phẩm              
            </div>
            <div style={{display:"flex",gap:"20px", alignItems:"center"}}>
                <ShoppingCartOutlined style={{fontSize:"40px"}}/>
                Quản lý đơn hàng và thống kê thông tin đơn hàng
            </div>
        </div>
    )
}

export default AdminDefault