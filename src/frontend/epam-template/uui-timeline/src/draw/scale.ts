import { addDays, getHoursInFormatAMPM, months } from '../helpers';
import { timelinePrimitives } from './primitives';
import {
    CanvasDrawBorderForTopCell,
    CanvasDrawScaleBottomBorderProps,
    CanvasDrawDaysProps,
    CanvasDrawHeaderTodayProps,
    CanvasDrawPeriodFragmentProps,
    CanvasDrawPeriodPartProps,
    CanvasDrawPeriodProps,
    CanvasDrawPeriodWithTodayProps,
    CanvasDrawCellBackground,
    CanvasDrawTopDaysProps,
    CanvasScaleRange,
    CanvasDrawBottomGridLine,
    CanvasDrawWeekendHoursCell,
    CanvasDrawBottomMonthProps,
    CanvasDrawTopMonthProps,
    CanvasDrawProps,
} from './types';

const defaultFonts = {
    meridiemFont: 'normal normal 400 12px Source Sans Pro',
    periodFont: 'normal normal 600 14px Source Sans Pro',
    currentPeriodFont: '14px Sans Semibold',
};

const defaultColors = {
    bottomBorderColor: '#999',
    periodTextColor: '#525462',
    topDayTextColor: '#2c2f3c',
    weekendTextColor: '#ACAFBF',
    weekendCellBackgroundColor: '#F5F6FA',
    todayLineColor: '#FBB6B6',
    evenPeriodCellBackgroundColor: '#FFFFFF',
    cellBorderColor: timelinePrimitives.defaultColors.defaultLineColor,
    cellBackgroundColor: timelinePrimitives.defaultColors.defaultRectangleColor,
};

const defaultWidth = {
    cellBorderWidth: 1,
    todayLineHeight: 4,
};

const isCurrentPeriod = (leftDate: Date, rightDate: Date) => new Date() >= leftDate && new Date() <= rightDate;

const getCanvasVerticalCenter = (canvasHeight: number) => canvasHeight / 2;
const getBottomCellY = (canvasHeight: number) => getCanvasVerticalCenter(canvasHeight);
const getTopMonth = (month: number) => months[month]?.toUpperCase() ?? '';
const getBottomMonth = (month: number) => months[month] ?? '';

const drawScaleBottomBorder = ({
    context,
    canvasHeight,
    timelineTransform,
    bottomBorderColor = defaultColors.bottomBorderColor,
}: CanvasDrawScaleBottomBorderProps) => {
    context.strokeStyle = bottomBorderColor;
    context.beginPath();
    context.moveTo(0, canvasHeight - 1);
    context.lineTo(timelineTransform.widthMs, canvasHeight - 1);
    context.stroke();
};

const drawBorderForTopCell = ({
    context,
    canvasHeight,
    scaleBar,
    color,
    width,
}: CanvasDrawBorderForTopCell) => {
    const y = getCanvasVerticalCenter(canvasHeight) - 1;
    timelinePrimitives.drawHorizontalLine({ context, x1: scaleBar.left, x2: scaleBar.right + 1, y, color, width });
    timelinePrimitives.drawVerticalLine({ context, x: scaleBar.left, y2: y, color, width });
};

const drawBottomGridLine = ({
    context,
    scaleBar,
    width,
    color,
    canvasHeight,
}: CanvasDrawBottomGridLine) => {
    const y = getCanvasVerticalCenter(canvasHeight);
    timelinePrimitives.drawVerticalLine({ context, x: scaleBar.left, y1: y, y2: canvasHeight - 1, width, color });
};

const drawCellBackground = ({
    context,
    canvasHeight,
    height = getCanvasVerticalCenter(canvasHeight),
    scaleBar,
    color = timelinePrimitives.defaultColors.defaultRectangleColor,
    y = 0,
}: CanvasDrawCellBackground) => {
    timelinePrimitives.drawRectangle({
        context,
        x: scaleBar.left,
        y,
        width: scaleBar.right - scaleBar.left + 1,
        height,
        color,
    });
};

const drawPeriod = (
    {
        context,
        timelineTransform,
        minPxPerDay,
        maxPxPerDay,
        canvasHeight,
        draw,
        ...fonts
    }: CanvasDrawPeriodProps,
) => {
    const visibility = timelineTransform.getScaleVisibility(minPxPerDay, maxPxPerDay);

    if (!visibility) {
        return;
    }

    context.save();
    context.globalAlpha = visibility;

    draw({ context, timelineTransform, visibility, canvasHeight, ...fonts });

    context.restore();
};

const calculateTextLine = ({
    context,
    text,
    canvasHeight,
    line,
}: CanvasDrawProps & { canvasHeight: number, line: number, text: string }) => {
    const { actualBoundingBoxAscent, actualBoundingBoxDescent } = context.measureText(text);
    const headerTextHeight = Math.abs(actualBoundingBoxAscent) + Math.abs(actualBoundingBoxDescent);

    const lineHeight = canvasHeight / 2;
    const textCenter = lineHeight / 2;
    const baseTextLine = textCenter + headerTextHeight / 2;
    return baseTextLine + lineHeight * (line - 1);
};

const drawPeriodText = ({
    context,
    timelineTransform,
    text,
    x,
    width,
    line,
    canvasHeight,
    isCurPeriod,
    textColor = defaultColors.periodTextColor,
    superscript,
    meridiemFont = defaultFonts.meridiemFont,
    periodFont = defaultFonts.periodFont,
    currentPeriodFont = defaultFonts.currentPeriodFont,
}: CanvasDrawPeriodFragmentProps) => {
    context.font = isCurPeriod ? currentPeriodFont : periodFont;
    context.fillStyle = textColor;

    const padding = 12;
    const { width: headerTextWidth } = context.measureText(text);

    const textWidth = headerTextWidth + padding * 2;
    const center = x + width / 2;
    let left = center - textWidth / 2;

    // Stick to the edges
    if (width > 120) {
        const bound = 24;
        const leftBound = bound;
        const rightBound = timelineTransform.widthPx - bound;
        const isOutOfLeftBound = left < leftBound;
        const isOutOfRightBound = left + textWidth > rightBound;

        if (isOutOfLeftBound) {
            left = leftBound;
        }
        if (isOutOfRightBound) {
            left = rightBound - textWidth;
        }
        if (left < x) {
            left = x;
        }
        if (left + textWidth > x + width) {
            left = x + width - textWidth;
        }
    }

    const textLine = calculateTextLine({ context, text, canvasHeight, line });

    context.fillText(text, left + padding, textLine);

    if (superscript) {
        context.font = meridiemFont;
        const superscriptTextLine = calculateTextLine({ context, text: superscript, canvasHeight, line });
        context.fillText(superscript, left + padding + headerTextWidth + (text.length === 1 ? 3 : 4), superscriptTextLine);
    }
};

const getBottomLine = (visibility: number) => 2 + (1 - visibility) * 1;
const getTopLine = (visibility: number) => visibility * 1;

const drawMinutes = ({
    context,
    timelineTransform,
    visibility,
    canvasHeight,
    periodTextColor = defaultColors.periodTextColor,
    cellBorderColor = defaultColors.cellBorderColor,
    cellBorderWidth = defaultWidth.cellBorderWidth,
    cellBackgroundColor = defaultColors.cellBackgroundColor,
    weekendCellBackgroundColor = defaultColors.weekendCellBackgroundColor,

    ...restProps
}: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleMinutes().forEach((w) => {
        const isHoliday = timelineTransform.isWeekend(w.leftDate) || timelineTransform.isHoliday(w.leftDate);
        const color = isHoliday ? weekendCellBackgroundColor : cellBackgroundColor;
        const text = w.leftDate.getHours().toString().padStart(2, '0') + ':' + w.leftDate.getMinutes().toString().padStart(2, '0');
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawCellBackground({ context, scaleBar: w, canvasHeight, y: getBottomCellY(canvasHeight), color });
        drawPeriodText({
            context,
            timelineTransform,
            text,
            x: w.left,
            width: w.right - w.left,
            line: getBottomLine(visibility),
            isCurPeriod,
            textColor: periodTextColor,
            canvasHeight,
            ...restProps,
        });
        drawBottomGridLine({ context, canvasHeight, scaleBar: w, width: cellBorderWidth, color: cellBorderColor });
    });
};

const drawHoursCells = ({
    context,
    scaleBar,
    timelineTransform,
    canvasHeight,
    cellBackgroundColor = defaultColors.cellBackgroundColor,
    weekendCellBackgroundColor = defaultColors.weekendCellBackgroundColor,
}: CanvasDrawWeekendHoursCell) => {
    const leftDate = new Date(scaleBar.leftDate);
    leftDate.setDate(leftDate.getDate() - 1);
    const isLeftHoliday = timelineTransform.isHoliday(leftDate) || timelineTransform.isWeekend(leftDate);
    const isCurrentHoliday = timelineTransform.isHoliday(scaleBar.leftDate) || timelineTransform.isWeekend(scaleBar.leftDate);
    const isRightHoliday = timelineTransform.isHoliday(scaleBar.rightDate) || timelineTransform.isWeekend(scaleBar.rightDate);

    if (isLeftHoliday && isCurrentHoliday) {
        if (isRightHoliday || scaleBar.leftDate.getHours() < 23) {
            drawCellBackground({ context, scaleBar, canvasHeight, y: getBottomCellY(canvasHeight), color: weekendCellBackgroundColor });
            return;
        }

        const width = (scaleBar.right - scaleBar.left) + 1;
        const grad = context.createLinearGradient(scaleBar.left, 0, scaleBar.right + width + 1, 0);
        grad.addColorStop(0, weekendCellBackgroundColor);
        grad.addColorStop(1, cellBackgroundColor);
        timelinePrimitives.drawRectangle({
            context,
            x: scaleBar.left,
            y: getBottomCellY(canvasHeight),
            width: (width * 2),
            height: canvasHeight / 2 - 1,
            color: grad,
        });
        return;
    }
    if (isCurrentHoliday) {
        if (scaleBar.leftDate.getHours() >= 1) {
            drawCellBackground({ context, scaleBar, canvasHeight, y: getBottomCellY(canvasHeight), color: weekendCellBackgroundColor });
            return;
        }

        if (scaleBar.leftDate.getHours() === 0) {
            const width = (scaleBar.right - scaleBar.left) + 1;
            const grad = context.createLinearGradient(scaleBar.left - width, 0, scaleBar.right + 1, 0);
            grad.addColorStop(0, cellBackgroundColor);
            grad.addColorStop(1, weekendCellBackgroundColor);

            timelinePrimitives.drawRectangle({
                context,
                x: scaleBar.left - width,
                y: getBottomCellY(canvasHeight),
                width: (width * 2),
                height: canvasHeight / 2 - 1,
                color: grad,
            });
        }

        if (!isRightHoliday) {
            if (scaleBar.leftDate.getHours() < 23) {
                drawCellBackground({ context, scaleBar, canvasHeight, y: getBottomCellY(canvasHeight), color: weekendCellBackgroundColor });
                return;
            }
        }
        return;
    }

    if (isLeftHoliday) {
        if (scaleBar.leftDate.getHours() >= 1) {
            drawCellBackground({ context, scaleBar, canvasHeight, y: getBottomCellY(canvasHeight), color: cellBackgroundColor });
        }
        return;
    }

    if (isRightHoliday) {
        if (scaleBar.leftDate.getHours() < 23) {
            drawCellBackground({ context, scaleBar, canvasHeight, y: getBottomCellY(canvasHeight), color: cellBackgroundColor });
        }
        return;
    }
    drawCellBackground({ context, scaleBar, canvasHeight, y: getBottomCellY(canvasHeight), color: cellBackgroundColor });
};

const drawRemainingHours = ({
    context,
    timelineTransform,
    visibility,
    periodTextColor = defaultColors.periodTextColor,
    canvasHeight,
    cellBackgroundColor = defaultColors.cellBackgroundColor,
    weekendCellBackgroundColor = defaultColors.weekendCellBackgroundColor,
    ...restProps
}: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleHours()
        .forEach((w) => {
            drawHoursCells({ context, scaleBar: w, timelineTransform, canvasHeight, cellBackgroundColor, weekendCellBackgroundColor });
        });

    timelineTransform.getVisibleHours()
        .filter((i) => i.leftDate.getHours() % 3 !== 0)
        .forEach((w) => {
            const hoursInFormatAMPM = getHoursInFormatAMPM(w.leftDate);
            const text = hoursInFormatAMPM.length === 4 ? hoursInFormatAMPM.slice(0, 1) : hoursInFormatAMPM.slice(0, 2);
            const superscript = hoursInFormatAMPM.slice(-2);
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            drawPeriodText({
                context,
                timelineTransform,
                text,
                x: w.left - (w.right - w.left) / 2,
                width: w.right - w.left,
                line: getBottomLine(visibility),
                isCurPeriod,
                textColor: periodTextColor,
                superscript,
                canvasHeight,
                ...restProps,
            });
        });
};

const drawHours = ({
    context,
    timelineTransform,
    visibility,
    canvasHeight,
    periodTextColor = defaultColors.periodTextColor,
    cellBackgroundColor = defaultColors.cellBackgroundColor,
    weekendCellBackgroundColor = defaultColors.weekendCellBackgroundColor,

    ...restProps
}: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleHours()
        .forEach((w) => {
            const { minPxPerDay, maxPxPerDay } = timelineScale.getRemainingHoursScaleRange();
            const remainingHoursVisible = timelineTransform.getScaleVisibility(minPxPerDay, maxPxPerDay);
            if (!remainingHoursVisible) {
                drawHoursCells({ context, scaleBar: w, timelineTransform, canvasHeight, cellBackgroundColor, weekendCellBackgroundColor });
            }
        });

    timelineTransform.getVisibleHours()
        .filter((i) => i.leftDate.getHours() % 3 === 0)
        .forEach((w) => {
            const hoursInFormatAMPM = getHoursInFormatAMPM(w.leftDate);
            const text = hoursInFormatAMPM.length === 4 ? hoursInFormatAMPM.slice(0, 1) : hoursInFormatAMPM.slice(0, 2);
            const superscript = hoursInFormatAMPM.slice(-2);
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            drawPeriodText({
                context,
                timelineTransform,
                text,
                x: w.left - (w.right - w.left) / 2,
                width: w.right - w.left,
                line: getBottomLine(visibility),
                isCurPeriod,
                textColor: periodTextColor,
                superscript,
                canvasHeight,
                ...restProps,
            });
        });
};

const drawToday = ({
    context,
    scaleBar,
    todayLineColor = defaultColors.todayLineColor,
    canvasHeight,
    todayLineHeight = defaultWidth.todayLineHeight,
}: CanvasDrawHeaderTodayProps) => {
    if (isCurrentPeriod(scaleBar.leftDate, scaleBar.rightDate)) {
        context.fillStyle = todayLineColor;
        context.fillRect(scaleBar.left + 1, canvasHeight - todayLineHeight, scaleBar.right - scaleBar.left, todayLineHeight);
    }
};

const drawTopDays = ({
    context,
    timelineTransform,
    visibility,
    topDayTextColor = defaultColors.topDayTextColor,
    weekendTextColor = defaultColors.weekendTextColor,
    todayLineColor = defaultColors.todayLineColor,
    todayLineHeight = defaultWidth.todayLineHeight,
    drawToday: customDrawToday,
    getTopMonth: customGetMonth = getTopMonth,
    canvasHeight,
    cellBorderColor = defaultColors.cellBorderColor,
    cellBorderWidth = defaultWidth.cellBorderWidth,
    cellBackgroundColor = defaultColors.cellBackgroundColor,
    weekendCellBackgroundColor = defaultColors.weekendCellBackgroundColor,
    ...restProps
}: CanvasDrawTopDaysProps) => {
    timelineTransform.getVisibleDays().forEach((w) => {
        const header = customGetMonth(w.leftDate.getMonth()) + ' ' + w.leftDate.getDate().toString() + ', ' + w.leftDate.getFullYear();
        const isHoliday = timelineTransform.isWeekend(w.leftDate) || timelineTransform.isHoliday(w.leftDate);
        const color = isHoliday ? weekendCellBackgroundColor : cellBackgroundColor;
        drawCellBackground({ context, scaleBar: w, canvasHeight, color });

        const textColor = isHoliday ? weekendTextColor : topDayTextColor;
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodText({
            context,
            timelineTransform,
            text: header,
            x: w.left,
            width: w.right - w.left,
            line: getTopLine(visibility),
            isCurPeriod,
            textColor,
            canvasHeight,
            ...restProps,
        });
        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor, todayLineHeight, canvasHeight });
        drawBorderForTopCell({ context, canvasHeight, scaleBar: w, width: cellBorderWidth, color: cellBorderColor });
    });
};

const drawDays = ({
    context,
    timelineTransform,
    visibility,
    periodTextColor = defaultColors.periodTextColor,
    weekendTextColor = defaultColors.weekendTextColor,
    todayLineColor = defaultColors.todayLineColor,
    todayLineHeight = defaultWidth.todayLineHeight,
    drawToday: customDrawToday,
    canvasHeight,
    cellBorderColor = defaultColors.cellBorderColor,
    cellBorderWidth = defaultWidth.cellBorderWidth,
    cellBackgroundColor = defaultColors.cellBackgroundColor,
    weekendCellBackgroundColor = defaultColors.weekendCellBackgroundColor,

    ...restProps
}: CanvasDrawDaysProps) => {
    timelineTransform.getVisibleDays().forEach((w) => {
        const isHoliday = timelineTransform.isWeekend(w.leftDate) || timelineTransform.isHoliday(w.leftDate);
        const color = isHoliday ? weekendCellBackgroundColor : cellBackgroundColor;
        drawCellBackground({ context, scaleBar: w, canvasHeight, y: getCanvasVerticalCenter(canvasHeight), color });

        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor, todayLineHeight, canvasHeight });
        drawBottomGridLine({ context, canvasHeight, scaleBar: w, width: cellBorderWidth, color: cellBorderColor });

        const text = w.leftDate.getDate().toString();
        const textColor = isHoliday ? weekendTextColor : periodTextColor;
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodText({
            context,
            timelineTransform,
            text,
            textColor,
            x: w.left,
            width: w.right - w.left,
            line: getBottomLine(visibility),
            isCurPeriod,
            canvasHeight,
            ...restProps,
        });
    });
};

const drawTopMonths = ({
    context,
    timelineTransform,
    visibility,
    periodTextColor = defaultColors.periodTextColor,
    canvasHeight,
    cellBorderColor = defaultColors.cellBorderColor,
    cellBorderWidth = defaultWidth.cellBorderWidth,
    cellBackgroundColor = defaultColors.cellBackgroundColor,
    evenPeriodCellBackgroundColor = defaultColors.evenPeriodCellBackgroundColor,
    getTopMonth: customGetMonth = getTopMonth,
    ...restProps
}: CanvasDrawTopMonthProps) => {
    timelineTransform.getVisibleMonths().forEach((w) => {
        const color = w.leftDate.getMonth() % 2 === 0
            ? cellBackgroundColor
            : evenPeriodCellBackgroundColor;

        drawCellBackground({ context, scaleBar: w, canvasHeight, color });
        drawBorderForTopCell({ context, canvasHeight, scaleBar: w, width: cellBorderWidth, color: cellBorderColor });

        const header = customGetMonth(w.leftDate.getMonth()) + ' ' + w.leftDate.getFullYear();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodText({
            context,
            timelineTransform,
            text: header,
            x: w.left,
            width: w.right - w.left,
            line: getTopLine(visibility),
            isCurPeriod,
            textColor: periodTextColor,
            canvasHeight,
            ...restProps,
        });
    });
};

const drawWeeks = ({
    context,
    timelineTransform,
    visibility,
    periodTextColor = defaultColors.periodTextColor,
    todayLineColor = defaultColors.todayLineColor,
    todayLineHeight = defaultWidth.todayLineHeight,
    drawToday: customDrawToday,
    canvasHeight,
    cellBorderColor = defaultColors.cellBorderColor,
    cellBorderWidth = defaultWidth.cellBorderWidth,
    cellBackgroundColor = defaultColors.cellBackgroundColor,

    ...restProps
}: CanvasDrawPeriodWithTodayProps) => {
    timelineTransform.getVisibleWeeks().forEach((w) => {
        const text = w.leftDate.getDate() + ' – ' + addDays(w.rightDate, -1).getDate();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawCellBackground({ context, scaleBar: w, canvasHeight, y: getCanvasVerticalCenter(canvasHeight), color: cellBackgroundColor });

        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor, todayLineHeight, canvasHeight });
        drawBottomGridLine({ context, canvasHeight, scaleBar: w, width: cellBorderWidth, color: cellBorderColor });
        drawPeriodText({
            context,
            timelineTransform,
            text,
            x: w.left,
            width: w.right - w.left,
            line: getBottomLine(visibility),
            isCurPeriod,
            textColor: periodTextColor,
            canvasHeight,
            ...restProps,
        });
    });
};

const drawBottomMonths = ({
    context,
    timelineTransform,
    visibility,
    canvasHeight,
    periodTextColor = defaultColors.periodTextColor,
    todayLineColor = defaultColors.todayLineColor,
    todayLineHeight = defaultWidth.todayLineHeight,
    drawToday: customDrawToday,
    cellBorderColor = defaultColors.cellBorderColor,
    cellBorderWidth = defaultWidth.cellBorderWidth,
    cellBackgroundColor = defaultColors.cellBackgroundColor,
    getBottomMonth: customGetMonth = getBottomMonth,
    ...restProps
}: CanvasDrawBottomMonthProps) => {
    timelineTransform.getVisibleMonths().forEach((w) => {
        const text = customGetMonth(w.leftDate.getMonth()).toString();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawCellBackground({ context, scaleBar: w, canvasHeight, y: getCanvasVerticalCenter(canvasHeight), color: cellBackgroundColor });

        drawPeriodText({
            context,
            timelineTransform,
            text,
            x: w.left,
            width: w.right - w.left,
            line: getBottomLine(visibility),
            isCurPeriod,
            textColor: periodTextColor,
            canvasHeight,
            ...restProps,
        });
        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor, todayLineHeight, canvasHeight });
        drawBottomGridLine({ context, canvasHeight, scaleBar: w, width: cellBorderWidth, color: cellBorderColor });
    });
};

const drawYears = ({
    context,
    timelineTransform,
    visibility,
    periodTextColor = defaultColors.periodTextColor,
    todayLineColor = defaultColors.todayLineColor,
    todayLineHeight = defaultWidth.todayLineHeight,
    drawToday: customDrawToday,
    canvasHeight,
    cellBorderColor = defaultColors.cellBorderColor,
    cellBorderWidth = defaultWidth.cellBorderWidth,
    cellBackgroundColor = defaultColors.cellBackgroundColor,
    evenPeriodCellBackgroundColor = defaultColors.evenPeriodCellBackgroundColor,

    ...restProps
}: CanvasDrawPeriodWithTodayProps) => {
    const isBottom = timelineTransform.getScaleVisibility(null, 1);
    timelineTransform.getVisibleYears().forEach((w) => {
        const text = w.leftDate.getFullYear().toString().toUpperCase();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);

        const bottomAnimationThreshold = 0.4;
        const bottomTextMoveMount = 0.74;
        const textMoveAmount = isBottom > bottomAnimationThreshold ? bottomTextMoveMount : 1;
        let line = (visibility + isBottom) * textMoveAmount;
        line = isBottom < bottomAnimationThreshold ? Math.min(line, 1) : line;

        if (isBottom) {
            const y = canvasHeight;
            timelinePrimitives.drawHorizontalLine({ context, x1: w.left, x2: w.right + 1, y: y - 1, color: cellBorderColor, width: cellBorderWidth });
            drawCellBackground({ context, scaleBar: w, canvasHeight, height: canvasHeight, color: cellBackgroundColor });
            (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor, todayLineHeight, canvasHeight });
            timelinePrimitives.drawVerticalLine({ context, x: w.left + 0.5, y2: y - 1, color: cellBorderColor, width: cellBorderWidth });
        } else {
            const color = w.leftDate.getFullYear() % 2 === 0
                ? cellBackgroundColor
                : evenPeriodCellBackgroundColor;

            drawCellBackground({ context, scaleBar: w, canvasHeight, color });
            drawBorderForTopCell({ context, canvasHeight, scaleBar: w, width: cellBorderWidth, color: cellBorderColor });
        }

        drawPeriodText({
            context,
            timelineTransform,
            text,
            x: w.left,
            width: w.right - w.left,
            line,
            isCurPeriod,
            textColor: periodTextColor,
            canvasHeight,
            ...restProps,
        });
    });
};

export const getMinutesScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 40000, maxPxPerDay: null });
export const getRemainingHoursScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 800, maxPxPerDay: 40000 });
export const getHoursScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 200, maxPxPerDay: 20000 });
export const getTopDaysScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 200, maxPxPerDay: null });
export const getDaysScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 20, maxPxPerDay: 200 });
export const getTopMonthsScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 6, maxPxPerDay: 200 });
export const getWeeksScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 6, maxPxPerDay: 20 });
export const getBottomMonthsScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 1, maxPxPerDay: 6 });
export const getYearsScaleRange = (): CanvasScaleRange => ({ minPxPerDay: null, maxPxPerDay: 6 });

/**
 * Default implementations of scale draw functions/ranges and default fonts/width/colors.
 * It is recommended to be used while overriding some specific parts of scale.
 */
export const timelineScale = {
    drawScaleBottomBorder,
    drawPeriod,
    drawMinutes,
    drawRemainingHours,
    drawHours,
    drawToday,
    drawPeriodText,
    drawTopDays,
    drawDays,
    drawTopMonths,
    drawWeeks,
    drawBottomMonths,
    drawYears,
    isCurrentPeriod,
    getMinutesScaleRange,
    getRemainingHoursScaleRange,
    getHoursScaleRange,
    getTopDaysScaleRange,
    getDaysScaleRange,
    getTopMonthsScaleRange,
    getWeeksScaleRange,
    getBottomMonthsScaleRange,
    getYearsScaleRange,
    drawHoursCells,
    getTopMonth,
    getBottomMonth,
    defaultFonts,
    defaultColors,
    defaultWidth,
};
