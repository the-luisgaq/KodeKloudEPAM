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
    TDocContext,
    TSkin,
} from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';
import { getCurrentTheme } from '../helpers';
import { TTagPreview } from './_types/previewIds';
import { ReactComponent as ActionIcon } from '@epam/assets/icons/action-account-fill.svg';

export class TagDoc extends BaseDocsBlock {
    title = 'Tag';

    static override config: TDocConfig = {
        name: 'Tag',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TagProps', component: uui.Tag },
            [TSkin.Promo]: { type: '@epam/promo:TagProps', component: promo.Tag },
            [TSkin.Loveship]: { type: '@epam/loveship:TagProps', component: loveship.Tag },
            [TSkin.Electric]: { type: '@epam/electric:TagProps', component: electric.Tag },
        },
        doc: (doc: DocBuilder<loveship.TagProps | uui.TagProps | promo.TagProps | electric.TagProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
            doc.merge('color', {
                editorType: getColorPickerComponent({
                    ...COLOR_MAP,
                    neutral: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-40' : 'neutral-30'})`,
                }),
            });
            doc.setDefaultPropExample('onClick', () => true);
            doc.merge('count', { examples: [{ value: '9' }, { value: '19' }, { value: '99+' }] });
            doc.setDefaultPropExample('icon', ({ value }) => value === ActionIcon);
        },

        preview: (docPreview: DocPreviewBuilder<loveship.TagProps | uui.TagProps | promo.TagProps | electric.TagProps>) => {
            const TEST_DATA = {
                icon: 'action-account-fill.svg',
            };
            docPreview.add({
                id: TTagPreview['Size Variants'],
                matrix: {
                    caption: { values: ['Test'] },
                    size: { examples: '*' },
                    count: { values: [undefined, '+99'] },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    iconPosition: { examples: '*', condition: (pp) => !!pp.icon },
                    isDropdown: { examples: '*' },
                    onClear: { examples: ['callback', undefined] },
                },
                cellSize: '210-60',
            });
            docPreview.add({
                id: TTagPreview['Color Variants'],
                matrix: {
                    caption: { values: ['Test'] },
                    icon: { examples: [TEST_DATA.icon] },
                    count: { values: ['+99'] },
                    isDropdown: { values: [true] },
                    color: { examples: '*' },
                    fill: { examples: '*' },
                    isDisabled: { examples: '*' },
                },
                cellSize: '140-60',
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tag-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/tag/Basic.example.tsx" />
                <DocExample config={ this.getConfig() } title="Size" path="./_examples/tag/Size.example.tsx" />
                <DocExample config={ this.getConfig() } title="Color variants" path="./_examples/tag/Colors.example.tsx" />
            </>
        );
    }
}
