export declare function checkMultipleImagesStretch(page: any, selectors: string[], threshold?: number): Promise<{
    selector: string;
    displayedAspectRatio?: number;
    naturalAspectRatio?: number;
    isStretched?: boolean;
    error?: string;
}[]>;
