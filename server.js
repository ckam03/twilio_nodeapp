const dotenv = require('dotenv').config();
const accountSid = process.env.twilioAccountSid;
const authToken = process.env.twilioAuthToken;
const client = require('twilio')(accountSid, authToken);
const express = require('express');
const PORT = process.env.PORT || 3000;
const schedule = require('node-schedule');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post('/form', (req, res) => {
    let number = req.body.number;
    let date = req.body.date.split("-");
    let dateObject = {
        year: date[0],
        month: date[1],
        day: date[2]   
    };
    let time = req.body.appt.split(":");
    let hours = time[0].split("0");
    let timeObject = {
        hour: hours[1],
        minute: time[1]
    };
    let message = req.body.message;
    res.send('Text sent');
    
    let scheduledDate = new Date(dateObject.year, dateObject.month - 1, dateObject.day, timeObject.hour, timeObject.minute, 0);
    const j = schedule.scheduleJob(scheduledDate, function() {
        client.messages.create({
            body: message,
            to: number,
            from: '+19169148723'
        })
        .then(message => console.log(message.sid));
      });
    

});

app.listen(PORT,() => {
    console.log(`Server started on port ${PORT}`);
});