document.addEventListener('DOMContentLoaded', () => {
    // Varsayılan dili ayarlama
    setLanguage('tr');
    
    // Menü simgesi tıklama işlevi
    const menuIcon = document.querySelector("#menu-item");
    const navbar = document.querySelector(".navbar");
    menuIcon.onclick = () => {
        menuIcon.classList.toggle("bx-x");
        navbar.classList.toggle("active");
    };

    // Scroll to top butonu için işlev
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    document.addEventListener('scroll', () => {
        scrollToTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });

    scrollToTopBtn.addEventListener('click', () => {
        scrollToTopSmooth();
    });

    // Dil seçici butonlarına tıklama olayları 
    const langButtons = document.querySelectorAll('.language-selector button');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Form gönderme işlemi
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function(event) {
        let isValid = true;
        const errorContainer = document.getElementById('form-errors');
        errorContainer.innerHTML = ''; // Önceki hata mesajlarını temizle

        // Formdaki tüm zorunlu alanları kontrol et
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const errorMessageEl = document.createElement('div');
            const lang = document.documentElement.lang || 'tr'; // Varsayılan dil
            const errorMessage = field.getAttribute(`data-error-${lang}`);
            
            if (!field.value.trim()) {
                errorMessageEl.textContent = errorMessage || 'Bu alan zorunludur.';
                errorMessageEl.className = 'error-message';
                errorContainer.appendChild(errorMessageEl);
                isValid = false;
            }
        });

        // Form geçerliyse gönder
        if (!isValid) {
            event.preventDefault(); // Formun gönderilmesini engelle
        }
    });
});

// Dil metinlerini güncelleme
function setLanguage(lang) {
    const elements = document.querySelectorAll("[data-lang-tr], [data-lang-en]");
    elements.forEach((element) => {
        const text = element.getAttribute(`data-lang-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = text;
            } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.innerHTML = text;
            }
        }
    });

    // Dil butonlarının aktifliğini güncelleme
    const buttons = document.querySelectorAll('.language-selector button');
    buttons.forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-lang') === lang);
    });

    // Sayfa dilini değiştirme
    document.documentElement.lang = lang;

    // CV ve İletişim butonlarını güncelleme
    updateBtnTexts(lang);

    // Form doğrulama mesajlarını güncelleme
    updateFormValidationMessages(lang);
}

function updateBtnTexts(lang) {
    const cvDownloadLink = document.getElementById('cvDownloadLink');
    const contactLink = document.getElementById('contactLink');

    // CV İndirme bağlantısını güncelleme
    if (lang === 'en') {
        cvDownloadLink.href = 'CV/CV.pdf'; // İngilizce CV dosyasının yolu
        cvDownloadLink.download = 'CV'; // İngilizce dosya adı
        cvDownloadLink.textContent = 'CV'; // İngilizce metin
    } else {
        cvDownloadLink.href = 'CV/Özgeçmiş.pdf'; // Türkçe CV dosyasının yolu
        cvDownloadLink.download = 'Özgeçmiş'; // Türkçe dosya adı
        cvDownloadLink.textContent = 'Özgeçmiş'; // Türkçe metin
    }

    // İletişim bağlantısını güncelle
    const contactText = contactLink.getAttribute(`data-lang-${lang}`);
    if (contactText) {
        contactLink.textContent = contactText;
    }
}

function updateFormValidationMessages(lang) {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        const errorMessage = input.getAttribute(`data-error-${lang}`);
        if (errorMessage) {
            input.setCustomValidity(errorMessage);
        } else {
            input.setCustomValidity('Bu alan zorunludur.');
        }
    });
}

// Scroll to top işlevi
function scrollToTopSmooth() {
    const duration = 1000;
    const start = window.scrollY;
    const startTime = performance.now();

    function scroll(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const scrollAmount = start * (1 - easeInOutQuad(progress));
        window.scrollTo(0, scrollAmount);

        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    requestAnimationFrame(scroll);
}

function validateInput(fieldId) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}-error`);
    let isValid = true;

    if (input.value.trim() === '') {
        isValid = false;
    }

    if (fieldId === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value.trim() !== '' && !emailPattern.test(input.value.trim())) {
            isValid = false;
        }
    }

    // Dil seçimine göre hata mesajını ayarla
    const lang = document.documentElement.lang || 'en';
    const errorMessage = errorSpan.getAttribute(`data-lang-${lang}`);
    errorSpan.textContent = isValid ? '' : errorMessage;

    errorSpan.style.display = isValid ? 'none' : 'block';
    return isValid;
}

function validateForm() {
    const nameValid = validateInput('name');
    const emailValid = validateInput('email');
    const messageValid = validateInput('message');

    return nameValid && emailValid && messageValid;
}
