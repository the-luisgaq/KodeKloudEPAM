import {
    Range, Editor,
} from 'slate';
import {
    PlatePlugin, Value, createPlateEditor, getPlugins, useEditorState, PlateEditor, createPlugins,
} from '@udecode/plate-common';
import { createPlateUI } from './components';
import { PARAGRAPH_TYPE } from './plugins/paragraphPlugin';

export function getBlockDesirialiser(blockTags: Record<string, string>) {
    return (el: any, next: any) => {
        const block = blockTags[el.tagName.toLowerCase()];

        if (block) {
            return {
                object: 'block',
                type: block,
                nodes: next(el.childNodes),
            };
        }
    };
}

export function getMarkDeserializer(marks: Record<string, string>) {
    return (el: any, next: any) => {
        const mark = marks[el.tagName.toLowerCase()];

        if (mark) {
            return {
                object: 'mark',
                type: mark,
                nodes: next(el.childNodes),
            };
        }
    };
}

export function isTextSelected(editor: any, inFocus: boolean) {
    const { selection } = editor;
    return (selection && inFocus && !Range.isCollapsed(selection) && Editor.string(editor, selection) !== '');
}

export function isImageSelected(editor: any) {
    const { selection, getFragment } = editor;
    const node = getFragment()[0]?.type;
    return selection && node === 'image';
}

// TODO: get rid of that
export function useIsPluginActive(key: string): boolean {
    const editor = useEditorState();
    const plugins = getPlugins(editor);
    return plugins.some((plugin) => plugin.key === key);
}

export const isEditorValueEmpty = (value: Value) => {
    if (!value || value.length === 0) return true;

    const isFirstParagraph = value[0].type === PARAGRAPH_TYPE && value[0].children[0].text === '';
    if (value.length === 1 && isFirstParagraph) {
        return true;
    }
    return false;
};

export class SelectionUtils {
    static getSelection(params: { shadowRoot: ShadowRoot | undefined }) {
        const { shadowRoot } = params;
        if (shadowRoot) {
            if ((shadowRoot as any).getSelection) {
                // Chrome/Edge. See details here: https://caniuse.com/mdn-api_shadowroot_getselection
                return (shadowRoot as any).getSelection();
            }
        }
        // Works fine in other cases
        return window.getSelection();
    }

    static getSelectionRange0(params: { selection: Selection; shadowRoot: ShadowRoot | undefined }) {
        const { selection, shadowRoot } = params;
        if (shadowRoot) {
            if ((selection as any).getComposedRanges) {
                // Webkit. https://w3c.github.io/selection-api/#dom-selection-getcomposedranges
                return (selection as any).getComposedRanges(shadowRoot)[0];
            }
        }
        return selection.getRangeAt(0);
    }
}

export const createTempEditor = (plugins: PlatePlugin[]): PlateEditor => {
    return createPlateEditor({
        plugins: createPlugins((plugins).flat(), {
            components: createPlateUI(),
        }),
    });
};
