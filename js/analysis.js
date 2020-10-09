let user_id = localStorage.getItem('userId');

window.expenseCategories = [];
window.incomeCategories = [];

window.expenseValues = [];
let myLabels = [];
window.backgroundColorList = [];

document.querySelector('#user_dp').setAttribute("src", localStorage.getItem("picture"));
document.querySelector('#user_name').textContent = localStorage.getItem("name");

document.querySelector('#backbtn').addEventListener('click', function () {
    window.location.href = 'dashboard.html'
})
//------------------------ Logout functionality---------------------------------------

document.querySelector('#logout').addEventListener('click', function () {

    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        localStorage.removeItem("name");
        localStorage.removeItem("picture");
        localStorage.removeItem("userId");

        window.location.href = "index.html";

    }).catch(function (error) {
        alert("Some error occured")
    });
});

//********************&&&&&&&&&  Logout Complete  &&&&&&&&********************* */


firebase.database().ref('users/' + user_id).on('value', function (snapshot) {
    let data = snapshot.val();

    $('#bar_graph').html('');
    let totalYearList = [];


    window.dataObject = {};
    let counter = 1;


    for (let id in data) {
        dataObject[`${counter}`] = [id, data[id]];

        // if (data[id].date.split('-')[1] === month && data[id].date.split('-')[0] === year) {

        //     let temp = data[id].category;
        //     if (expenseCategories.includes(temp)) {
        //         //pass
        //     } else {
        //         if (data[id].type !== 'credit') {
        //             expenseCategories.push(temp);
        //         } else {
        //             incomeCategories.push(temp)
        //         }
        //     }
        // }

        if (totalYearList.includes(data[id].date.split('-')[0])) {
            //pass
        } else {
            totalYearList.push(data[id].date.split('-')[0])
        }
        counter++;
    };


    let select = document.getElementById('filterByYear');

    for (var i = 0; i < totalYearList.length; i++) {
        var opt = document.createElement('option');
        opt.value = totalYearList[i];
        opt.innerHTML = totalYearList[i];
        select.appendChild(opt);
    }

    const date = new Date();
    document.querySelector('#filterByYear').value = date.getFullYear();
    let currentMonth = Number(date.getMonth()) + 1;
    if (currentMonth < 10) {
        currentMonth = currentMonth.toString()
        document.querySelector('#filterByMonth').value = '0' + currentMonth;
    } else {
        document.querySelector('#filterByMonth').value = currentMonth;
    }
    filterByMonthYear();


    window.expenseChart = new Chart(myChart, {
        type: document.querySelector('#graph_type').value,
        data: myData,
        options: options
    });

});

function updateChartType() {
    // Since you can't update chart type directly in Charts JS you must destroy original chart and rebuild
    expenseChart.destroy();




    if (document.getElementById("graph_type").value === 'line' || document.getElementById("graph_type").value === 'bar') {
        expenseChart = new Chart(myChart, {
            type: document.getElementById("graph_type").value,
            data: myData,
            options: options
        });
        expenseChart.options.scales.xAxes[0].scaleLabel.display = true;
        expenseChart.options.scales.yAxes[0].scaleLabel.display = true;
    } else {
        expenseChart = new Chart(myChart, {
            type: document.getElementById("graph_type").value,
            data: myData,
        });
    }

};

function getRandomColor() {
    let color = '#';
    let letters = '0123456789ABCDEF';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color
}


function filterByMonthYear() {
    expenseCategories = [];
    incomeCategories = [];
    expenseValues = [];

    let month = document.querySelector('#filterByMonth').value;
    let year = document.querySelector('#filterByYear').value;
    let totalExpense = document.querySelector('#totalExpense');
    let totalIncome = document.querySelector('#totalIncome');
    let totalSavings = document.querySelector('#totalSavings');
    let newCounter = 1;
    let newDataObject = {};
    let income = 0;
    let expense = 0;
    for (let key in dataObject) {

        if (dataObject[key][1].date.split('-')[1] === month && dataObject[key][1].date.split('-')[0] === year) {
            //pass
            newDataObject[`${newCounter}`] = [dataObject[key][0], dataObject[key][1]];
            newCounter++;

            if (dataObject[key][1].type === 'credit') {
                income += Number(dataObject[key][1].amount);
            } else {
                expense += Number(dataObject[key][1].amount);
            }

            let temp = dataObject[key][1].category;
            if (expenseCategories.includes(temp)) {
                //pass
            } else {
                if (dataObject[key][1].type !== 'credit') {
                    expenseCategories.push(temp);
                } else {
                    incomeCategories.push(temp)
                }
            }
        }
    };
    expenseCategories.forEach(element => {
        let amount = 0;

        for (let id in dataObject) {
            if (dataObject[id][1].category === element) {
                amount += Number(dataObject[id][1].amount);
            }
        };

        expenseValues.push(amount);

        if (backgroundColorList.includes(getRandomColor())) {
            //pass
        } else {
            backgroundColorList.push(getRandomColor())
        }

    });

    totalExpense.textContent = expense;
    totalIncome.textContent = income;
    savings = income - expense;
    totalSavings.textContent = savings;

    window.options = {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Expense Category'
                },
                gridLines: {
                    display: false,
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Expense Amount'
                },
                gridLines: {
                    display: false,
                }
            }]
        },
        elements: {
            arc: {
                borderWidth: 0
            }
        },
        responsive: true
    };

    window.myData = {
        labels: expenseCategories,
        datasets: [{
            label: 'Category wise expense',
            data: expenseValues,
            backgroundColor: backgroundColorList,

        }],
    };

    let ctx = document.querySelector('#bar_graph');
    window.myChart = ctx.getContext('2d');
    ctx.height = 90;
    ctx.width = 200;


};