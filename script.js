    // Sample initial tasks
        const initialTasks = [
            { id: 1, title: 'Complete project proposal', completed: false, priority: 'high', dueDate: '2023-06-15', tags: ['Work'] },
            { id: 2, title: 'Buy groceries for the week', completed: false, priority: 'medium', dueDate: '2023-06-12', tags: ['Personal'] },
            { id: 3, title: 'Schedule team meeting', completed: true, priority: 'low', dueDate: '2023-06-10', tags: ['Work'] },
            { id: 4, title: 'Gym workout', completed: false, priority: 'medium', dueDate: '2023-06-11', tags: ['Health'] },
            { id: 5, title: 'Read React documentation', completed: false, priority: 'high', dueDate: '2023-06-20', tags: ['Learning'] }
        ];

        // DOM Elements
        const themeToggle = document.getElementById('theme-toggle');
        const addTaskBtn = document.getElementById('add-task-btn');
        const addTaskForm = document.getElementById('add-task-form');
        const taskForm = document.getElementById('task-form');
        const cancelTaskBtn = document.getElementById('cancel-task-btn');
        const taskList = document.getElementById('task-list');
        const onboarding = document.getElementById('onboarding');
        const skipOnboardingBtn = document.getElementById('skip-onboarding');
        const nextOnboardingBtn = document.getElementById('next-onboarding');
        const onboardingTitle = document.getElementById('onboarding-title');
        const onboardingDescription = document.getElementById('onboarding-description');
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const contentTitle = document.getElementById('content-title');

        // State
        let tasks = [];
        let currentFilter = 'all';
        let searchQuery = '';
        let sortBy = 'newest';
        let onboardingStep = 1;

        // Initialize the app
        function init() {
            loadTasks();
            renderTasks();
            setupEventListeners();
            checkFirstVisit();
            updateTaskCounts();
        }

        // Load tasks from localStorage or use initial tasks
        function loadTasks() {
            const savedTasks = JSON.parse(localStorage.getItem('tasks'));
            if (savedTasks && savedTasks.length > 0) {
                tasks = savedTasks;
            } else {
                tasks = initialTasks;
            }
        }

        // Save tasks to localStorage
        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            updateTaskCounts();
        }

        // Update task counts in the sidebar
        function updateTaskCounts() {
            const allCount = tasks.length;
            const activeCount = tasks.filter(task => !task.completed).length;
            const completedCount = tasks.filter(task => task.completed).length;
            
            const today = new Date().toISOString().split('T')[0];
            const todayCount = tasks.filter(task => task.dueDate === today && !task.completed).length;
            
            const highCount = tasks.filter(task => task.priority === 'high' && !task.completed).length;
            
            document.getElementById('all-count').textContent = allCount;
            document.getElementById('active-count').textContent = activeCount;
            document.getElementById('completed-count').textContent = completedCount;
            document.getElementById('today-count').textContent = todayCount;
            document.getElementById('high-count').textContent = highCount;
        }

        // Setup event listeners
        function setupEventListeners() {
            // Theme toggle
            themeToggle.addEventListener('change', toggleTheme);
            
            // Add task button
            addTaskBtn.addEventListener('click', () => {
                addTaskForm.style.display = 'block';
                addTaskBtn.style.display = 'none';
            });
            
            // Cancel task button
            cancelTaskBtn.addEventListener('click', () => {
                addTaskForm.style.display = 'none';
                addTaskBtn.style.display = 'flex';
                taskForm.reset();
            });
            
            // Task form submission
            taskForm.addEventListener('submit', handleTaskSubmit);
            
            // Sidebar filters
            sidebarItems.forEach(item => {
                item.addEventListener('click', () => {
                    const filter = item.dataset.filter;
                    const tag = item.dataset.tag;
                    
                    if (filter) {
                        setFilter(filter);
                    } else if (tag) {
                        setTagFilter(tag);
                    }
                });
            });
            
            // Search input
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase();
                renderTasks();
            });
            
            // Sort select
            sortSelect.addEventListener('change', (e) => {
                sortBy = e.target.value;
                renderTasks();
            });
            
            // Onboarding buttons
            skipOnboardingBtn.addEventListener('click', completeOnboarding);
            nextOnboardingBtn.addEventListener('click', nextOnboardingStep);
        }

        // Toggle theme
        function toggleTheme() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        }

        // Set active filter
        function setFilter(filter) {
            currentFilter = filter;
            
            // Update active class in sidebar
            sidebarItems.forEach(item => {
                if (item.dataset.filter === filter) {
                    item.classList.add('active');
                } else if (item.dataset.filter) {
                    item.classList.remove('active');
                }
            });
            
            // Update content title
            contentTitle.textContent = 
                filter === 'all' ? 'All Tasks' :
                filter === 'active' ? 'Active Tasks' :
                filter === 'completed' ? 'Completed Tasks' :
                filter === 'today' ? "Today's Tasks" :
                filter === 'high' ? 'High Priority Tasks' : 'All Tasks';
            
            renderTasks();
        }

        // Set tag filter
        function setTagFilter(tag) {
            currentFilter = 'tag';
            searchQuery = tag.toLowerCase();
            renderTasks();
            
            // Update content title
            contentTitle.textContent = `${tag} Tasks`;
        }

        // Handle task form submission
        function handleTaskSubmit(e) {
            e.preventDefault();
            
            const titleInput = document.getElementById('task-title');
            const prioritySelect = document.getElementById('task-priority');
            const dueDateInput = document.getElementById('task-dueDate');
            const tagsSelect = document.getElementById('task-tags');
            
            const newTask = {
                id: Date.now(),
                title: titleInput.value,
                completed: false,
                priority: prioritySelect.value,
                dueDate: dueDateInput.value,
                tags: tagsSelect.value ? [tagsSelect.value] : []
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            
            // Reset form and hide it
            taskForm.reset();
            addTaskForm.style.display = 'none';
            addTaskBtn.style.display = 'flex';
        }

        // Toggle task completion
        function toggleTaskCompletion(id) {
            tasks = tasks.map(task => 
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            saveTasks();
            renderTasks();
        }

        // Delete task
        function deleteTask(id) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }

        // Render tasks based on current filter and search
        function renderTasks() {
            // Filter tasks
            let filteredTasks = tasks.filter(task => {
                const matchesFilter = 
                    currentFilter === 'all' || 
                    (currentFilter === 'active' && !task.completed) ||
                    (currentFilter === 'completed' && task.completed) ||
                    (currentFilter === 'high' && task.priority === 'high') ||
                    (currentFilter === 'today' && isToday(task.dueDate)) ||
                    (currentFilter === 'tag' && task.tags.some(tag => 
                        tag.toLowerCase().includes(searchQuery)));
                
                const matchesSearch = task.title.toLowerCase().includes(searchQuery);
                
                return matchesFilter && matchesSearch;
            });
            
            // Sort tasks
            filteredTasks.sort((a, b) => {
                if (sortBy === 'newest') return b.id - a.id;
                if (sortBy === 'oldest') return a.id - b.id;
                if (sortBy === 'dueDate') {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                }
                if (sortBy === 'priority') {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                return 0;
            });
            
            // Clear task list
            taskList.innerHTML = '';
            
            // Render tasks or empty state
            if (filteredTasks.length > 0) {
                filteredTasks.forEach(task => {
                    const taskElement = createTaskElement(task);
                    taskList.appendChild(taskElement);
                });
            } else {
                taskList.innerHTML = createEmptyState();
            }
        }

        // Create task element
        function createTaskElement(task) {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const priorityClass = `task-tag priority-${task.priority}`;
            
            taskItem.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}">
                    <i class="fas fa-check"></i>
                </div>
                
                <div class="task-content">
                    <h3 class="task-title">${task.title}</h3>
                    <div class="task-meta">
                        ${task.dueDate ? `
                            <div class="task-tag">
                                <i class="far fa-calendar"></i>
                                <span>${formatDate(task.dueDate)}</span>
                            </div>
                        ` : ''}
                        <div class="${priorityClass}">
                            <span class="tag-dot"></span>
                            <span>${task.priority}</span>
                        </div>
                        ${task.tags.length > 0 ? `
                            <div class="task-tag">
                                <i class="fas fa-tag"></i>
                                <span>${task.tags[0]}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="btn btn-icon">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon" data-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add event listeners
            taskItem.querySelector('.task-checkbox').addEventListener('click', () => {
                toggleTaskCompletion(task.id);
            });
            
            taskItem.querySelector('.btn-icon[data-id]').addEventListener('click', () => {
                deleteTask(task.id);
            });
            
            return taskItem;
        }

        // Create empty state
        function createEmptyState() {
            const messages = {
                all: "You don't have any tasks yet. Add your first task to get started!",
                active: "You don't have any active tasks. Enjoy your free time!",
                completed: "You haven't completed any tasks yet.",
                high: "No high priority tasks. Great job!",
                today: "No tasks due today. Enjoy your day!",
                tag: `No tasks found with the tag "${searchQuery}"`
            };
            
            return `
                <div class="empty-state">
                    <i class="far fa-smile"></i>
                    <h3>Nothing to do!</h3>
                    <p>${messages[currentFilter] || 'No tasks match your criteria'}</p>
                    ${currentFilter === 'all' ? `
                        <button class="btn btn-primary" id="empty-add-task" style="margin-top: 20px;">
                            <i class="fas fa-plus"></i>
                            Add Your First Task
                        </button>
                    ` : ''}
                </div>
            `;
        }

        // Check if it's user's first visit
        function checkFirstVisit() {
            const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
            if (!hasSeenOnboarding) {
                onboarding.style.display = 'flex';
            }
        }

        // Complete onboarding
        function completeOnboarding() {
            onboarding.style.display = 'none';
            localStorage.setItem('hasSeenOnboarding', 'true');
        }

        // Next onboarding step
        function nextOnboardingStep() {
            onboardingStep++;
            
            if (onboardingStep > 4) {
                completeOnboarding();
                return;
            }
            
            // Update onboarding dots
            document.querySelectorAll('.onboarding-dot').forEach(dot => {
                if (parseInt(dot.dataset.step) === onboardingStep) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // Update content based on step
            switch (onboardingStep) {
                case 2:
                    onboardingTitle.textContent = "Add and Organize Tasks";
                    onboardingDescription.textContent = "Create tasks, set due dates, priorities, and tags to keep everything organized.";
                    break;
                case 3:
                    onboardingTitle.textContent = "Filter and Search";
                    onboardingDescription.textContent = "Easily find what you're looking for with filters and search functionality.";
                    break;
                case 4:
                    onboardingTitle.textContent = "Dark Mode";
                    onboardingDescription.textContent = "Switch between light and dark mode based on your preference or time of day.";
                    nextOnboardingBtn.textContent = "Get Started";
                    break;
            }
        }

        // Check if a date is today
        function isToday(dateString) {
            if (!dateString) return false;
            const today = new Date().toISOString().split('T')[0];
            return dateString === today;
        }

        // Format date for display
        function formatDate(dateString) {
            if (!dateString) return '';
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }

        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);

        // Apply saved theme if exists
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeToggle.checked = savedTheme === 'dark';
        }