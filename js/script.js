var fakeContacts = [
    { "phone": "1234567",
        "name": "Test Name",
        "city": "Sofia",
        "gender": "Male",
        "sign": "Leo",
        "notes": "Some notes"},
    {"phone": "0555666",
        "name": "Test Name 2",
        "city": "World",
        "gender": "Female",
        "sign": "Cancer",
        "notes": "Some notes"}
];
var emptyContacts = [];
localStorage.setItem("contacts", JSON.stringify(fakeContacts));
console.log("1", localStorage.getItem('contacts'));


var ContactViewModel = function() {
    var self = this;
    ko.mapping.fromJSON(JSON.parse(localStorage.getItem('contacts')), {}, this.contacts);
    self.contacts = ko.observableArray(fakeContacts);
    self.editMode = ko.observable(false);
    self.selectedContact = ko.observable();
    
    self.signOptions = ['Leo', 'Cancer', 'Scorpion'];
    
    self.editContact = function(contact) {
        self.editMode(true);
        self.contacts.remove(contact);
        self.selectedContact(contact);
    }
    self.addContact = function() {       
        contact = { phone : ko.observable("1"), name:ko.observable(""), city:ko.observable(""),gender:ko.observable(null),sign:ko.observable(null),notes:ko.observable("")};
        self.selectedContact(contact);
        self.editMode(true);
    }
    self.saveContact = function() {   
        self.contacts.push(self.selectedContact());
        self.editMode(false);
    }    
    self.removeContact = function(contact) {
        self.contacts.remove(contact);
    };
};

ko.applyBindings(new ContactViewModel());


// Activate jQuery Validation
/*$("form").validate({ submitHandler: viewModel.save });*/