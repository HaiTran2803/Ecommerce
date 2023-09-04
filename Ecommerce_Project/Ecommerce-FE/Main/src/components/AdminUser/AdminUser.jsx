import { Button, Form, Select, Space, Input } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import React, { useRef } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import { useState } from 'react'
import { getBase64, renderOptions } from '../../utils'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { useEffect } from 'react'
import * as message from '../../components/Message/Message'
import { useQuery } from 'react-query'
import DrawerComponent from '../Drawer/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'


const AdminUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const inittial = () => ({
        name: '',
        email: '',
        phone: '',
        isAdmin: true,
        address: '',
        avatar:''
    })
    const [stateUser, setStateUser] = useState(inittial())
    const [stateUserDetails, setStateUserDetails] = useState(inittial())
 
    const mutation = useMutationHooks(
        (data) => {
        const { 
            name,
            email,
            phone,
            isAdmin,
            address,
            avatar } = data
        const res = UserService.signupUser({
            name,
            email,
            phone,
            isAdmin,
            address,
            avatar
        })
        return res
        }
    )
    const mutationUpdate = useMutationHooks(
        (data) => {
        const { id,
            token,
            ...rests } = data
        const res = UserService.updateUser(
            id,
            token,
            { ...rests }, token)
        return res
        },
    )
    const mutationDeleted = useMutationHooks(
        (data) => {
          const { id,
            token,
          } = data
          const res = UserService.deleteUser(
            id,
            token)
          return res
        },
    )
    const mutationDeletedMany = useMutationHooks(
        (data) => {
          const { token, ...ids
          } = data
          const res = UserService.deleteManyUser(
            ids,
            token)
          return res
        },
    )
    const getAllUsers = async () => {
        const res = await UserService.getAllUser()
        return res
    }
    
    const handleDeleteManyUsers = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
          onSettled: () => {
            queryClient.invalidateQueries(['users'])
          }
        })
      }
    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected)
        if (res?.data) {
          setStateUserDetails({
            name: res?.data?.name,
            email: res?.data?.email,
            phone: res?.data?.phone,
            isAdmin: res?.data?.isAdmin,
            address: res?.data?.address,
            avatar: res.data?.avatar
          })
        }
        setIsLoadingUpdate(false)
      }

    useEffect(() => {
        if(!isModalOpen) {
        form.setFieldsValue(stateUserDetails)
        }else {
        form.setFieldsValue(inittial())
        }
    }, [form, stateUserDetails, isModalOpen])
    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
        setIsLoadingUpdate(true)
        fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])
    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }
    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

    const queryClient = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
    const { isLoading: isLoadingUsers, data: users } = queryClient
    const renderAction = () => {
        return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{marginLeft: '0px'}}>
                <EditOutlined style={{ color: 'black', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
            </div>
            <div style={{marginLeft: '15px'}}>
                <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
            </div>
        </div>
        )
    }
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };
    const handleReset = (clearFilters) => {
        clearFilters();
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{padding: 8,}}
            onKeyDown={(e) => e.stopPropagation()}>
            <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
                marginBottom: 8,
                display: 'block',
            }}
            />
            <Space>
            <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                width: 90,
                }}
            >
                Search
            </Button>
            <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                width: 90,
                }}
            >
                Reset
            </Button>
            </Space>
        </div>
        ),
        filterIcon: (filtered) => (
        <SearchOutlined
            style={{
            color: filtered ? '#1890ff' : undefined,
            }}
        />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
            },
        });
        const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              sorter: (a, b) => a.name.length - b.name.length,
              ...getColumnSearchProps('name')
            },
            {
              title: 'Email',
              dataIndex: 'email',
              sorter: (a, b) => a.email.length - b.email.length,
              ...getColumnSearchProps('email')
            },
            {
              title: 'Address',
              dataIndex: 'address',
              sorter: (a, b) => a.address.length - b.address.length,
              ...getColumnSearchProps('address')
            },
            {
              title: 'Admin',
              dataIndex: 'isAdmin',
              filters: [
                {
                  text: 'True',
                  value: true,
                },
                {
                  text: 'False',
                  value: false,
                }
              ],
            },
            {
              title: 'Phone',
              dataIndex: 'phone',
              sorter: (a, b) => a.phone - b.phone,
              ...getColumnSearchProps('phone')
            },
            {
              title: 'Action',
              dataIndex: 'action',
              render: renderAction
            },
          ];
    const dataTable = users?.data?.length > 0 && users?.data?.map((user) => {
        return { ...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE' }
    })
    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
        message.success()
        handleCancel()
        } else if (isError) {
        message.error()
        }
    }, [isSuccess])
    useEffect(() => {
        if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
        message.success()
        } else if (isErrorDeletedMany) {
        message.error()
        }
    }, [isSuccessDelectedMany])
    useEffect(() => {
        if (isSuccessDelected && dataDeleted?.status === 'OK') {
        message.success()
        handleCancelDelete()
        } else if (isErrorDeleted) {
        message.error()
        }
    }, [isSuccessDelected])
    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: '',
            address: '',
            avatar:''
        })
        form.resetFields()
    };
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
        message.success()
        handleCloseDrawer()
        } else if (isErrorUpdated) {
        message.error()
        }
    }, [isSuccessUpdated])
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }
    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
        onSettled: () => {
            queryClient.refetch()
        }
        })
    }
    const handleCancel = () => {
        setIsModalOpen(false);
        setStateUser({
            name: '',
            email: '',
            phone: '',
            isAdmin: '',
            address: '',
            avatar:''
        })
        form.resetFields()
    }
    const onFinish = () => {
        const params = {
        name: stateUser.name,
        email: stateUser.email,
        phone: stateUser.phone,
        isAdmin: stateUser.isAdmin,
        address: stateUser.address,
        avatar: stateUser.avatar
        }
        mutation.mutate(params, {
        onSettled: () => {
            queryClient.refetch()
        }
        })
    }
    const handleOnchange = (e) => {
        setStateUser({
        ...stateUser,
        [e.target.name]: e.target.value
        })
    }
    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
        ...stateUserDetails,
        [e.target.name]: e.target.value
        })
    }
    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }
        setStateUser({
        ...stateUser,
        image: file.preview
        })
    }
    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
        ...stateUserDetails,
        image: file.preview
        })
    }
    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
        onSettled: () => {
            queryClient.refetch()
        }
        })
    }
    const handleChangeSelect = (value) => {
        setStateUser({
            ...stateUser,
            type: value
        })
    }

    return (
        <div>
        <WrapperHeader> Thêm người dùng </WrapperHeader>
        <div style={{ marginTop: '10px' }}>
            <Button style={{ height: '130px', width: '130px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '50px' }} /></Button>
        </div>
        <div style={{ marginTop: '20px' }}>
            <TableComponent handleDelteMany={handleDeleteManyUsers} columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
            return {
                onClick: event => {
                setRowSelected(record._id)
                }
            };
            }} />
        </div>
        <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <Loading isLoading={isLoading}>
                <Form   name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form={form}>
                    <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input name!' }]}>
                        <Input value={stateUser['name']} onChange={handleOnchange} name="name" />
                    </Form.Item>

                    <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your count Email!' }]}>
                        <Input value={stateUser['email']} onChange={handleOnchange} name="email" />
                    </Form.Item>
                    
                    <Form.Item
                        label="Image"
                        name="image"
                        rules={[{ required: true, message: 'Please input your count image!' }]}>
                    <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Button style={{alignSelf: 'flex-start'}}>Select File</Button>
                            <div    style={{margin: "0px 0px 0px 30px", height: '100px', width: '100px', 
                                    borderRadius: "50%", borderStyle:"dashed", borderWidth:"1px",
                                    boxShadow:"1px 3px 2px 2px #ccc"}}
                            >
                                {stateUser?.image && (
                                <img src={stateUser?.image} style={{
                                    height: '90px',
                                    width: '90px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginLeft: '5px',
                                    marginTop: '5px'
                                }} alt="avatar" />)} 
                            </div>
                        </div>

                    </WrapperUploadFile>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 19, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    </Form.Item>
                </Form>
            </Loading>
        </ModalComponent>
        <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="30%">
            <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onUpdateUser}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                    <Input value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
                    </Form.Item>

                    <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Please input your type!' }]}
                    >
                    <Input value={stateUserDetails['email']} onChange={handleOnchangeDetails} name="email" />
                    </Form.Item>
                    <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please input your count inStock!' }]}
                    >
                    <Input value={stateUserDetails.countInStock} onChange={handleOnchangeDetails} name="phone" />
                    </Form.Item>
                    <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input your count price!' }]}
                    >
                    <Input value={stateUserDetails.price} onChange={handleOnchangeDetails} name="address" />
                    </Form.Item>
                    <Form.Item
                    label="Avatar"
                    name="avatar"
                    rules={[{ required: true, message: 'Please input your count image!' }]}
                    >
                    <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                        <Button >Select File</Button>
                        {stateUserDetails?.avatar && (
                        <img src={stateUserDetails?.avatar} style={{
                            height: '60px',
                            width: '60px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginLeft: '10px'
                        }} alt="avatar" />
                        )}
                    </WrapperUploadFile>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Apply
                    </Button>
                    </Form.Item>
                </Form>
            </Loading>
        </DrawerComponent>
        <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
            <Loading isLoading={isLoadingDeleted}>
                <div>Bạn có chắc xóa sản phẩm này không?</div>
            </Loading>
        </ModalComponent>
        </div>
  )
}

export default AdminUser


// import React from 'react'
// import { WrapperHeader, WrapperUploadFile } from './style'
// import TableComponent from '../TableComponent/TableComponent'
// import InputComponent from '../InputComponent/InputComponent'
// import DrawerComponent from '../Drawer/DrawerComponent'
// import Loading from '../LoadingComponent/Loading'
// import ModalComponent from '../ModalComponent/ModalComponent'
// import { getBase64 } from '../../utils'
// import { useEffect } from 'react'
// import * as message from '../../components/Message/Message'
// import { useState } from 'react'
// import { useSelector } from 'react-redux'
// import { useRef } from 'react'
// import { useMutationHooks } from '../../hooks/useMutationHook'
// import * as UserService from '../../services/UserService'
// import { useIsFetching, useQuery, useQueryClient } from 'react-query'
// import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'

//     const AdminUser = () => {
//     const [rowSelected, setRowSelected] = useState('')
//     const [isOpenDrawer, setIsOpenDrawer] = useState(false)
//     const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
//     const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
//     const user = useSelector((state) => state?.user)
//     const searchInput = useRef(null);

//     const [stateUserDetails, setStateUserDetails] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         isAdmin: false,
//         avatar: '',
//         address: ''
//     })
//     const [form] = Form.useForm();

//     const mutationUpdate = useMutationHooks(
//         (data) => {
//         const { id,
//             token,
//             ...rests } = data
//         const res = UserService.updateUser(
//             id,
//             { ...rests }, token)
//         return res
//         },
//     )

//     const mutationDeletedMany = useMutationHooks(
//         (data) => {
//         const { token, ...ids
//         } = data
//         const res = UserService.deleteManyUser(
//             ids,
//             token)
//         return res
//         },
//     )
//     const handleDelteManyUsers = (ids) => {
//         mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
//         onSettled: () => {
//             queryClient.invalidateQueries(['users'])
//         }
//         })
//     }
//     const mutationDeleted = useMutationHooks(
//         (data) => {
//         const { id,
//             token,
//         } = data
//         const res = UserService.deleteUser(
//             id,
//             token)
//         return res
//         },
//     )
//     const fetchGetDetailsUser = async (rowSelected) => {
//         const res = await UserService.getDetailsUser(rowSelected)
//         if (res?.data) {
//         setStateUserDetails({
//             name: res?.data?.name,
//             email: res?.data?.email,
//             phone: res?.data?.phone,
//             isAdmin: res?.data?.isAdmin,
//             address: res?.data?.address,
//             avatar: res.data?.avatar
//         })
//         }
//         setIsLoadingUpdate(false)
       
//     }
//     // console.log("data",stateUserDetails)
//     // console.log("row",rowSelected)

//     useEffect(() => {
//         form.setFieldsValue(stateUserDetails)
//     }, [form, stateUserDetails])

//     useEffect(() => {
//         if (rowSelected && isOpenDrawer) {
//         setIsLoadingUpdate(true)
//         fetchGetDetailsUser(rowSelected)
//         }
//     }, [rowSelected, isOpenDrawer])

//     const handleDetailsUser = () => {
//         setIsOpenDrawer(true)
//     }
//     // console.log("data") 
//     const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
//     const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
//     const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

//     const queryClient = useQueryClient()
//     const users = queryClient.getQueryData(['users'])
//     const isFetchingUser = useIsFetching(['users'])
//     console.log("query",queryClient)
//     console.log("users",users)

//     const renderAction = () => {
//         return (
//         <div>
//             <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
//             <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsUser} />
//         </div>
//         )
//     }

//     const handleSearch = (selectedKeys, confirm, dataIndex) => {
//         confirm();
//     };
//     const handleReset = (clearFilters) => {
//         clearFilters();
//     };

//     const getColumnSearchProps = (dataIndex) => ({
//         filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//         <div
//             style={{
//             padding: 8,
//             }}
//             onKeyDown={(e) => e.stopPropagation()}
//         >
//             <InputComponent
//             ref={searchInput}
//             placeholder={`Search ${dataIndex}`}
//             value={selectedKeys[0]}
//             onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//             onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             style={{
//                 marginBottom: 8,
//                 display: 'block',
//             }}
//             />
//             <Space>
//             <Button
//                 type="primary"
//                 onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//                 icon={<SearchOutlined />}
//                 size="small"
//                 style={{
//                 width: 90,
//                 }}
//             >
//                 Search
//             </Button>
//             <Button
//                 onClick={() => clearFilters && handleReset(clearFilters)}
//                 size="small"
//                 style={{
//                 width: 90,
//                 }}
//             >
//                 Reset
//             </Button>
//             </Space>
//         </div>
//         ),
//         filterIcon: (filtered) => (
//         <SearchOutlined
//             style={{
//             color: filtered ? '#1890ff' : undefined,
//             }}
//         />
//         ),
//         onFilter: (value, record) =>
//         record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//         onFilterDropdownOpenChange: (visible) => {
//         if (visible) {
//             setTimeout(() => searchInput.current?.select(), 100);
//         }
//         },
//     });

//     const columns = [
//         {
//             title: 'Name',
//             dataIndex: 'name',
//             sorter: (a, b) => a.name.length - b.name.length,
//             ...getColumnSearchProps('name')
//         },
//         {
//             title: 'Email',
//             dataIndex: 'email',
//             sorter: (a, b) => a.email.length - b.email.length,
//             ...getColumnSearchProps('email')
//         },
//         {
//             title: 'Address',
//             dataIndex: 'address',
//             sorter: (a, b) => a.address.length - b.address.length,
//             ...getColumnSearchProps('address')
//         },
//         {
//             title: 'Admin',
//             dataIndex: 'isAdmin',
//             filters: [
//                 {
//                 text: 'True',
//                 value: true,
//                 },
//                 {
//                 text: 'False',
//                 value: false,
//                 }
//             ],
//         },
//         {
//             title: 'Phone',
//             dataIndex: 'phone',
//             sorter: (a, b) => a.phone - b.phone,
//             ...getColumnSearchProps('phone')
//         },
//         {
//             title: 'Action',
//             dataIndex: 'action',
//             render: renderAction
//         },
//     ];
//     const dataTable = users?.data?.length > 0 && users?.data?.map((user) => {
//         return { ...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE' }
//     })
//     console.log("table",dataTable)
//     useEffect(() => {
//         if (isSuccessDelected && dataDeleted?.status === 'OK') {
//             message.success()
//             handleCancelDelete()
//         } else if (isErrorDeleted) {
//             message.error()
//         }
//     }, [isSuccessDelected])

//     useEffect(() => {
//         if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
//             message.success()
//         } else if (isErrorDeletedMany) {
//             message.error()
//         }
//     }, [isSuccessDelectedMany])

//     const handleCloseDrawer = () => {
//         setIsOpenDrawer(false);
//         setStateUserDetails({
//         name: '',
//         email: '',
//         phone: '',
//         isAdmin: false,
//         })
//         form.resetFields()
//     };

//     useEffect(() => {
//         if (isSuccessUpdated && dataUpdated?.status === 'OK') {
//         message.success()
//         handleCloseDrawer()
//         } else if (isErrorUpdated) {
//         message.error()
//         }
//     }, [isSuccessUpdated])

//     const handleCancelDelete = () => {
//         setIsModalOpenDelete(false)
//     }

//     const handleDeleteUser = () => {
//         mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
//         onSettled: () => {
//             queryClient.invalidateQueries(['users'])
//         }
//         })
//     }

//     const handleOnchangeDetails = (e) => {
//         setStateUserDetails({
//         ...stateUserDetails,
//         [e.target.name]: e.target.value
//         })
//     }

//     const handleOnchangeAvatarDetails = async ({ fileList }) => {
//         const file = fileList[0]
//         if (!file.url && !file.preview) {
//         file.preview = await getBase64(file.originFileObj);
//         }
//         setStateUserDetails({
//         ...stateUserDetails,
//         avatar: file.preview
//         })
//     }
//     const onUpdateUser = () => {
//         mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
//         onSettled: () => {
//             queryClient.invalidateQueries(['users'])
//         }
//         })
//     }

//     return (
//         <div>
//         <WrapperHeader>Quản lý người dùng</WrapperHeader>
//         <div style={{ marginTop: '20px' }}>
//             <TableComponent handleDelteMany={handleDelteManyUsers} columns={columns} isLoading={isFetchingUser} data={dataTable} onRow={(record, rowIndex) => {
//             return {
//                 onClick: event => {
//                 setRowSelected(record._id)
//                 }
//             };
//             }} />
//         </div>
//         <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="40%">
//             <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>

//             <Form
//                 name="basic"
//                 labelCol={{ span: 2 }}
//                 wrapperCol={{ span: 22 }}
//                 onFinish={onUpdateUser}
//                 autoComplete="on"
//                 form={form}
//             >
//                 <Form.Item
//                 label="Name"
//                 name="name"
//                 rules={[{ required: true, message: 'Please input your name!' }]}
//                 >
//                 <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
//                 </Form.Item>

//                 <Form.Item
//                 label="Email"
//                 name="email"
//                 rules={[{ required: true, message: 'Please input your email!' }]}
//                 >
//                 <InputComponent value={stateUserDetails['email']} onChange={handleOnchangeDetails} name="email" />
//                 </Form.Item>
//                 <Form.Item
//                 label="Phone"
//                 name="phone"
//                 rules={[{ required: true, message: 'Please input your  phone!' }]}
//                 >
//                 <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
//                 </Form.Item>

//                 <Form.Item
//                 label="Adress"
//                 name="address"
//                 rules={[{ required: true, message: 'Please input your  address!' }]}
//                 >
//                 <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
//                 </Form.Item>

//                 <Form.Item
//                 label="Avatar"
//                 name="avatar"
//                 rules={[{ required: true, message: 'Please input your image!' }]}
//                 >
//                 <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
//                     <Button >Select File</Button>
//                     {stateUserDetails?.avatar && (
//                     <img src={stateUserDetails?.avatar} style={{
//                         height: '60px',
//                         width: '60px',
//                         borderRadius: '50%',
//                         objectFit: 'cover',
//                         marginLeft: '10px'
//                     }} alt="avatar" />
//                     )}
//                 </WrapperUploadFile>
//                 </Form.Item>
//                 <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
//                 <Button type="primary" htmlType="submit">
//                     Apply
//                 </Button>
//                 </Form.Item>
//             </Form>
//             </Loading>
//         </DrawerComponent>
//         <ModalComponent title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
//             <Loading isLoading={isLoadingDeleted}>
//             <div>Bạn có chắc xóa tài khoản này không?</div>
//             </Loading>
//         </ModalComponent>
//         </div>
//     )
//     }

// export default AdminUser