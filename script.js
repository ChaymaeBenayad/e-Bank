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
const labelDate = document.querySelector(".date");
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
};

const account2 = {
  owner: "Jessica Davis",
  username: "jessicaD",
  pin: 2222,
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
};

const account3 = {
  owner: "Steven Thomas Williams",
  username: "stevenTW",
  pin: 3333,
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
};

const account4 = {
  owner: "Sarah Smith",
  username: "sara23",
  pin: 4444,
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
};

let accounts = [account1, account2, account3, account4];

// Get local storage data
if (localStorage.getItem("accounts")) {
  accounts = JSON.parse(localStorage.getItem("accounts"));
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
  const newPin = Number(inputRegisterPin.value);
  let newuser = new User(newName, newUsername, newPin, [100], 0.5);
  accounts.push(newuser);
  //empty the fields
  inputRegisterName.value =
    inputRegisterUsername.value =
    inputRegisterPin.value =
      "";
  //store account data
  localStorage.setItem("accounts", JSON.stringify(accounts));
  console.log(accounts);
});

console.log(accounts);

//==========Calculate & display balance===========
const movement = [200, 450, -400, 3000, -650, -130, 70, 1300];
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}DH`;
};

//=========================Display Movements==============================
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
      <div class="movements-row">
        <div class="movements-type movements-type-${type}">${
      i + 1
    } ${type}</div>
        <div class="movements-value">${mov}DH</div>
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
  labelSumIn.textContent = `${incomes}DH`;
  const outcomes = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}DH`;
  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}DH`;
};

//=============Update UI=========================
const updateUI = function (acc) {
  //display the balance
  calcDisplayBalance(acc);
  //display the movements
  displayMovements(acc.movements);
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
  if (currAccount?.pin === Number(inputLoginPin.value)) {
    //empty the fields
    inputLoginUsername.value = inputLoginPin.value = "";
    //show the main app
    appContent.classList.remove("hidden");
    signInUpContainer.classList.add("hidden");
    overlay.classList.add("hidden");
    //display welcome message with the first name only
    labelWelcome.textContent = `Welcome back, ${
      currAccount.owner.split(" ")[0]
    }`;
    updateUI(currAccount);
  }
});

//========================Transfer Money======================
const transferMoney = function () {
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  //empty the fields
  inputTransferTo.value = inputTransferAmount.value = "";
  //check if the amount to transfer is positive & the transmitter actually has that amount
  //& check if the receiver exist & it is different than the transmitter
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currAccount.balance &&
    receiverAcc?.username !== currAccount.username
  ) {
    //doing the transfer
    currAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //store account data
    localStorage.setItem("accounts", JSON.stringify(accounts));
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
  const loanAmount = Number(inputLoanAmount.value);
  const rule = currAccount.movements.some((mov) => mov >= loanAmount * 0.1);
  if (loanAmount > 0 && rule) {
    //giving the requested loan
    currAccount.movements.push(loanAmount);
    //store account data
    localStorage.setItem("accounts", JSON.stringify(accounts));
    //update the main app
    updateUI(currAccount);
  }
  //empty the field
  inputLoanAmount.value = "";
});

//=========================Close Account========================
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  //check if the credentials are correct
  if (
    inputCloseUsername.value === currAccount.username &&
    Number(inputClosePin.value) === currAccount.pin
  ) {
    //find the index of the account we want to close
    const index = accounts.findIndex(
      (acc) => acc.username === currAccount.username
    );
    //delete the account
    accounts.splice(index, 1);
    //store account data
    localStorage.setItem("accounts", JSON.stringify(accounts));
    //hide the main app
    appContent.classList.add("hidden");
    signInUpContainer.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }
  //empty the fields
  inputCloseUsername.value = inputClosePin.value = "";
});

//========================Sort Button===========================
//state variable
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currAccount.movements, sorted);
  sorted = !sorted;
});
