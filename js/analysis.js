let user_id = localStorage.getItem('userId');

let category = ['bills', 'grocery', "house", "rent", "medical"];

let expenseCategory = [];



let ref = firebase.database().ref('users/' + user_id).on('value', function (snapshot) {
    let data = snapshot.val();
    console.log(data);


    category.forEach(element => {
        let amount = 0;

        for (let id in data) {
            if (data[id].category === element) {
                amount += Number(data[id].amount);
            }
        };

        expenseCategory.push(amount);


    })
});

let myChart = document.querySelector('#bar_graph').getContext('2d');

let expenseChart = new Chart(myChart, {
    type: 'bar',
    data: {
        labels: category,
        datasets: [{
            label: 'Category wise expense',
            data: expenseCategory,
            backgroundColor: '#1418cb'
        }]
    }
})
