/**
 * Teacher Data and Course Database
 * Contains information about teachers, their assigned courses, and students
 */

// Define the teachers
const teachers = [
    {
        id: "T001",
        name: "Dr. Robert Johnson",
        email: "robert.johnson@university.edu",
        department: "Computer Science",
        position: "Associate Professor",
        avatar: "assets/img/teacher-avatar.png",
        courses: ["CC100", "CC101", "DS111", "CC102", "WD111"]
    },
    {
        id: "T002",
        name: "Prof. Maria Garcia",
        email: "maria.garcia@university.edu",
        department: "Information Technology",
        position: "Assistant Professor",
        avatar: "assets/img/teacher-avatar-2.png",
        courses: ["IT101", "IT102", "IT103", "IT201", "IT202"]
    },
    {
        id: "T003",
        name: "Dr. William Chen",
        email: "william.chen@university.edu",
        department: "Computer Science",
        position: "Professor",
        avatar: "assets/img/teacher-avatar-3.png",
        courses: ["HCI116", "DS118", "CC201", "CC202", "CC203"]
    }
];

// Define the courses
const courses = {
    // 1st Semester Courses - Computer Science
    "CC100": {
        code: "CC100",
        title: "INTRODUCING TO COMPUTING",
        description: "Basic concepts of computing, history of computers, and introduction to computer systems.",
        credits: 3,
        semester: "1st",
        type: "Lecture",
        schedule: "MWF 9:00 AM - 10:30 AM",
        room: "LR 2",
        capacity: 40,
        enrolled: 35,
        teacher: "T001",
        program: "BSCS"
    },
    "CC100L": {
        code: "CC100L",
        title: "INTRODUCING TO COMPUTING (LAB)",
        description: "Laboratory exercises for Introduction to Computing.",
        credits: 1,
        semester: "1st",
        type: "Laboratory",
        schedule: "TH 1:00 PM - 4:00 PM",
        room: "Lab 1",
        capacity: 30,
        enrolled: 28,
        teacher: "T001",
        program: "BSCS"
    },
    "CC101": {
        code: "CC101",
        title: "COMPUTER PROGRAMMING",
        description: "Introduction to programming concepts and problem-solving using a high-level programming language.",
        credits: 3,
        semester: "1st",
        type: "Lecture",
        schedule: "TTH 10:30 AM - 12:00 PM",
        room: "LR 3",
        capacity: 40,
        enrolled: 38,
        teacher: "T001",
        program: "BSCS"
    },
    "CC101L": {
        code: "CC101L",
        title: "COMPUTER PROGRAMMING (LAB)",
        description: "Laboratory exercises for Computer Programming.",
        credits: 1,
        semester: "1st",
        type: "Laboratory",
        schedule: "F 1:00 PM - 4:00 PM",
        room: "Lab 2",
        capacity: 30,
        enrolled: 29,
        teacher: "T001",
        program: "BSCS"
    },
    "DS111": {
        code: "DS111",
        title: "DISCRETE STRUCTURES 1",
        description: "Introduction to discrete mathematical structures used in computer science.",
        credits: 3,
        semester: "1st",
        type: "Lecture",
        schedule: "MWF 1:00 PM - 2:30 PM",
        room: "LR 5",
        capacity: 40,
        enrolled: 32,
        teacher: "T001",
        program: "BSCS"
    },

    // 2nd Semester Courses - Computer Science
    "CC102": {
        code: "CC102",
        title: "COMPUTER PROGRAMMING 2",
        description: "Advanced programming concepts including object-oriented programming.",
        credits: 3,
        semester: "2nd",
        type: "Lecture",
        schedule: "MWF 9:00 AM - 10:30 AM",
        room: "LR 2",
        capacity: 40,
        enrolled: 30,
        teacher: "T001",
        program: "BSCS"
    },
    "CC102L": {
        code: "CC102L",
        title: "COMPUTER PROGRAMMING 2 (LAB)",
        description: "Laboratory exercises for Computer Programming 2.",
        credits: 1,
        semester: "2nd",
        type: "Laboratory",
        schedule: "TH 1:00 PM - 4:00 PM",
        room: "Lab 1",
        capacity: 30,
        enrolled: 25,
        teacher: "T001",
        program: "BSCS"
    },
    "WD111": {
        code: "WD111",
        title: "WEB DEVELOPMENT 1",
        description: "Introduction to web development, HTML, CSS, and basic JavaScript.",
        credits: 3,
        semester: "2nd",
        type: "Lecture",
        schedule: "TTH 10:30 AM - 12:00 PM",
        room: "LR 3",
        capacity: 40,
        enrolled: 35,
        teacher: "T001",
        program: "BSCS"
    },
    "WD111L": {
        code: "WD111L",
        title: "WEB DEVELOPMENT 1 (LAB)",
        description: "Laboratory exercises for Web Development 1.",
        credits: 1,
        semester: "2nd",
        type: "Laboratory",
        schedule: "F 1:00 PM - 4:00 PM",
        room: "Lab 2",
        capacity: 30,
        enrolled: 28,
        teacher: "T001",
        program: "BSCS"
    },
    "HCI116": {
        code: "HCI116",
        title: "HUMAN COMPUTER INTERACTION",
        description: "Principles of human-computer interaction and user interface design.",
        credits: 3,
        semester: "2nd",
        type: "Lecture",
        schedule: "MWF 1:00 PM - 2:30 PM",
        room: "LR 5",
        capacity: 40,
        enrolled: 32,
        teacher: "T003",
        program: "BSCS"
    },
    "DS118": {
        code: "DS118",
        title: "DISCRETE STRUCTURES 2",
        description: "Advanced discrete mathematical structures used in computer science.",
        credits: 3,
        semester: "2nd",
        type: "Lecture",
        schedule: "TTH 1:00 PM - 2:30 PM",
        room: "LR 4",
        capacity: 40,
        enrolled: 30,
        teacher: "T003",
        program: "BSCS"
    },

    // 1st Semester Courses - IT
    "IT101": {
        code: "IT101",
        title: "INTRODUCTION TO INFORMATION TECHNOLOGY",
        description: "Overview of information technology concepts and applications.",
        credits: 3,
        semester: "1st",
        type: "Lecture",
        schedule: "MWF 8:00 AM - 9:30 AM",
        room: "LR 1",
        capacity: 40,
        enrolled: 38,
        teacher: "T002",
        program: "BSIT"
    },
    "IT102": {
        code: "IT102",
        title: "COMPUTER ORGANIZATION",
        description: "Introduction to computer hardware, architecture, and organization.",
        credits: 3,
        semester: "1st",
        type: "Lecture",
        schedule: "TTH 8:00 AM - 9:30 AM",
        room: "LR 2",
        capacity: 40,
        enrolled: 35,
        teacher: "T002",
        program: "BSIT"
    },
    "IT103": {
        code: "IT103",
        title: "PROGRAMMING FUNDAMENTALS",
        description: "Basic programming concepts and problem-solving techniques.",
        credits: 3,
        semester: "1st",
        type: "Lecture",
        schedule: "MWF 10:30 AM - 12:00 PM",
        room: "LR 4",
        capacity: 40,
        enrolled: 37,
        teacher: "T002",
        program: "BSIT"
    },

    // 2nd Semester Courses - IT
    "IT201": {
        code: "IT201",
        title: "DATABASE MANAGEMENT SYSTEMS",
        description: "Introduction to database concepts, design, and implementation.",
        credits: 3,
        semester: "2nd",
        type: "Lecture",
        schedule: "MWF 8:00 AM - 9:30 AM",
        room: "LR 1",
        capacity: 40,
        enrolled: 35,
        teacher: "T002",
        program: "BSIT"
    },
    "IT202": {
        code: "IT202",
        title: "NETWORK FUNDAMENTALS",
        description: "Introduction to computer networks and data communications.",
        credits: 3,
        semester: "2nd",
        type: "Lecture",
        schedule: "TTH 8:00 AM - 9:30 AM",
        room: "LR 2",
        capacity: 40,
        enrolled: 32,
        teacher: "T002",
        program: "BSIT"
    }
};

// Sample students data
const students = [
    { id: "2023-0001", name: "John Smith", program: "BSCS", year: 1 },
    { id: "2023-0002", name: "Emily Johnson", program: "BSCS", year: 1 },
    { id: "2023-0003", name: "Michael Brown", program: "BSCS", year: 1 },
    { id: "2023-0004", name: "Jessica Davis", program: "BSCS", year: 1 },
    { id: "2023-0005", name: "David Wilson", program: "BSCS", year: 1 },
    { id: "2023-0006", name: "Sarah Martinez", program: "BSCS", year: 1 },
    { id: "2023-0007", name: "Daniel Anderson", program: "BSCS", year: 1 },
    { id: "2023-0008", name: "Jennifer Taylor", program: "BSCS", year: 1 },
    { id: "2023-0009", name: "Christopher Thomas", program: "BSCS", year: 1 },
    { id: "2023-0010", name: "Lisa Rodriguez", program: "BSCS", year: 1 },
    { id: "2023-0011", name: "Matthew Jackson", program: "BSIT", year: 1 },
    { id: "2023-0012", name: "Amanda White", program: "BSIT", year: 1 },
    { id: "2023-0013", name: "Ryan Harris", program: "BSIT", year: 1 },
    { id: "2023-0014", name: "Stephanie Martin", program: "BSIT", year: 1 },
    { id: "2023-0015", name: "Kevin Thompson", program: "BSIT", year: 1 }
];

// Sample reservations data
const reservations = [
    {
        id: "R001",
        courseCode: "CC100",
        studentId: "2023-0001",
        studentName: "John Smith",
        preferredDays: ["Monday", "Wednesday", "Friday"],
        preferredTime: "9:00 AM - 10:30 AM",
        preferredRoom: "LR 2",
        reason: "Schedule conflict with another required course.",
        status: "pending",
        requestDate: "May 4, 2025",
        teacherId: "T001"
    },
    {
        id: "R002",
        courseCode: "CC101",
        studentId: "2023-0002",
        studentName: "Emily Johnson",
        preferredDays: ["Tuesday", "Thursday"],
        preferredTime: "1:00 PM - 2:30 PM",
        preferredRoom: "LR 3",
        reason: "The current schedule conflicts with my part-time job.",
        status: "pending",
        requestDate: "May 5, 2025",
        teacherId: "T001"
    },
    {
        id: "R003",
        courseCode: "DS111",
        studentId: "2023-0003",
        studentName: "Michael Brown",
        preferredDays: ["Monday", "Wednesday", "Friday"],
        preferredTime: "10:30 AM - 12:00 PM",
        preferredRoom: "LR 5",
        reason: "The course is not yet scheduled and I need it for my program.",
        status: "pending",
        requestDate: "May 3, 2025",
        teacherId: "T001"
    },
    {
        id: "R004",
        courseCode: "IT101",
        studentId: "2023-0011",
        studentName: "Matthew Jackson",
        preferredDays: ["Monday", "Wednesday", "Friday"],
        preferredTime: "8:00 AM - 9:30 AM",
        preferredRoom: "LR 1",
        reason: "I missed the enrollment period due to medical reasons.",
        status: "pending",
        requestDate: "May 2, 2025",
        teacherId: "T002"
    },
    {
        id: "R005",
        courseCode: "IT102",
        studentId: "2023-0012",
        studentName: "Amanda White",
        preferredDays: ["Tuesday", "Thursday"],
        preferredTime: "8:00 AM - 9:30 AM",
        preferredRoom: "LR 2",
        reason: "The current schedule conflicts with another required course.",
        status: "pending",
        requestDate: "May 1, 2025",
        teacherId: "T002"
    },
    {
        id: "R006",
        courseCode: "HCI116",
        studentId: "2023-0004",
        studentName: "Jessica Davis",
        preferredDays: ["Monday", "Wednesday", "Friday"],
        preferredTime: "1:00 PM - 2:30 PM",
        preferredRoom: "LR 5",
        reason: "I need this course to complete my program requirements.",
        status: "approved",
        requestDate: "April 30, 2025",
        approvalDate: "May 2, 2025",
        teacherId: "T003"
    },
    {
        id: "R007",
        courseCode: "DS118",
        studentId: "2023-0005",
        studentName: "David Wilson",
        preferredDays: ["Tuesday", "Thursday"],
        preferredTime: "1:00 PM - 2:30 PM",
        preferredRoom: "LR 4",
        reason: "Schedule conflict with a required elective course.",
        status: "approved",
        requestDate: "April 29, 2025",
        approvalDate: "May 1, 2025",
        teacherId: "T003"
    },
    {
        id: "R008",
        courseCode: "IT103",
        studentId: "2023-0013",
        studentName: "Ryan Harris",
        preferredDays: ["Monday", "Wednesday", "Friday"],
        preferredTime: "10:30 AM - 12:00 PM",
        preferredRoom: "LR 4",
        reason: "I need to adjust my schedule due to transportation issues.",
        status: "rejected",
        requestDate: "April 28, 2025",
        rejectionDate: "April 30, 2025",
        rejectionReason: "The requested time slot is already at maximum capacity.",
        teacherId: "T002"
    }
];

// Function to get the current teacher's data
function getCurrentTeacher() {
    // In a real application, this would be determined by login
    // For demo purposes, we'll return the first teacher
    return teachers[0];
}

// Function to get courses for a specific teacher
function getTeacherCourses(teacherId, semester = null) {
    const teacherCourses = [];
    
    for (const courseCode in courses) {
        if (courses[courseCode].teacher === teacherId) {
            if (!semester || courses[courseCode].semester === semester) {
                teacherCourses.push(courses[courseCode]);
            }
        }
    }
    
    return teacherCourses;
}

// Function to get reservations for a specific teacher
function getTeacherReservations(teacherId, status = null) {
    return reservations.filter(reservation => {
        if (reservation.teacherId === teacherId) {
            if (!status || reservation.status === status) {
                return true;
            }
        }
        return false;
    });
}

// Function to get students enrolled in a course
function getStudentsInCourse(courseCode) {
    // In a real application, this would query a database
    // For demo purposes, we'll return a subset of students
    return students.slice(0, courses[courseCode].enrolled);
}

// First semester courses data for courses.js
const firstSemesterCoursesData = [
    {
        courseCode: 'CC 100',
        courseName: 'INTRODUCING TO COMPUTING',
        schedule: 'MWF 9:00 AM - 10:30 AM',
        room: 'LR 3',
        students: 35,
        type: 'Lecture'
    },
    {
        courseCode: 'CC 100',
        courseName: 'INTRODUCING TO COMPUTING (LAB)',
        schedule: 'TTh 1:00 PM - 3:00 PM',
        room: 'LR 1',
        students: 35,
        type: 'Laboratory'
    },
    {
        courseCode: 'DS 111',
        courseName: 'DISCRETE STRUCTURES 1',
        schedule: 'MWF 10:30 AM - 12:00 PM',
        room: 'LR 5',
        students: 32,
        type: 'Lecture'
    },
    {
        courseCode: 'CC 101',
        courseName: 'COMPUTER PROGRAMMING',
        schedule: 'TTh 9:00 AM - 10:30 AM',
        room: 'LR 4',
        students: 30,
        type: 'Lecture'
    },
    {
        courseCode: 'CC 101',
        courseName: 'COMPUTER PROGRAMMING (LAB)',
        schedule: 'TTh 3:30 PM - 5:30 PM',
        room: 'LR 2',
        students: 30,
        type: 'Laboratory'
    }
];

// Second semester courses data for courses.js
const secondSemesterCoursesData = [
    {
        courseCode: 'CC 102',
        courseName: 'COMPUTER PROGRAMMING 2',
        schedule: 'MWF 9:00 AM - 10:30 AM',
        room: 'LR 3',
        students: 33,
        type: 'Lecture'
    },
    {
        courseCode: 'CC 102',
        courseName: 'COMPUTER PROGRAMMING 2 (LAB)',
        schedule: 'TTh 1:00 PM - 3:00 PM',
        room: 'LR 1',
        students: 33,
        type: 'Laboratory'
    },
    {
        courseCode: 'WD 111',
        courseName: 'WEB DEVELOPMENT 1',
        schedule: 'MWF 10:30 AM - 12:00 PM',
        room: 'LR 5',
        students: 28,
        type: 'Lecture'
    },
    {
        courseCode: 'WD 111',
        courseName: 'WEB DEVELOPMENT 1 (LAB)',
        schedule: 'TTh 3:30 PM - 5:30 PM',
        room: 'LR 2',
        students: 28,
        type: 'Laboratory'
    },
    {
        courseCode: 'HCI 116',
        courseName: 'HUMAN COMPUTER INTERACTION',
        schedule: 'TTh 9:00 AM - 10:30 AM',
        room: 'LR 4',
        students: 25,
        type: 'Lecture'
    },
    {
        courseCode: 'DS 118',
        courseName: 'DISCRETE STRUCTURES 2',
        schedule: 'MWF 1:00 PM - 2:30 PM',
        room: 'LR 3',
        students: 30,
        type: 'Lecture'
    },
    {
        courseCode: 'OOP 112',
        courseName: 'OBJECT ORIENTED PROGRAMMING',
        schedule: 'TTh 10:30 AM - 12:00 PM',
        room: 'LR 2',
        students: 26,
        type: 'Lecture'
    },
    {
        courseCode: 'OOP 112',
        courseName: 'OBJECT ORIENTED PROGRAMMING (LAB)',
        schedule: 'WF 3:30 PM - 5:30 PM',
        room: 'LR 3',
        students: 26,
        type: 'Laboratory'
    }
];

// Initialize the teacher interface
document.addEventListener('DOMContentLoaded', function() {
    // Store teacher data in session storage for access across pages
    const currentTeacher = getCurrentTeacher();
    sessionStorage.setItem('teacherName', currentTeacher.name);
    sessionStorage.setItem('teacherId', currentTeacher.id);
});
