// Mock data for the professor
const professor = {
    name: "Dr. Jane Smith",
    department: "Computer Science Department",
    position: "Associate Professor",
    profilePic: "/api/placeholder/150/150",
    overallRating: 4.5,
    courses: [
        {
            id: 1,
            name: "Introduction to Programming",
            students: 120,
            averageRating: 4.7,
            medianRating: 5,
            modeRating: 5,
            comments: [
                "Great course, very informative!",
                "Dr. Smith explains concepts clearly.",
                "Challenging but rewarding."
            ]
        },
        {
            id: 2,
            name: "Data Structures",
            students: 80,
            averageRating: 4.3,
            medianRating: 4,
            modeRating: 4,
            comments: [
                "Excellent course structure.",
                "Helps in building a strong foundation.",
                "More practical examples would be helpful."
            ]
        },
        {
            id: 3,
            name: "Algorithms",
            students: 95,
            averageRating: 4.6,
            medianRating: 5,
            modeRating: 5,
            comments: [
                "Challenging but very interesting.",
                "Dr. Smith's enthusiasm is contagious!",
                "Great balance of theory and practice."
            ]
        }
    ]
};

// Populate professor info
document.getElementById('profName').textContent = professor.name;
document.getElementById('profDepartment').textContent = professor.department;
document.getElementById('profPosition').textContent = professor.position;
document.getElementById('profPic').src = professor.profilePic;
document.getElementById('overallRating').textContent = professor.overallRating.toFixed(1);

// Create star rating display
function createStarRating(rating) {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'star-rating';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = i <= rating ? '★' : '☆';
        starsContainer.appendChild(star);
    }
    return starsContainer;
}

document.querySelector('.rating-display').appendChild(createStarRating(professor.overallRating));

// Generate course cards
const coursesList = document.getElementById('coursesList');
professor.courses.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';
    courseCard.innerHTML = `
        <h3>${course.name}</h3>
        <p>Students: ${course.students}</p>
        <p>Average Rating: ${course.averageRating.toFixed(1)}</p>
    `;
    courseCard.addEventListener('click', () => openModal(course));
    coursesList.appendChild(courseCard);
});

// Modal functionality
const modal = document.getElementById('courseModal');
const closeBtn = document.getElementsByClassName('close')[0];

function openModal(course) {
    document.getElementById('modalCourseName').textContent = course.name;
    const detailsContainer = document.getElementById('modalCourseDetails');
    detailsContainer.innerHTML = `
        <p>Average Rating: ${course.averageRating.toFixed(1)}</p>
        <p>Median Rating: ${course.medianRating}</p>
        <p>Mode Rating: ${course.modeRating}</p>
    `;
    
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = course.comments.map(comment => `<p>${comment}</p>`).join('');
    
    modal.style.display = 'block';
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Create bar chart
const ctx = document.getElementById('coursesChart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: professor.courses.map(course => course.name),
        datasets: [{
            label: 'Average Rating',
            data: professor.courses.map(course => course.averageRating),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 5
            }
        }
    }
});

// Calculate overall rating (weighted mean)
function calculateOverallRating() {
    const totalWeightedRating = professor.courses.reduce((sum, course) => sum + course.averageRating * course.students, 0);
    const totalStudents = professor.courses.reduce((sum, course) => sum + course.students, 0);
    return totalWeightedRating / totalStudents;
}

const calculatedOverallRating = calculateOverallRating();
document.getElementById('overallRating').textContent = calculatedOverallRating.toFixed(1);
document.querySelector('.star-rating').replaceWith(createStarRating(calculatedOverallRating));