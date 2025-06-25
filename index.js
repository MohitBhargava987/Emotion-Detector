const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const HUGGING_FACE_URL = "https://api-inference.huggingface.co/models/bhadresh-savani/distilbert-base-uncased-emotion";



// Serve HTML page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Emotion Detector</title>
            <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(to right, #fdfbfb, #ebedee);
                padding: 40px;
                color: #333;
                display: flex;
                justify-content: center;
            }

            .container {
                background: #fff;
                padding: 30px 40px;
                max-width: 600px;
                width: 100%;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                border-radius: 12px;
                transition: 0.3s ease;
            }

            h2 {
                font-size: 28px;
                margin-bottom: 20px;
                color: #2d3436;
                text-align: center;
            }

            textarea {
                width: 100%;
                height: 140px;
                padding: 14px;
                font-size: 16px;
                border: 1px solid #ccc;
                border-radius: 8px;
                resize: none;
                margin-bottom: 20px;
                transition: border 0.2s ease;
            }

            textarea:focus {
                outline: none;
                border-color: #007bff;
                box-shadow: 0 0 5px rgba(0,123,255,0.3);
            }

            button {
                background-color: #007bff;
                color: white;
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                width: 100%;
            }

            button:hover {
                background-color: #0056b3;
            }

            #result {
                margin-top: 25px;
                background: #f8f9fa;
                border-left: 5px solid #007bff;
                padding: 15px;
                border-radius: 8px;
                white-space: pre-line;
                font-size: 16px;
                line-height: 1.5;
            }
        </style>

        </head>
        <body>
            <div class="container">
                <h2>Emotion Detector</h2>
                <form id="emotionForm">
                    <textarea id="text" placeholder="Write your story or feelings here..." required></textarea><br>
                    <button type="submit">Detect Emotion</button>
                </form>
                <div id="result"></div>
            </div>

            <script>
                document.getElementById('emotionForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const text = document.getElementById('text').value;

                    try {
                        const response = await fetch('/detect-emotion', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text })
                        });

                        const data = await response.json();
                        const resultDiv = document.getElementById('result');

                        if (data.error) {
                            resultDiv.innerText = "Error: " + data.error;
                        } else {
                            resultDiv.innerText = data.emotions
                                .map(e => \`\${e.label}: \${(e.score * 100).toFixed(2)}%\`)
                                .join('\\n');
                        }
                    } catch (err) {
                        document.getElementById('result').innerText = "Request failed.";
                    }
                });
            </script>
        </body>
        </html>
    `);
});

app.post('/detect-emotion', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Please send TEXT" });

    try {
        const response = await axios.post(
            HUGGING_FACE_URL,
            { inputs: text },
            {
                headers: {
                    Authorization: `Bearer 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`,
                },
            }
        );
        console.log(response);
        const emotions = response.data[0]; // top predictions
        res.json({ emotions });
    } catch (err) {
        console.log(err, 'errerr');
        res.status(500).json({ error: 'Error detecting emotion', details: err.message });
    }
});

app.listen(3000, () => {
    console.log(`App is running on PORT- 3000`);
})