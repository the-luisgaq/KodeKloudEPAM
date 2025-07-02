import React, { useMemo } from 'react';
import { DataTable } from '@epam/uui';
import { DataRowProps, DataSourceListProps, DataTableState, IControlled } from '@epam/uui-core';
import { DataTableFocusManager } from '@epam/uui-components';
import { ColumnsProps, Task } from './types';
import { getColumnsTimelineMode } from './columns';
import { TimelineController } from '@epam/uui-timeline';

export interface TimelineModeProps extends ColumnsProps {
    timelineController: TimelineController;
    rows: DataRowProps<Task, any>[];
    tableState: IControlled<DataTableState<any, any>>['value'];
    setTableState: IControlled<DataTableState<any, any>>['onValueChange'];
    listProps: DataSourceListProps;
    dataTableFocusManager: DataTableFocusManager<number>;
}

export function TimelineMode({
    rows, tableState, setTableState, listProps, dataTableFocusManager, insertTask, deleteTask, timelineController,
}: TimelineModeProps) {
    const columns = useMemo(
        () => getColumnsTimelineMode({ insertTask, deleteTask, timelineController }),
        [insertTask, deleteTask, timelineController],
    );

    return (
        <DataTable
            headerTextCase="upper"
            rows={ rows }
            columns={ columns }
            value={ tableState }
            onValueChange={ setTableState }
            dataTableFocusManager={ dataTableFocusManager }
            allowColumnsResizing
            allowColumnsReordering
            headerSize="60"
            { ...listProps }
        />
    );
}
