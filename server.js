const prompt = require('prompt-sync')();
const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose');
const Customer = require('./models/customer');

const init = async () => {
  console.log("Welcome to the CRM\n");
  console.log("What would you like to do?\n");
  console.log("1. Create a customer");
  console.log("2. View all customers");
  console.log("3. Update a customer");
  console.log("4. Delete a customer");
  console.log("5. Quit\n");

  const userInput = prompt('Enter Number to Run: ');

  if (userInput === "1") {
    console.clear();
    name = prompt('Enter a customer name: ');
    age = prompt('Enter customer age: ');
    if (name && age) {
      await createCustomer(name, age);
      console.clear();
      console.log('Successfully created a customer\n');
    } else {
      while (!(name && age)) {
        console.clear();
        console.log('Failed to create a customer: The name and age is required to create a customer');
        name = prompt('Enter a customer name: ');
        age = prompt('Enter customer age: ');
      }
      await createCustomer(name, age);
      console.clear();
      console.log('Successfully created a customer\n');
    }
  }
}

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');

  await init();

  await mongoose.disconnect();
  console.log('MongoDB Disconnected');

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
  console.log("All Customers:", customers);
}

const updateCustomer = async (id, name, age) => {
  const customer = await Customer.findByIdAndUpdate(
    id,
    { name: name },
    { age: age }
  );

  console.log('Customer:', customer);
}

const deleteCustomer = async (id) => {
  if (id) {
    const customerToDelete = await Customer.findByIdAndDelete(id);
    console.log('Customer successfully deleted');
  }
}

connect();
