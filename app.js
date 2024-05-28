const fs = require("fs");
const cron = require('node-cron');
const postToInstagram=require('./post')
const editImage = require('./editImage');
const news = require('./news');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function main(start,end) {
    
    let newsList=await news.getNewsHeadlines()
    for (start;i<end;i++){
        let newsObj=newsList[i]
        let imgUrl=newsObj.imgUrl
        let heading=newsObj.title
        let description=newsObj.description
        if (imgUrl!=null && heading!=null) {
            console.log(imgUrl)
            console.log(heading)
            let status=await editImage.editImage(imgUrl, heading);
            if (status==true) {
                await postToInstagram.post('./images/output.jpeg',description)
                await sleep(60*1000);
            }
            console.log(i)
            console.log("---------------------------------------------")
        }
    }

}


// Schedule task at 6 AM every day
cron.schedule('0 6 * * *', () => {
    main(0,10)
});

// Schedule task at 6 PM every day
cron.schedule('0 18 * * *', () => {
  main(10,20)
});

// Keep the process running
const keepAlive = () => {
  setTimeout(keepAlive, 1000);
};
keepAlive();



