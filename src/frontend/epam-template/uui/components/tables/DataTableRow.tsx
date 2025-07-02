import * as React from 'react';
import { withMods, DataTableCellProps, DataTableRowProps as CoreDataTableRowProps, Overwrite } from '@epam/uui-core';
import { DataTableRow as uuiDataTableRow } from '@epam/uui-components';
import { DataTableCell } from './DataTableCell';
import { DropMarker } from '../dnd';
import type { DataTableRowMods } from './types';
import { settings } from '../../settings';

import './variables.scss';
import css from './DataTableRow.module.scss';

// Here we define a single instance of the renderCell function to make DataTableRow#shouldComponentUpdate work.
// As we need our mods to style the cell properly, we extract them from DataTableCellProps.rowProps, which is a hack, but it's reliable enough.
export const renderCell = (props: DataTableCellProps) => {
    const mods = props.rowProps as DataTableRowMods & DataTableRowProps;
    return <DataTableCell { ...props } key={ props.key } size={ mods.size } columnsGap={ mods.columnsGap } />;
};

export const renderDropMarkers: DataTableRowProps['renderDropMarkers'] = ({ ref, ...props }) => <DropMarker { ...props } enableBlocker={ true } />;

export const propsMods = { renderCell, renderDropMarkers };

export interface DataTableRowModsOverride {}

export type DataTableRowProps = CoreDataTableRowProps & Overwrite<DataTableRowMods, DataTableRowModsOverride>;

export const DataTableRow = withMods<CoreDataTableRowProps, DataTableRowProps>(
    uuiDataTableRow,
    ({ borderBottom = true, size }) => {
        return [
            css.root, 'uui-dt-vars', borderBottom && 'uui-dt-row-border', `uui-size-${size || settings.dataTable.sizes.body.row}`,
        ];
    },
    () => propsMods,
);
