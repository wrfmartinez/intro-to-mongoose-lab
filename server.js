const prompt = require('prompt-sync')();
const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose');
const Customer = require('./models/customer');

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await runQueries();

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

const runQueries = async () => {
  console.log('Running queries');
}

connect();
