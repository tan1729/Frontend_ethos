// Mock student data
const student = {
    name: "John Doe",
    rollNo: "CS2023001",
    department: "Computer Science",
    course: "B.Tech",
    uniqueId: "JD2023CS",
    tokens: 150,
    profilePic: "/api/placeholder/100/100",
    courses: [
        { id: 1, name: "Introduction to Programming", instructor: "Dr. Jane Smith" },
        { id: 2, name: "Data Structures", instructor: "Prof. Mike Johnson" },
        { id: 3, name: "Database Systems", instructor: "Dr. Emily Brown" },
    ]
};

// Populate student info
document.getElementById('studentName').textContent = student.name;
document.getElementById('rollNo').textContent = student.rollNo;
document.getElementById('department').textContent = student.department;
document.getElementById('course').textContent = student.course;
document.getElementById('uniqueId').textContent = student.uniqueId;
document.getElementById('tokens').textContent = student.tokens;
document.getElementById('profilePic').src = student.profilePic;

// Generate course cards
const coursesList = document.getElementById('coursesList');

student.courses.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.className = 'card course-card';
    courseCard.innerHTML = `
        <div class="course-header">
            <h3>${course.name}</h3>
            <span class="chevron">▼</span>
        </div>
        <div class="course-content">
            <div class="course-content-inner">
                <p>Instructor: ${course.instructor}</p>
                <form class="review-form">
                    ${['Overall Course Rating', 'Course Content Quality', 'Instructor\'s Delivery', 'Student Engagement', 'Course Difficulty']
                        .map(question => `
                            <div class="review-question">
                                <label>${question}</label>
                                <div class="star-rating" data-rating="0">
                                    ${Array(5).fill('<span class="star">☆</span>').join('')}
                                </div>
                            </div>
                        `).join('')}
                    <div class="review-question">
                        <label>Additional Comments</label>
                        <textarea rows="4"></textarea>
                    </div>
                    <button type="submit">Submit Review</button>
                </form>
            </div>
        </div>
    `;
    coursesList.appendChild(courseCard);

    // Toggle course content
    const header = courseCard.querySelector('.course-header');
    const content = courseCard.querySelector('.course-content');
    const chevron = courseCard.querySelector('.chevron');

    header.addEventListener('click', () => {
        content.classList.toggle('expanded');
        chevron.textContent = content.classList.contains('expanded') ? '▲' : '▼';
    });

    // Handle star ratings
    const starContainers = courseCard.querySelectorAll('.star-rating');
    starContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                container.dataset.rating = index + 1;
                updateStars(container);
            });
            star.addEventListener('mouseover', () => {
                highlightStars(container, index);
            });
            star.addEventListener('mouseout', () => {
                updateStars(container);
            });
        });
    });

    function updateStars(container) {
        const rating = parseInt(container.dataset.rating);
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.textContent = index < rating ? '★' : '☆';
        });
    }

    function highlightStars(container, hoveredIndex) {
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.textContent = index <= hoveredIndex ? '★' : '☆';
        });
    }

    // Handle form submission
    const form = courseCard.querySelector('.review-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const ratings = Array.from(form.querySelectorAll('.star-rating')).map(container => ({
            question: container.previousElementSibling.textContent,
            rating: parseInt(container.dataset.rating)
        }));
        const comment = form.querySelector('textarea').value;
        console.log(`Submitted review for course ${course.id}:`, ratings, `Comment: ${comment}`);
        // Here you would typically send this data to your backend
    });
});