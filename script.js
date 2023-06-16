'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-05-21T17:01:17.194Z',
    '2023-05-25T23:36:17.929Z',
    '2023-05-26T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// <---- START ---->
// Internationalization

// Format Date
const formatMovementsDate = (date, locale) => {
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return Intl.DateTimeFormat(locale, options).format(date);
  }
};

const formatCurrency = (acc, value) => {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(value);
};

const calcMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const mov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  mov.forEach((value, index) => {
    const date = new Date(acc.movementsDates[index]);

    const displayDate = formatMovementsDate(date, acc.locale);

    const formattedMov = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(value);

    let type = value > 0 ? 'deposit' : 'withdrawal';
    const transactionRow = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', transactionRow);
  });
};

// calcMovements(account1.movements);

const createUsername = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(element => {
        return element[0];
      })
      .join('');
  });
};

createUsername(accounts);
// console.log(accounts);

const calcBalance = acc => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  const formattedBalace = formatCurrency(acc, acc.balance);
  labelBalance.textContent = `${formattedBalace}`;
};

// calcBalance(account1.movements);

const calcSummary = acc => {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formattedIncome = formatCurrency(acc, income);
  labelSumIn.textContent = `${formattedIncome}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + Math.abs(cur), 0);
  const formattedOut = formatCurrency(acc, out);
  labelSumOut.textContent = `${formattedOut}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (acc.interestRate / 100))
    .filter((mov, i, arr) => mov >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  const formattedInterest = formatCurrency(acc, interest);
  labelSumInterest.textContent = `${formattedInterest}`;
};

// Update UI Function
const updateUI = acc => {
  // Display Movments
  calcMovements(acc);
  // Display summary
  calcSummary(acc);
  // Display Balance
  calcBalance(acc);
};

const startLogOutTimer = function () {
  // set time to 5 minutes
  let time = 120;

  const tick = function () {
    // each call print remaining time to UI
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${sec}`;
    // when time is 0 log out user
    if (time === 0) {
      clearInterval(startTimer);
      containerApp.style.opacity = '0';
    }
    time--;
  };

  //call timer every second
  tick();
  const startTimer = setInterval(tick, 1000);
  return startTimer;
};

//Logged in user
let currentAccount, timer;

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  // Using find method to find account
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    // Date
    const now = new Date();
    const options = {
      hour: 'numeric',
      day: 'numeric',
      minute: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // Clear out fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = '1';

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

// Transfer
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    account => account.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferAmount.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Adding Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
});

// Delete Account
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    currentAccount.pin === Number(inputClosePin.value) &&
    currentAccount.username === inputCloseUsername.value
  ) {
    const userIndex = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(userIndex, 1);
    containerApp.style.opacity = '0';
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

// Request Loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Adding Loan
      currentAccount.movements.push(amount);
      // Adding date
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 1000 * 3);
  }
  inputLoanAmount.value = '';
  clearInterval(timer);
  timer = startLogOutTimer();
});

// Sort
let state = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  calcMovements(currentAccount, !state);
  state = !state;
});

// Fake Login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = '1';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/* // LECTURES

// Converting and Checking Numbers
console.log(23 === 23.0);

// Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.3333333
// Binary base 2 - 0 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

// Conversion
console.log(Number('23'));
console.log(+'23');

// Parsing
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));

console.log(Number.parseInt('  2.5rem  '));
console.log(Number.parseFloat('  2.5rem  '));

// console.log(parseFloat('  2.5rem  '));

// Check if value is NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0));

// Checking if value is number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0));

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));
 */

/* // Math and Rounding
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2));
console.log(Math.max(5, 18, '23px', 11, 2));

console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0...1 -> 0...(max - min) -> min...max
// console.log(randomInt(10, 20));

// Rounding integers
console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor('23.9'));

console.log(Math.trunc(23.3));

console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));

// Rounding decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));
 */

/* // Remainder Operator

console.log(5 % 2);

const isEven = n => n % 2 === 0;

console.log(isEven(24));
console.log(isEven(243));
console.log(isEven(278));

labelBalance.addEventListener('click', e => {
  [...document.querySelectorAll('.movements__row')].forEach((element, i) => {
    if (i % 2 === 0) {
      element.style.backgroundColor = 'orangered';
    }
  });
});
 */

/* // Numeric Seperator
// Numeric Separators

// 287,460,000,000
const diameter = 287_460_000_000;
console.log(diameter);

const price = 345_99;
console.log(price);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

const PI = 3.1415;
console.log(PI);

console.log(Number('230_000'));
console.log(parseInt('230_000')); */

/* 
// Working with BigInt
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

console.log(4838430248342043823408394839483204n);
console.log(BigInt(48384302));

// Operations
console.log(10000n + 10000n);
console.log(36286372637263726376237263726372632n * 10000000n);
// console.log(Math.sqrt(16n));

const huge = 20289830237283728378237n;
const num = 23;
console.log(huge * BigInt(num));

// Exceptions
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == '20');

console.log(huge + ' is REALLY big!!!');

// Divisions
console.log(11n / 3n);
console.log(10 / 3);
 */

/* // Creating Dates

// Create a date

const now = new Date();
console.log(now);

console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(2142256980000));

console.log(Date.now());

future.setFullYear(2040);
console.log(future); */

// Operation With dates

/* const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => {
    console.log(`🍕 Pizza with ${ing1}, ${ing2}`);
  },
  1000 * 3,
  ...ingredients
); */

/* if (ingredients.includes('spinach')) {
  clearTimeout(pizzaTimer);
} */

/* setInterval(() => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  console.log(`${hours}:${minutes}:${seconds}`);
}, 1000); */
