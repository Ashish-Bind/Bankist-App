'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

// <---- START ---->
const calcMovements = function (transactions, sort = false) {
  containerMovements.innerHTML = '';

  const trans = sort
    ? transactions.slice().sort((a, b) => a - b)
    : transactions;

  trans.forEach((value, index) => {
    let type = value > 0 ? 'deposit' : 'withdrawal';
    const transactionRow = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index} deposit</div>
          <div class="movements__value">${value}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', transactionRow);
  });
};

calcMovements(account1.movements);

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
  labelBalance.textContent = `${acc.balance} EUR`;
};

// calcBalance(account1.movements);

const calcSummary = acc => {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income} €`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + Math.abs(cur), 0);
  labelSumOut.textContent = `${out} €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (acc.interestRate / 100))
    .filter((mov, i, arr) => mov >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest} €`;
};

// Update UI Function
const updateUI = acc => {
  // Display Movments
  calcMovements(acc.movements);
  // Display summary
  calcSummary(acc);
  // Display Balance
  calcBalance(acc);
};

//Logged in user
let currentAccount;

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
    // Clear out fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = '1';
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
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
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

  const amount = inputLoanAmount.value;
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// Sort
let state = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  calcMovements(currentAccount.movements, !state);
  state = !state;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]); */

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/* 
// Array Methods

const arr1 = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log(arr1.slice(1));
console.log(arr1.slice(1, 4));
console.log(arr1.slice(-2));
console.log(arr1.slice(-2, 4));

// SPLICE
// console.log(arr1.splice(3));
console.log(arr1);
// console.log(arr1.splice(1, 3));
console.log(arr1);

// REVERSE
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2);
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr1.concat(arr2);
console.log(letters);
console.log([...arr1, ...arr2]);

// JOIN
console.log(letters.join('-'));
 */

/* 
const arr = [23, 11, 64];

console.log(arr[0]);
console.log(arr.at(0));

// For getting last element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('ashish'.at(0));
console.log('ashish'.at(-1));

 */

/* 
// For each loop
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [index, transaction] of movements.entries()) {
  let message =
    transaction > 0
      ? `${index + 1} : You deposited ${transaction}`
      : `${index + 1} : ${Math.abs(transaction)} is withdrawn`;
  console.log(message);
}

console.log(`--- FOREACH ---`);
movements.forEach((transaction, index) => {
  let message =
    transaction > 0
      ? `${index + 1} : You deposited ${transaction}`
      : `${index + 1} : ${Math.abs(transaction)} is withdrawn`;
  console.log(message);
});
 */

/* 
// For each for Maps and Sets

// Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach((value, key, map) => {
  console.log(`${key} : ${value}`);
});

// Set
const currencySet = new Set(['USD', 'EUR', 'GBP', 'EUR', 'INR', 'GBP', 'USD']);

currencySet.forEach((value, _, set) => {
  console.log(`${_} : ${value}`);
}); */

/* 
Coding Challenge #1
  Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners 
  about their dog's age, and stored the data into an array (one array for each). For 
  now, they are just interested in knowing whether a dog is an adult or a puppy.
  A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years 
  old.
Your tasks:
  Create a function 'checkDogs', which accepts 2 arrays of dog's ages 
  ('dogsJulia' and 'dogsKate'), and does the following things:
  1. Julia found out that the owners of the first and the last two dogs actually have 
  cats, not dogs! So create a shallow copy of Julia's array, and remove the cat 
  ages from that copied array (because it's a bad practice to mutate function 
  parameters)
  2. Create an array with both Julia's (corrected) and Kate's data
  3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 
  is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 
  �
  ")
  4. Run the function for both test datasets
Test data:
  § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
  § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
Hints: Use tools from all lectures in this section so far �
*/

/* 
const checkDogs = (dogsJulia, dogsKate) => {
  const copyJulia = dogsJulia.splice(0, 3);
  copyJulia.splice(0, 1);
  console.log(copyJulia);

  const allDogs = [...copyJulia, ...dogsKate];
  allDogs.forEach((dogAge, index) => {
    const dogStr =
      dogAge >= 3
        ? `Dog number ${index + 1} is an adult, and is ${dogAge} years old`
        : `Dog number ${index + 1} is still a puppy`;

    console.log(dogStr);
  });
};
console.log(`TEST-1`);
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
console.log(`TEST-2`);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]); 
*/

/* 
// Map Method

const movementsArray = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurtoUsd = 1.1;

const movementsUSD = movementsArray.map(element =>
  Math.floor(element * eurtoUsd)
);

const movementsDescription = movementsArray.map((value, i) => {
  return `${i + 1} : ${Math.abs(value)} is ${
    value > 0 ? 'Deposited' : 'Withdrew'
  }`;
});

console.log(movementsArray);
console.log(movementsUSD);
console.log(movementsDescription); 

*/

/* // Filter Method

const movementsArray = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movementsArray.filter(transaction => transaction > 0);
const withdrawal = movementsArray.filter(transaction =>
  Math.abs(transaction < 0)
);
console.log(deposits);
console.log(withdrawal); */

/* // Reduce Method

const movementsArray = [200, 450, -400, 3000, -650, -130, 70, 1300];

const balance = movementsArray.reduce((acc, curr, i, arr) => {
  console.log(`${i} : Accumalator is ${acc}`);
  return acc + curr;
}, 0);

console.log(balance);

const max = movementsArray.reduce((acc, cur) => {
  return acc > cur ? acc : cur;
}, movements[0]);
console.log(max);
 */

/* 
// Chaining
const eurtoUsd = 1.1;

const movementsArray = [200, 450, -400, 3000, -650, -130, 70, 1300];

const totalDepositUSD = movementsArray
  .filter(mov => mov > 0)
  .map(mov => mov * eurtoUsd)
  .reduce((acc, mov) => acc + mov);

console.log(totalDepositUSD); 
*/

/* 
// Find method
const movementsArray = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movementsArray.find(mov => mov < 0);
console.log(firstWithdrawal);

const accountJessica = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(accountJessica);

for (const acc of accounts) {
  console.log(acc.owner === 'Jessica Davis' ? acc : 'Not Found');
}
 */

/*  
 */

/* const arr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(arr.flat());

const arrDeep = [
  [1, [2, 3]],
  [4, 5, 6],
  [[7, 8], 9],
];

console.log(arrDeep.flat(2));

const sumMovements1 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, cur) => acc + cur, 0);
console.log(sumMovements1);

const sumMovements2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => acc + cur, 0);
console.log(sumMovements2);
 */
/* 
// Sorting Arrays

// Strings
const movementsArray = [200, 450, -400, 3000, -650, -130, 70, 1300];
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movementsArray);

// return > 0 ; a > b
// return < 0 ; b > a

// Ascending order
// movementsArray.sort((a, b) => {
//   if (a > b) {
//     return 1;
//   }
//   if (b > a) {
//     return -1;
//   }
// });
movementsArray.sort((a, b) => a - b);
console.log(movementsArray);

// Descending order
// movementsArray.sort((a, b) => {
//   if (a > b) {
//     return -1;
//   }
//   if (b > a) {
//     return 1;
//   }
// });

/* movementsArray.sort((a, b) => b - a);

console.log(movementsArray); 

// filliing Arrays
const arr1 = new Array(7);
console.log(arr1);

arr1.fill(1);
console.log(arr1);

arr1.fill(3, 4, 6);
console.log(arr1);

// Array.from
const arr2 = Array.from({ length: 10 }, () => 12);
console.log(arr2);
const arr3 = Array.from({ length: 10 }, (_, index) => ++index);
console.log(arr3);

labelBalance.addEventListener('click', () => {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => el.textContent
  );

  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
}); */

/*
Coding Challenge #2 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert 
dog ages to human ages and calculate the average age of the dogs in their study. 
Your tasks: 
  Create a function 'calcAverageHumanAge', which accepts an arrays of dog's 
  ages ('ages'), and does the following things in order: 
    1. Calculate the dog age in human years using the following formula: if the dog is 
    <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, 
    humanAge = 16 + dogAge * 4 
    2. Exclude all dogs that are less than 18 human years old (which is the same as 
    keeping dogs that are at least 18 years old) 
    3. Calculate the average human age of all adult dogs (you should already know 
    from other challenges how we calculate averages 😉) 
    4. Run the function for both test datasets 
  Test data: 
  § Data 1: [5, 2, 4, 1, 15, 8, 3] 
  § Data 2: [16, 6, 10, 5, 6, 1, 4] 
*/

const calcAverageHumanAge = ages => {
  const averageHumanAge = ages
    .map((dogAge, i) => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(dogAge => dogAge >= 18)
    .reduce((acc, dogAge, _, arr) => acc + dogAge / arr.length, 0);
  console.log(averageHumanAge);
};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// Arrays Method Practice

// 1.
const totalDeposit = accounts
  .map(arr => arr.movements)
  .flat()
  .filter(mov => mov > 0)
  .reduce((acc, current) => acc + current, 0);

console.log(totalDeposit);

// 2.
const deposit1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, current) => (current >= 1000 ? ++count : count), 0);

console.log(deposit1000);

// 3.
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (acc, current) => {
      current > 0 ? (acc.deposits += current) : (acc.withdrawals += current);
      return acc;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// 4.
const convertTitle = title => {
  const exceptions = ['a', 'an', 'in', 'the', 'but', 'or', 'in', 'with', 'on'];

  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const convertedTitle = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return convertedTitle;
};

console.log(convertTitle('this is a title'));

/*
Coding Challenge #4 
  Julia and Kate are still studying dogs, and this time they are studying if dogs are 
  eating too much or too little. 
  Eating too much means the dog's current food portion is larger than the 
  recommended portion, and eating too little is the opposite. 
  Eating an okay amount means the dog's current food portion is within a range 10% 
  above and 10% below the recommended portion (see hint). 
Your tasks: 
  1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate 
  the recommended food portion and add it to the object as a new property. Do 
  not create a new array, simply loop over the array. Forumla: 
  recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg) 
  2. Find Sarah's dog and log to the console whether it's eating too much or too 
  little. Hint: Some dogs have multiple owners, so you first need to find Sarah in 
  the owners array, and so this one is a bit tricky (on purpose) 🤓 
  3. Create an array containing all owners of dogs who eat too much 
  ('ownersEatTooMuch') and an array with all owners of dogs who eat too little 
  ('ownersEatTooLittle'). 
  4. Log a string to the console for each array created in 3., like this: "Matilda and 
  Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat 
  too little!" 
  5. Log to the console whether there is any dog eating exactly the amount of food 
  that is recommended (just true or false) 
  6. Log to the console whether there is any dog eating an okay amount of food 
  (just true or false) 
  7. Create an array containing the dogs that are eating an okay amount of food (try 
  to reuse the condition used in 6.) 
  8. Create a shallow copy of the 'dogs' array and sort it by recommended food 
  portion in an ascending order (keep in mind that the portions are inside the 
  array's objects 😉) 

Hints: 
  § Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉 
  § Being within a range 10% above and below the recommended portion means: 
  current > (recommended * 0.90) && current < (recommended * 
  1.10). Basically, the current portion should be between 90% and 110% of the 
  recommended portion.
*/

// 1.
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dogs => {
  dogs.recFood = Math.floor(dogs.weight ** 0.75 * 28);
});

//2.
const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(dogs);
console.log(
  `Sarah's dog is ${
    sarahDog.curFood > sarahDog.recFood ? 'Overeating' : 'Undereating'
  }`
);

// 3.
const ownersEatTooMuch = dogs
  .filter((dog, i) => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs
  .filter((dog, i) => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooLittle);
console.log(ownersEatTooMuch);

// 4.
console.log(`${ownersEatTooMuch.join(' and ')} dogs eat too much!`);

console.log(`${ownersEatTooLittle.join(' and ')} dogs eat too little!`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recFood));

// 6.
console.log(
  dogs.some(
    dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
  )
);

// 7.
const count = dogs.filter(
  dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
);
console.log(count);

// 8.
const sorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(sorted);
