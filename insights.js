// قراءة الداتا من localStorage

let resave_data = localStorage.getItem("name_data_subj");

let myobj = JSON.parse(resave_data);


// edit nav bar 
const user = document.getElementById("user")
user.textContent = myobj.name



// عناصر الصفحة

let my_warning = document.querySelector(".warning");

let subject_name = document.querySelector(".subject span");

let my_time = document.querySelector(".time1");

let my_target = document.querySelector(".time2");

let my_job = document.querySelector(".job span");

let my_good = document.querySelector(".good");

let my_sub = document.querySelector(".object_dis .sup");





const length_subject = myobj.subjects.length;


// WARNING (أضعف مادة)

let weakest = null;

for (let i = 0; i < length_subject; i++) {

    let subject = myobj.subjects[i];

    let time = ((subject.time) / 60).toFixed(2);

    let target = Number(subject.target);
    // console.log(target)
    // console.log(time)



    if (time < target) {

        if (!weakest || (target - time) > (weakest.target - weakest.time)) {

            weakest = {

                name: subject.name,

                time: time,

                target: target

            };
        }
    }
}

if (weakest) {

    my_warning.style.display = "block";

    subject_name.textContent = weakest.name;

    my_time.textContent = weakest.time;

    my_target.textContent = weakest.target + " hour";

} else {

    // my_warning.style.display = "none";

}    // success


// SUCCESS (أفضل مادة)

let best = null;

for (let i = 0; i < length_subject; i++) {

    let subject = myobj.subjects[i];

    let time = ((subject.time) / 60).toFixed(2);

    let target = Number(subject.target);

    if (time >= target) {

        if (!best || time > best.time) {

            best = {
                ...subject,
                time: time
            };

        }
    }
}

if (best) {

    my_job.textContent = best.name;

}

// Suggestion

let deate = [];

for (let i = 0; i < length_subject; i++) {

    let subject_deat = myobj.subjects[i].startedat;

    deate.push({
        time_date: subject_deat
    });

}

let max = deate[0].time_date;

for (let i = 1; i < deate.length; i++) {

    if (deate[i].time_date > max) {

        max = deate[i].time_date;

    }

}



function date() {

    if (max >= 6 && max <= 12) {

        my_sub.textContent = "Morning";

    }

    else if (max >= 13 && max <= 18) {

        my_sub.textContent = "Afternoon";

    }
    else if (max >= 19 && max <= 5) {

        my_sub.textContent = "Night";

    }



}

date();






let data = myobj.subjects;
// console.log(data)


let result = {};

for (let i = 0; i < data.length; i++) {

    let item = data[i];

    if (!result[item.day]) {

        result[item.day] = 0;

    }

    result[item.day] += item.time / 60;

}






// الرسم البياني

const canvasElement = document.querySelector("#bar_chart");

if (canvasElement) {

    const ctx = canvasElement.getContext('2d');

    const labels = [

        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'

    ];






    const chartData = labels.map(day => result[day] || 0);



    new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [{

                label: 'Weekly Study Time in hours ',

                data: chartData,

                backgroundColor: 'rgba(124, 58, 237, 0.7)',

                borderColor: '#7C3AED',

                borderWidth: 2,

                borderRadius: 8,

                hoverBackgroundColor: '#3B82F6'

            }]

        },



        options: {

            responsive: true,

            maintainAspectRatio: false,



            plugins: {

                legend: {

                    labels: {

                        color: '#FFFFFF',

                        font: {

                            family: 'Poppins',

                            size: 14

                        }

                    }

                }

            },



            scales: {

                y: {

                    beginAtZero: true,

                    grid: {

                        color: 'rgba(255, 255, 255, 0.05)'

                    },

                    ticks: {

                        color: '#9CA3AF'

                    }

                },



                x: {

                    grid: {

                        display: false

                    },

                    ticks: {

                        color: '#9CA3AF'

                    }

                }

            }

        }

    });

}





// summary


let total_study_time = document.querySelector(".summ2");

let avr_day = document.querySelector(".summ");

let complet = document.querySelector(".summ3");

let foucas_section = document.querySelector(".summ4");



// إجمالي ساعات المذاكرة


// console.log(result)


let total = 0;

for (let i in result) {

    total += result[i];

}


// total هنا بالساعات بالفعل

let total_hours = Math.floor(total);

let total_min = Math.floor((total - total_hours) * 60);


// عرض الوقت

total_study_time.textContent = `${total_hours} h ${total_min} m`;




// متوسط اليوم

let average = (total) / 7;

let avg_hours = Math.floor(average);

let avg_min = Math.floor((average - avg_hours) * 60);

avr_day.textContent = `${avg_hours} h ${avg_min} m`;




// المواد المكتملة

// console.log(subject)
let completed = 0;

for (let i = 0; i < myobj.subjects.length; i++) {

    let subject = myobj.subjects[i];

    let time = (subject.time / 60).toFixed(2);

    let target = subject.target
        ;

    if (time >= target) {
        completed++;
    }
}

complet.textContent = completed;
// logout btn
const logout = document.getElementById("logout")
logout.onclick = async function () {

    const result = await Swal.fire({
        icon: "warning",
        title: "warning",
        text: "if click ok your data deleted",
        showCancelButton: true,
        confirmButtonText: "logout",
        cancelButtonText: "cancel",
    });

    if (result.isConfirmed) {
        localStorage.clear();
        window.location.href = "../index.html"
    }
}