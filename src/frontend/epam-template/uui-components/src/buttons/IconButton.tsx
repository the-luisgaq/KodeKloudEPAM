import * as React from 'react';
import { IDropdownToggler, Icon } from '@epam/uui-core';
import { Clickable, ClickableComponentProps } from '../widgets';
import { IconContainer } from '../layout';
import css from './IconButton.module.scss';

export type IconButtonProps = ClickableComponentProps & Omit<IDropdownToggler, 'isDropdown'> & {
    /** Icon can be a React element (usually an SVG element) */
    icon?: Icon;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /**
     * Defines component size.
     */
    size?: number | string;
    /**
     * Pass true to enable dropdown icon.
     */
    showDropdownIcon?: boolean;
};

export const IconButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>((props, ref) => {
    return (
        <Clickable
            { ...props }
            type="button"
            cx={ [css.container, props.cx] }
            ref={ ref }
        >
            <IconContainer icon={ props.icon } size={ props.size } />
            { props.showDropdownIcon && (
                <IconContainer icon={ props.dropdownIcon } flipY={ props.isOpen } size={ props.size } />
            ) }
        </Clickable>
    );
});
