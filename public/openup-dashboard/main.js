<// Function to fetch response from OpenAI
async function fetchOpenAIResponse(input) {
    // Replace with actual API call to OpenAI
    const response = await fetch(sk-proj-ZstjbkmPtzCV7lEXMMLbT3BlbkFJcRcgrU15M940yEreHKDf, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
    });

    const data = await response.json();
    return data.response; // Adjust based on your API response format
}

// Function to generate p5.js visualization
function generateP5Visualization(response) {
    new p5((p) => {
        p.setup = function () {
            p.createCanvas(400, 400);
            p.background(200);
            // Visualization logic based on response
            p.fill(0);
            p.textSize(16);
            p.text(response, 10, 50, 380, 380); // Example: Displaying response as text
        };
    }, document.getElementById('p5CanvasContainer'));
}

// Event listener for the form submission
document.querySelector('.search-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const input = event.target.querySelector('input').value;

    // Fetch OpenAI response
    const openAIResponse = await fetchOpenAIResponse(input);

    // Display OpenAI response in the chatbot interface
    const responseWrapper = document.createElement('div');
    responseWrapper.classList.add('single__question__answer');
    responseWrapper.innerHTML = `
        <div class="question_user">
            <div class="left_user_info">
                <img src="assets/images/avatar/04.png" alt="avatar">
                <div class="question__user">${input}</div>
            </div>
        </div>
        <div class="answer__area">
            <div class="thumbnail">
                <img src="assets/images/avatar/04.png" alt="avatar">
            </div>
            <div class="answer_main__wrapper">
                <h4 class="common__title">Response</h4>
                <p class="disc">${openAIResponse}</p>
                <div id="p5CanvasContainer"></div>
            </div>
        </div>
    `;

    document.querySelector('.question_answer__wrapper__chatbot').appendChild(responseWrapper);

    // Generate p5.js visualization
    generateP5Visualization(openAIResponse);
});

