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

})

// Code to display the Expenses
firebase.database().ref('users/' + user_id).on('value', function (snapshot) {

    let data = snapshot.val();
    lengthOfData = data.length;
    // console.log(data);
    lengthCounter = 0;


    $('#expense_table').html('');
    // console.log(data)

    let totalExpense = document.querySelector('#totalExpense');
    let totalIncome = document.querySelector('#totalIncome');
    let totalSavings = document.querySelector('#totalSavings');

    let income = 0;
    let expense = 0;
    let counter = 1;
    for (let id in data) {
        // console.log(data[id].amount)
        lengthCounter++
        document.querySelector('#expense_table').innerHTML += `
        <tr data-id=${id} class = "table_row">
                <td>${counter}</td>
                <td>${data[id].name}</td>
                <td>${data[id].type}</td>
                <td><i class="fa fa-rupee" style="font-size:18px"> ${data[id].amount}</td>
                <td>${data[id].category}</td>
                <td>${data[id].time} , ${data[id].date}</td>
                <td class="editOnHover" data-toggle="modal" data-target="#exampleModal"><i class="fa mt-3 fa-pencil-square-o" style="color:blue;"></i></td>
                <td class="editOnHover" style="color:red;"><i onclick="CompleteMessageShown()" class="fa mt-3 fa-times"></i></td>
        </tr>`;
        counter++;

        if (data[id].type === 'credit') {
            income += Number(data[id].amount);
        } else {
            expense += Number(data[id].amount);
        }
    }
    totalExpense.textContent = expense;
    totalIncome.textContent = income;
    savings = income - expense;
    totalSavings.textContent = savings;

    // --------------------------------- Page Number ---------------------------------

    for (let i = 1; i <= Math.ceil(lengthCounter / 5); i++) {
        let numberList = document.querySelector('#numberList');


        if (i == 1) {
            numberList.innerHTML += `<li id="f${i}" class="page-item "><a data-id = ${i} class="page-link">${i}</a></li>`
            document.querySelector('#f1').classList.add('active')
        } else {
            numberList.innerHTML += `<li id="f${i}" class="page-item "><a data-id = ${i} class="page-link">${i}</a></li>`

        }
    };

    let pageLink = document.getElementsByClassName('page-link');

    for (let i = 0; i < pageLink.length; i++) {

        pageLink[i].addEventListener('click', function (e) {
            let pageId = this.getAttribute('data-id');

            if (document.querySelector('.active') != null) {
                document.querySelector('.active').classList.remove('active');
            }

            console.log(`#f${pageId}`);
            document.querySelector(`#f${pageId}`).classList.add('active');

        });


    };
    //---------------------------------- update and delete operations ----------------------

    let table_row = document.getElementsByClassName('table_row');
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
            // console.log(id);
        });
    };


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
        alert('income more money to expense it')
    }
};

