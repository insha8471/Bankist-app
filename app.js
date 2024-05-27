//Bankist

const account1 = {
    owner: 'Insha Mahfooz',
    movement: [200,500,-400,8000,-700,60],
    interestRate: 1.2,
    pin:1111,


    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
      ],
      currency: "USD",
      locale: "en-US", // de-DE
};


const account2 = {
    owner: 'Tanzeel Ahmad',
    movement: [200,800,-400,2000,-700,70],
    interestRate: 1,
    pin:2222,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
        "2020-07-28T23:36:17.929Z",
      ],
      currency: "EUR",
      locale: "pt-PT", // de-DE
};
const account3 = {
    owner: 'Irfan Parwez',
    movement: [200,500,-400,9000,-700,70],
    interestRate: 0.7,
    pin:3333,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
      ],
      currency: "USD",
      locale: "pt-PT", // de-DE
};
const account4 = {
    owner: 'Parwez Musharraf',
    movement: [200,500,-400,1000,9000,70],
    interestRate: 1.5,
    pin:4444,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
      ],
      currency: "EUR",
      locale: "pt-PT", // de-DE
};

let accounts = [account1, account2, account3,account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance_value');
const labelSumIn = document.querySelector('.summary_value--in');
const labelSumOut = document.querySelector('.summary_value--out');
const labelSumInterest = document.querySelector('.summary_value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movement');

const btnLogin = document.querySelector('.login_btn');
const btnTransfer = document.querySelector('.form_btn--transfer');
const btnLoan = document.querySelector('.form_btn--loan');
const btnClose = document.querySelector('.form_btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login_input--user');
const inputLoginPin = document.querySelector('.login_input--pin');
const inputTransferTo = document.querySelector('.form_input--to');
const inputTransferAmount = document.querySelector('.form_input--amount');
const inputLoanAmount = document.querySelector('.form_input--loan-amount');
const inputCloseUsername = document.querySelector('.form_input--user');
const inputClosePin = document.querySelector('.form_input--pin');

//********************************************* display movements ************************************************


const formatMovementDate = function(date, locale) {
    const calDaysPassed = (date1, date2) => Math.round(Math.abs((date2 - date1) / (1000 * 60 *60 *24)));

    const dayPassed = calDaysPassed(new Date(), date);

    if(dayPassed === 0) return 'Today';
    if(dayPassed === 1) return 'Yesterday';
    if(dayPassed <= 7) return `${dayPassed} days ago`;
    // else{
    //     const day = `${date.getDate()}`.padStart(2,0);
    //     const month = `${date.getMonth() + 1}`.padStart(2,0);
    //     const year = `${date.getFullYear()}`;

    //     return `${day}/${month}/${year}`;
    // }

    return new Intl.DateTimeFormat(locale).format(date);

}

// crrency 

const formatcur = function (value, locale, currency){
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency : currency,
    }).format(value);
}

const displayMovements = function(acc, sort = false){
    containerMovements.innerHTML = '';

    const movs = sort ? acc.movement.slice().sort((a,b) => a-b) : acc.movement;
      
    movs.forEach(function(mov, i){
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]);
        displayDate = formatMovementDate(date, acc.locale);

        //currecny 

        const formattedMov = formatcur(mov, acc.locale, acc.currency);

        const html = `
        <div class="movement_row">
                <div class="movement_type movement_type--${type}">
                    ${i+1} ${type}
                </div> 
                <div class="movement_date">${displayDate}</div>
                <div class="movement_value">${formattedMov}</div>
        </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
        
    });
};


//********************************************* End display movements ************************************************

//  ***************************************** Display Global Balance ************************************************
 
const calDisplayBalnce = function(accs){
    accs.balance = accs.movement.reduce( (acc, cur) => acc+cur, 0);
    labelBalance.textContent = formatcur(accs.balance, accs.locale, accs.currency);
}


// ********************************** summary part **************************************************************


const calDisplaySummary = function(accs){
    // deposit in
    const incomes = accs.movement
        .filter( mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
        
    labelSumIn.textContent = formatcur(incomes, accs.locale, accs.currency);


    // withdrawal
    const out = accs.movement
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc+mov);

    labelSumOut.textContent = formatcur(Math.abs(out), accs.locale, accs.currency);

    // calulate interest if it is greater than 1
    const interest = accs.movement
        .filter(mov => mov > 0)
        .map(deposit => (deposit * accs.interestRate)/100)
        .filter((inte, i, arr) => {
                return inte >=1;
        })
        .reduce((acc,mov) => acc+mov, 0);
    labelSumInterest.textContent = formatcur(interest, accs.locale, accs.currency);

}


// ********************************************** End *****************************************************


//**************************************** Generate userName ***********************************************


const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map( name => name[0])
            .join('');
    });
}

createUsernames(accounts);

loadFromLocalStorage();

const updateUI = function(acc) {
        //display movement
        displayMovements(acc);
        
        //display global balance
        calDisplayBalnce(acc);
        
        // display summary
        calDisplaySummary(acc);

        // save account
        saveToLocalStorage();

}

//**************************************** Generate userName ***********************************************

// **************************************** Implementing Login **************************************


let currentAccount, timer;
btnLogin.addEventListener('click', function(e) {
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

    if(currentAccount?.pin === +(inputLoginPin.value)){
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

        containerApp.style.opacity = 100;

        //current date 
        // const currDate = new Date();
        // const day = `${currDate.getDate()}`.padStart(2,0);
        // const month = `${currDate.getMonth()}`.padStart(2,0);
        // const year = currDate.getFullYear();
        // const hour = `${currDate.getHours()}`.padStart(2,0);
        // const min = `${currDate.getMinutes()}`.padStart(2,0);
        // labelDate.textContent = `${day}/${month}/${year} , ${hour}:${min}`;

        // const locale = navigator.language;

        const currDate = new Date();
        const option = {
            hour: 'numeric',
            minute : 'numeric',
            day : 'numeric',
            month : 'numeric',
            year : 'numeric'
        }

        labelDate.textContent = Intl.DateTimeFormat(currentAccount.locale, option).format(currDate);

        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        //count Down
        if(timer) clearInterval(timer);
        timer = startLogoutTimer();
        
        // update UI
        updateUI(currentAccount);
    }else{
        window.alert('Please enter correct username and pin');
    }
});

// ******************** Transfer *****************************************

btnTransfer.addEventListener('click', function(e) {
    e.preventDefault();

    const amount = +(inputTransferAmount.value);
    const receiveAcc = accounts.find(acc => acc.username === inputTransferTo.value);
    
    console.log(amount, receiveAcc);
    
    
    if(
        amount > 0 && 
        currentAccount.balance >= inputTransferAmount.value &&
        receiveAcc 
        && receiveAcc?.username !== currentAccount.username
    ){
        currentAccount.movement.push(-amount);
        receiveAcc.movement.push(amount);

        //Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiveAcc.movementsDates.push(new Date().toISOString());

        //set time out
        clearInterval(timer);
        timer = startLogoutTimer();

        //Update UI
        updateUI(currentAccount);

    }else if(!receiveAcc){
        window.alert('Please enter correct username');
    }else{
        window.alert('Insufficient Balance');
    }
    
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
    inputTransferAmount.blur();
})

// ********************************************* Loan Request ************************************

btnLoan.addEventListener('click', function(e) {
    e.preventDefault();

    const amount = +(inputLoanAmount.value);
    if(amount > 0 && currentAccount.movement.some(mov => mov >= amount * 0.1)){

        currentAccount.movement.push(amount);

        inputLoanAmount.value = '';
        inputLoanAmount.blur();

        //add date
        currentAccount.movementsDates.push(new Date().toISOString());

        //set time out
        clearInterval(timer);
        timer = startLogoutTimer();

        //update UI
        updateUI(currentAccount);
    }
})

//**************************************************** Close Account ********************************/

btnClose.addEventListener('click', function(e) {
    e.preventDefault();

    
    console.log("done")
    if(inputCloseUsername.value === currentAccount.username &&
        +(inputClosePin.value) === currentAccount.pin){
            
            const index = accounts.findIndex(
                acc => acc.username === currentAccount.username
            );

            accounts.splice(index, 1);
    }

    saveToLocalStorage();

    inputCloseUsername.value = '';
    inputClosePin.value ='';
    inputClosePin.blur();
    
    containerApp.style.opacity = 0;
})


// ************************* Sorting **********************************

let sorted = false;

btnSort.addEventListener('click', function(e) {
    e.preventDefault();

    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});


//Logout timer

const startLogoutTimer = function() {
    const tick = function () {
        const min = String(Math.trunc(time/60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2,0);

        labelTimer.textContent = `${min}:${sec}`;

        

        if(time === 0){
            clearInterval(timer);
            labelWelcome.textContent = 'Log in to get started';
            containerApp.style.opacity = 0;
        }
        time--;
    }

    let time = 300;

    tick();
    const timer = setInterval(tick, 1000);
    return timer;
}


// local storage



function saveToLocalStorage() {
    localStorage.setItem('account', JSON.stringify(accounts));
}

function loadFromLocalStorage() {
    const storedAccount = localStorage.getItem('account');
    // if(storedAccount){
    //     accounts = JSON.parse(storedAccount);
    // }

    accounts =  JSON.parse(storedAccount);
}  