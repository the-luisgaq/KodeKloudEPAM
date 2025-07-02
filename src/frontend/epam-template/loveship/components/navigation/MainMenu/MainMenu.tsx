import React from 'react';
import * as uui from '@epam/uui';
import { createSkinComponent } from '@epam/uui-core';
import { MainMenuDropdown } from './MainMenuDropdown';

export interface MainMenuProps extends uui.MainMenuProps {
    /**
     * Defines component color scheme.
     * @default 'dark'
     */
    color?: 'white' | 'dark';
}

function applyMainMenuMods(mods: MainMenuProps) {
    return [
        mods.color && `uui-main_menu-${mods.color || 'dark'}`,
    ];
}

export const MainMenu = createSkinComponent<uui.MainMenuProps, MainMenuProps>(
    uui.MainMenu,
    (props) => {
        return {
            MainMenuDropdown: (dropdownProps) => <MainMenuDropdown { ...dropdownProps } color={ props.color } />,
        };
    },
    applyMainMenuMods,
);
