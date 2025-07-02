import { PreviewPageParams } from '../types';

const DELIMITERS = {
    TOKEN: '-',
    TAG: '--',
};

export type TUniqueTestNameParams = PreviewPageParams & { previewTag?: string };

/**
 * The result string is used for both: 1) unique test name 2) unique screenshot file name
 */
export function formatTestName(params: TUniqueTestNameParams): string {
    const { isSkin, theme, componentId, previewId, previewTag } = params;
    const skinToken = normToken(isSkin ? 'Skin' : 'NotSkin');
    const previewToken = previewTag
        ? `${normToken(previewId)}${DELIMITERS.TAG}${normToken(previewTag)}`
        : normToken(previewId);

    return [
        normToken(componentId),
        previewToken,
        normToken(theme),
        skinToken,
    ].join(DELIMITERS.TOKEN);
}

type TUniqueTestNameTokens = {
    componentId: string,
    previewId: string,
    previewIdTag: string | undefined,
    theme: string,
    skinToken: string,
};
export function parseTestName(testName: string): TUniqueTestNameTokens {
    const TEMP_DELIM = '__';
    const testName1 = testName.replaceAll(DELIMITERS.TAG, TEMP_DELIM);
    const [componentId, previewIdWithTag, theme, skinToken] = testName1.split(DELIMITERS.TOKEN);
    const [previewId, previewIdTag] = previewIdWithTag.split(TEMP_DELIM);

    return {
        componentId,
        previewId,
        previewIdTag,
        theme,
        skinToken,
    };
}

/**
 * Make it possible to use a token as part of a filename in any operating system
 */
function normToken(s: string) {
    return s
        .split(/[-_\s]/).map((i) => `${capitalize(i)}`).join('')
        .replace(/[^A-Za-z0-9]/g, '');
}
function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
