// Varsayılan Dil İngilizce (en)
let currentLang = 'en'; 
let modulesLoadedCount = 0;
const totalModules = 8; 
let isScrollSpySetup = false; 

document.addEventListener('DOMContentLoaded', function() {
    
    // HTML parçacıklarını yükleyen fonksiyon
    function loadHTML(elementId, filePath) {
        const container = document.getElementById(elementId);
        if (container) {
            fetch(filePath)
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
                    return response.text();
                })
                .then(html => {
                    container.innerHTML = html;
                    modulesLoadedCount++;

                    // Tüm modüller yüklendikten sonra gerekli ayarları yap
                    if (modulesLoadedCount === totalModules && !isScrollSpySetup) { 
                        setLanguage(currentLang);
                        setupScrollSpyAndMobileMenu(); 
                        isScrollSpySetup = true;
                    }
                })
                .catch(error => {
                    console.error('HTML yüklenirken hata oluştu:', error);
                    if(container) container.innerHTML = `<p class="text-danger p-5">Content failed to load: ${filePath}</p>`;
                });
        }
    }

    // Yüklenecek tüm parçalar (element ID'si: dosya yolu)
    const modules = {
        'navbar-container': 'components/navbar.html',
        'summary-section': 'components/sections/summary.html',
        'experience-section': 'components/sections/experience.html',
        'education-section': 'components/sections/education.html',
        'projects-section': 'components/sections/projects.html',
        'medium-posts-section': 'components/sections/medium_posts.html',
        'documents-section': 'components/sections/documents.html',
        'contact-section': 'components/contact.html',
        'footer-container': 'components/footer.html'
    };

    // Tüm modülleri yükle
    for (const [id, path] of Object.entries(modules)) {
        loadHTML(id, path);
    }
    
    // Scroll Spy ve Mobil Menü Kapanışı Ayarları
    function setupScrollSpyAndMobileMenu() {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarCollapseElement = document.getElementById('navbarNav'); // Hamburger menü ID'si

        // 1. Scroll Spy (Aktif Link Takibi)
        const updateActiveLink = () => {
            let currentSectionId = 'summary-section'; 
            const scrollYPosition = window.scrollY;
            const offset = 75; 
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - offset;
                const sectionHeight = section.clientHeight;
                
                if (scrollYPosition >= sectionTop && scrollYPosition < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') && link.getAttribute('href').includes(currentSectionId)) {
                    link.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink(); 

        // 2. Mobil Menü Kapanışı (DÜZELTİLDİ)
        if (navbarCollapseElement) {
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // Tıklanan link bir fragment (#) ise ve menü şu anda açıksa kapat
                    // NOT: Dil butonu da nav-link olabilir, bu yüzden sadece fragment linklerini kontrol ediyoruz.
                    if (link.getAttribute('href') && link.getAttribute('href').startsWith('#') && navbarCollapseElement.classList.contains('show')) {
                        
                        // Bootstrap Collapse örneğini al
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapseElement);
                        
                        // Eğer örnek varsa kapat
                        if (bsCollapse) {
                            bsCollapse.hide();
                        } else {
                            // Eğer yoksa (ilk tıklama ise), yeni bir Collapse nesnesi oluştur ve kapat
                            new bootstrap.Collapse(navbarCollapseElement, { toggle: false }).hide();
                        }
                    }
                });
            });
        }
    }


    // DİL YÖNETİMİ FONKSİYONU
    window.setLanguage = function(lang) {
        currentLang = lang;
        const elements = document.querySelectorAll('[data-lang-en], [data-lang-tr]');

        elements.forEach(el => {
            // İçerik (innerHTML)
            const enText = el.getAttribute('data-lang-en');
            const trText = el.getAttribute('data-lang-tr');
            if (lang === 'tr' && trText) {
                el.innerHTML = trText;
            } else if (lang === 'en' && enText) {
                el.innerHTML = enText;
            }

            // Form etiketleri için placeholder yönetimi
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                 const enPlaceholder = el.getAttribute('data-placeholder-en');
                 const trPlaceholder = el.getAttribute('data-placeholder-tr');
                 if (lang === 'tr' && trPlaceholder) {
                     el.placeholder = trPlaceholder;
                 } else if (lang === 'en' && enPlaceholder) {
                     el.placeholder = enPlaceholder;
                 }
            }
        });

        // Navbar Dil Butonunu Güncelle
        const toggleButton = document.getElementById('lang-toggle');
        if(toggleButton) {
             const nextLang = lang === 'en' ? 'tr' : 'en';
             toggleButton.setAttribute('onclick', `setLanguage('${nextLang}')`);
             toggleButton.innerHTML = lang === 'en' 
                ? '<i class="fas fa-language me-2"></i> TR' 
                : '<i class="fas fa-language me-2"></i> ENG';
        }
    }
});