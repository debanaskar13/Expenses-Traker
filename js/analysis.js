let user_id = localStorage.getItem('userId');

let expenseCategories = [];
let incomeCategories = [];

let expenseValues = [];
let myLabels = [];
let backgroundColorList = [];

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

    let totalExpense = document.querySelector('#totalExpense');
    let totalIncome = document.querySelector('#totalIncome');
    let totalSavings = document.querySelector('#totalSavings');

    let income = 0;
    let expense = 0;

    for (let id in data) {
        let temp = data[id].category;
        if (expenseCategories.includes(temp)) {
            //pass
        } else {
            if (data[id].type !== 'credit') {
                expenseCategories.push(temp);
            } else {
                incomeCategories.push(temp)
            }
        }

        if (data[id].type === 'credit') {
            income += Number(data[id].amount);
        } else {
            expense += Number(data[id].amount);
        }

    };
    totalExpense.textContent = expense;
    totalIncome.textContent = income;
    savings = income - expense;
    totalSavings.textContent = savings;


    expenseCategories.forEach(element => {
        let amount = 0;

        for (let id in data) {
            if (data[id].category === element) {
                amount += Number(data[id].amount);
            }
        };

        expenseValues.push(amount);

        backgroundColorList.push(getRandomColor())

    });

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
            // borderColor: getRandomColor(),
            // borderWidth: 1
        }],
    };

    let ctx = document.querySelector('#bar_graph');
    window.myChart = ctx.getContext('2d');
    ctx.height = 90;
    ctx.width = 200;

    window.expenseChart = new Chart(myChart, {
        type: document.querySelector('#graph_type').value,
        data: myData,
        options: options
    });
});

function updateChartType() {
    // Since you can't update chart type directly in Charts JS you must destroy original chart and rebuild
    expenseChart.destroy();


    expenseChart = new Chart(myChart, {
        type: document.getElementById("graph_type").value,
        data: myData,
        options: options
    });

    if (document.getElementById("graph_type").value === 'line' || document.getElementById("graph_type").value === 'bar') {
        expenseChart.options.scales.xAxes[0].scaleLabel.display = true;
        expenseChart.options.scales.yAxes[0].scaleLabel.display = true;
    } else {
        expenseChart.options.scales.xAxes[0].scaleLabel.display = false;
        expenseChart.options.scales.yAxes[0].scaleLabel.display = false;
        expenseChart.options.scales.display = false;

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
