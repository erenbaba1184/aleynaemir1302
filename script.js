// ========== PASSWORD LOGIC ==========
const CORRECT_PASSWORD = '1302';
let enteredPassword = '';

const dotSlots = document.querySelectorAll('.dot-slot');
const errorMsg = document.getElementById('error-msg');
const passwordPage = document.getElementById('password-page');
const birthdayPage = document.getElementById('birthday-page');

// Update the dot display above numpad
function updateDisplay() {
    dotSlots.forEach((slot, index) => {
        if (index < enteredPassword.length) {
            slot.textContent = '★';
            slot.classList.add('filled');
            slot.classList.remove('correct');
        } else {
            slot.textContent = '_';
            slot.classList.remove('filled', 'correct');
        }
    });
}

// Handle numpad button clicks
document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const val = this.getAttribute('data-num');

        if (val === 'clear') {
            enteredPassword = '';
            errorMsg.textContent = '';
            errorMsg.classList.remove('show');
            updateDisplay();
            return;
        }

        if (val === 'enter') {
            checkPassword();
            return;
        }

        if (enteredPassword.length < 4) {
            enteredPassword += val;
            updateDisplay();

            if (enteredPassword.length === 4) {
                setTimeout(() => checkPassword(), 350);
            }
        }
    });
});

// Check password
function checkPassword() {
    if (enteredPassword === CORRECT_PASSWORD) {
        errorMsg.textContent = '';
        errorMsg.classList.remove('show');

        // Show green success state
        dotSlots.forEach(slot => {
            slot.textContent = '★';
            slot.classList.add('correct');
            slot.classList.remove('filled');
        });

        setTimeout(() => {
            passwordPage.classList.add('page-exit');
            setTimeout(() => {
                passwordPage.classList.remove('active', 'page-exit');
                passwordPage.style.display = 'none';
                birthdayPage.classList.add('active', 'page-enter');
                birthdayPage.style.display = 'block';
                launchConfetti();
            }, 500);
        }, 600);
    } else {
        errorMsg.textContent = 'Yanlış Şifre!';
        errorMsg.classList.add('show');
        enteredPassword = '';
        updateDisplay();

        setTimeout(() => {
            errorMsg.classList.remove('show');
        }, 2500);
    }
}

// ========== BIRTHDAY PAGE LOGIC ==========

// Confetti launcher
function launchConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#f48fb1', '#f8c8dc', '#e891b0', '#fce4ec', '#d4688e', '#ff80ab', '#fff', '#fdd6e5'];

    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = (Math.random() * 8 + 5) + 'px';
            piece.style.height = (Math.random() * 8 + 5) + 'px';
            piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
            piece.style.opacity = Math.random() * 0.7 + 0.3;

            if (Math.random() > 0.5) {
                piece.style.borderRadius = '50%';
            }

            container.appendChild(piece);
            setTimeout(() => piece.remove(), 4000);
        }, i * 40);
    }
}

// ========== PROFILE SECTION (inline expandable) ==========
let profileOpen = false;

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const btn = document.getElementById('btn-profile');

    if (profileOpen) {
        section.classList.remove('open');
        btn.classList.remove('active');
        profileOpen = false;
    } else {
        section.classList.add('open');
        btn.classList.add('active');
        profileOpen = true;
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// ========== MODAL OVERLAY SYSTEM ==========

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const container = modal.querySelector('.modal-scroll-container');

    container.classList.remove('closing');

    if (modalId === 'letter-modal') {
        const envelope = document.getElementById('letter-envelope-modal');
        const postcard = document.getElementById('postcard-view-modal');
        envelope.style.display = 'flex';
        envelope.style.opacity = '1';
        envelope.style.transform = 'none';
        postcard.classList.add('hidden');
    }

    if (modalId === 'reel-modal') {
        const items = modal.querySelectorAll('.reel-item-modal');
        items.forEach(item => {
            item.style.animation = 'none';
            item.offsetHeight;
            item.style.animation = '';
        });
    }

    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
    container.scrollTop = 0;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const container = modal.querySelector('.modal-scroll-container');
    const backdrop = modal.querySelector('.modal-backdrop');

    container.classList.add('closing');
    backdrop.style.opacity = '0';
    backdrop.style.transition = 'opacity 0.35s ease';

    setTimeout(() => {
        modal.classList.remove('visible');
        container.classList.remove('closing');
        backdrop.style.opacity = '';
        backdrop.style.transition = '';
        document.body.style.overflow = '';
    }, 420);
}

function openPostcardModal() {
    const envelope = document.getElementById('letter-envelope-modal');
    const postcard = document.getElementById('postcard-view-modal');

    envelope.style.opacity = '0';
    envelope.style.transform = 'scale(0.9)';
    envelope.style.transition = 'all 0.4s ease';

    setTimeout(() => {
        envelope.style.display = 'none';
        postcard.classList.remove('hidden');
    }, 400);
}

// Close modals with Escape key + keyboard support
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const reelModal = document.getElementById('reel-modal');
        const letterModal = document.getElementById('letter-modal');
        if (reelModal.classList.contains('visible')) closeModal('reel-modal');
        if (letterModal.classList.contains('visible')) closeModal('letter-modal');
    }

    if (!passwordPage.classList.contains('active')) return;

    if (e.key >= '0' && e.key <= '9') {
        if (enteredPassword.length < 4) {
            enteredPassword += e.key;
            updateDisplay();
            if (enteredPassword.length === 4) {
                setTimeout(() => checkPassword(), 350);
            }
        }
    } else if (e.key === 'Backspace') {
        enteredPassword = enteredPassword.slice(0, -1);
        errorMsg.textContent = '';
        errorMsg.classList.remove('show');
        updateDisplay();
    } else if (e.key === 'Enter') {
        checkPassword();
    }
});
