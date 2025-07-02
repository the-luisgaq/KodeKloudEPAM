import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import {
    COLOR_MAP,
    DocBuilder,
    DocPreviewBuilder,
    getColorPickerComponent,
    TDocConfig,
    TDocContext, TPreviewMatrix,
    TSkin,
} from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { getCurrentTheme } from '../helpers';
import { TBadgePreview } from './_types/previewIds';
import { ReactComponent as ActionIcon } from '@epam/assets/icons/action-account-fill.svg';

export class BadgeDoc extends BaseDocsBlock {
    title = 'Badge';

    static override config: TDocConfig = {
        name: 'Badge',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: {
                type: '@epam/uui:BadgeProps',
                component: uui.Badge,
            },
            [TSkin.Loveship]: { type: '@epam/loveship:BadgeProps', component: loveship.Badge },
            [TSkin.Promo]: { type: '@epam/promo:BadgeProps', component: promo.Badge },
            [TSkin.Electric]: { type: '@epam/electric:BadgeProps', component: electric.Badge },
        },
        doc: (doc: DocBuilder<uui.BadgeProps | promo.BadgeProps | loveship.BadgeProps | electric.BadgeProps>) => {
            doc.setDefaultPropExample('onClick', () => true);
            doc.merge('color', {
                defaultValue: 'info',
                editorType: getColorPickerComponent({
                    ...COLOR_MAP,
                    neutral: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-40' : 'neutral-30'})`,
                }),
            });
            doc.merge('count', { examples: [
                { value: '9' },
                { value: '19' },
                { value: '99+' },
            ] });
            doc.setDefaultPropExample('icon', ({ value }) => value === ActionIcon);
        },
        preview: (docPreview: DocPreviewBuilder<uui.BadgeProps | promo.BadgeProps | loveship.BadgeProps | electric.BadgeProps>) => {
            type TMatrixLocal = TPreviewMatrix<uui.BadgeProps | promo.BadgeProps | loveship.BadgeProps | electric.BadgeProps>;
            const TEST_DATA = {
                caption: 'Test',
                icon: 'action-account-fill.svg',
                count: '99+',
            };
            const colorVariantsBase: TMatrixLocal = {
                caption: { values: [TEST_DATA.caption] },
                isDropdown: { values: [true] },
                count: { values: [TEST_DATA.count] },
            };
            docPreview.add({
                id: TBadgePreview['Color Variants'],
                matrix: [
                    {
                        ...colorVariantsBase,
                        fill: { values: ['solid', 'outline'] },
                        color: { examples: '*' },
                        icon: { examples: [TEST_DATA.icon] },
                    },
                    {
                        ...colorVariantsBase,
                        fill: { values: ['outline'] },
                        color: { examples: '*' },
                        icon: { examples: [undefined] },
                        indicator: { values: [true] },
                    },
                ],
                cellSize: '150-50',
            });
            docPreview.add({
                id: TBadgePreview['Size Variants'],
                matrix: [
                    {
                        caption: { values: [TEST_DATA.caption] },
                        color: { values: ['info'] },
                        icon: { examples: [TEST_DATA.icon, undefined] },
                        size: { examples: '*' },
                        count: { values: [TEST_DATA.count, undefined] },
                        isDropdown: { values: [false, true] },
                    },
                    {
                        caption: { values: [TEST_DATA.caption] },
                        color: { values: ['info'] },
                        size: { examples: '*' },
                        count: { values: [TEST_DATA.count] },
                        isDropdown: { values: [true] },
                        icon: { examples: [TEST_DATA.icon] },
                        fill: { examples: ['outline'] },
                        indicator: { values: [true] },
                        iconPosition: { values: ['right'] },
                    },
                ],
                cellSize: '200-60',
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="badge-descriptions" />
                {this.renderSectionTitle('Overview')}
                <DocExample title="Types" path="./_examples/badge/Types.example.tsx" />
                <DocExample config={ this.getConfig() } title="Color variants" path="./_examples/badge/Colors.example.tsx" />
                <DocExample title="Styles" path="./_examples/badge/Styles.example.tsx" />
                <DocExample config={ this.getConfig() } title="Sizes" path="./_examples/badge/Size.example.tsx" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Attributes" path="./_examples/badge/Attributes.example.tsx" />
                <DocExample title="Dropdown" path="./_examples/badge/Dropdown.example.tsx" />
                <DocExample title="Badge with status indicator" path="./_examples/badge/StatusIndicator.example.tsx" />
            </>
        );
    }
}
