import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, FlexRow } from '@epam/uui';

export default function DatePickerFilterExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow rawProps={ { style: { minWidth: '195px' } } }>
            <DatePicker
                value={ value }
                onValueChange={ onValueChange }
                format="MMM D, YYYY"
                filter={ (day: Dayjs) => day.valueOf() >= dayjs().subtract(1, 'day').valueOf() }
            />
        </FlexRow>
    );
}
