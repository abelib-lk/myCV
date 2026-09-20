/* ==========================================================================
   Asanka B. Ekanayake — portfolio behaviour
   Content is rendered from mycv.json; mycv.json is the single source of truth.
   ========================================================================== */

(function () {
    'use strict';

    /* ----------------------------------------------------------------------
       Helpers
       ---------------------------------------------------------------------- */

    /** Escape values before they go into an innerHTML template. */
    function esc(value) {
        if (value === null || value === undefined) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /** Only allow http(s)/mailto/tel URLs into href attributes. */
    function safeUrl(value) {
        if (!value) return '';
        var url = String(value).trim();
        if (/^(https?:|mailto:|tel:)/i.test(url)) return esc(url);
        // Bare domains in the data (e.g. "www.credly.com/...") need a scheme.
        if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(url)) return esc('https://' + url);
        return '';
    }

    function byId(id) {
        return document.getElementById(id);
    }

    /* ----------------------------------------------------------------------
       Renderers
       ---------------------------------------------------------------------- */

    function renderHero(info) {
        if (!info) return;

        byId('hero-name').textContent = info.full_name || '';
        byId('hero-title').textContent = info.professional_title || '';
        byId('hero-tagline').textContent = info.tagline || '';

        var availability = byId('hero-availability-text');
        if (info.availability) {
            availability.textContent = info.availability;
        } else {
            availability.closest('.hero-availability').style.display = 'none';
        }

        var brandText = document.querySelector('.nav-brand-text');
        if (brandText && info.full_name) brandText.textContent = info.full_name;

        var channels = [
            { key: 'email', icon: 'fas fa-envelope', href: 'mailto:' + info.email, label: info.email },
            { key: 'phone', icon: 'fas fa-phone', href: 'tel:' + info.phone, label: info.phone },
            { key: 'location', icon: 'fas fa-location-dot', href: null, label: info.location },
            { key: 'linkedin', icon: 'fab fa-linkedin', href: info.linkedin, label: 'LinkedIn' },
            { key: 'github', icon: 'fab fa-github', href: info.github, label: 'GitHub' },
            { key: 'codepen', icon: 'fab fa-codepen', href: info.codepen, label: 'CodePen' },
            { key: 'credly', icon: 'fas fa-award', href: info.credly, label: 'Credly' }
        ];

        byId('hero-contact').innerHTML = channels
            .filter(function (c) { return info[c.key]; })
            .map(function (c) {
                var icon = '<i class="' + c.icon + '" aria-hidden="true"></i> ' + esc(c.label);
                var href = c.href ? safeUrl(c.href) : '';
                if (!href) return '<span class="contact-item">' + icon + '</span>';
                var external = /^https?:/i.test(href) ? ' target="_blank" rel="noopener"' : '';
                return '<a href="' + href + '" class="contact-item"' + external + '>' + icon + '</a>';
            })
            .join('');
    }

    function renderContactChannels(info) {
        if (!info) return;

        var waNumber = (info.whatsapp || '').replace(/[^\d]/g, '');
        var channels = [
            { icon: 'fas fa-envelope', href: 'mailto:' + info.email, label: 'Email — ' + info.email, when: info.email },
            { icon: 'fas fa-phone', href: 'tel:' + info.phone, label: 'Call — ' + info.phone, when: info.phone },
            { icon: 'fab fa-whatsapp', href: 'https://wa.me/' + waNumber, label: 'WhatsApp', when: waNumber },
            { icon: 'fab fa-linkedin', href: info.linkedin, label: 'LinkedIn', when: info.linkedin },
            { icon: 'fab fa-github', href: info.github, label: 'GitHub', when: info.github },
            { icon: 'fab fa-codepen', href: info.codepen, label: 'CodePen', when: info.codepen }
        ];

        byId('contact-direct').innerHTML = channels
            .filter(function (c) { return c.when; })
            .map(function (c) {
                var href = safeUrl(c.href);
                if (!href) return '';
                var external = /^https?:/i.test(href) ? ' target="_blank" rel="noopener"' : '';
                return '<a class="contact-channel" href="' + href + '"' + external + '>' +
                    '<i class="' + c.icon + '" aria-hidden="true"></i> <span>' + esc(c.label) + '</span></a>';
            })
            .join('');
    }

    function renderStats(data) {
        var certCount = (data.certifications || []).reduce(function (total, group) {
            return total + ((group.items || []).length);
        }, 0);

        var stats = [
            { value: (data.personal_information || {}).years_experience || '', label: 'Years Experience' },
            { value: (data.professional_experience || []).length, label: 'Roles Held' },
            { value: (data.personal_projects || []).length, label: 'Projects Delivered' },
            { value: certCount, label: 'Certifications' }
        ];

        byId('hero-stats').innerHTML = stats
            .filter(function (s) { return s.value !== '' && s.value !== 0; })
            .map(function (s) {
                return '<div class="stat-card">' +
                    '<span class="stat-value">' + esc(s.value) + '</span>' +
                    '<span class="stat-label">' + esc(s.label) + '</span>' +
                    '</div>';
            })
            .join('');
    }

    function renderSummary(summary) {
        byId('summary-text').textContent = summary || '';
    }

    function renderSkills(groups) {
        byId('skills-container').innerHTML = (groups || []).map(function (group) {
            var tags = (group.items || []).map(function (item) {
                return '<span class="skill-tag">' + esc(item) + '</span>';
            }).join('');

            return '<div class="skill-category">' +
                '<h4>' + esc(group.category) + '</h4>' +
                '<div class="skill-tags">' + tags + '</div>' +
                '</div>';
        }).join('');
    }

    function renderExperience(experience) {
        byId('experience-timeline').innerHTML = (experience || []).map(function (job) {
            var achievements = (job.achievements || []).length
                ? '<ul class="timeline-achievements">' + job.achievements.map(function (a) {
                    return '<li>' + esc(a) + '</li>';
                }).join('') + '</ul>'
                : '';

            return '<div class="timeline-item">' +
                '<div class="timeline-date">' + esc(job.period) + '</div>' +
                '<h3>' + esc(job.position) + '</h3>' +
                '<p class="company-name">' + esc(job.company) + '</p>' +
                achievements +
                '</div>';
        }).join('');
    }

    function renderProjects(projects) {
        // Sub-lists vary by project; render whichever the entry provides.
        var highlightKeys = [
            { key: 'components', label: 'Components' },
            { key: 'features', label: 'Features' },
            { key: 'integrations', label: 'Integrations' },
            { key: 'projects', label: 'Includes' }
        ];

        byId('projects-grid').innerHTML = (projects || []).map(function (project) {
            var highlights = highlightKeys.map(function (h) {
                var items = project[h.key];
                if (!items || !items.length) return '';
                return '<span class="project-highlights-label">' + esc(h.label) + '</span>' +
                    '<ul class="project-highlights">' + items.map(function (i) {
                        return '<li>' + esc(i) + '</li>';
                    }).join('') + '</ul>';
            }).join('');

            var techs = (project.technologies || []).length
                ? '<div class="project-tech">' + project.technologies.map(function (t) {
                    return '<span class="tech-tag">' + esc(t) + '</span>';
                }).join('') + '</div>'
                : '';

            var href = safeUrl(project.link);
            var link = href
                ? '<a href="' + href + '" class="project-link" target="_blank" rel="noopener">' +
                'View Project <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a>'
                : '';

            return '<article class="project-card">' +
                '<h3>' + esc(project.name) + '</h3>' +
                '<p>' + esc(project.description) + '</p>' +
                highlights +
                link +
                techs +
                '</article>';
        }).join('');
    }

    function renderEducation(education) {
        byId('education-list').innerHTML = (education || []).map(function (edu) {
            var status = edu.status
                ? '<p class="edu-status">' + esc(edu.status) + '</p>'
                : '';

            return '<div class="edu-item">' +
                '<h3>' + esc(edu.degree) + '</h3>' +
                '<div class="meta-info"><span>' + esc(edu.institution) + '</span><span>' + esc(edu.period) + '</span></div>' +
                status +
                '</div>';
        }).join('');
    }

    function renderCertifications(groups) {
        byId('certifications-list').innerHTML = (groups || []).map(function (group) {
            var items = (group.items || []).map(function (cert) {
                var href = safeUrl(cert.link);
                var verifyLink = href
                    ? '<a class="verify-link" href="' + href + '" target="_blank" rel="noopener">' +
                    '<i class="fas fa-link" aria-hidden="true"></i> Verify</a>'
                    : '';

                // Non-clickable proof (verification codes, certificate numbers) shown as text.
                var note = cert.verification || cert.certificate || cert.code || cert.description;
                var noteHtml = (!href && note) ? '<p class="cert-note">' + esc(note) + '</p>' : '';

                var when = cert.year || cert.period || '';

                return '<div class="cert-item">' +
                    '<h4>' + esc(cert.name) + '</h4>' +
                    '<div class="meta-info"><span>' + esc(cert.issuer) + '</span><span>' + esc(when) + '</span></div>' +
                    verifyLink +
                    noteHtml +
                    '</div>';
            }).join('');

            return '<div class="cert-group">' +
                '<h3 class="cert-group-title">' + esc(group.category) + '</h3>' +
                items +
                '</div>';
        }).join('');
    }

    function renderLanguages(languages) {
        byId('languages-list').innerHTML = (languages || []).map(function (lang) {
            return '<div class="award-item">' +
                '<div class="language-row">' +
                '<h3>' + esc(lang.language) + '</h3>' +
                '<span class="language-level">' + esc(lang.proficiency) + '</span>' +
                '</div></div>';
        }).join('');
    }

    function renderAwards(awards) {
        byId('awards-list').innerHTML = (awards || []).map(function (award) {
            return '<div class="award-item">' +
                '<h3>' + esc(award.name) + '</h3>' +
                '<div class="meta-info"><span>' + esc(award.year || award.period || '') + '</span></div>' +
                '</div>';
        }).join('');
    }

    /* ----------------------------------------------------------------------
       UI behaviour
       ---------------------------------------------------------------------- */

    function initThemeToggle() {
        var root = document.documentElement;
        var toggle = byId('theme-toggle');
        if (!toggle) return;

        var sync = function () {
            var isLight = root.getAttribute('data-theme') === 'light';
            toggle.innerHTML = '<i class="fas fa-' + (isLight ? 'sun' : 'moon') + '" aria-hidden="true"></i>';
            toggle.setAttribute('aria-label', 'Switch to ' + (isLight ? 'dark' : 'light') + ' theme');
            var meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', isLight ? '#eef2f8' : '#0f172a');
        };

        toggle.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
            sync();
        });

        sync();
    }

    function initMobileNav() {
        var toggle = byId('nav-toggle');
        var links = byId('nav-links');
        if (!toggle || !links) return;

        var setOpen = function (open) {
            links.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            toggle.innerHTML = '<i class="fas fa-' + (open ? 'xmark' : 'bars') + '" aria-hidden="true"></i>';
        };

        toggle.addEventListener('click', function () {
            setOpen(!links.classList.contains('is-open'));
        });

        // Tapping a link should navigate and close the sheet.
        links.addEventListener('click', function (event) {
            if (event.target.closest('a')) setOpen(false);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') setOpen(false);
        });
    }

    function initScrollEffects() {
        var nav = byId('site-nav');
        var progress = byId('scroll-progress-bar');
        var backToTop = byId('back-to-top');
        var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
        var sections = navLinks
            .map(function (link) { return document.querySelector(link.getAttribute('href')); })
            .filter(Boolean);

        var onScroll = function () {
            var y = window.scrollY || window.pageYOffset;

            if (nav) nav.classList.toggle('is-scrolled', y > 8);
            if (backToTop) backToTop.classList.toggle('is-visible', y > 600);

            if (progress) {
                var scrollable = document.documentElement.scrollHeight - window.innerHeight;
                var pct = scrollable > 0 ? (y / scrollable) * 100 : 0;
                progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
            }

            // Scroll spy: the last section whose top has passed the nav line wins.
            var activeIndex = -1;
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].getBoundingClientRect().top <= 120) activeIndex = i;
            }
            navLinks.forEach(function (link, i) {
                link.classList.toggle('is-active', i === activeIndex);
            });
        };

        var queued = false;
        window.addEventListener('scroll', function () {
            if (queued) return;
            queued = true;
            window.requestAnimationFrame(function () {
                queued = false;
                onScroll();
            });
        }, { passive: true });

        window.addEventListener('resize', onScroll);
        onScroll();
    }

    function initReveal() {
        var items = document.querySelectorAll('.reveal');

        if (!('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        items.forEach(function (el, index) {
            // Small stagger so hero elements cascade rather than pop together.
            el.style.transitionDelay = Math.min(index, 6) * 60 + 'ms';
            observer.observe(el);
        });
    }

    function initPrint() {
        var button = byId('print-cv');
        if (button) {
            button.addEventListener('click', function () {
                // Reveal animations must be settled before the print snapshot.
                document.querySelectorAll('.reveal').forEach(function (el) {
                    el.classList.add('is-visible');
                });
                window.print();
            });
        }
    }

    function initContactForm() {
        var form = byId('contact-form');
        if (!form) return;

        var status = byId('form-status');
        var submit = byId('contact-submit');
        var original = submit ? submit.innerHTML : '';

        form.addEventListener('submit', function (event) {
            // Let the browser do a normal POST (and Netlify's redirect) if fetch is missing.
            if (!window.fetch) return;

            event.preventDefault();
            status.className = 'form-status';
            status.textContent = '';

            if (submit) {
                submit.disabled = true;
                submit.innerHTML = '<i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i> Sending…';
            }

            var body = new URLSearchParams(new FormData(form)).toString();

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body
            })
                .then(function (response) {
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    form.reset();
                    status.className = 'form-status is-success';
                    status.textContent = 'Thanks — your message is on its way. I\'ll be in touch soon.';
                })
                .catch(function () {
                    status.className = 'form-status is-error';
                    status.textContent = 'Sorry, the message could not be sent. Please email asanka_e@ykk.com instead.';
                })
                .then(function () {
                    if (submit) {
                        submit.disabled = false;
                        submit.innerHTML = original;
                    }
                });
        });
    }

    /* ----------------------------------------------------------------------
       Boot
       ---------------------------------------------------------------------- */

    document.addEventListener('DOMContentLoaded', function () {
        byId('year').textContent = new Date().getFullYear();

        initThemeToggle();
        initMobileNav();
        initScrollEffects();
        initPrint();
        initContactForm();

        fetch('mycv.json')
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function (data) {
                renderHero(data.personal_information);
                renderContactChannels(data.personal_information);
                renderStats(data);
                renderSummary(data.professional_summary);
                renderSkills(data.technical_proficiencies);
                renderExperience(data.professional_experience);
                renderProjects(data.personal_projects);
                renderEducation(data.education);
                renderCertifications(data.certifications);
                renderLanguages(data.languages);
                renderAwards(data.awards);
            })
            .catch(function (error) {
                console.error('Error loading CV data:', error);
                var summary = byId('summary-text');
                if (summary) {
                    summary.textContent =
                        'CV details could not be loaded. Please reach me at asanka_e@ykk.com.';
                }
            })
            .then(function () {
                // Observe after render so injected panels are measured correctly.
                initReveal();
            });
    });
})();
