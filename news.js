const axios = require('axios');

async function getNewsHeadlines(limit) {
    // Replace 'YOUR_API_KEY' with your actual NewsAPI key
    const api_key = "732f121d0b66458bac3fb5bf326db1e3";
    
    // URL for top headlines endpoint
    const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${api_key}`;

    try {
        const response = await axios.get(url);
        
        const newsheadlines = [];
        
        if (response.status === 200) {
            const data = response.data;
            // Extract and store the headlines
            data.articles.slice(0, limit).forEach(article => {
                let newsObj={
                    title:article.title,
                    imgUrl:article.urlToImage,
                    description:article.description
                }
                newsheadlines.push(newsObj);
            });
        } else {
            console.log("Error:", response.status);
        }
        
        return newsheadlines;
    } catch (error) {
        console.log("Error:", error.message);
        return [];
    }
}
module.exports={
    getNewsHeadlines
}

// async function main() {
//     const headlines = await getNewsHeadlines(30);
//     k=1
//     headlines.forEach(element => {
//         // console.log(element);
//         console.log(k)
//         k+=1
//     });
// }

// main();
