const fs = require("fs");
const cron = require('node-cron');
const express = require('express');
const axios = require('axios');
const postToInstagram = require('./post');
const editImage = require('./editImage');
const news = require('./news');

const app = express();
const port = process.env.PORT || 3000;  // Use the PORT environment variable provided by Render

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(start, end) {
    let newsList = await news.getNewsHeadlines();
    for (let i = start; i < end; i++) {
        let newsObj = newsList[i];
        let imgUrl = newsObj.imgUrl;
        let heading = newsObj.title;
        let description = newsObj.description;
        if (imgUrl != null && heading != null) {
            console.log(imgUrl);
            console.log(heading);
            let status = await editImage.editImage(imgUrl, heading);
            if (status == true) {
                await postToInstagram.post('./images/output.jpeg', description);
                await sleep(60 * 1000);
            }
            console.log(i);
            console.log("---------------------------------------------");
        }
    }
}

// Schedule task at 6 AM every day
cron.schedule('0 6 * * *', () => {
    main(0, 10);
});

// Schedule task at 6 PM every day
cron.schedule('3 19 * * *', () => {
    console.log("its 19:00");
    main(10, 20);
});

// Dummy server to keep Render happy
app.get('/', (req, res) => {
    res.send('Background worker is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Periodic ping to keep the app awake
setInterval(() => {
    axios.get(`http://localhost:${port}`)
        .then(() => console.log('Pinged self to stay awake'))
        .catch((err) => console.error('Error pinging self:', err));
}, 5 * 60 * 1000); // Ping every 5 minutes
