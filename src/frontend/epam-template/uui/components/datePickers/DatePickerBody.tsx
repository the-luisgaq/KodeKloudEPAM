import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import {
    IControlled,
    cx,
} from '@epam/uui-core';
import { MonthSelection, YearSelection } from '@epam/uui-components';
import { DatePickerHeader } from './DatePickerHeader';
import { Calendar } from './Calendar';
import { CommonDatePickerBodyProps, ViewType } from './types';
import {
    getNewMonth, uuiDatePickerBodyBase, valueFormat,
} from './helpers';
import { Dayjs, uuiDayjs } from '../../helpers/dayJsHelper';
import { settings } from '../../settings';

import css from './DatePickerBody.module.scss';

export interface DatePickerBodyProps extends CommonDatePickerBodyProps, IControlled<string | null> {
    /**
     * Manually handles holidays
     */
    isHoliday?: (day: Dayjs) => boolean;
}

export const uuiDatePickerBody = {
    wrapper: 'uui-datepicker-body-wrapper',
} as const;

export const DatePickerBody = forwardRef(DatePickerBodyComp);

function DatePickerBodyComp(props: DatePickerBodyProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { value, onValueChange } = props;
    const [month, setMonth] = useState<Dayjs>(getNewMonth(value));
    const [view, setView] = useState<ViewType>('DAY_SELECTION');

    // sync updated props with internal state
    useEffect(() => {
        setMonth(getNewMonth(value));
        setView('DAY_SELECTION');
    }, [value, setMonth]);

    return (
        <StatelessDatePickerBody
            ref={ ref }
            { ...props }
            month={ month }
            view={ view }
            onValueChange={ onValueChange }
            onMonthChange={ (m) => setMonth(m) }
            onViewChange={ (v) => setView(v) }
        />
    );
}

export interface StatelessDatePickerBodyValue<TSelection> {
    value: TSelection | null;
    month: Dayjs;
    view: ViewType;
}

export interface StatelessDatePickerBodyProps extends CommonDatePickerBodyProps, StatelessDatePickerBodyValue<string> {
    onValueChange: (value: string | null) => void;
    onMonthChange: (m: Dayjs) => void;
    onViewChange: (v: ViewType) => void;
    isHoliday?: (day: Dayjs) => boolean;
}

export const StatelessDatePickerBody = forwardRef(StatelessDatePickerBodyComp);

function StatelessDatePickerBodyComp({
    renderDay,
    isHoliday,
    cx: classes,
    filter,
    rawProps,
    value,
    month,
    view,
    onValueChange,
    onMonthChange,
    onViewChange,
    isDisabled,
}: StatelessDatePickerBodyProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const selectedDate = useMemo(() => uuiDayjs.dayjs(value), [value]);

    const onMonthClick = (newDate: Dayjs) => {
        onMonthChange(newDate);
        onViewChange('DAY_SELECTION');
    };

    const onYearClick = (newDate: Dayjs) => {
        onMonthChange(newDate);
        onViewChange('MONTH_SELECTION');
    };

    const onDayClick = (day: Dayjs) => {
        if (!filter || filter(day)) {
            onValueChange(day.format(valueFormat));
        }
    };

    const getView = () => {
        switch (view) {
            case 'MONTH_SELECTION':
                return (
                    <MonthSelection
                        selectedDate={ selectedDate }
                        value={ month }
                        onValueChange={ onMonthClick }
                    />
                );
            case 'YEAR_SELECTION':
                return (
                    <YearSelection
                        selectedDate={ selectedDate }
                        value={ month }
                        onValueChange={ onYearClick }
                    />
                );
            case 'DAY_SELECTION':
                return (
                    <Calendar
                        value={ selectedDate }
                        month={ month }
                        onValueChange={ onDayClick }
                        filter={ filter }
                        renderDay={ renderDay }
                        isHoliday={ isHoliday }
                        isDisabled={ isDisabled }
                    />
                );
        }
    };

    return (
        <div
            ref={ ref }
            className={ cx(uuiDatePickerBodyBase.container, `uui-size-${settings.datePicker.sizes.body}`, classes) }
            { ...rawProps }
        >
            <div className={ cx(css.root, uuiDatePickerBody.wrapper) }>
                <DatePickerHeader
                    value={ {
                        view,
                        month,
                    } }
                    onValueChange={ (newValue) => {
                        onMonthChange(newValue.month);
                        onViewChange(newValue.view);
                    } }
                    isDisabled={ isDisabled }
                />
                {getView()}
            </div>
        </div>
    );
}
