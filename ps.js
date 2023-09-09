const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[ data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator =document.querySelector("[ data-indicator]");
const generateBtn =document.querySelector(".generateButton");
const allCheckBox =document.querySelectorAll("input[type=checkbox]");
const symbols='~!@#$%^&*()_+<>[]?/.:;"{}';

let password="";
let passwordLength=10;
let checkCount=0;

handleSlider();
// color of indicator

//set the passwordLength default value =10
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
}
setIndicator("#ccc");
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
   return Math.floor(Math.random()*(max-min))+min; //return Bhul gai thi idhar
}

//random value of single digit integer
function generateRandomNumber(){
    return getRndInteger(0,9);
}
// ASCII value of lowercase range from (97,123)
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
// ASCII value of lowercase range from (65,91)
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols(){
    const rndNum=getRndInteger(0,symbols.length);
    return symbols.charAt(rndNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked){
        hasUpper=true;
    }
    if(lowercaseCheck.checked){
        hasLower=true;
    } 
    if(numbersCheck.checked){
        hasNum=true;
    }
    if(symbolsCheck.checked){
        hasSym=true;
    }

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator('#0f0');
    } else if(
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6
    ){
        setIndicator('#f00');
    }

    
}

function shufflePassword(array){
    //fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        const j= Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
array.forEach((el)=>(str+=el));
return str;

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    //copy vala span tag

    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
    }

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special case if your passwordlength is smaller than checkBoxCount set password length to the checkcount

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

// check everycheckbox here and call the handleCheckBoxChange Function
allCheckBox.forEach((checkbox)=>{
   checkbox.addEventListener('change',handleCheckBoxChange);
})


inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider(); //this change the value on the slider
})

//copy btn content
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){ //if the password has valid input then call the copy vala function
        console.log("copied")
        copyContent();
    }
    console.log("done copy")
})


//Generate password vala addEventListner
generateBtn.addEventListener('click',()=>{
    if(checkCount==0) return;
    if(passwordLength<checkCount){
        passwordLength=checkCount
        handleSlider();
    }
    console.log("Starting");

    //let's start the journey to find new password
    password="";//remove the previous one
    //check the checked checkboxes
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password+=generateRandonNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbols();
    // }

    //create array of all checkboxes and we use them randomly

    let funArr = [];
    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funArr.push(generateSymbols);
    }


    //Compulsory Addition

    for(let i=0; i<funArr.length; i++){
        password+=funArr[i]();//function Calling
    }
    console.log("comulsory")
    //remaing password (like length =10 and we only added 4 only)
    for(let i=0; i<passwordLength-funArr.length; i++){
        console.log(funArr.length)
        let randIndex = getRndInteger(0 , funArr.length);//means 0 to 4
        console.log("randIndex" + randIndex);
     
        password=password+ funArr[randIndex]();
    }
    console.log("Remaining")

    //shuffle the password
    password=shufflePassword(Array.from(password));
    console.log("Shuffling done")
    //show in Ui
    passwordDisplay.value=password;
    console.log("UI done")

    //strength
    calcStrength();

});