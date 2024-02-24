const amountEl = document.querySelector("#amount")
const yearsEl = document.querySelector("#years")
const rateEl = document.querySelector("#rate")
const payment1El = document.querySelector("#payment1")
const payment2El = document.querySelector("#payment2")
const feeEl = document.querySelector("#fee")
const calcEl = document.querySelector("#calc")
const resultEl = document.querySelector("#result");
const tableEl = document.querySelector("#table tbody");


console.log(amountEl, yearsEl, rateEl, payment1El, payment2El, feeEl, calcEl, tableEl);
calcEl.addEventListener("click", calcLoan);


function calcLoan() {
    let amount = amountEl.value * 10000;
    let years = yearsEl.value;
    let rate = rateEl.value;

    if (amount == "") {
        alert("請輸入貸款金額");
        return;
    }

    if (years == "") {
        alert("請輸入貸款年限");
        return;
    }
    if (rate == "") {
        alert("請輸入貸款利率");
        return;
    }
    // let fee = 0;
    // if (feeEl.checked) {
    //     fee = 5000
    // }
    // js中的三元運算子寫法
    // fee=5000 if feeEl.checked else 0
    let fee = feeEl.checked ? 5000 : 0;
    // 取得不同計算方法
    let rule = payment1El.checked ? 1 : 2;
    // // 計算利息
    // let totalInterest = amount * rate * years;
    // // 計算總金額
    // let totalAmount = amount + totalInterest + fee;
    // console.log(amount, years, rate, fee, rule, totalAmount, totalInterest);
    console.log(rule);
    let result;
    if (rule == 1) {
        result = rule1(amount, years, rate);
        console.log(result);

    } else if (rule == 2) {
        result = rule2(amount, years, rate);
        console.log(result);
    }

    let totalInterest = result[1];
    let totalAmount = amount + totalInterest + fee;
    console.log(amount, years, rate, fee, rule, totalAmount, totalInterest)

    document.querySelector(".totalAmount").innerText = totalAmount + (fee == 0 ? "" : "(含手續費)");
    document.querySelector(".totalInterest").innerText = totalInterest;

    resultEl.style.display = "none";
    setTimeout(function () {
        resultEl.style.display = "block";
    }, 500)
    drawTable(result[0]);
}

function drawTable(datas) {
    let tableStr = "";
    for (let i = 0; i < datas.length; i++) {
        tableStr += "<tr>";
        for (let j = 0; j < datas[i].length; j++) {
            tableStr += `<td>${datas[i][j]}</td>`;
        }
        tableStr += "</tr>";
    }
    tableEl.innerHTML = tableStr;
    // let tableStr = "<ul>"
    // for (let i = 0; i < datas.length; i++) {
    //     console.log(datas[i].join(","));
    //     tableStr += `<li>${datas[i].join(";")}</li>`
    // }

    // tableStr += "</ul>";
    // console.log(tableStr);
    // tableEl.innerHTML = tableStr;
}

const resetEl = document.querySelector("#reset")
resetEl.addEventListener("click", resetForm);
function resetForm() {
    amountEl.value = "";
    yearsEl.value = "";
    rateEl.value = "";
    resultEl.innerText = "";
    tableEl.innerHTML = "";
}
// console.log(amount, years, rate, fee, rule, totalAmount, totalInterest);

function rule1(total_amount, years, rate) {
    let amount = total_amount;
    let period = years * 12;
    let month_rate = rate / 100 / 12;
    let month_pay = parseInt(amount / period);
    let totalInterest = 0;
    let datas = [];

    for (let i = 0; i < period; i++) {
        interest = Math.round(amount * month_rate);
        amount -= month_pay;
        if (i == period - 1) {
            datas.push([i + 1, month_pay + amount, interest, month_pay + amount + interest, 0]
            );
        } else {
            datas.push([i + 1, month_pay, interest, month_pay + interest, amount]);
        }
        totalInterest += interest;
    }
    console.log(datas, totalInterest);
    return [datas, totalInterest];
}
/**本息平均攤還計算公式：
 * A.試算公式：
    *每月應付本息金額之平均攤還率 ＝{[(1＋月利率)^月數]×月利率}÷{[(1＋月利率)^月數]－1}
    (公式中：月利率 ＝ 年利率／12 ； 月數=貸款年期 ｘ 12)
 * 每月應攤還本金與利息試算：
    * 平均每月應攤付本息金額＝貸款本金×每月應付本息金額之平均攤還率
    * 每月應付本息金額之平均攤還率＝每月應還本金金額＋每月應付利息金額 
    * 每月應付利息金額＝本金餘額×月利率
  */
function rule2(total_amount, years, rate) {
    let amount = total_amount;
    let period = years * 12;
    let month_rate = rate / 100 / 12;
    // 計算每月還款金額（本息平均攤還）,使用parseInt取到整數
    let month_pay = parseInt(amount * (month_rate * Math.pow(1 + month_rate, period)) / (Math.pow(1 + month_rate, period) - 1));

    let totalInterest = 0;
    let datas = [];

    for (let i = 0; i < period; i++) {
        interest = Math.round(amount * month_rate);
        principalPayment = month_pay - interest;
        amount -= principalPayment;
        if (i == period - 1) {
            datas.push([i + 1, 0, interest, month_pay, 0]);

        } else {
            datas.push([i + 1, principalPayment, interest, month_pay, amount]);
        }

        totalInterest += interest
    }
    console.log(datas, totalInterest);
    return [datas, totalInterest];
}



