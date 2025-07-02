import { TElement } from '@udecode/plate-common';
import type { FileUploadResponse } from '@epam/uui-core';

export type PlateImgAlign = 'left' | 'center' | 'right';
export type ImageSize = { width?: number, height?: number | string };

export type ModalPayload = string | File[];

export interface TImageElement extends TElement {
    url: string;
    width?: number | string;
    align?: PlateImgAlign;
    data?: FileUploadResponse;
    height?: number;
}
