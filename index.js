const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ServiceNow credentials and instance details
const SERVICE_NOW_INSTANCE = 'dev190983.service-now.com';
const SERVICE_NOW_USERNAME = 'admin';
const SERVICE_NOW_PASSWORD = '%ilC4A6q$CQv';

// Create a ticket on ServiceNow

// "impact": 1, (1 = High, 2 = Medium, 3 = Low).
// "urgency": 1, (1 = High, 2 = Medium, 3 = Low).
// "state": 1, (1 = New, 2 = In Progress, 3 = On Hold, 6 = Resolved, 7 = Closed).
app.post('/create-ticket', async (req, res) => {
    const { short_description, description, priority, category, subcategory, impact, urgency, state, comments, severity } = req.body;

    try {
        const response = await axios.post(
            `https://${SERVICE_NOW_INSTANCE}/api/now/table/incident`,
            {
                short_description: short_description || 'Default Short Description',
                description: description || 'Default Description',
                priority,
                category,
                subcategory,
                impact,
                urgency,
                state,
                comments,
                severity
            },
            {
                auth: {
                    username: SERVICE_NOW_USERNAME,
                    password: SERVICE_NOW_PASSWORD
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json({
            message: 'Ticket created successfully',
            ticket_number: response.data.result.number
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to create ticket',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
