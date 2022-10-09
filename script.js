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
const navLinks = document.querySelector(".navbar");
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
const btnLogout = document.querySelector(".logout");

// Data
const account1 = {
  owner: "Chaymae Benayad",
  username: "chamben",
  pin: 1234,
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
  owner: "Amine Alaoui",
  username: "amine30",
  pin: 1020,
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

let accounts = [account1, account2];

// Get local storage data
if (localStorage.getItem("accsData")) {
  accounts = JSON.parse(localStorage.getItem("accsData"));
}

//============change from sign-in overlay to sign-up overlay=======================
signUpButton.addEventListener("click", () => {
  signInUpContainer.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  signInUpContainer.classList.remove("right-panel-active");
});

//====================create a new user===========================
function User(owner, username, pin, movements, interestRate, movementsDates) {
  this.owner = owner;
  this.username = username;
  this.pin = pin;
  this.movements = movements;
  this.interestRate = interestRate;
  this.movementsDates = movementsDates;
}

//===================create a new account========================
//clicking on the sign up button
signUpFormBtn.addEventListener("click", function (e) {
  //prevent the page from refresh after the form submit
  e.preventDefault();
  const newName = inputRegisterName.value;
  const newUsername = inputRegisterUsername.value;
  const newPin = +inputRegisterPin.value;
  const date = new Date().toISOString();
  //helper function
  const checkEmpty = (...inputs) => inputs.every((inputVal) => inputVal !== "");
  if (!checkEmpty(newName, newUsername, newPin, date)) return;
  let newuser = new User(newName, newUsername, newPin, [100], 0.5, [date]);
  accounts.push(newuser);
  //clear the input fields
  inputRegisterName.value =
    inputRegisterUsername.value =
    inputRegisterPin.value =
      "";
  //store account data
  localStorage.setItem("accsData", JSON.stringify(accounts));
  console.log(accounts);
});

console.log(accounts);

//============Navigate to sections through nav links==========
navLinks.addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav-link")) {
    const id = e.target.getAttribute("href");
    if (!id) return;
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//===================Format the currency==================
const formatCurrency = function (value) {
  const options = { style: "currency", currency: "MAD" };
  return new Intl.NumberFormat("fr-FR", options).format(value);
};

//==========Calculate & display balance===========
const movement = [200, 450, -400, 3000, -650, -130, 70, 1300];
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCurrency(acc.balance)}`;
};

//==============Formatting the movements dates===========================
const formatMovDates = function (date) {
  //the substraction returns a timestamp value (ms)
  const calcPassedDays = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const userLocale = navigator.language;

  const passedDays = calcPassedDays(new Date(), date);
  if (passedDays === 0) return `today`;
  if (passedDays === 1) return `yesterday`;
  if (passedDays <= 7) return `${passedDays} days ago`;
  return new Intl.DateTimeFormat(userLocale).format(date);
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
    const formattedMov = formatCurrency(mov);
    const html = `
      <div class="movements-row">
        <div class="movements-type movements-type-${type}">${
      i + 1
    } ${type}</div>
    <div class="movements-date">${formatMovDates(date)}</div>
        <div class="movements-value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("beforeend", html);
  });
};

//==========Calculate & display incomes, outcomes and interest===========
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCurrency(incomes)}`;
  const outcomes = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCurrency(outcomes)}`;
  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatCurrency(interest)}`;
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

//===========Display the current date according to the user's date format============
const currentDate = function () {
  const now = new Date();
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const locale = navigator.language;
  labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);
};

//==================Hide the main app==================
const hideApp = function () {
  appContent.classList.add("hidden");
  signInUpContainer.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

//====================Logout Timer====================
//track the inactivity of the user
const StartLogoutTimer = function () {
  //set time to 10 min
  let time = 600;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    //logout when time reaches 0
    if (time === 0) {
      clearInterval(timer);
      //hide the main app
      hideApp();
    }
    //decrease time with a 1s
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

//=====================Login========================
let currAccount, timer;
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
    currentDate();
    //clear timer if already exist
    clearInterval(timer);
    //start the countdown timer
    timer = StartLogoutTimer();
    //update the user interface
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
    localStorage.setItem("accsData", JSON.stringify(accounts));
    //update the main app
    updateUI(currAccount);
    //reset timer
    clearInterval(timer);
    timer = StartLogoutTimer();
  }
};

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  transferMoney();
});

//=================Loan a request==========================
/*our bank has a rule that says: it only grants a loan if there is at least
one deposit with at least 10% of the requested loan amount*/
/*The loan can be receveid after two days*/
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  const rule = currAccount.movements.some((mov) => mov >= loanAmount * 0.1);
  if (loanAmount > 0 && rule) {
    setTimeout(function () {
      //add the requested loan
      currAccount.movements.push(loanAmount);
      //add the current date
      const loanDate = new Date().toISOString();
      currAccount.movementsDates.push(loanDate);
      //store account data
      localStorage.setItem("accsData", JSON.stringify(accounts));
      //update the main app
      updateUI(currAccount);
    }, 2000 * 60 * 60 * 24);
    //reset timer
    clearInterval(timer);
    timer = StartLogoutTimer();
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
    localStorage.setItem("accsData", JSON.stringify(accounts));
    //hide the main app
    hideApp();
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

//========================Logout Button===========================
btnLogout.addEventListener("click", function (e) {
  e.preventDefault();
  hideApp();
});
