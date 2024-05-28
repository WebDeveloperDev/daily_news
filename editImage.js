const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

async function editImage(imageUrl, heading) {
    try {
        // Define paths for input images and output image
        const templateImgPath = "./images/template.png";
        const overlayImagePath = imageUrl;  // Path to the input image
        const outputImagePath = path.join(__dirname, 'images/output.jpeg');  // Path to the output image

        // Define constants for layout
        const canvasSize = 1000;  // 1x1 aspect ratio canvas
        const margin = 50;  // Margin around elements
        const fontSize = 40;  // Custom font size

        // Load images
        const [templateImg, overlayImage] = await Promise.all([
            Jimp.read(templateImgPath),
            Jimp.read(overlayImagePath),
        ]);

        // Load custom font from local file
        const fontPath = path.join(__dirname, 'fonts', 'aWQ4B6h0CHWzngh9AcfBpi69.ttf.fnt');  // Path to your local .fnt file
        const font = await Jimp.loadFont(fontPath);

        // Create a new image with a white background
        const image = new Jimp(canvasSize, canvasSize, '#000000');

        // Convert WebP to JPEG if overlay image is in WebP format
        if (overlayImagePath.toLowerCase().endsWith('.webp')) {
            // Convert WebP to buffer
            const webpBuffer = await Jimp.read(overlayImagePath).getBufferAsync(Jimp.MIME_JPEG);
            overlayImage = await Jimp.read(webpBuffer);
        }

        // Resize and composite the overlay image to fit the canvas
        overlayImage.resize(Jimp.AUTO, canvasSize);
        templateImg.resize(canvasSize, Jimp.AUTO);
        image.composite(overlayImage, -250, 0);
        image.composite(templateImg, 0, 0);

        // Add the heading text at the bottom
        const headingHeight = Jimp.measureTextHeight(font, heading, canvasSize - 2 * margin);
        image.print(
            font,
            margin, canvasSize - headingHeight - margin,
            {
                text: heading,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_TOP
            },
            canvasSize - 2 * margin,
            headingHeight
        );

        // Save the resulting image
        await image.writeAsync(outputImagePath);
        console.log('Image processing complete');
        return true
    } catch (err) {
        console.error('Error processing image:', err);
        return false
    }
}

module.exports = {
    editImage
};

// Usage example
// const inputImagePath = 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1280,q_80/lsci/db/PICTURES/CMS/381500/381553.jpg';  // Path to the uploaded image (WebP format)
// const heading = 'Kolkata Knight Riders Win IPL 2024: Historic Third Championship Victory l IPL 2024 Champions';  // Heading text
// editImage(inputImagePath, heading);
