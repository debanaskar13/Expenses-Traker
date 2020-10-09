if (localStorage.getItem("name") === null) {
    window.location.href = "index.html";
}

let user_id = localStorage.getItem("userId");
let savings;

document.querySelector('#open_add_expense_modal_btn').addEventListener('click', function () {
    document.querySelector('#add_expense').textContent = 'Add Expense';
    document.querySelector('#exampleModalLabel').textContent = 'Add Expense';
    document.querySelector('#expense_name').value = '';
    document.querySelector('#expense_type').value = 'debit';
    document.querySelector('#expense_amount').value = '';
    document.querySelector('#expense_date').value = '';
    document.querySelector('#expense_time').value = '';
    document.querySelector('#expense_category').value = 'bills';

});


// Code to display the Expenses
firebase.database().ref('users/' + user_id).on('value', function (snapshot) {

    let data = snapshot.val();
    window.myData = data;
    if (data != null) {

        lengthOfData = data.length;
    } else {
        lengthOfData = 0;
    }
    // console.log(data);
    window.lengthCounter = 0;
    let totalYearList = [];

    $('#expense_table').html('');
    $('#numberList').html('');
    // console.log(data)



    window.dataObject = {};

    let counter = 1;
    for (let id in data) {
        dataObject[`${counter}`] = [id, data[id]];
        lengthCounter++
        if (counter <= 5) {

            document.querySelector('#expense_table').innerHTML += `
            <tr data-id=${id} class = "table_row">
            <td>${counter}</td>
            <td>${data[id].name}</td>
            <td>${data[id].type}</td>
            <td><i class="fa fa-rupee" style="font-size:18px"> ${data[id].amount}</td>
            <td>${data[id].category}</td>
            <td>${data[id].time}</td>
            <td>${data[id].date}</td>
            <td class="editOnHover" data-toggle="modal" data-target="#exampleModal"><i class="fa mt-3 fa-pencil-square-o" style="color:blue;"></i></td>
            <td class="editOnHover" style="color:red;"><i onclick="CompleteMessageShown()" class="fa mt-3 fa-times"></i></td>
            </tr>`;
        }
        counter++;

        if (totalYearList.includes(data[id].date.split('-')[0])) {
            //pass
        } else {
            totalYearList.push(data[id].date.split('-')[0])
        }
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

    // --------------------------------- Page Number ---------------------------------
    if (lengthCounter != 0) {

        for (let i = 1; i <= Math.ceil(lengthCounter / 5); i++) {
            let numberList = document.querySelector('#numberList');

            if (i == 1) {
                numberList.innerHTML += `<li id="f${i}" class="page-item "><a data-id = ${i} class="page-link">${i}</a></li>`
                document.querySelector('#f1').classList.add('active')
            } else {
                numberList.innerHTML += `<li id="f${i}" class="page-item "><a data-id = ${i} class="page-link">${i}</a></li>`
            }
        };
    };

    filterByMonthYear();

    let table_row = document.getElementsByClassName('table_row');
    let pageLink = document.getElementsByClassName('page-link');

    for (let i = 0; i < pageLink.length; i++) {

        pageLink[i].addEventListener('click', function (e) {
            let pageId = this.getAttribute('data-id');
            showTableOnPageChange(dataObject, pageId);
            filterByMonthYear();

        });
        updateFunctionality(table_row, data);


    };
    //---------------------------------- update and delete operations ----------------------

    updateFunctionality(table_row, data);



});


document.querySelector('#user_dp').setAttribute("src", localStorage.getItem("picture"));
document.querySelector('#user_name').textContent = localStorage.getItem("name");

document.querySelector('#graphical_view').addEventListener('click', function () {
    window.location.href = 'analysis.html'
})

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
document.querySelector('#add_expense').addEventListener('click', function () {
    let expenseName = document.querySelector('#expense_name').value;
    let expenseType = document.querySelector('#expense_type').value;
    let expenseAmount = document.querySelector('#expense_amount').value;
    let expenseDate = document.querySelector('#expense_date').value;
    let expenseTime = document.querySelector('#expense_time').value;
    let expenseCategory = document.querySelector('#expense_category').value;


    if (document.querySelector('#add_expense').textContent === 'Add Expense') {

        let response = insertTableData(expenseName, expenseType, expenseAmount, expenseDate, expenseTime, expenseCategory);
        if (response === 1) {
            // close the modal
            $('#exampleModal').modal('hide');
            // display success message
            let message = document.querySelector('#message');
            message.style.display = 'block'

            message.innerHTML = `<p id="message_alert" class="text-md-center" style= "padding : 10px; background-color : green; color : white"> Expense Added Successfully <i id="close_icon" class="fas fa-times float-md-right" style="font-size:20px;cursor:pointer;"></i></p>`
            document.querySelector('#close_icon').addEventListener('click', function () {
                message.style.display = 'none'
            });

        } else {
            // display error message in the modal

        }
    } else {
        let response = updateTableData(expenseName, expenseType, expenseAmount, expenseDate, expenseTime, expenseCategory);
        if (response === 1) {
            // close the modal
            $('#exampleModal').modal('hide');
            // display success message
            let message = document.querySelector('#message');
            message.style.display = 'block'

            message.innerHTML = `<p id="message_alert" class="text-md-center" style= "padding : 10px; background-color : green; color : white"> Expense Updated Successfully <i id="close_icon" class="fas fa-times float-md-right" style="font-size:20px;cursor:pointer;"></i></p>`
            document.querySelector('#close_icon').addEventListener('click', function () {
                message.style.display = 'none'
            });


        } else {
            // display error message in the modal

        }
    }


    document.querySelector('#expense_name').value = '';
    document.querySelector('#expense_type').value = 'debit';
    document.querySelector('#expense_amount').value = '';
    document.querySelector('#expense_date').value = '';
    document.querySelector('#expense_time').value = '';
    document.querySelector('#expense_category').value = 'bills';
});

function CompleteMessageShown() {
    setTimeout(function () {
        document.querySelector('#message').style.display = 'none';
    }, 3000)
}

function insertTableData(name, type, amount, date, time, category) {

    if ((type === "debit" && amount < savings) || (type === "credit")) {

        firebase.database().ref('users/' + user_id).push({
            name: name,
            type: type,
            amount: amount,
            date: date,
            time: time,
            category: category
        }, function (error) {
            // The write failed...
            return 0;

        });

        return 1;
    } else {
        $('#exampleModal').modal('hide');
        alert('income more money to expense it')
    }
};

function showTableOnPageChange(dataObject, pageId) {

    $('#expense_table').html('');
    for (let index = 5 * Number(pageId) - 4; index < 5 * Number(pageId) + 1; index++) {

        // console.log(index);
        if (index <= Object.keys(dataObject).length) {

            document.querySelector('#expense_table').innerHTML += `
                    <tr data-id=${dataObject[index][0]} class = "table_row">
                    <td>${index}</td>
                    <td>${dataObject[index][1].name}</td>
                    <td>${dataObject[index][1].type}</td>
                    <td><i class="fa fa-rupee" style="font-size:18px"> ${dataObject[index][1].amount}</td>
                    <td>${dataObject[index][1].category}</td>
                    <td>${dataObject[index][1].time}</td>
                    <td>${dataObject[index][1].date}</td>
                    <td class="editOnHover" data-toggle="modal" data-target="#exampleModal"><i class="fa mt-3 fa-pencil-square-o" style="color:blue;"></i></td>
                    <td class="editOnHover" style="color:red;"><i onclick="CompleteMessageShown()" class="fa mt-3 ml-2 fa-times"></i></td>
                    </tr>
                    `;
        }

    }


    if (document.querySelector('.active') != null) {
        document.querySelector('.active').classList.remove('active');
        document.querySelector(`#f${pageId}`).classList.add('active');
    }

    table_row = document.getElementsByClassName('table_row');
};

function updateFunctionality(table_row, data) {


    for (let i = 0; i < table_row.length; i++) {

        table_row[i].addEventListener('click', function (e) {
            window.id = this.getAttribute('data-id');
            if (e.target.classList.contains('fa-pencil-square-o')) {
                document.querySelector('#add_expense').textContent = 'Update Expense';
                document.querySelector('#exampleModalLabel').textContent = 'Update Expense';
                document.querySelector('#expense_name').value = data[id].name;
                document.querySelector('#expense_type').value = data[id].type;
                document.querySelector('#expense_amount').value = data[id].amount;
                document.querySelector('#expense_date').value = data[id].date;
                document.querySelector('#expense_time').value = data[id].time;
                document.querySelector('#expense_category').value = data[id].category;

            } else if (e.target.classList.contains('fa-times')) {
                firebase.database().ref('users/' + user_id).child(id).remove();
                let message = document.querySelector('#message');
                message.style.display = 'block'

                message.innerHTML = `<p id="message_alert" class="text-md-center" style= "padding : 10px; background-color : green; color : white"> Expense Deleted Successfully <i id="close_icon" class="fas fa-times float-md-right" style="font-size:20px;cursor:pointer;"></i></p>`
                document.querySelector('#close_icon').addEventListener('click', function () {
                    message.style.display = 'none'
                });
            };
            // console.log(data);
        });
    };
};

function updateTableData(name, type, amount, date, time, category) {

    if ((type === "debit" && amount < savings) || (type === "credit")) {

        firebase.database().ref('users/' + user_id).child(`${id}`).update({
            name: name,
            type: type,
            amount: amount,
            date: date,
            time: time,
            category: category
        }, function (error) {
            // The write failed...
            return 0;

        });

        return 1;
    } else {
        $('#exampleModal').modal('hide');
        alert('income more money to expense it');
    }
};

function filterByMonthYear() {

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
        }
    };
    totalExpense.textContent = expense;
    totalIncome.textContent = income;
    savings = income - expense;
    totalSavings.textContent = savings;

    // if (document.querySelectorAll('.page-item').length <= Math.ceil(newCounter / 5)) {
    //     console.log('small or equal to');
    // } else {
    //     console.log('Greater');
    //     for (let i = Math.ceil(newCounter / 5); i < document.querySelectorAll('.page-item').length; i++) {
    //         document.querySelectorAll('.page-item')[i].style.display = 'none'

    //     }
    // }
    // console.log(document.querySelectorAll('.page-item')[3]);

    let pageId = $("li.active a[data-id]").attr('data-id');
    let table_row = document.getElementsByClassName('table_row');
    showTableOnPageChange(newDataObject, pageId);
    updateFunctionality(table_row, myData);
};
