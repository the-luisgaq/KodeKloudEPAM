import React, { useState } from 'react';
import { DatePicker, FlexRow, LinkButton } from '@epam/uui';
import css from './FormatDateExample.module.scss';
import dayjs from 'dayjs';

export default function DatePickerFooterExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow rawProps={ { style: { minWidth: '195px' } } }>
            <DatePicker
                value={ value }
                onValueChange={ onValueChange }
                renderFooter={ () => (
                    <FlexRow cx={ css.footer } size="48">
                        <LinkButton size="36" caption="Today" onClick={ () => onValueChange(dayjs().format('YYYY-MM-DD')) } />
                    </FlexRow>
                ) }
            />
        </FlexRow>
    );
}
