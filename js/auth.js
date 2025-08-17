async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // For hardcoded account
    if (username === 'theo' && password === 'master') {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', 'theo')
            .eq('password', 'master')
            .single();
            
        if (data) {
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials');
        }
    } else {
        // Normal login
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();
            
        if (data) {
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials');
        }
    }
}

// Check if already logged in
window.onload = function() {
    const user = localStorage.getItem('user');
    if (user) {
        window.location.href = 'dashboard.html';
    }
};
