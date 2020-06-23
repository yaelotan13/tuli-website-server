const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const transporter = require('./config');

const app = express();
dotenv.config();

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  console.log('running in production mode');
  app.use(cors({
    origin: 'https://tulis-events.com',
    credentials: true,
  }))
} else {
  console.log('running in development mode');
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }))
}

app.post('/send', (req, res) => {
  console.log(req.body);
  try {
    const mailOptions = {
        from: req.body.email,
        to: process.env.email,
        subject: 'Tulis Event - New Message', 
        html: `<div><h4>Sender Information:</h4><p><b>Name:</b> ${req.body.name}</p><p><b>Phone Number:</b> ${req.body.tel}</p><hr></hr><br></br><p><b>Message:</b><br></br><br></br>${req.body.content}</p></div>`
    };

    console.log('sending email');
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('has error');
        } else {
            res.status(200).send(`<div><h4>Sender Information:</h4><p><b>Name:</b> ${req.body.name}</p><p><b>Phone Number:</b> ${req.body.tel}</p><hr></hr><br></br><p><b>Message:</b><br></br><br></br>${req.body.content}</p></div>`);
        }
    })
  } catch (error) {
    res.status(500).send('has error');
  };
});

app.listen(process.env.PORT || 3333, () => {
  console.log(`server start on port ${process.env.PORT || 3333}`);
});