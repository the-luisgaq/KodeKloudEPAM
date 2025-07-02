import * as React from 'react';
import { offset } from '@floating-ui/react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DropdownProps } from '@epam/uui-core';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class DropdownDoc extends BaseDocsBlock {
    title = 'Dropdown';

    static override config: TDocConfig = {
        name: 'Dropdown',
        bySkin: {
            [TSkin.Loveship]: { type: '@epam/uui-core:DropdownProps', component: loveship.Dropdown },
            [TSkin.Promo]: { type: '@epam/uui-core:DropdownProps', component: promo.Dropdown },
            [TSkin.UUI]: { type: '@epam/uui-core:DropdownProps', component: uui.Dropdown },
            [TSkin.Electric]: { type: '@epam/uui-core:DropdownProps', component: electric.Dropdown },
        },
        doc: (doc: DocBuilder<DropdownProps>) => {
            doc.merge('openOnClick', { remountOnChange: true });
            doc.merge('openOnHover', { remountOnChange: true });
            doc.merge('closeOnClickOutside', { remountOnChange: true });
            doc.merge('closeOnTargetClick', { remountOnChange: true });
            doc.merge('closeOnMouseLeave', { remountOnChange: true });
            doc.merge('middleware', { examples: [{ name: '[offset(6)]', value: [offset(6)] }] });
            doc.merge('virtualTarget', {
                examples: [
                    {
                        name: 'Virtual Element',
                        value: {
                            getBoundingClientRect() {
                                return {
                                    x: 20,
                                    y: 20,
                                    top: 0,
                                    left: 0,
                                    bottom: 20,
                                    right: 20,
                                    width: 20,
                                    height: 20,
                                };
                            },
                        },
                    },
                ],
            });
            doc.merge('renderBody', {
                editorType: 'MultiUnknownEditor',
                examples: [
                    {
                        value: (props) => (
                            <uui.DropdownMenuBody { ...props }>
                                <uui.DropdownMenuHeader caption="Tools" />
                                <uui.DropdownMenuButton caption="Button111" />
                                <uui.DropdownMenuButton caption="Button2" />
                                <uui.DropdownMenuButton caption="Button3232" />
                                <uui.DropdownMenuSplitter />
                                <uui.DropdownMenuButton caption="Button2" />
                                <uui.DropdownMenuButton caption="Button323442" />
                            </uui.DropdownMenuBody>
                        ),
                        name: 'menu',
                        isDefault: true,
                    },
                    {
                        value: () => {
                            return (
                                <uui.Panel background="surface-main" shadow={ true }>
                                    <uui.FlexRow padding="12" vPadding="12">
                                        <uui.Text>Dropdown body content. You can use any components as a dropdown body.</uui.Text>
                                    </uui.FlexRow>
                                </uui.Panel>
                            );
                        },
                        name: 'content',
                    },
                ],
            });
            doc.merge('renderTarget', {
                editorType: 'SingleUnknownEditor',
                examples: [
                    {
                        value: (props) => <uui.Button caption="Target" { ...props } />,
                        isDefault: true,
                    },
                ],
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dropdown-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/dropdown/Basic.example.tsx" />
                <DocExample title="Dropdown Open/Close modifiers" path="./_examples/dropdown/CloseOpenModifiers.example.tsx" />
                <DocExample title="Set delay for dropdown body opening or closing" path="./_examples/dropdown/DelayForOpenAndClose.example.tsx" />
                <DocExample title="Handle dropdown state by yourself" path="./_examples/dropdown/HandleStateByYourself.example.tsx" />
                <DocExample title="Close dropdown from body" path="./_examples/dropdown/CloseFromBody.example.tsx" />
                <DocExample title="Virtual element positioned at a specific point on canvas" path="./_examples/dropdown/VirtualElementCanvas.example.tsx" />
                <DocExample title="Create a virtual element that positions the dropdown at mouse coordinates" path="./_examples/dropdown/VirtualElementOnMouseCoordinates.example.tsx" />
            </>
        );
    }
}
