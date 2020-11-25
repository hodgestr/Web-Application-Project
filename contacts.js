function $(id)
{
    return document.getElementById(id);
}

function checkEmail(pEmail) //making sure email is in correct format with @ and .com
{
    if (pEmail.length < 4)
    {
        return false;
    }
    atSignPosition = pEmail.indexOf("@");
    if ((atSignPosition == -1) || (atSignPosition == 0))
    {
        return false;
    }
    periodPosition = pEmail.indexOf(".");
    if ((periodPosition == -1) || (periodPosition <= atSignPosition +1))
    {
        return false;
    }
    return true;
}

function checkPhone(pPhone) //making sure phone has correct amt of digits and dashes (-)
{
    if (pPhone.length != 8 && pPhone.length != 13)
    {
        return false;
    }
    
    atSignPosition = pPhone.indexOf("-");
    if ((atSignPosition != -1) && ((atSignPosition != 3) && (atSignPosition != 8)))
    {
        return false;
    }
    periodPosition = pPhone.indexOf("(");
    if ((periodPosition != -1) && (periodPosition != 0))
    {
            return false;
    }
    periodPosition = pPhone.indexOf(")");
    if ((periodPosition != -1) && (periodPosition != 4))
    {
        return false;
    }
    return true;
}

function checkForm()
{
    firstNameElement = $('firstNameEdit');
    lastNameElement = $('lastNameEdit');
    ageElement = $('ageEdit');
    emailElement = $('emailEdit');
    phoneElement = $('phoneEdit');
    //Check name fields
    if ((firstNameElement.value.length == 0) || (firstNameElement.value.length > 30)) //first name must be more than 0 and less than 30 char
    {
        alert("First name field is incorrect. ");
        return false;
    }
    if ((lastNameElement.value.length == 0) || (lastNameElement.value.length > 30)) //last name must be more than 0 and less than 30 char
    {
        alert("Last name field is incorrect. ");
        return false;
    }
    //Check Age Field
    ageValue = parseInt(ageElement.value);
    if (!(5 < ageValue < 110)) //age must be more than 5 and less than 110
    {
        alert("Age field is incorrect. ");
        return false;
    }
    if (!checkEmail(emailElement.value)) //refering to checkEmail function, if does not pass return false
    {
        alert("The email field is incorrect");
        return false;
    }
    if (!checkPhone(phoneElement.value)) //referring to checkPhone function, if does not pass return false
    {
        alert("The phone field is incorrect");
        return false;
    }
    return true;
}

function processContactList()
{
    console.log("Processing contact list returned from server.");
    if ((this.readyState == 4) && (this.status >= 200) && (this.status <= 299))
    {
        console.log("Got contact list successfully.");
        console.log(this.responseText);
        document.contactList = this.responseText;
        fillSelect();
        fillTable();
    }
    else
    {
        console.log("Failed to get contact list.");
        document.contactList = "";
    }
}

function clearForm()
{
    $('idEdit').value = 0;
    $('firstNameEdit').value = "";
    $('lastNameEdit').value = "";
    $('ageEdit').value = 0;
    $('phoneEdit').value = "";
    $('emailEdit').value = "";
    $('idEdit').hidden = true;
    $('idEditLabel').hidden = true;
    $('firstNameEdit').focus = true;
}

function getContactById(pId, plocal=true)
{
    console.log(`Getting contact by id = ${pId}`);
    if (plocal)
    {
        var contactsJSON = JSON.parse(document.contactList);
        for (loopIndex = 0; loopIndex < contactsJSON.length; loopIndex++)
        {
            if (contactsJSON[loopIndex].id == pId)
            {
                console.log(`Found contact in getContactById. Index = ${loopIndex}`);
                console.log(contactsJSON[loopIndex]);
                return contactsJSON[loopIndex];
            }
        }
        console.log('Did not find the contact in getContactById.');
        return null;
    }
    else
    {
        var curId = $('contact_select').value;
        console.log(`Deleting contact with id = ${curId}`);
        if (curId >= 0)
        {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function()
            {
                console.log(this.responseText);
                if (this.readyState == 4 && (this.status >= 200 && this.status <= 299))
                {
                    console.log("deleted the contact successfully");
                }
                else
                {
                    console.log("failed to delete contact");
                    console.log(this.status);
                    console.log(this.responseText);
                }
            }
        xhttp.open("POST", `http://localhost:3000/delete?Id=${curId}`);
        xhttp.send();
        }
    }
}

function fillEditForm()
{
    console.log('Trying to fill contact form');
    var contactsJSON = JSON.parse(document.contactList);
    var contactSelect = $('contact_select');
    var curId = contactSelect.value;
    console.log(`Filling contact form, id = ${curId}`);
    var curContact = getContactById(curId);
    if (curContact != null)
    {
        $('idEdit').value = curContact['id'];
        $('firstNameEdit').value = curContact['firstname'];
        $('lastNameEdit').value = curContact['lastname'];
        $('ageEdit').value = curContact['age'];
        $('phoneEdit').value = curContact['phone'];
        $('emailEdit').value = curContact['email'];
    }
    $('idEditLabel').hidden = false;
    $('idEdit').hidden = false;
    $('idEdit').disabled = true; //hide ID field so user cannot edit the ID field
}

function deleteContact()
{
    console.log("Attempting to delete a contact");
    var curId = $('contact_select').value;
    console.log(`Deleting contact with id = ${curId}`);
    if (curId >= 0)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function()
        {
            console.log(this.responseText);
            if (this.readyState == 4 && (this.status >= 200 && this.status <= 299))
            {
                console.log("deleted the contact successfully");
                getContacts();
            }
            else
            {
                console.log("failed to delete contact");
                console.log(this.status);
                console.log(this.responseText);
            }
        }
        xhttp.open("POST", `http://localhost:3000/delete?Id=${curId}`);
        xhttp.send();
    }
}

function fillSelect() //fill contact drop down menu
{
    if (document.contactList.length == 0)
    {
        console.log("The contact list is empty");
        return;
    }
    selectDeleteOptions();
    var contactsJSON = JSON.parse(document.contactList);
    var curRow;
    var contactSelect = $('contact_select');
    var option;
    for (var rowIndex = 0; rowIndex < contactsJSON.length; rowIndex++)
    {
        console.log(`Creating Select item: row index is ${rowIndex}`);
        option = document.createElement('option');
        curRow = contactsJSON[rowIndex];
        console.log(curRow);
        option.value = curRow['id'];
        option.appendChild(document.createTextNode(`${curRow['firstname']} ${curRow[`lastname`]}`));
        contactSelect.appendChild(option);
    }
    console.log("Finished setting up contact select option. ");
}

function tableDeleteOptions()
{
    var tableElement = $('contacts_table');
    for (loopControl = tableElement.rows.length - 1; loopControl >= 1; loopControl--)
    {
        tableElement.deleteRow(loopControl);
    }
}

function fillTable()
{
    if (document.contactList.length == 0)
    {
        console.log("The contact list is empty");
        return;
    }
    tableDeleteOptions();
    var contactsJSON = JSON.parse(document.contactList);
    var curRow;
    var tableElement = $('contacts_table');
    var tableColumns = ['id', 'firstname', 'lastname', 'age', 'phone', 'email']
    var curTR, curRow;
    for (var rowIndex = 0; rowIndex < contactsJSON.length; rowIndex++)
    {
        console.log(`Creating table item: row index is ${rowIndex}`);
        curTR = document.createElement('tr');
        curRow = contactsJSON[rowIndex];
        for (var loopControl = 0; loopControl < tableColumns.length; loopControl++)
        {
            var curTD = document.createElement('td');
            curTD.appendChild(document.createTextNode(curRow[tableColumns[loopControl]]))
            curTR.appendChild(curTD);
        }
        tableElement.appendChild(curTR);
    }
    console.log("Finished setting up contact select option. ");
}

function submitForm()
{
    if (!checkForm())
        return
    console.log("Attempting to save a contact");
    var curId = $('idEdit').value;
    var curFirstName = $('firstNameEdit').value;
    var curLastName = $('lastNameEdit').value;
    var curAge = $('ageEdit').value;
    var curPhone = $('phoneEdit').value;
    var curEmail = $('emailEdit').value;
    console.log(`Saving contact with id = ${curId}`);
    if (curId >= 0)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function()
        {
            console.log(this.responseText);
            if (this.readyState == 4 && (this.status >= 200 && this.status <= 299))
            {
                console.log("Saved the contact successfully");
                getContacts();
            }
            else
            {
                console.log("Failed to save contact.");
                console.log(this.status);
                console.log(this.responseText);
            }
        }
        xhttp.open("POST", `http://localhost:3000/save?Id=${curId}&firstName=${curFirstName}&lastName=${curLastName}&age=${curAge}&phone=${curPhone}&email=${curEmail}`);
        xhttp.send();
    }
}

function selectDeleteOptions()
{
    var curSelect = $('contact_select');
    for (loopControl = curSelect.length - 1; loopControl >= 0; loopControl--)
    {
        curSelect.remove(loopControl);
    }
}

function getContacts()
{
    console.log("Getting contacts from server.");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = processContactList;
    xhttp.open("GET", "http:/localhost:3000/list", true);
    xhttp.send();
}

function checkKey(event)
{
    if (event.keyCode == 13)
    {
        $('lastNameEdit').focus();
    }
}

window.onload = function() 
{
    this.getContacts();
    this.$('firstNameEdit').addEventListener('keypress', function(event) {if (event.keyCode == 13) { $('firstNameEdit').focus();}});
    this.$('lastNameEdit').addEventListener('keypress', function(event) {if (event.keyCode == 13) { $('lastNameEdit').focus();}});
    this.$('ageEdit').addEventListener('keypress', function(event) {if (event.keyCode == 13) { $('ageEdit').focus();}});
    this.$('phoneEdit').addEventListener('keypress', function(event) {if (event.keyCode == 13) { $('phoneEdit').focus();}});
    this.$('emailEdit').addEventListener('keypress', function(event) {if (event.keyCode == 13) { $('emailEdit').focus();}});
    //window.onkeypress = checkKey;
}
