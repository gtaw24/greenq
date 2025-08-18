async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 1. Check hardcoded admin first
    if (username === 'theo' && password === 'master') {
        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('username', 'theo')
            .single();
            
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = 'dashboard.html';
        return;
    }

    // 2. Check regular users
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
        alert('Login failed! Error: ' + (error?.message || 'Invalid credentials'));
        console.error('Login error:', error);
    }
}
