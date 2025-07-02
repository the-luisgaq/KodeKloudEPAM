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
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { getCurrentTheme } from '../helpers';
import { TIconButtonPreview } from './_types/previewIds';
import { ReactComponent as ActionIcon } from '@epam/assets/icons/action-account-fill.svg';

export class IconButtonDoc extends BaseDocsBlock {
    title = 'Icon Button';

    static override config: TDocConfig = {
        name: 'IconButton',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:IconButtonProps', component: uui.IconButton },
            [TSkin.Electric]: { type: '@epam/uui:IconButtonProps', component: electric.IconButton },
            [TSkin.Loveship]: { type: '@epam/loveship:IconButtonProps', component: loveship.IconButton },
            [TSkin.Promo]: { type: '@epam/promo:IconButtonProps', component: promo.IconButton },
        },
        doc: (doc: DocBuilder<promo.IconButtonProps | loveship.IconButtonProps| uui.IconButtonProps>) => {
            const mapNeutralColor: Record<string, string> = {
                loveship_dark: 'neutral-10',
                electric: 'neutral-95',
                vanilla_thunder: 'control-bg-hover',
            };

            const mapSecondaryColor: Record<string, string> = {
                loveship: 'neutral-50',
                promo: 'neutral-50',
                loveship_dark: 'neutral-40',
            };

            doc.merge('color', {
                editorType: getColorPickerComponent({
                    ...COLOR_MAP,
                    neutral: `var(--uui-${!!mapNeutralColor[getCurrentTheme()] ? mapNeutralColor[getCurrentTheme()] : 'neutral-60'})`,
                    secondary: `var(--uui-${!!mapSecondaryColor[getCurrentTheme()] ? mapSecondaryColor[getCurrentTheme()] : 'secondary-50'})`,
                }),
            });
            doc.setDefaultPropExample('onClick', () => true);
            doc.setDefaultPropExample('icon', ({ value }) => value === ActionIcon);
        },
        preview: (docPreview: DocPreviewBuilder<promo.IconButtonProps | loveship.IconButtonProps | uui.IconButtonProps>) => {
            const TEST_DATA = {
                icon: 'action-account-fill.svg',
                dropdownIcon: 'navigation-chevron_down-outline.svg',
            };
            docPreview.add({
                id: TIconButtonPreview['Color Variants'],
                matrix: {
                    size: { values: ['24'] },
                    color: { examples: '*' },
                    dropdownIcon: { examples: [TEST_DATA.dropdownIcon] },
                    showDropdownIcon: { values: [true] },
                    isOpen: { values: [false] },
                    icon: { examples: [TEST_DATA.icon] },
                    isDisabled: { values: [false, true] },
                    href: { values: ['https://www.epam.com'] },
                },
                cellSize: '60-40',
            });
            docPreview.add({
                id: TIconButtonPreview['Size Variants'],
                matrix: {
                    dropdownIcon: { examples: [TEST_DATA.dropdownIcon] },
                    showDropdownIcon: { values: [true, false] },
                    isOpen: { values: [false, true] },
                    icon: { examples: [TEST_DATA.icon] },
                    size: { examples: '*' },
                    color: { examples: ['info'] },
                    href: { values: ['https://www.epam.com'] },
                },
                cellSize: '80-50',
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="icon-button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/iconButton/Basic.example.tsx" />
            </>
        );
    }
}
