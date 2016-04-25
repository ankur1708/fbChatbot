var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'Show me products') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Bot heard, echo: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "CAAD7rRxMDvQBAJAWkouZBH4NQBPKXCa0SWzTZBriU8H8CB82YHI3ZBifsfiNR8mXg4RIKunl88L0aqDevRsZAGG0oOLU3L29baJNSiSuBiGsfqqEHzXOGfmC8mXtW7oVptm6IOYSCTu9DEIkXaqPAv9SphK0HuL0qQowpjZCeW6SGs95rBbbd6Ell4ZCDGF7JNHZAQWIBiqVAZDZD"

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Anarkali for occassions",
                    "subtitle": "₹20,000",
                    "image_url": "http://d2jdrba3e4yihf.cloudfront.net/products/5439/large/pralii-peach-high-low-ankle-length-anarkali-with-zari-cutwork-gillet-PRL1028_1.JPG",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.violetstreet.com/products/pralii-peach-high-low-ankle-length-anarkali-with-zari-cutwork-gillet",
                        "title": "I'll take it"
                    }, {
                        "type": "postback",
                        "title": "Add to cart",
                        "payload": "Anarkali added to cart. To checkout, type Checkout",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}



// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

