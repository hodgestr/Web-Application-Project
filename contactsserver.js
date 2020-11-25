const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');

// '/' is default folder  res is result
app.get('/', (req, res) => res.send('Hello World!'));

contactDataList = [];

app.get('/data/', cors(), function(req, res) //access the data folder, request results
{
    // TODO: fill out this method
    console.log("Inside data folder by GET function");
    client.query("SELECT * FROM contacts WHERE contacts.id = curId", function(err, result)
    {
        if (err) throw err;
        console.log(result.rowCount);
        res.status(201).send(result.rows);
        console.log(`result of the post is: ${result}`);
    })
    res.send(contactDataList[0]); //send back the contactDataList
});

app.get('/list/', cors(), function(req, res) //access the list folder, request results
{
    console.log("Inside contact list GET function.");
    client.query("SELECT * FROM contacts", function(err, result) //get all contacts from DB
    {
        console.log("Trying to insert into the DB.");
        if (err) throw err;
        console.log(result.rowCount);
        res.status(201).send(result.rows);
        console.log(`result of the post is: ${result}`);
    })
});

app.post('/delete/', cors(), function(req, res) //post request to delete a contact
{
    console.log("Deleting contact (post)");
    var curId = req.query.Id;
    console.log(`Id = ${curId}`);
    if (curId > 0)
    {
        var deleteSQL = `DELETE FROM contacts WHERE id = ${curId}`;
        client.query(deleteSQL, function(err, result)
        {
            console.log("Trying to delete from the DB.");
            if (err)
            {
                res.status(500).send(result);
                throw err;
            }
            console.log(`Deleted ${result.affectedRows} from the DB. `);
            res.status(200).send(result);
            console.log(`result of the post is: ${result}`);
        });
    }
});

app.post('/save/', cors(), function(req, res) //post request to add/edit(save) a contact
{
    var curId = req.query.Id;
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var age = req.query.age;
    var phone = req.query.phone;
    var email = req.query.email;

    if (curId > 0) //if the contact exists, then update it
    {
        var insert_sql = `UPDATE contacts set firstname='${firstName}', lastname='${lastName}', age=${age}, phone='${phone}', email='${email}', WHERE id=${curId}`;
    }
    else // else if contact does not exist, add it to the DB
    {
        var insert_sql = `INSERT INTO contacts (firstname, lastname, age, phone, email) VALUES ('${firstName}', '${lastName}', ${age}, '${phone}', '${email}')`;
    }
    
    client.query(insert_sql, function(err, result)
    {
        console.log("Trying to insert into the DB.");
        if (err)
        {
            res.status(500).send(result);
            throw err;
        }
        console.log(result.rowCount);
        res.status(201).send(result);
        console.log(`result of the post is: ${result}`);
    });
});
//I want app to listen on port 3000
app.listen(port, () => console.log('App is listening at http://localhost:${port}'));

const { Client } = require('pg')
const client = new Client(
{
    user: 'contacts',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
})
client.connect()
