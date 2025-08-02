export async function checkMultipleImagesStretch(
  page: any,
  selectors: string[],
  threshold: number = 0.05
): Promise<
  {
    selector: string;
    displayedAspectRatio?: number;
    naturalAspectRatio?: number;
    isStretched?: boolean;
    error?: string;
  }[]
> {
  const results: {
    selector: string;
    displayedAspectRatio?: number;
    naturalAspectRatio?: number;
    isStretched?: boolean;
    error?: string;
  }[] = [];

  for (const selector of selectors) {
    try {
      const result = await page.evaluate((sel: string) => {
        let target: HTMLElement | null = document.querySelector(sel);

        if (target && target.tagName.toLowerCase() === 'picture') {
          const img = target.querySelector('img');
          if (!img) throw new Error('No <img> inside <picture> tag.');
          target = img as HTMLImageElement;
        }

        if (!target || target.tagName.toLowerCase() !== 'img') {
          throw new Error('Element not found or is not an <img>.');
        }

        const img = target as HTMLImageElement;
        const displayedWidth = img.clientWidth;
        const displayedHeight = img.clientHeight;
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        if (
          displayedWidth === 0 ||
          displayedHeight === 0 ||
          naturalWidth === 0 ||
          naturalHeight === 0
        ) {
          throw new Error('Image dimensions are zero or not loaded.');
        }

        const displayedAspectRatio = displayedWidth / displayedHeight;
        const naturalAspectRatio = naturalWidth / naturalHeight;
        const isStretched =
          Math.abs(displayedAspectRatio - naturalAspectRatio) > threshold;

        return {
          displayedAspectRatio,
          naturalAspectRatio,
          isStretched,
        };
      }, selector);

      results.push({
        selector,
        ...result,
      });
    } catch (error: any) {
      results.push({
        selector,
        error: error?.message || String(error),
      });
    }
  }

  return results;
}
