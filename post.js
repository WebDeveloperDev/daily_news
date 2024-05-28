const fs = require("fs");
const editImage = require('./editImage');
const news = require('./news');
require("dotenv").config();
const { IgApiClient } = require("instagram-private-api");
const exp = require("constants");

async function post(imagePath, caption) {
    let hashtag="#news #latestnews #dailynews #daily #business #trading #share #india #us #trending #feed #explorepage"
    let inscaption = caption + hashtag;
    console.log(`Preparing to post: ${inscaption}`);

    const postToInsta = async () => {
        try {
            const ig = new IgApiClient();
            ig.state.generateDevice(process.env.IG_USERNAME);
            await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

            // Ensure the file exists
            if (!fs.existsSync(imagePath)) {
                throw new Error(`File not found: ${imagePath}`);
            }

            // Read the image file into a buffer
            const imageBuffer = fs.readFileSync(imagePath);

            // Ensure the buffer is not empty
            if (!imageBuffer || imageBuffer.length === 0) {
                throw new Error('Image buffer is empty');
            }

            // Post the image buffer to Instagram
            await ig.publish.photo({
                file: imageBuffer,
                caption: inscaption,
            });

            console.log('Successfully posted.');
        } catch (error) {
          console.error('Error posting to Instagram:', JSON.stringify(error, null, 2));

        }
    };

    await postToInsta();
}

module.exports={
  post
}