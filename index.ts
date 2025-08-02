export async function checkMultipleImagesStretch(
  page: any,
  selectors: string[],
  threshold: number
): Promise<
  {
    selector: string;
    displayedAspectRatio: number;
    naturalAspectRatio: number;
    isStretched: boolean;
    error?: string;
  }[]
> {
  const results: {
    selector: string;
    displayedAspectRatio: number;
    naturalAspectRatio: number;
    isStretched: boolean;
    error?: string;
  }[] = [];

  for (const selector of selectors) {
    try {
      const result = await page.evaluate(
        ({ sel, threshold }: { sel: string; threshold: number }) => {
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
        },
        { sel: selector, threshold }
      );

      results.push({
        selector,
        displayedAspectRatio: result.displayedAspectRatio,
        naturalAspectRatio: result.naturalAspectRatio,
        isStretched: result.isStretched,
      });
    } catch (err: any) {
      results.push({
        selector,
        displayedAspectRatio: 0,
        naturalAspectRatio: 0,
        isStretched: false,
        error: err.message || 'Unknown error',
      });
    }
  }

  return results;
}
