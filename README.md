# Image Stretch Detector

This package checks if images on a web page appear stretched. It works by comparing each image’s displayed aspect ratio with its natural aspect ratio.

It can be used with testing tools like Stagehand.

---

## Installation

If you're using this as a local package for testing:

npm link

If this is a published package:

npm install image-stretch-detector

---

## How to Use

Import the function and pass in:

- The `page` object from your test environment (Stagehand or Puppeteer)
- An array of image selectors
- A threshold value (optional) to allow for small differences

```ts
import checkMultipleImagesStretch from 'image-stretch-detector';

const results = await checkMultipleImagesStretch(page, [
  'img.home-page-banner',
  'img.cars-slider-image'
], 0.1); // 0.1 is the threshold for stretch detection

Result Format
Each item in the result is an object with the following structure:

{
  selector: string,
  displayedAspectRatio: number,
  naturalAspectRatio: number,
  isStretched: boolean,
  error?: string
}
Example

test('Check homepage images', async () => {
  await page.goto('https://renty.ae');

  const selectors = ['img.home-page-banner', 'img.cars-slider-image'];
  const results = await checkMultipleImagesStretch(page, selectors, 0.1);

  for (const res of results) {
    console.log(`Result for selector: ${res.selector}`);
    if (res.error) {
      console.error(`Error: ${res.error}`);
    } else {
      console.log(`Displayed Aspect Ratio: ${res.displayedAspectRatio}`);
      console.log(`Natural Aspect Ratio: ${res.naturalAspectRatio}`);
      console.log(`Is Stretched? ${res.isStretched}`);
    }
  }
});

Notes
This package runs inside the browser context to get the natural and displayed sizes of each image.

If the difference between the aspect ratios is greater than the threshold, the image is marked as stretched.
```
