document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Set initial theme to dark
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fas fa-sun';

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        localStorage.setItem('theme', newTheme);
    });

    // Handle image loading animations
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        if(img.complete) {
            img.classList.add('loaded');
        }
    });

    // Add intersection observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((element) => {
        observer.observe(element);
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navArea = document.querySelector('.nav-area');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navArea.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-area li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navArea.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navArea.contains(e.target)) {
            hamburger.classList.remove('active');
            navArea.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Progress indicator and scroll to top
    const progressPath = document.querySelector('.progress-wrap path');
    const pathLength = progressPath.getTotalLength();
    
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

    const updateProgress = () => {
        const scroll = window.pageYOffset;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = pathLength - (scroll * pathLength / height);
        progressPath.style.strokeDashoffset = progress;
    }

    const offset = 50;
    const progressWrap = document.querySelector('.progress-wrap');

    const scrollListener = () => {
        updateProgress();
        
        if (window.pageYOffset > offset) {
            progressWrap.classList.add('active-progress');
        } else {
            progressWrap.classList.remove('active-progress');
        }
    }

    window.addEventListener('scroll', scrollListener);

    progressWrap.addEventListener('click', (event) => {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add active state to navigation links
    function setActiveNavLink() {
        const currentLocation = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-area li a');
        const hash = window.location.hash;

        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // For homepage sections
            if (currentLocation === '/' && hash) {
                if (link.getAttribute('href') === hash) {
                    link.classList.add('active');
                }
            }
            // For other pages
            else if (link.getAttribute('href') === currentLocation) {
                link.classList.add('active');
            }
            // For homepage when no hash
            else if (currentLocation === '/' && link.getAttribute('href') === '/') {
                link.classList.add('active');
            }
        });
    }

    // Set active link on page load
    setActiveNavLink();

    // Update active link on hash change
    window.addEventListener('hashchange', setActiveNavLink);

    // Update active link when clicking navigation links
    document.querySelectorAll('.nav-area li a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.nav-area li a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Function to check which section is in viewport
    function setActiveNavOnScroll() {
        const sections = document.querySelectorAll('section, #home, #features, #commands, #faq');
        const navLinks = document.querySelectorAll('.nav-area li a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight/3)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            } else if (currentSection === '' && link.getAttribute('href') === '/') {
                link.classList.add('active');
            }
        });
    }

    // Add scroll event listener for active nav updates
    window.addEventListener('scroll', () => {
        setActiveNavOnScroll();
    });

    // Update active state on page load
    setActiveNavOnScroll();

    // Smooth scroll to sections when clicking nav links
    document.querySelectorAll('.nav-area a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

$(document).ready(function () {
    $(".open").click(function () {
      var container = $(this).parents(".topic");
      var answer = container.find(".answer");
      var trigger = container.find(".faq-t");
  
      answer.slideToggle(200);
  
      if (trigger.hasClass("faq-o")) {
        trigger.removeClass("faq-o");
      } else {
        trigger.addClass("faq-o");
      }
  
      if (container.hasClass("expanded")) {
        container.removeClass("expanded");
      } else {
        container.addClass("expanded");
      }
    });
    $(".question").each(function () {
      $(this).attr(
        "data-search-term",
        $(this).text().toLowerCase() + $(this).find("ptag").text().toLowerCase()
      );
    });
  
    $(".live-search-box").on("keyup", function () {
      var searchTerm = $(this).val().toLowerCase();
  
      $(".question").each(function () {
        if (
          $(this).filter("[data-search-term *= " + searchTerm + "]").length > 0 ||
          searchTerm.length < 1
        ) {
          $(this).parent().parent().show();
        } else {
          $(this).parent().parent().hide();
        }
      });
    });
  });
  window.addEventListener("scroll", reveal);
  
  function reveal() {
    var reveals = document.querySelectorAll(".reveal");
  
    for (var i = 0; i < reveals.length; i++) {
      var windowheight = window.innerHeight;
      var revealtop = reveals[i].getBoundingClientRect().top;
      var revealpoint = 150;
  
      if (revealtop < windowheight - revealpoint) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }
