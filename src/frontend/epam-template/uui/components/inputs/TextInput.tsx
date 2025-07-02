import React from 'react';
import { withMods, IEditableDebouncer, IEditableDebouncerOptions, Overwrite } from '@epam/uui-core';
import { TextInput as uuiTextInput, TextInputProps as CoreTextInputProps } from '@epam/uui-components';
import { IHasEditMode, EditMode, ControlSize } from '../types';
import { settings } from '../../settings';

import css from './TextInput.module.scss';

const DEFAULT_MODE = EditMode.FORM;

type TextInputMods = IHasEditMode & {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: ControlSize | '60';
};

export interface TextInputModsOverride {}

function applyTextInputMods(mods: CoreTextInputProps & TextInputMods) {
    return [
        css.root,
        `uui-size-${mods.size || settings.textInput.sizes.default}`,
        'uui-control-mode-' + (mods.mode || DEFAULT_MODE),
    ];
}

/** Represents the properties for a TextInput component. */
export interface TextInputProps extends CoreTextInputProps, Overwrite<TextInputMods, TextInputModsOverride> {}

/** Represents the properties for a SearchInput component. */
export interface SearchInputProps extends TextInputProps, IEditableDebouncerOptions {}

export const TextInput = withMods<CoreTextInputProps, TextInputProps>(uuiTextInput, applyTextInputMods, () => ({
    acceptIcon: settings.textInput.icons.acceptIcon,
    cancelIcon: settings.textInput.icons.clearIcon,
    dropdownIcon: settings.textInput.icons.dropdownIcon,
}));

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
    // analytics events are sending in IEditableDebouncer, so we need to avoid sending events in TextInput
    const { ...textInputProps } = props;
    delete textInputProps.getValueChangeAnalyticsEvent;

    return (
        <IEditableDebouncer
            { ...props }
            render={ (iEditable) => {
                const defaultOnCancel = () => iEditable.onValueChange('');

                return (
                    <TextInput
                        icon={ settings.textInput.icons.searchIcon }
                        onCancel={ props.onCancel ?? defaultOnCancel }
                        type="search"
                        inputMode="search"
                        ref={ ref }
                        { ...textInputProps }
                        { ...iEditable }
                    />
                );
            } }
        />
    );
});
