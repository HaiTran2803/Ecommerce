import React, { useState } from 'react';
import { Button, Divider, Table } from 'antd';
import Loading from '../LoadingComponent/Loading';
import { Excel } from "antd-table-saveas-excel";
import { useMemo } from 'react';



const TableComponent = (props) => {
    const {selectionType = 'checkbox', data:dataSource = [], isLoading = false, columns=[], handleDelteMany} = props
    // const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const [rowSelectedKeys] = useState([])
    const newColumnExport = useMemo(() => {
      const arr = columns?.filter((col) => col.dataIndex !== 'action')
      return arr
    }, [columns])
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
      }
      const handleDeleteAll = () => {
        handleDelteMany(rowSelectedKeys)
      }
      const exportExcel = () => {
        const excel = new Excel();
        excel
          .addSheet("test")
          .addColumns(newColumnExport)
          .addDataSource(dataSource, {
            str2Percent: true
          })
          .saveAs("Excel.xlsx");
      };
    return(
      <Loading isLoading={isLoading}>
        <div>
        {!!rowSelectedKeys.length && (
          <div style={{
            background: '#1d1ddd',
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px',
            cursor: 'pointer'
          }}
            onClick={handleDeleteAll}
          >
            Xóa tất cả
          </div>
          )}
          <Button onClick={exportExcel}>Export Excel File</Button>
          <Divider />
          <Table
            rowSelection={{type: selectionType,...rowSelection,}}
            columns={columns}
            dataSource={dataSource}
            {...props}
          />
        </div>        
      </Loading>

    )
}

export default TableComponent