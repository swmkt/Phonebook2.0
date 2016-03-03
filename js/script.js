var fakeContacts = [
    { "phone": "1234567",
        "name": "Test Name",
        "city": "Sofia",
        "gender": "Male",
        "sign": "Leo",
        "notes": "Some notes"},
    {"phone": "0",
        "name": "Test Name 2",
        "city": "World",
        "gender": "Female",
        "sign": "Cancer",
        "notes": "Some notes"},
    {"phone": "333",
        "name": "Test Name 2",
        "city": "World",
        "gender": "Female",
        "sign": "Cancer",
        "notes": "Some notes"}
];
var emptyContacts = [];
localStorage.setItem("contacts", JSON.stringify(fakeContacts));


var ContactViewModel = function() {
    var self = this;
    //ko.mapping.fromJSON(JSON.parse(localStorage.getItem('contacts')), {}, this.contacts);
    self.contacts = ko.observableArray(fakeContacts);
    self.editMode = ko.observable(false);
    self.selectedContact = ko.observable(); 
    self.signOptions = ['Leo', 'Cancer', 'Scorpion'];
    self.currentPhoneFilter = ko.observable("");
    self.currentNameFilter = ko.observable("");
    self.currentCityFilter = ko.observable("");
    self.currentGenderFilter = ko.observable("");

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
    self.sortContactsBy = function()  {
        self.contacts.sort(function(left, right) { return left.phone == right.phone ? 0 : (left.phone < right.phone ? -1 : 1) });
    };
    self.sortContactsBy = function(fieldName, ascending)  {
        self.contacts.sort(function(a, b) {
            if (a[fieldName] > b[fieldName]) {
                return ascending ? +1 : -1;
            }
            if (a[fieldName] < b[fieldName]) {
                return ascending ? -1 : +1;
            }
            return 0;
        });
    }
    self.filterContacts = ko.computed(function() {
        var tempContacts = self.contacts();
        if (self.currentPhoneFilter()) {
            tempContacts = _.filter(self.contacts(), function(contact){ return contact.phone.toLowerCase().indexOf(self.currentPhoneFilter().toLowerCase()) >= 0; });
        }
        if (self.currentNameFilter()) {
            tempContacts = _.filter(tempContacts, function(contact){ return contact.name.toLowerCase().indexOf(self.currentNameFilter().toLowerCase()) >= 0; });
        }
        if (self.currentCityFilter()) {
            tempContacts = _.filter(tempContacts, function(contact){ return contact.city.toLowerCase().indexOf(self.currentCityFilter().toLowerCase()) >= 0; });
        }
        if (self.currentGenderFilter()) {
            tempContacts = _.filter(tempContacts, function(contact){ return contact.gender.toLowerCase().indexOf(self.currentGenderFilter().toLowerCase()) >= 0; });
        }

        return tempContacts;
    }, ContactViewModel);

    function filterBy(query){
        if (!query) {
            return self.contacts();
        } else {
            return _.filter(self.contacts(), function(contact){ return contact.phone.toLowerCase().indexOf(query.toLowerCase()) >= 0; });
        }
    }
};

ko.applyBindings(new ContactViewModel());


// Activate jQuery Validation
/*$("form").validate({ submitHandler: viewModel.save });*/