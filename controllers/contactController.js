const fs = require("fs");
const contacts = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/contacts.json`)
  );
  
  // Route Handlers
  
  exports.getAllContacts = (req, res) => {
    console.log(req.requestTime);
    res.status(200);
    res.json({
      status: "success",
      requestedAt: req.requestTime,
      results: contacts.length,
      data: { contacts },
    });
  };
  
  exports.getContact = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const contact = contacts.find((el) => el.id === id);
    if (!contact) {
      return res.status(404).json({ status: "fail", message: "Invalid ID" });
    }
    res.status(200);
    res.json({
      status: "success",
      data: { contact },
      // results: contacts.length, data: { contacts }
    });
  };

  exports.createContact = (req, res) => {
    // console.log(req.body);
    const newID = contacts[contacts.length - 1].id + 1;
    const newContact = Object.assign({ id: newID }, req.body);
    contacts.push(newContact);
    fs.writeFile(
      `${__dirname}/dev-data/data/contacts.json`,
      JSON.stringify(contacts),
      (err) => {
        res
          .status(201)
          .json({ status: "success", data: { contact: newContact } });
      }
    );
  };

  exports.updateContact = (req, res) => {
    if (req.params.id * 1 > contacts.length) {
      return res.status(404).json({ status: "fail", message: "Invalid ID" });
    }
    res.status(200).json({
      status: "success",
      data: { contact: "<Updated contact here...>" },
    });
  };

  exports.deleteContact = (req, res) => {
    if (req.params.id * 1 > contacts.length) {
      return res.status(404).json({ status: "fail", message: "Invalid ID" });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  };