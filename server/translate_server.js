const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(bodyParser.json());

app.get('/api',(req,res)=> {
    res.send("hi");
});
app.post('/api/translate', (req, res) => {
    const { text, language } = req.body;
    const data_to_pass_to_py = [text, language];

    const python_process = spawn('python', ['./translate.py', JSON.stringify(data_to_pass_to_py)]);

    python_process.stdout.on('data', (data) => {
        const translatedText = data.toString();
        res.json({ translatedText });
    });

            // python_process.stderr.on('data', (error) => {
            //     console.error(`Error: ${error}`);
            //     res.status(500).json({ error: 'Translation failed' });
            // });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
