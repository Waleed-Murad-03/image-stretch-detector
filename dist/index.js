"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMultipleImagesStretch = checkMultipleImagesStretch;
async function checkMultipleImagesStretch(page, selectors, threshold = 0.05) {
    const results = [];
    for (const selector of selectors) {
        try {
            const result = await page.evaluate((sel) => {
                let target = document.querySelector(sel);
                if (target && target.tagName.toLowerCase() === 'picture') {
                    const img = target.querySelector('img');
                    if (!img)
                        throw new Error('No <img> inside <picture> tag.');
                    target = img;
                }
                if (!target || target.tagName.toLowerCase() !== 'img') {
                    throw new Error('Element not found or is not an <img>.');
                }
                const img = target;
                const displayedWidth = img.clientWidth;
                const displayedHeight = img.clientHeight;
                const naturalWidth = img.naturalWidth;
                const naturalHeight = img.naturalHeight;
                if (displayedWidth === 0 ||
                    displayedHeight === 0 ||
                    naturalWidth === 0 ||
                    naturalHeight === 0) {
                    throw new Error('Image dimensions are zero or not loaded.');
                }
                const displayedAspectRatio = displayedWidth / displayedHeight;
                const naturalAspectRatio = naturalWidth / naturalHeight;
                const isStretched = Math.abs(displayedAspectRatio - naturalAspectRatio) > threshold;
                return {
                    displayedAspectRatio,
                    naturalAspectRatio,
                    isStretched,
                };
            }, selector);
            results.push(Object.assign({ selector }, result));
        }
        catch (error) {
            results.push({
                selector,
                error: (error === null || error === void 0 ? void 0 : error.message) || String(error),
            });
        }
    }
    return results;
}
