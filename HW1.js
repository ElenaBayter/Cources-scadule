document.addEventListener("DOMContentLoaded", function () {
  const courses = loadCourses();
  updateEnrollmentStatus(courses);
  renderCourses(courses);
  document
    .getElementById("scheduleTable")
    .addEventListener("click", function (e) {
      if (e.target.tagName === "BUTTON") {
        const courseId = parseInt(e.target.dataset.courseId, 10);
        const action = e.target.dataset.action;
        handleAction(courseId, action, courses);
        updateEnrollmentStatus(courses);
      }
    });
});
function loadCourses() {
  const savedCourses = localStorage.getItem("courses");
  if (savedCourses) {
    return JSON.parse(savedCourses);
  } else {
    const defaultCourses = [
      {
        id: 1,
        name: "Йога",
        time: "10:00 - 11:00",
        maxParticipants: 15,
        currentParticipants: 8,
      },
      {
        id: 2,
        name: "Пилатес",
        time: "11:30 - 12:30",
        maxParticipants: 10,
        currentParticipants: 10,
      },
      {
        id: 3,
        name: "Кроссфит",
        time: "13:00 - 14:00",
        maxParticipants: 20,
        currentParticipants: 15,
      },
      {
        id: 4,
        name: "Танцы",
        time: "14:30 - 15:30",
        maxParticipants: 12,
        currentParticipants: 10,
      },
      {
        id: 5,
        name: "Бокс",
        time: "16:00 - 17:00",
        maxParticipants: 8,
        currentParticipants: 6,
      },
    ];
    localStorage.setItem("courses", JSON.stringify(defaultCourses));
    return defaultCourses;
  }
}

function renderCourses(courses) {
  const tableBody = document.querySelector("#scheduleTable tbody");
  tableBody.innerHTML = "";
  courses.forEach((course) => {
    const isEnrolled = checkEnrollment(course.id);
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.time}</td>
            <td>${course.maxParticipants}</td>
            <td>${course.currentParticipants}</td>
            <td>
                <button data-action="enroll" data-course-id="${course.id}" ${
      course.currentParticipants >= course.maxParticipants || isEnrolled
        ? "disabled"
        : ""
    }>Записаться</button>
                <button data-action="unenroll" data-course-id="${course.id}" ${
      !isEnrolled ? "disabled" : ""
    }>Отменить запись</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}
function setEnrollment(courseId, status) {
  const enrollments = JSON.parse(localStorage.getItem("enrollments") || "{}");
  enrollments[courseId] = status;
  localStorage.setItem("enrollments", JSON.stringify(enrollments));
}
function checkEnrollment(courseId) {
  const enrollments = JSON.parse(localStorage.getItem("enrollments") || "{}");
  return !!enrollments[courseId];
}
function updateEnrollmentStatus(courses) {
  courses.forEach((course) => {
    course.isEnrolled = checkEnrollment(course.id);
  });
}
function handleAction(courseId, action, courses) {
  const course = courses.find((c) => c.id === courseId);
  const isEnrolled = checkEnrollment(courseId);
  if (
    action === "enroll" &&
    course.currentParticipants < course.maxParticipants &&
    !isEnrolled
  ) {
    course.currentParticipants++;
    setEnrollment(courseId, true);
  } else if (action === "unenroll" && isEnrolled) {
    course.currentParticipants--;
    setEnrollment(courseId, false);
  }
  localStorage.setItem("courses", JSON.stringify(courses));
  renderCourses(courses); // Обновляем таблицу
}
