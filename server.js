const prompt = require('prompt-sync')();
const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose');
const Customer = require('./models/customer');

let userInput = null;

const init = async () => {
  // Initializes CRM
  console.log("Welcome to the CRM\n");
  console.log("What would you like to do?\n");
  console.log("1. Create a customer");
  console.log("2. View all customers");
  console.log("3. Update a customer");
  console.log("4. Delete a customer");
  console.log("5. Quit\n");

  userInput = prompt('Enter A Number to Run: ');

  await checkUserChoice();
}

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');

  await init();

  await mongoose.disconnect();
  console.log('\nMongoDB Disconnected');

  process.exit();
}

const createCustomer = async (name, age) => {
  const customerData = {
    name: name,
    age: age
  }

  await Customer.create(customerData);
}

const findCustomers = async () => {
  const customers = await Customer.find();
  console.log("Customer List:\n");
  // Traverses the list of objects on MONGO and logs the data based on their index position
  for (let i = 0; i < customers.length; i++) {
    console.log('id: ' + customers[i].id + ' -- ' + 'Name: ' + customers[i].name + ', ' + 'Age: ' + customers[i].age);
  }
}

const updateCustomer = async (id, name, age) => {
  // Ensures I'm passing the parameters as objects to MONGO
  const updateFields = {};
  if (name) {
    updateFields.name = name;
  }
  if (age) {
    updateFields.age = age;
  }

  const customer = await Customer.findByIdAndUpdate(
    id,
    updateFields,
    // This option returns the modified document rather than the original
    { new: true }
  );

  console.log('UPDATE SUCCESSFUL', customer);
}

const deleteCustomer = async (id) => {
  if (id) {
    const customerToDelete = await Customer.findByIdAndDelete(id);
    console.log('Customer successfully deleted');
  }
}

const checkUserChoice = async () => {
  if (userInput === "1") {
    console.clear();
    name = prompt('Enter a customer name: ');
    age = prompt('Enter customer age: ');
    // Validates that user entered a name AND age before creating a customer
    if (name && age) {
      await createCustomer(name, age);
      console.clear();
      console.log('Successfully created a customer');
    } else {
      // Prints an error handling message to user then
      // User will be prompted until a name AND age is entered to be able to create a customer
      while (!(name && age)) {
        console.clear();
        console.log('Failed to create a customer: The name and age is required to create a customer');
        name = prompt('Enter a customer name: ');
        age = prompt('Enter customer age: ');
      }
      // Creates the user on while loop exit
      await createCustomer(name, age);
      console.clear();
      console.log('Successfully created a customer');
    }
  } else if (userInput === "2") {
    console.clear();
    await findCustomers();
  } else if (userInput === "3") {
    console.clear();
    await findCustomers();
    console.log("\n");
    const id = prompt('Please enter the id of the customer you want to update: ');

    if (id) {
      console.clear();
      console.log("1. Update customer name");
      console.log("2. Update customer age");
      console.log("3. Update each customer category\n");
      const updateChoice = prompt("Which category would you like to update? ")

      if (updateChoice === "1") {
        console.clear();
        const name = prompt("Enter new name: ");
        await updateCustomer(id, name);
        console.log('--NEW CUSTOMER NAME: ' + name);
      } else if (updateChoice === "2") {
        console.clear();
        let age = Number(prompt("Enter new age: "));
        await updateCustomer(id, undefined, age);
        console.log('--NEW CUSTOMER AGE: ' + age);
      } else if (updateChoice === "3") {
        console.clear();
        const name = prompt("Enter new name: ");
        let age = Number(prompt("Enter new age: "));
        await updateCustomer(id, name, age);
        console.log('--NEW CUSTOMER INFO:\n' + 'Name: ' + name + '\nAge: ' + age);
      }
    }
  }
}

connect();
