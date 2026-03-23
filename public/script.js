const form = document.getElementById('registration-form');
const submitBtn = document.getElementById('submit-btn');
const toast = document.getElementById('toast');

// ── Wake up server on page load ───────────────────────────────────────────────
(async () => {
    try {
        await fetch('https://renewed-mind-1.onrender.com/api/registrants', { method: 'GET' });
    } catch (_) {
        // silent — this is just a wake-up ping
    }
})();

// ── Utility: show toast ──────────────────────────────────────────────────────
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast toast--${type} toast--visible`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 5000);
}

// ── Utility: set loading state ────────────────────────────────────────────────
function setLoading(isLoading) {
    submitBtn.classList.toggle('btn-primary--loading', isLoading);
    submitBtn.disabled = isLoading;
}

// ── Utility: field error helpers ──────────────────────────────────────────────
function setError(fieldId, msg) {
    const group = document.getElementById(`group-${fieldId}`);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (group) group.classList.add('form-group--error');
    if (errorEl) errorEl.textContent = msg;
}

function clearErrors() {
    document.querySelectorAll('.form-group--error').forEach(g => g.classList.remove('form-group--error'));
    document.querySelectorAll('.field-error').forEach(e => (e.textContent = ''));
}

// ── Validate fields client-side ───────────────────────────────────────────────
function validate(name, email, level, contact, department) {
    let valid = true;

    if (!name.trim()) {
        setError('name', 'Please enter your full name.');
        valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        setError('email', 'Please enter your email address.');
        valid = false;
    } else if (!emailRegex.test(email.trim())) {
        setError('email', 'Please enter a valid email address.');
        valid = false;
    }

    const validLevels = ['200', '300', '400', '500', '600'];
    if (!level) {
        setError('level', 'Please select your level.');
        valid = false;
    } else if (!validLevels.includes(level)) {
        setError('level', 'Level must be 200, 300, 400, 500, or 600.');
        valid = false;
    }

    const contactRegex = /^[+\d\s\-().]{7,20}$/;
    if (!contact.trim()) {
        setError('contact', 'Please enter your contact number.');
        valid = false;
    } else if (!contactRegex.test(contact.trim())) {
        setError('contact', 'Please enter a valid contact number.');
        valid = false;
    }

    if (!department.trim()) {
        setError('department', 'Please enter your department.');
        valid = false;
    }

    return valid;
}

// ── Form submit handler ───────────────────────────────────────────────────────
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name       = document.getElementById('name').value;
    const email      = document.getElementById('email').value;
    const level      = document.getElementById('level').value;
    const contact    = document.getElementById('contact').value;
    const department = document.getElementById('department').value;

    if (!validate(name, email, level, contact, department)) return;

    setLoading(true);

    try {
        const res = await fetch('https://renewed-mind-1.onrender.com/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name:       name.trim(),
                email:      email.trim(),
                level:      level,
                contact:    contact.trim(),
                department: department.trim(),
            }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
            showToast(data.message, 'success');
            form.reset();
        } else if (res.status === 409) {
            setError('email', data.message);
            showToast(data.message, 'error');
        } else {
            showToast(data.message || 'Something went wrong. Please try again.', 'error');
        }
    } catch (err) {
        showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
        setLoading(false);
    }
});

// ── Clear error on input ──────────────────────────────────────────────────────
['name', 'email', 'level', 'contact', 'department'].forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('input', () => {
        const group = document.getElementById(`group-${id}`);
        const errorEl = document.getElementById(`${id}-error`);
        if (group) group.classList.remove('form-group--error');
        if (errorEl) errorEl.textContent = '';
    });
});
