/* eslint-disable no-restricted-imports */
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import localeData from 'dayjs/plugin/localeData.js';
import isToday from 'dayjs/plugin/isToday.js';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import objectSupport from 'dayjs/plugin/objectSupport';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';

export type { Dayjs } from 'dayjs';

export const uuiDayjs = TREE_SHAKEABLE_INIT();

function TREE_SHAKEABLE_INIT() {
    let extended = false;
    return {
        get dayjs() {
            if (!extended) {
                dayjs.extend(isSameOrBefore);
                dayjs.extend(isSameOrAfter);
                //
                dayjs.extend(isToday);
                //
                dayjs.extend(localeData);
                dayjs.extend(updateLocale);
                dayjs.extend(objectSupport);
                dayjs.extend(customParseFormat);
                dayjs.extend(isoWeek);
                extended = true;
            }
            return dayjs;
        },
    };
}
