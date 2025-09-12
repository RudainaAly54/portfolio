//Buttons 


const viewWorkBtn = document.querySelector('#Workbutton');
const contactBtn = document.querySelectorAll('.contact');
const githubBtn =  document.querySelector('#githubButton');

// Mobile Menu Elements
const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
const mobileMenu = document.querySelector('#mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

//Sections 
const contactSection = document.querySelector('#contact');
const projectsSection = document.querySelector("#projects")

contactBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        contactSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

viewWorkBtn.addEventListener('click', () =>{
    projectsSection.scrollIntoView({
        behavior:'smooth'
    });
});

if (githubBtn) {
    githubBtn.addEventListener('click', () =>{
        window.open('https://github.com/RudainaAly54?tab=repositories');
    });
}

// Mobile Menu Functionality
let isMobileMenuOpen = false;

function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    
    if (isMobileMenuOpen) {
        mobileMenu.classList.remove('-translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        // Animate hamburger to X
        mobileMenuBtn.classList.add('hamburger-active');
    } else {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('-translate-x-full');
        // Animate X back to hamburger
        mobileMenuBtn.classList.remove('hamburger-active');
    }
}

function closeMobileMenu() {
    if (isMobileMenuOpen) {
        isMobileMenuOpen = false;
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('-translate-x-full');
        mobileMenuBtn.classList.remove('hamburger-active');
    }
}

// Event Listeners
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Close menu when clicking on nav links
mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close menu when clicking close button
const mobileMenuClose = document.querySelector('#mobile-menu-close');
if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (isMobileMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
    }
});

// Project Showcase Rendering and Filtering
const PROJECT_CONTAINER_ID = 'project-container';
const FILTER_BTN_CLASS = 'filter-btn';

// Color rules
const SPECIAL_BG = {
	BinWise: 'rgba(2,15,15,1)', // green custom
	'E-Commerce': 'rgba(25,5,5,1)', // orange custom
};
const CYCLING_COLORS = [
	'rgba(4,17,25,1)',
	'rgba(16,5,28,1)',
	'rgba(25,8,25,1)',
	'rgba(3,16,19,1)'
];

// Gradients aligned to the card themes (index corresponds to CYCLING_COLORS)
const CYCLING_TITLE_GRADIENTS = [
	'linear-gradient(90deg, #2584ff, #15a9ef)', // for rgba(4,17,25,1)
	'linear-gradient(90deg, #582380, #a73dba)', // for rgba(167,61,186,255)
	'linear-gradient(90deg, #735bff, #a34aff)', // for rgba(16,5,28,1)
	'linear-gradient(90deg, #00bab1, #0fb1bc)'  // for rgba(3,15,19,1)
];

function getTitleGradientByTheme(title, index) {
	if (title.includes('BinWise')) return 'linear-gradient(90deg, #00c2a8, #00e0cf)';
	if (title.includes('E-Commerce')) return 'linear-gradient(90deg, #ff7a1a, #ff6100)';
	return CYCLING_TITLE_GRADIENTS[index % CYCLING_TITLE_GRADIENTS.length];
}

let allProjects = [];
let activeFilter = 'All';

function resolveImagePath(basePath) {
	// Try .png first, then .jpg; browser will attempt fallback via onerror
	return `${basePath}.png`;
}

function getBackgroundColor(title, index) {
	if (title.includes('BinWise')) return SPECIAL_BG['BinWise'];
	if (title.includes('E-Commerce')) return SPECIAL_BG['E-Commerce'];
	const color = CYCLING_COLORS[index % CYCLING_COLORS.length];
	return color;
}

function createTechTag(tag) {
	return `<span class="text-xs rounded-full bg-[rgba(30,41,57,255)] text-white px-2 py-1 border-1 border-solid border-[#344454]">${tag}</span>`;
}

function linkOrPlaceholder(url, label, placeholder) {
	if (url) {
		return `<a href="${url}" target="_blank" rel="noopener" class="underline text-gray hover:text-white no-underline">
        ${label}</a>`;
	}
	return `<span class="text-gray-400">${placeholder}</span>`;
}

function createIconButton(url, title, svgPath) {
	if (!url) return '';
	return `
		<a href="${url}" target="_blank" rel="noopener" class="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center transition" title="${title}">
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				${svgPath}
			</svg>
		</a>
	`;
}

const GITHUB_SVG = '<path d="M12 2C6.477 2 2 6.486 2 12.012c0 4.424 2.865 8.176 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.865-.014-1.698-2.782.605-3.369-1.341-3.369-1.341-.455-1.159-1.111-1.468-1.111-1.468-.908-.62.069-.608.069-.608 1.003.071 1.53 1.03 1.53 1.03.892 1.529 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.339-2.221-.253-4.556-1.114-4.556-4.958 0-1.095.39-1.991 1.03-2.693-.104-.253-.447-1.27.098-2.646 0 0 .84-.27 2.75 1.029A9.563 9.563 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.908-1.3 2.747-1.029 2.747-1.029.546 1.376.203 2.393.1 2.646.64.702 1.028 1.598 1.028 2.693 0 3.853-2.339 4.702-4.566 4.951.359.309.679.918.679 1.851 0 1.335-.012 2.411-.012 2.739 0 .268.18.58.688.481A10.01 10.01 0 0 0 22 12.012C22 6.486 17.523 2 12 2Z" fill="#ffffff"/>';
const EXTERNAL_SVG = '<path d="M14 3h7v7h-2V6.414l-8.293 8.293-1.414-1.414L17.586 5H14V3Z" fill="#ffffff"/><path d="M5 5h7v2H7v10h10v-5h2v7H5V5Z" fill="#ffffff"/>';

function createCard(project, indexForColor) {
	const bg = getBackgroundColor(project.title, indexForColor);
	const imgSrc = resolveImagePath(project.img);
	const techTags = (project.tech || []).map(createTechTag).join(' ');
	const github = linkOrPlaceholder(project.github, 'GitHub', 'Private', GITHUB_SVG);
	const live = linkOrPlaceholder(project.live, 'Live Demo', 'No Demo', EXTERNAL_SVG);
	const titleGradient = getTitleGradientByTheme(project.title, indexForColor);
	// const fieldPill = getFieldPillClasses(project.field);

	const overlay = `
		<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
			${createIconButton(project.live, 'Live Demo', EXTERNAL_SVG)}
			${createIconButton(project.github, 'Source Code', GITHUB_SVG)}
		</div>
	`;

	return `
		<div class="rounded-2xl shadow-lg p-5 transform transition-transform duration-300 hover:scale-105 border border-[#111] group" style="background-color:${bg}">
			<div class="relative overflow-hidden rounded-xl mb-4">
				<img src="${imgSrc}" alt="${project.title}" class="w-full h-40 object-cover" onerror="if(!this.dataset.fallback){this.dataset.fallback='jpg';this.src='${project.img}.jpg';}else if(this.dataset.fallback==='jpg'){this.dataset.fallback='jpeg';this.src='${project.img}.jpeg';}">
				${overlay}
			</div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="font-bold text-xl bg-clip-text text-transparent" style="background-image:${titleGradient}">${project.title}</h3>
				<span class="text-xs px-3 py-1 rounded-full text-white" style="background-image:${titleGradient};">${project.field}</span>
			</div>
			<p class="text-white/80 text-sm mb-3">${project.description}</p>
			<div class="flex flex-wrap gap-2 mb-4">${techTags}</div>
			<div class="flex items-center gap-4 ">${live} • ${github}</div>
		</div>
	`;
}

function chunkForLayout(projects) {
	// First row up to 2, second row up to 3, remaining in groups of 3
	const first = projects.slice(0, 2);
	const second = projects.slice(2, 5);
	const rest = projects.slice(5);
	return { first, second, rest };
}

function render(projects) {
	const container = document.getElementById(PROJECT_CONTAINER_ID);
	if (!container) return;

	const { first, second, rest } = chunkForLayout(projects);

	let colorIndex = 0;
	const row1 = `
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			${first.map((p) => createCard(p, colorIndex++)).join('')}
		</div>`;
	const row2 = `
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			${second.map((p) => createCard(p, colorIndex++)).join('')}
		</div>`;
	let rowRest = '';
	if (rest.length) {
		rowRest = `
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				${rest.map((p) => createCard(p, colorIndex++)).join('')}
			</div>`;
	}
	container.innerHTML = `${row1}${row2}${rowRest}`;
}

function applyFilter(filterValue) {
	activeFilter = filterValue;
	const filtered = activeFilter === 'All' ? allProjects : allProjects.filter(p => p.field === activeFilter);
	render(filtered);
	updateActiveButton();
}

function updateActiveButton() {
	const buttons = document.querySelectorAll(`.${FILTER_BTN_CLASS}`);
	buttons.forEach(btn => {
		const isActive = btn.dataset.filter === activeFilter;
		btn.classList.toggle('bg-gradient-to-r from-[#4277ff] via-[#735aff] to-[#9227fb]', isActive);
		btn.classList.toggle('text-white', isActive);
	});
}

async function init() {
	try {
		const res = await fetch('projects.json');
		const data = await res.json();
		allProjects = Array.isArray(data.projects) ? data.projects : [];
		applyFilter('All');
	} catch (e) {
		console.error('Failed to load projects.json', e);
	}

	// Filters
	document.querySelectorAll(`.${FILTER_BTN_CLASS}`).forEach(btn => {
		btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
	});

	// Smooth scroll from hero button if exists
	const goWork = document.getElementById('Workbutton');
	if (goWork) {
		goWork.addEventListener('click', () => {
			document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
		});
	}
}

init();


// Scroll animations
function setupScrollAnimations() {
const observerOptions = {
threshold: 0.1,
rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add("animate-fade-in-up");
entry.target.classList.remove("opacity-0", "translate-y-8");
}
});
}, observerOptions);

// Observe sections
const sections = document.querySelectorAll("section");
sections.forEach(section => {
section.classList.add("opacity-0", "translate-y-8", "transition-all", "duration-700");
observer.observe(section);
});

// Observe project cards
const projectCards = document.querySelectorAll("#project-container > div > div");
projectCards.forEach((card, index) => {
card.classList.add("opacity-0", "translate-y-8", "transition-all", "duration-700");
card.style.transitionDelay = `${index * 100}ms`;
observer.observe(card);
});

// Observe skill cards
const skillCards = document.querySelectorAll("#skills .grid > div");
skillCards.forEach((card, index) => {
card.classList.add("opacity-0", "translate-y-8", "transition-all", "duration-700");
card.style.transitionDelay = `${index * 100}ms`;
observer.observe(card);
});
}

// Add CSS for animations
function addAnimationStyles() {
const style = document.createElement("style");
style.textContent = `
.animate-fade-in-up {
animation: fadeInUp 0.7s ease-out forwards;
}

@keyframes fadeInUp {
from {
opacity: 0;
transform: translateY(30px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
`;
document.head.appendChild(style);
}

// Initialize animations after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
addAnimationStyles();
setupScrollAnimations();
});
