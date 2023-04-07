var totalCreditElement = document.getElementById('total-credit');
var divdata = document.getElementById('data');
var divdataSelected = document.getElementById('Selected-data');
var courseData = getCourseList("http://localhost:3000/courseList");
let finalSelectedCourses = [];
let selectedCourses = [];
let totalCredit = 0;

(function () {
  var html = "<ul class='left-list'> <h3> Available Courses</h3>";
  for (var i = 0; i < courseData.length; i++) {
    html += "<div class='one-course' id='" + courseData[i].courseId + "' data-credit=" + courseData[i].credit + ">" +
      "<li class='courseName'>" + courseData[i].courseName + "</li>" +
      "<li class='courseRequired'>Course Type: " + courseType(courseData[i].required) + "</li>" +
      "<li class='courseCredit'>Course Credit: " + courseData[i].credit + "</li>" +
      "</div>";
  }
  html += "</ul>";
  divdata.innerHTML = html;

  var rhtml = "<ul class='left-list'> <h3> Selected Courses</h3>";
  for (var i = 0; i < finalSelectedCourses.length; i++) {
    rhtml += "<div class='one-course' id='" + finalSelectedCourses[i].courseId + "' data-credit=" + finalSelectedCourses[i].credit + ">" +
      "<li class='courseName'>" + finalSelectedCourses[i].courseName + "</li>" +
      "<li class='courseRequired'>Course Type: " + courseType(finalSelectedCourses[i].required) + "</li>" +
      "<li class='courseCredit'>Course Credit: " + finalSelectedCourses[i].credit + "</li>" +
      "</div>";
  }
  rhtml += "</ul>";
  divdataSelected.innerHTML = rhtml;

  var courses = document.querySelectorAll('.one-course');
  for (var i = 0; i < courses.length; i++) {
    courses[i].addEventListener('click', function (e) {
      var pID = e.target.parentNode.getAttribute("id");
      var selectedCourse = {};
      for (var i = 0; i < courseData.length; i++) {
        if (courseData[i].courseId === Number(pID)) {
          selectedCourse = courseData[i];
        }
      }

      if (this.classList.contains('selected')) {
        this.classList.remove('selected');
        unSelectCourse(selectedCourse);
      } else {
        if (totalCredit > 18 || (totalCredit + selectedCourse.credit) > 18) {
          alert("You can only choose up to 18 credits in one semester");
        } else {
          this.classList.add('selected');
          selectCourse(selectedCourse);
        }
      }
    });
  }
}());

function getCourseList(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false);
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}

function courseType(type) {
  if (type) {
    return "Compulsory";
  } else {
    return "Elective";
  }
}

function selectCourse(course) {
  selectedCourses.push(course);
  totalCredit += course.credit;
  totalCreditElement.textContent = 'Total Credits: ' + totalCredit;
}

function unSelectCourse(course) {
  for (var i = 0; i < selectedCourses.length; i++) {
    if (selectedCourses[i].courseId === course.courseId) {
      totalCredit -= course.credit;
      totalCreditElement.textContent = 'Total Credits: ' + totalCredit;
      selectedCourses.splice(i, 1);
    }
  }
}

function onSubmit() {
  let userAction = confirm("You have chosen " + totalCredit + " credits for this semester. You cannot change once you submit. Do you want to confirm?")
  if (userAction) {
    finalSelectedCourses = selectedCourses;
    var rhtml = "<ul class='left-list'> <h3> Selected Courses</h3>";
    for (var i = 0; i < selectedCourses.length; i++) {
      rhtml += "<div class='one-course' id='" + selectedCourses[i].courseId + "' data-credit=" + selectedCourses[i].credit + ">" +
        "<li class='courseName'>" + selectedCourses[i].courseName + "</li>" +
        "<li class='courseRequired'>Course Type: " + courseType(selectedCourses[i].required) + "</li>" +
        "<li class='courseCredit'>Course Credit: " + selectedCourses[i].credit + "</li>" +
        "</div>";
    }
    rhtml += "</ul>";
    divdataSelected.innerHTML = rhtml;
  }
}