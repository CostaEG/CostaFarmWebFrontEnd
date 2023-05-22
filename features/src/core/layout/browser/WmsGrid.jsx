import 'devextreme/dist/css/dx.light.css';
import {
  DataGrid,
  Editing,
  Scrolling,
  SearchPanel,
  Column,
  Export,
  FilterRow,
  HeaderFilter,
  Pager,
  Paging,
  Grouping,
  GroupPanel,
} from 'devextreme-react/data-grid';
import { useState } from 'react';
import { Divider } from '@mui/material';

function WmsGrid() {
  const pageSizes = [10, 25, 50, 100];
  const [items, setItems] = useState([
    {
      conveyanceTypeId: '1',
      conveyanceType: 'Bin Box',
      exceptionCategoryId: '1',
      exceptionCategory: 'Ikea',
      inputContainerTypeId: '5',
      inputContainerType: 'Pallet',
      inputContainerTypeCode: 'BP',
    },
    {
      conveyanceTypeId: '2',
      conveyanceType: 'Pallet',
      exceptionCategoryId: '2',
      exceptionCategory: 'Drench',
      inputContainerTypeId: '6',
      inputContainerType: 'Rack 1 Shelf',
      inputContainerTypeCode: 'R1',
    },
    {
      conveyanceTypeId: '3',
      conveyanceType: 'Rack',
      exceptionCategoryId: '3',
      exceptionCategory: 'Sams',
      inputContainerTypeId: '7',
      inputContainerType: 'Rack 2 Shelf',
      inputContainerTypeCode: 'R2',
    },
    {
      conveyanceTypeId: '4',
      conveyanceType: 'Small Box',
      exceptionCategoryId: '4',
      exceptionCategory: 'Home Office',
      inputContainerTypeId: '8',
      inputContainerType: 'Rack 3 Shelf',
      inputContainerTypeCode: 'R3',
    },
    {
      exceptionCategoryId: '5',
      exceptionCategory: 'Huston Gardens',
      inputContainerTypeId: '9',
      inputContainerType: 'Rack 4 Shelf',
      inputContainerTypeCode: 'R4',
    },
    {
      exceptionCategoryId: '6',
      exceptionCategory: 'Costa Online',
      inputContainerTypeId: '10',
      inputContainerType: 'Rack 5 Shelf',
      inputContainerTypeCode: 'R5',
    },
    {
      exceptionCategoryId: '7',
      exceptionCategory: 'Pines',
    },
    {
      exceptionCategoryId: '8',
      exceptionCategory: 'No Exception',
    },
  ]);

  const renderCustomHeader = (e) => {
    const { column } = e.data;

    return column.allowEditing ? (
      <th>{column.caption}</th>
    ) : (
      <>{column.caption}</>
    );
  };

  return (
    <>
      <DataGrid
        id="dataGrid"
        dataSource={items}
        // defaultColumns={columns}
        showBorders={true}
        allowColumnResizing={true}
        allowColumnReordering={true}
        cellHintEnabled={true}
        allowSearch={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
      >
        <Editing
          mode="batch"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />
        <Scrolling mode="virtual" />
        <SearchPanel visible={true} width={240} placeholder="Search..." />
        <GroupPanel visible={true} />
        <Grouping autoExpandAll={false} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <Export enabled={true} />
        <Column dataField="conveyanceTypeId" visible={false}></Column>
        <Column
          dataField="conveyanceType"
          caption="Conveyance Type"
          headerCellComponent={renderCustomHeader}
        ></Column>

        <Pager allowedPageSizes={pageSizes} showPageSizeSelector={true} />
        <Paging defaultPageSize={10} />
      </DataGrid>

      <Divider />

      <DataGrid
        id="dataGrid"
        dataSource={items}
        // defaultColumns={columns}
        showBorders={true}
        allowColumnResizing={true}
        allowColumnReordering={true}
        cellHintEnabled={true}
        allowSearch={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
      >
        <Editing
          mode="batch"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />
        <Scrolling mode="virtual" />
        <SearchPanel visible={true} width={240} placeholder="Search..." />
        <GroupPanel visible={true} />
        <Grouping autoExpandAll={false} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <Export enabled={true} />

        <Column
          dataField="exceptionCategoryId"
          visible={false}
          headerCellComponent={renderCustomHeader}
        ></Column>
        <Column
          dataField="exceptionCategory"
          headerCellComponent={renderCustomHeader}
        ></Column>
        <Pager allowedPageSizes={pageSizes} showPageSizeSelector={true} />
        <Paging defaultPageSize={10} />
      </DataGrid>

      <Divider />

      <DataGrid
        id="dataGrid"
        dataSource={items}
        // defaultColumns={columns}
        showBorders={true}
        allowColumnResizing={true}
        allowColumnReordering={true}
        cellHintEnabled={true}
        allowSearch={true}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
      >
        <Editing
          mode="batch"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />
        <Scrolling mode="virtual" />
        <SearchPanel visible={true} width={240} placeholder="Search..." />
        <GroupPanel visible={true} />
        <Grouping autoExpandAll={false} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <Export enabled={true} />
        <Column
          dataField="inputContainerTypeId"
          visible={false}
          headerCellComponent={renderCustomHeader}
        ></Column>
        <Column
          dataField="inputContainerType"
          headerCellComponent={renderCustomHeader}
        ></Column>
        <Column
          dataField="inputContainerTypeCode"
          headerCellComponent={renderCustomHeader}
          allowEditing={false}
        ></Column>

        <Pager allowedPageSizes={pageSizes} showPageSizeSelector={true} />
        <Paging defaultPageSize={10} />
      </DataGrid>
    </>
  );
}

export default WmsGrid;
