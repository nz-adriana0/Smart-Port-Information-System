/**
 * Smart Port Information System - Multi-Page Logic
 * Handles active navigation states and page-specific interactions.
 */

    document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Automatic Active Link Highlighting (CORRECTED) ---
    // Get the current page filename (e.g., "vessel-history.html")
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    
    // Select all links in the nav
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        // Get the href of the link (e.g., "vessel-history.html")
        const linkHref = link.getAttribute('href');

        // Check if this link matches the current page
        if (linkHref === currentPath) {
            
            // 1. Highlight the specific sub-link (e.g., Vessel History)
            link.classList.add('active');

            // 2. Highlight the Parent Dropdown (e.g., Data & Report)
            // Find the closest parent list item with class 'dropdown'
            const parentDropdown = link.closest('.dropdown');
            
            if (parentDropdown) {
                // Find the main link inside that dropdown and make it active
                const parentLink = parentDropdown.querySelector('a'); 
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    });

    // ... Keep the rest of your code (Section 2, 3, 4, etc.) below this ...

 // --- 2. Vessel History Search Filter ---
const historyVesselInput = document.getElementById('historyVesselInput');
if (historyVesselInput) {
    historyVesselInput.addEventListener('keyup', function () {
        const val = this.value.toLowerCase();
        // Target the rows in your history table (assuming it has a <tbody>)
        const rows = document.querySelectorAll('table tbody tr');

        rows.forEach(row => {
            // This checks the entire row text for the search value
            const text = row.textContent.toLowerCase();
            if (text.includes(val)) {
                row.style.display = ""; // Show row
            } else {
                row.style.display = "none"; // Hide row
            }
        });
    });
}

    // --- 3. Contact Form Submission ---
    // Handles the form on contact.html
    const contactForm = document.getElementById('portContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your inquiry. Our port authority will contact you shortly.');
            contactForm.reset();
        });
    }

    // --- 4. Global Search Logic ---
    // Remains active across all pages with the header search bar
    const globalSearchBtn = document.querySelector('.search-container button');
    if (globalSearchBtn) {
        globalSearchBtn.addEventListener('click', () => {
            const searchInput = document.querySelector('.search-container input');
            const query = searchInput ? searchInput.value : "";
            if (query) alert('Searching system for: ' + query);
        });
    }
});

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // Reset all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Activate the requested slide
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Initialize Auto-slide (5000ms = 5 seconds)
setInterval(nextSlide, 5000);


// 1. Data Kapal (Simulasi MOCK_VESSELS)
const vessels = [
    { id: 1, name: "Ocean Voyager", status: "Berthed", eta: "14:00 +0h", berth: "Terminal A - Berth 1", priority: "full" },
    { id: 2, name: "Blue Whale", status: "Arriving", eta: "15:30 +1h", berth: "Terminal A - Berth 2", priority: "half" },
    { id: 3, name: "North Star", status: "Scheduled", eta: "16:45 +2h", berth: "Terminal B - Berth 5", priority: "half" },
    { id: 4, name: "Ever Given", status: "Berthed", eta: "08:00 +0h", berth: "Terminal C - Berth 3", priority: "full" },
    { id: 5, name: "Sea Pearl", status: "Departing", eta: "10:15 -1h", berth: "Terminal B - Berth 1", priority: "half" }
];

// 2. Fungsi untuk Paparkan Jadual
// 2. Modified Function to prevent overlapping other tables
function renderTable(data) {
    // Only target the specific table on the Traffic Allocation page
    const tbody = document.getElementById("traffic-schedule-body");

    // If the ID doesn't exist on the current page, the script does nothing
    if (!tbody) return;

    tbody.innerHTML = data.map(v => `
        <tr>
            <td><strong>${v.name}</strong></td>
            <td><span class="status-badge ${v.status.toLowerCase()}">${v.status}</span></td>
            <td>${v.eta}</td>
            <td>${v.berth}</td>
            <td>
                <div class="priority-bg">
                    <div class="priority-fill ${v.priority}"></div>
                </div>
            </td>
        </tr>
    `).join("");
}

// 3. Fungsi untuk Kira Statistik
function updateStats() {
    const total = vessels.length;
    const arriving = vessels.filter(v => v.status === "Arriving").length;
    const departing = vessels.filter(v => v.status === "Departing").length;
    const berthed = vessels.filter(v => v.status === "Berthed").length;

    // Update nilai di UI jika ID wujud
    if (document.querySelector("stat-total")) document.querySelector("stat-total").innerText = total;
    if (document.querySelector("stat-arriving")) document.querySelector("stat-arriving").innerText = arriving;
    if (document.querySelector("stat-departing")) document.querySelector("stat-departing").innerText = departing;
    if (document.querySelector("stat-berthed")) document.querySelector("stat-berthed").innerText = berthed;
}

// 4. Fungsi Carian (Global Search)
function setupSearch() {
    const searchInput = document.querySelector(".search-container input");
    const searchBtn = document.querySelector(".search-container button");

    const filterData = () => {
        const query = searchInput.value.toLowerCase();
        const filtered = vessels.filter(v =>
            v.name.toLowerCase().includes(query) ||
            v.status.toLowerCase().includes(query) ||
            v.berth.toLowerCase().includes(query)
        );
        renderTable(filtered);
    };

    if (searchInput) {
        searchInput.addEventListener("keyup", filterData);
        searchBtn.addEventListener("click", filterData);
    }
}

// 5. Dropdown Menu Logic (Untuk Mobile/Click)
function setupDropdowns() {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function (e) {
            // Jika screen kecil, toggle class active
            if (window.innerWidth < 768) {
                this.querySelector(".dropdown-menu").classList.toggle("show");
            }
        });
    });
}

// Jalankan semua fungsi apabila page siap di-load
document.addEventListener("DOMContentLoaded", () => {
    renderTable(vessels);
    updateStats();
    setupSearch();
    setupDropdowns();
});


document.addEventListener("DOMContentLoaded", () => {
    const pageVesselSearchBtn = document.getElementById("pageVesselSearchBtn");
    const pageVesselInput = document.getElementById("pageVesselInput");

    // Elemen Paparan
    const etaDisplay = document.getElementById("etaDisplay");
    const departBar = document.getElementById("departProgress");
    const arrivalBar = document.getElementById("arrivalProgress");
    const departText = document.getElementById("departPercent");
    const arrivalText = document.getElementById("arrivalPercent");

    function performSearch() {
        const value = pageVesselInput.value.trim();

        if (value === "") {
            alert("Please enter a vessel number!");
            return;
        }

        // 1. Simulasikan Loading (Tukar teks ETA)
        etaDisplay.innerText = "CALCULATING...";

        // Reset progress bar sebelum mula animasi baru
        departBar.style.width = "0%";
        arrivalBar.style.width = "0%";

        // 2. Gunakan setTimeout untuk nampak macam sistem sedang 'berfikir'
        setTimeout(() => {
            // Set data simulasi
            etaDisplay.innerText = "14:45 GMT +8";

            // Animasi Progress Bars
            departBar.style.width = "85%";
            arrivalBar.style.width = "15%";

            // Kemaskini teks peratus
            departText.innerText = "85% Complete";
            arrivalText.innerText = "15% Local Progress";
        }, 800);
    }

    // Trigger bila klik butang
    if (pageVesselSearchBtn) {
        pageVesselSearchBtn.addEventListener("click", performSearch);
    }

    // Trigger bila tekan 'Enter' pada keyboard
    pageVesselInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            performSearch();
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const btnDownload = document.getElementById("btnGenerateReport");
    const progressContainer = document.getElementById("download-progress-container");
    const progressBar = document.getElementById("download-bar");
    const statusText = document.getElementById("download-status-text");

    // Inputs
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const fileFormat = document.getElementById("fileFormat");

    if (btnDownload) {
        btnDownload.addEventListener("click", () => {
            // Basic Validation
            if (!startDate.value || !endDate.value) {
                alert("Please select a valid date range first.");
                return;
            }

            // Show progress and disable UI
            progressContainer.style.display = "block";
            btnDownload.disabled = true;
            btnDownload.style.opacity = "0.6";
            btnDownload.innerText = "PREPARING FILES...";

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 20) + 5;

                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);

                    statusText.innerText = "Generation Complete: 100%";
                    progressBar.style.width = "100%";

                    setTimeout(() => {
                        const formatLabel = fileFormat.options[fileFormat.selectedIndex].text;
                        alert(`Success!\nReport Period: ${startDate.value} to ${endDate.value}\nFormat: ${formatLabel}\n\nYour download will start shortly.`);

                        // Reset UI
                        progressContainer.style.display = "none";
                        progressBar.style.width = "0%";
                        btnDownload.disabled = false;
                        btnDownload.style.opacity = "1";
                        btnDownload.innerText = "GENERATE & DOWNLOAD";
                    }, 600);
                } else {
                    statusText.innerText = `Compiling Data: ${progress}%`;
                    progressBar.style.width = `${progress}%`;
                }
            }, 350);
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const vesselSearchInput = document.getElementById('vesselSearch');

    if (vesselSearchInput) {
        vesselSearchInput.addEventListener('keyup', function () {
            const filterValue = this.value.toLowerCase();
            const rows = document.querySelectorAll('#vesselResultsTable tbody tr');

            rows.forEach(row => {
                // row.cells[0] targets the first column (Vessel Name)
                const vesselName = row.cells[0].textContent.toLowerCase();

                if (vesselName.includes(filterValue)) {
                    row.style.display = ''; // Show row
                } else {
                    row.style.display = 'none'; // Hide row
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- Global Search Logic (Header) ---
    const globalSearchInput = document.getElementById('globalSearchInput');
    const globalSearchBtn = document.getElementById('globalSearchBtn');

    if (globalSearchBtn && globalSearchInput) {
        const handleGlobalSearch = () => {
            const query = globalSearchInput.value.toLowerCase().trim();
            if (!query) return;

            // 1. Check for page keywords
            const pageMap = {
                // Existing keywords
                'contact': 'contact.html',
                'email': 'contact.html',
                'about': 'about.html',
                'news': 'news.html',
                'traffic': 'traffic.html',

                // Your new keywords
                'home': 'index.html',
                'report': 'download.html',
                'berth': 'berth-availability.html',
                'history': 'vessel-history.html',
                'traffic data': 'port-traffic.html'
            };

            if (pageMap[query]) {
                window.location.href = pageMap[query];
            } else {
                // 2. Otherwise, treat as a vessel search and redirect to that page
                localStorage.setItem('pendingVesselSearch', query);
                window.location.href = 'vessel-search.html';
            }
        };

        globalSearchBtn.addEventListener('click', handleGlobalSearch);
        globalSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleGlobalSearch();
        });
    }

    // --- Page-Specific Vessel Search Logic (vessel-search.html) ---
    const pageVesselInput = document.getElementById('pageVesselInput');
    const pageVesselSearchBtn = document.getElementById('pageVesselSearchBtn');

    if (pageVesselInput && pageVesselSearchBtn) {
        // Check if we arrived here from a Global Search redirect
        const pending = localStorage.getItem('pendingVesselSearch');
        if (pending) {
            pageVesselInput.value = pending;
            localStorage.removeItem('pendingVesselSearch');
            // You can trigger your search animation/logic here automatically
        }

        // Logic for the button on THIS page
        pageVesselSearchBtn.addEventListener('click', () => {
            // Your existing simulation logic (etaDisplay, progress bars, etc.)
            console.log("Searching on vessel-search page for:", pageVesselInput.value);
        });
    }
});

const newsData = {
    1: {
        title: "Phase 2 Port Expansion Project Officially Begins",
        date: "JAN 05, 2026",
        content: "The second phase of the Kuala Terengganu port expansion has officially begun. This phase includes deepening the north channel, upgrading berthing facilities, and improving cargo handling efficiency."
    },
    2: {
        title: "New Digital Tariff System Launched",
        date: "JAN 01, 2026",
        content: "The Smart Port Digital Tariff System is now active. All port users are required to register via the system to manage billing, invoices, and digital payments."
    },
    3: {
        title: "Monsoon Season Safety Protocol Active",
        date: "DEC 20, 2025",
        content: "Due to strong monsoon winds and high waves, Terminal 2 is operating under enhanced safety protocols. Vessel operators must maintain close coordination with port authorities."
    }
};

function openNews(id) {
    document.getElementById("detailTitle").textContent = newsData[id].title;
    document.getElementById("detailDate").textContent = newsData[id].date;
    document.getElementById("detailContent").textContent = newsData[id].content;

    document.querySelector(".card").style.display = "none"; // hide list
    document.getElementById("newsDetail").style.display = "block";
}

function closeNews() {
    document.querySelector(".card").style.display = "block"; // show list
    document.getElementById("newsDetail").style.display = "none";
}


    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav ul');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show'); // toggle nav open/close
    });

    
