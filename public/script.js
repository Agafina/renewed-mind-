const form = document.getElementById('registration-form');
const submitBtn = document.getElementById('submit-btn');
const toast = document.getElementById('toast');

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
function validate(name, email) {
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
    return valid;
}

// ── Form submit handler ───────────────────────────────────────────────────────
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (!validate(name, email)) return;

    setLoading(true);

    try {
        const res = await fetch('https://renewed-mind-1.onrender.com/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.trim(), email: email.trim() }),
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
['name', 'email'].forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
        const group = document.getElementById(`group-${id}`);
        const errorEl = document.getElementById(`${id}-error`);
        if (group) group.classList.remove('form-group--error');
        if (errorEl) errorEl.textContent = '';
    });
});
