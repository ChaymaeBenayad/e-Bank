("use strict");
/////////////////////////////////////////////////
// e-Bank app
// Elements
//Sign-in-up elements
const signUpButton = document.querySelector(".signUp");
const signInButton = document.querySelector(".signIn");
const signUpFormBtn = document.querySelector(".signUpFormBtn");
const signInFormBtn = document.querySelector(".signInFormBtn");
const signInUpContainer = document.querySelector(".container");
const overlay = document.querySelector(".light-gray-overlay");

//Main app elements
const appContent = document.querySelector(".main-content");
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".balance-date");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".summary-value-in");
const labelSumOut = document.querySelector(".summary-value-out");
const labelSumInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer");
const containerMovements = document.querySelector(".movements");

const inputLoginUsername = document.querySelector(".sign-in-username");
const inputLoginPin = document.querySelector(".sign-in-pin");
const inputRegisterName = document.querySelector(".sign-up-name");
const inputRegisterUsername = document.querySelector(".sign-up-username");
const inputRegisterPin = document.querySelector(".sign-up-pin");
const inputTransferTo = document.querySelector(".form-input-to");
const inputTransferAmount = document.querySelector(".form-input-amount");
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputCloseUsername = document.querySelector(".form-input-user");
const inputClosePin = document.querySelector(".form-input-pin");

const btnTransfer = document.querySelector(".form-btn-transfer");
const btnLoan = document.querySelector(".form-btn-loan");
const btnClose = document.querySelector(".form-btn-close");
const btnSort = document.querySelector(".btn-sort");

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  username: "jonas22",
  pin: 1111,
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  movementsDates: [
    "2022-08-04T21:31:17.178Z",
    "2022-08-03T07:42:02.383Z",
    "2022-08-02T09:15:04.904Z",
    "2022-08-01T10:17:24.185Z",
    "2022-07-28T14:11:59.604Z",
    "2022-07-20T17:01:17.194Z",
    "2022-07-15T23:36:17.929Z",
    "2022-07-12T10:51:36.790Z",
  ],
};

const account2 = {
  owner: "Jessica Davis",
  username: "jessicaD",
  pin: 2222,
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  movementsDates: [
    "2022-08-04T21:31:17.178Z",
    "2022-08-03T07:42:02.383Z",
    "2022-08-02T09:15:04.904Z",
    "2022-08-01T10:17:24.185Z",
    "2022-07-28T14:11:59.604Z",
    "2022-07-20T17:01:17.194Z",
    "2022-07-15T23:36:17.929Z",
    "2022-07-12T10:51:36.790Z",
  ],
};

const account3 = {
  owner: "Steven Thomas Williams",
  username: "stevenTW",
  pin: 3333,
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  movementsDates: [
    "2022-08-04T21:31:17.178Z",
    "2022-08-03T07:42:02.383Z",
    "2022-08-02T09:15:04.904Z",
    "2022-08-01T10:17:24.185Z",
    "2022-07-28T14:11:59.604Z",
    "2022-07-20T17:01:17.194Z",
    "2022-07-15T23:36:17.929Z",
    "2022-07-12T10:51:36.790Z",
  ],
};

const account4 = {
  owner: "Sarah Smith",
  username: "sara23",
  pin: 4444,
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  movementsDates: [
    "2022-08-04T21:31:17.178Z",
    "2022-08-03T07:42:02.383Z",
    "2022-08-02T09:15:04.904Z",
    "2022-08-01T10:17:24.185Z",
    "2022-07-28T14:11:59.604Z",
  ],
};

let accounts = [account1, account2, account3, account4];

// Get local storage data
if (localStorage.getItem("accountsData")) {
  accounts = JSON.parse(localStorage.getItem("accountsData"));
}

//============change from sign-in overlay to sign-up overlay=======================
signUpButton.addEventListener("click", () => {
  signInUpContainer.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  signInUpContainer.classList.remove("right-panel-active");
});

//create a new user
function User(owner, username, pin, movements, interestRate) {
  this.owner = owner;
  this.username = username;
  this.pin = pin;
  this.movements = movements;
  this.interestRate = interestRate;
}

//===================create a new account========================
//clicking on the sign up button
signUpFormBtn.addEventListener("click", function (e) {
  //prevent the page from refresh after the form submit
  e.preventDefault();
  const newName = inputRegisterName.value;
  const newUsername = inputRegisterUsername.value;
  const newPin = +inputRegisterPin.value;
  let newuser = new User(newName, newUsername, newPin, [100], 0.5);
  accounts.push(newuser);
  //clear the input fields
  inputRegisterName.value =
    inputRegisterUsername.value =
    inputRegisterPin.value =
      "";
  //store account data
  localStorage.setItem("accountsData", JSON.stringify(accounts));
  console.log(accounts);
});

console.log(accounts);

//==========Calculate & display balance===========
const movement = [200, 450, -400, 3000, -650, -130, 70, 1300];
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}DH`;
};

//=============Get the current date=========================
const currentDate = function (now = new Date()) {
  const date = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const displayDate = `${date}/${month}/${year}`;
  return displayDate;
};

//==============Formatting the movements dates===========================
const formatMovDates = function (date) {
  //the substraction returns a timestamp value (ms)
  const calcPassedDays = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const passedDays = calcPassedDays(new Date(), date);
  if (passedDays === 0) return `today`;
  if (passedDays === 1) return `yesterday`;
  if (passedDays <= 7) return `${passedDays} days ago`;
  else return currentDate(date);
};

//=========================Display Movements==============================
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const html = `
      <div class="movements-row">
        <div class="movements-type movements-type-${type}">${
      i + 1
    } ${type}</div>
    <div class="movements-date">${formatMovDates(date)}</div>
        <div class="movements-value">${mov.toFixed(2)}DH</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//==========Calculate & display incomes, outcomes and interest===========
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}DH`;
  const outcomes = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes.toFixed(2))}DH`;
  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}DH`;
};

//=============Update UI=========================
const updateUI = function (acc) {
  //display the balance
  calcDisplayBalance(acc);
  //display the movements
  displayMovements(acc);
  //display the summary
  calcDisplaySummary(acc);
};

//=====================Login========================
let currAccount;
//clicking on the login button
signInFormBtn.addEventListener("click", function (e) {
  //prevent the page from refresh after the form submit
  e.preventDefault();
  //check if the inputed usename exists in accounts array
  currAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  //check if the pin is correct
  //& convert the input value to a number(.value returns a string)
  if (currAccount?.pin === +inputLoginPin.value) {
    //clear the input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    //show the main app
    appContent.classList.remove("hidden");
    signInUpContainer.classList.add("hidden");
    overlay.classList.add("hidden");
    //display welcome message with the first name only
    labelWelcome.textContent = `Welcome back, ${
      currAccount.owner.split(" ")[0]
    }`;
    //display current date
    labelDate.textContent = currentDate();
    updateUI(currAccount);
  }
});

//========================Transfer Money======================
const transferMoney = function () {
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  //clear the input fields
  inputTransferTo.value = inputTransferAmount.value = "";
  //check if the amount to transfer is positive & the transmitter actually has that amount
  //& check if the receiver exist & it is different than the transmitter
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currAccount.balance &&
    receiverAcc?.username !== currAccount.username
  ) {
    //add movements
    currAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //add current date
    const transferDate = new Date().toISOString();
    currAccount.movementsDates.push(transferDate);
    receiverAcc.movementsDates.push(transferDate);
    //store account data
    localStorage.setItem("accountsData", JSON.stringify(accounts));
    //update the main app
    updateUI(currAccount);
  }
};

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  transferMoney();
});

//=================Loan a request==========================
/*our bank has a rule that says: it only grants a loan if there is at least
one deposit with at least 10% of the requested loan amount*/
//inputLoanAmount
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  const rule = currAccount.movements.some((mov) => mov >= loanAmount * 0.1);
  if (loanAmount > 0 && rule) {
    //add the requested loan
    currAccount.movements.push(loanAmount);
    //add the current date
    const loanDate = new Date().toISOString();
    currAccount.movementsDates.push(loanDate);
    //store account data
    localStorage.setItem("accountsData", JSON.stringify(accounts));
    //update the main app
    updateUI(currAccount);
  }
  //clear the input field
  inputLoanAmount.value = "";
});

//=========================Close Account========================
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  //check if the credentials are correct
  if (
    inputCloseUsername.value === currAccount.username &&
    +inputClosePin.value === currAccount.pin
  ) {
    //find the index of the account we want to close
    const index = accounts.findIndex(
      (acc) => acc.username === currAccount.username
    );
    //delete the account
    accounts.splice(index, 1);
    //store account data
    localStorage.setItem("accountsData", JSON.stringify(accounts));
    //hide the main app
    appContent.classList.add("hidden");
    signInUpContainer.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }
  //clear the input fields
  inputCloseUsername.value = inputClosePin.value = "";
});

//========================Sort Button===========================
//state variable
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currAccount, sorted);
  sorted = !sorted;
});
