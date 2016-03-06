var id = 0;
var fakeContacts = [
    { "phone": "01",
        "myname": "Test Name",
        "city": "Sofia",
        "gender": "Male",
        "sign": "Leo",
        "notes": "Some notes",
        "id": "0"},
    {"phone": "0",
        "myname": "Test Name 2",
        "city": "World",
        "gender": "Female",
        "sign": "Cancer",
        "notes": "Some notes",
        "id": "1"},
    {"phone": "333",
        "myname": "Test Name 2",
        "city": "World",
        "gender": "Female",
        "sign": "Cancer",
        "notes": "Some notes",
        "id": "2"}
];




var ContactViewModel = function (contact){
    var self = this;
    //Unique id when create new contact
    if(contact.id == null){
        self.id = id;
        id ++;
    }
    //Unique id when edit existing contact
    else
        self.id = contact.id;

    self.phone = ko.observable(contact.phone);
    self.myname = ko.observable(contact.myname);
    self.city = ko.observable(contact.city);
    self.gender = ko.observable(contact.gender);
    self.sign = ko.observable(contact.sign);
    self.notes = ko.observable(contact.notes);

    var regexPhone = /^[+0][0-9]+$/;
    //toDo: rules for valid contact depending on other rules
    self.contactValid = ko.computed(function() {
        return (self.phone().length> 12) || (self.phone().length < 5)  || (self.phone().match(regexPhone) == null) ||
        (self.myname().length> 30) || (self.myname().length < 0) || (self.notes() && self.notes().length> 500) ? false : true;
        //return (self.phone().length> 2) || (self.phone().match(regexPhone) == null) ||  self.myname().length> 2 || self.myname().length == "" || self.notes().length> 2 ? false : true;
    }, self);

    self.phoneStatus = ko.computed(function() {
        return (self.phone().length> 12) || (self.phone().length < 5)  || (self.phone().match(regexPhone) == null) ? "red" : "green";
    }, self);

    self.nameStatus = ko.computed(function() {
        return (self.myname().length> 30) || (self.myname().length < 0) ? "red" : "green";
    }, self);
    self.notesStatus = ko.computed(function() {
        return self.notes() && self.notes().length> 500 ? "red" : "green";
    }, self);
}
window.ContactViewModel = ContactViewModel;

var ContactList = function() {

    var self = this;
    self.contacts = ko.observableArray();
    self.editMode = ko.observable(false);
    self.importMode = ko.observable(false);
    self.selectedContact = ko.observable();
    self.signOptions = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagitarrius','Capricorn','Aquarius','Pisces'];
    self.currentPhoneFilter = ko.observable("");
    self.currentNameFilter = ko.observable("");
    self.currentCityFilter = ko.observable("");
    self.currentGenderFilter = ko.observable("");
    self.importText = ko.observable();

    self.initFakeContacts = function (){
        id = 3;
        localStorage.setItem("contacts",  JSON.stringify(fakeContacts));
        self.loadFromLocal();
    }
    self.saveToLocal = function(){
        console.log(self.contacts());
        var contacts = [];
        for(var i = 0; i< self.contacts().length; i++){
            contacts.push(createContact(self.contacts()[i].phone(), self.contacts()[i].myname(),self.contacts()[i].city(),self.contacts()[i].city(),self.contacts()[i].gender(),
                self.contacts()[i].sign(), self.contacts()[i].notes(),self.contacts()[i].id));
        }
        localStorage.setItem("contacts",  JSON.stringify(contacts));
    };

    //load JSON from localstorage, merge new contacts to localStorageJSON and update view
    self.saveToLocal = function(newContacts){
        var restoredContacts = JSON.parse(localStorage.getItem('contacts'));
        for(var i = 0; i< newContacts.length; i++){
            restoredContacts.push(newContacts[i]);
        }
        localStorage.setItem("contacts",  JSON.stringify(restoredContacts));
    }
    self.saveToLocalContact = function(newContact){
        var restoredContacts = JSON.parse(localStorage.getItem('contacts'));
        //delete if contact exist and rewrite it
        for(var j = 0; j < restoredContacts.length; j++)
            if(restoredContacts[j].id == newContact.id)
                restoredContacts.splice(j, 1);
        restoredContacts.push(newContact);
        localStorage.setItem("contacts",  JSON.stringify(restoredContacts));
    }

    self.removeFromLocal = function(id){
        var restoredContacts = JSON.parse(localStorage.getItem('contacts'));
        for(var i = 0; i< restoredContacts.length; i++){
            if(restoredContacts[i].id == id)
                restoredContacts.splice(i, 1);
        }
        localStorage.setItem("contacts",  JSON.stringify(restoredContacts));
    }

    self.loadFromLocal = function(){
        var restoredContacts = JSON.parse(localStorage.getItem('contacts'));
        var contacts = [];
        for(var i = 0; i < restoredContacts.length; i++){
            var contact = new ContactViewModel(restoredContacts[i]);
            contacts.push(contact);
        }
        self.contacts(contacts);
    };



    self.loadFromLocal();

    self.editContact = function(contact) {
        self.editMode(true);
        var editContact = new ContactViewModel(createContact(contact.phone(), contact.myname(),contact.city(),contact.gender(),contact.sign(),contact.notes(),contact.id));
        self.selectedContact(editContact);
        console.log("editedContact   ", self.selectedContact());
    }
    function createContact(phone, myname, city, gender, sign, notes, id){
        var contactJS = {};
        contactJS.phone = phone;
        contactJS.myname = myname;
        contactJS.city = city;
        contactJS.gender = gender;
        contactJS.sign = sign;
        contactJS.notes = notes;
        contactJS.id = id;
        return contactJS;
    }
    self.importContact = function(){
        self.importMode(true);
    }
    self.saveImport = function(){
        var importedContacts = [];
        if(self.importText()) {
            var contactLines = self.importText().split('\n');
            for (var i = 0; i < contactLines.length; i++) {
                if (contactLines[i]) {
                    var contactData = contactLines[i].split('\t');
                    var contact = createContact(contactData[0], contactData[1], contactData[2], contactData[3], contactData[4], contactData[5], id);
                    id++;
                    importedContacts.push(contact);
                }
            }
            self.saveToLocal(importedContacts);
            self.loadFromLocal();
        }
        self.importMode(false);
    }
    self.addContact = function() {
        var emptyContact = {};
        emptyContact.phone = "";
        emptyContact.myname = "";
        emptyContact.city = "";
        emptyContact.gender = null;
        emptyContact.sign = null;
        emptyContact.notes = "";
        contact = new ContactViewModel(emptyContact);
        self.selectedContact(contact);
        self.editMode(true);
    }
    self.saveContact = function() {
        for(var i = 0; i < self.contacts().length; i++){
            console.log("Check unique ", self.contacts()[i].phone(), self.contacts()[i].myname(), self.contacts()[i].id);
            if(self.contacts()[i].phone() == self.selectedContact().phone() && (self.contacts()[i].id  != self.selectedContact().id)) {
                alert("Contact with " + self.selectedContact().phone() + " already exists" );
                self.selectedContact().contactValid = false;
                return;
            }
            if(self.contacts()[i].myname() == self.selectedContact().myname() && (self.contacts()[i].id != self.selectedContact().id)) {
                alert("Contact with " + self.selectedContact().myname() + " already exists");
                self.selectedContact().contactValid = false;
                return;
            }
        }
        //if contact is valid and unique
        for(var i = 0; i < self.contacts().length; i++)
            if(self.contacts()[i].id == self.selectedContact().id) {
                self.editMode(false);
                //delete from
                self.contacts().splice(i,1);
            }
        //if contact with id was not found in existing contacts, then add it
        var newContact = createContact(self.selectedContact().phone(), self.selectedContact().myname(),self.selectedContact().city(),self.selectedContact().gender(),self.selectedContact().sign(),self.selectedContact().notes(),self.selectedContact().id);
        self.saveToLocalContact(newContact);
        self.loadFromLocal();
        self.editMode(false);
    }
    self.closeImport = function(){
        self.importMode(false);
    }
    self.removeContact = function(contact) {
        self.removeFromLocal(contact.id);
        self.loadFromLocal();
    };
    self.sortContactsBy = function()  {
        self.contacts.sort(function(left, right) { return left.phone == right.phone ? 0 : (left.phone < right.phone ? -1 : 1) });
    };
    self.sortContactsBy = function(fieldName, ascending)  {
        console.log("Let the sort begin ", self.contacts());
        self.contacts.sort(function(a, b) {
            if (a[fieldName]() > b[fieldName]()) {
                return ascending ? +1 : -1;
            }
            if (a[fieldName]() < b[fieldName]()) {
                return ascending ? -1 : +1;
            }
            return 0;
        });
    }
    self.filterContacts = ko.computed(function() {
        var tempContacts = self.contacts();
        if (self.currentPhoneFilter()) {
            tempContacts = _.filter(self.contacts(), function(contact){ return contact.phone().toLowerCase().indexOf(self.currentPhoneFilter().toLowerCase()) >= 0; });
        }
        if (self.currentNameFilter()) {
            tempContacts = _.filter(tempContacts, function(contact){ return contact.myname().toLowerCase().indexOf(self.currentNameFilter().toLowerCase()) >= 0; });
        }
        if (self.currentCityFilter()) {
            tempContacts = _.filter(tempContacts, function(contact){ return contact.city().toLowerCase().indexOf(self.currentCityFilter().toLowerCase()) >= 0; });
        }
        if (self.currentGenderFilter()) {
            tempContacts = _.filter(tempContacts, function(contact){ return contact.gender().toLowerCase().indexOf(self.currentGenderFilter().toLowerCase()) >= 0; });
        }

        return tempContacts;
    }, ContactList);
};

ko.applyBindings(new ContactList());