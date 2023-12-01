const API_KEY = "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";
const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
    


async function summarizeText(inputText) {
    try {
        const requestBody = {
            inputs: inputText,

            model: 'facebook/bart-large-cnn',

            parameters: {
                min_length: 200,
                max_length: 500,
            },
            
            option: {
                use_cache: true,
            },
        };

        const response = await fetch(API_URL, {

            method: 'POST',
            
            headers: {

                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                

            },
            
            body: JSON.stringify(requestBody),

        });


        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();

        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(data);
        return data[0].summary_text;

    } 
    catch (err) 
    {
        console.log(err);
        return 'Error summarizing text';
    }
}


function showloadingAnimation()
{
    loadingContainer.style.display = 'block';
    summaryFieldDisplay.style.display = 'none';
}

function hideLoadingAnimation()
{
    loadingContainer.style.display = 'none';
    summaryFieldDisplay.style.display = 'block';
}


const loadingContainer = document.querySelector('.loadingContainer')

const btn = document.querySelector('.summaryField');

const summaryFieldDisplay = document.querySelector('.summaryFieldDisplay');

const majorPointsDisplay = document.querySelector('.majorPointsDisplay');

const copyBtn = document.querySelector('.copyBtn')

const bullet = document.querySelector('.majorPoints');



btn.addEventListener('click', async () => {

    showloadingAnimation();

    let[tab] = await chrome.tabs.query({ active: true, currentWindow: true});
   
    chrome.scripting.executeScript(
    {

        target: { tabId: tab.id},

        function: pickText,

    },

        async (web) => {

            const [data] = web;
    
        

            if(data.result)
            {

                
                const summary = await summarizeText(data.result);


                copyBtn.addEventListener('click', async () => {
                    
                    try
                    {
                        await navigator.clipboard.writeText(summary);
                    }

                    catch (err)
                    {
                        console.log(err);
                    }
                });

                summaryFieldDisplay.innerText = summary;
                summaryFieldDisplay.style.fontWeight = 'bold'; 

                hideLoadingAnimation();
            }
        }
    
    );
});

bullet.addEventListener('click', async () => {

    showloadingAnimation();

    let[tab] = await chrome.tabs.query({ active: true, currentWindow: true});
   
    chrome.scripting.executeScript(
    {

        target: { tabId: tab.id},

        function: pickText,

    },

        async (web) => {

            const [data] = web;
        

            if(data.result)
            {

                
                
                const summary = await summarizeText(data.result);

                const temp = summary.split('. ');

                const bulletPoints = temp.map(point => `=> ${point}`).join('\n\n');

                copyBtn.addEventListener('click', async () => {
                    
                    try
                    {
                        await navigator.clipboard.writeText(bulletPoints);
                    }

                    catch (err)
                    {
                        console.log(err);
                    }
                });

                summaryFieldDisplay.innerText = bulletPoints;
                summaryFieldDisplay.style.fontWeight = 'bold'; 
                
                hideLoadingAnimation();
            }
        }
    
    );
});




 function pickText()
{
    try
    {

        const paragraphElements = document.querySelectorAll('p');

        let web = "";

        paragraphElements.forEach(p => {

            web = web + p.innerText + '\n';
        });


        return web;
     
    }

    catch(err)
    {
        console.log(err);
    }

}
