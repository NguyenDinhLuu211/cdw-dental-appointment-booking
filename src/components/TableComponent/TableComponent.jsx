import { Divider, Dropdown, Radio, Space, Table } from "antd";
import React, { useMemo, useRef, useState } from "react";
import Loading from "../LoadingComponent/Loading";
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const TableComponent = (props) => {
  const { selectionType = 'checkbox', data: dataSource = [], isPending = false, columns = [], handleDeleteMany } = props;
  const [rowSelectedKeys, setRowSelectedKey] = useState([]);

  // Bỏ cột action để tránh lỗi khi xuất excel
  const newColumnExport = useMemo(() => {
    return columns?.filter((col) => col.dataIndex !== 'action');
  }, [columns]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKey(selectedRowKeys);
    },
  };

  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: '4',
      danger: true,
      label: 'a danger item',
    },
  ];

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };

  // Hàm xuất Excel dùng XLSX + file-saver
  const exportExcel = () => {
    // Tạo mảng header (tên cột)
    const headers = newColumnExport.map(col => col.title || col.dataIndex);
    
    // Tạo mảng dữ liệu thô theo thứ tự cột đã lọc
    const data = dataSource.map(row => 
      newColumnExport.map(col => row[col.dataIndex])
    );

    // Nối header và data thành 1 mảng 2 chiều
    const worksheetData = [headers, ...data];

    // Tạo worksheet từ mảng
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Tạo workbook và gán worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Chuyển workbook thành file excel dưới dạng binary
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Tạo Blob từ buffer
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Gọi file-saver để lưu file
    saveAs(dataBlob, "ExportData.xlsx");
  };

  return (
    <Loading isPending={isPending}>

      <button
        style={{
          marginBottom: '10px',
          background: 'rgb(68, 68, 68)',
          height: '38px',
          width: 'fit-content',
          border: 'none',
          borderRadius: '4px',
          color: 'rgb(255, 255, 255)',
          fontWeight: '500',
          cursor: 'pointer'
        }}
        onClick={exportExcel}
      >
        Xuất file excel
      </button>

      {/* Nếu muốn hiển thị nút xóa khi chọn */}
      {/* {rowSelectedKeys.length > 0 && (
        <div style={{
          background: 'rgb(68, 68, 68)',
          color: '#fff',
          fontWeight: 'bold',
          padding: '10px',
          cursor: 'pointer'
        }}
          onClick={handleDeleteAll}
        >
          Xóa
        </div>
      )} */}

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </Loading>
  );
};

export default TableComponent;
