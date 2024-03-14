const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('signup');
});

app.post('/',(req, res) => {
    const Fname = req.body.Fname;
    const Lname = req.body.Lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: Fname,
                    LNAME: Lname
                }
            }
        ]
    };
        // console.log(data);
        const jsonData = JSON.stringify(data);
        // const jsonData = JSON.parse(JSON.stringify(data));
        // console.log(jsonData.members[0].email_address);
        // console.log(jsonData.members[0].merge_fields.FNAME);  
        
        const url = "https://us22.api.mailchimp.com/3.0/lists/6814202fab";

        const options = {
            method: 'POST',
            auth: "Aland:7801facf073a7efaca87df1fac6c9da3-us22",
        };

        const request = https.request(url, options, (response) => {
            if(response.statusCode===200) {
                res.render("success");
            } else{
                res.render("failure");
            }
        
            response.on('data', (data) => {
                console.log(JSON.parse(data));
            });
        });
        
        request.on('error', (error) => {
            console.error(error);
            res.render("failure");
        });
        
        request.write(jsonData);
        request.end();


        
        

});

app.listen(process.env.PORT || 3000, ()=> {
    console.log("server listening on port 3000");
})



// ID list
// 6814202fab

// new API 
// 7801facf073a7efaca87df1fac6c9da3-us22