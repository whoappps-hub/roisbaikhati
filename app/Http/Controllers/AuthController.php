<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Tampilkan Halaman Login.
     */
    public function showLogin()
    {
        return view('auth.login');
    }

    /**
     * Proses Login Simulation.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        $email = strtolower(trim($request->input('email')));
        $password = $request->input('password');

        // Strong credentials validation matching React and look 100% authentic
        if ($email === 'admin@perpus.id') {
            if ($password !== 'admin123') {
                return redirect()->back()->withErrors(['password' => 'Kata sandi Pustakawan salah!'])->withInput($request->only('email'));
            }
            session([
                'role' => 'admin',
                'auth_name' => 'Ibu Pustakawan',
                'auth_email' => 'admin@perpus.id',
                'auth_id' => 'A-101'
            ]);
            return redirect()->route('admin.index')->with('success_auth', 'Selamat datang Pustakawan! Sesi admin Anda berhasil diaktifkan.');
        } 
        
        // Retrieve registered simulated users from session
        $simulatedUsers = session('simulated_users', []);
        
        if (isset($simulatedUsers[$email])) {
            $user = $simulatedUsers[$email];
            if ($user['password'] !== $password) {
                return redirect()->back()->withErrors(['password' => 'Kata sandi Siswa/Anggota salah!'])->withInput($request->only('email'));
            }
            $name = $user['name'];
            $id = $user['id'];
        } else {
            return redirect()->back()->withErrors(['email' => 'Alamat email belum terdaftar di sistem. Silakan daftarkan diri sebagai Anggota terlebih dahulu.'])->withInput($request->only('email'));
        }
        
        session([
            'role' => 'user',
            'auth_name' => $name,
            'auth_email' => $email,
            'auth_id' => $id
        ]);

        return redirect()->route('katalog.index')->with('success_auth', 'Selamat datang ' . $name . '! Sesi anggota Anda aktif.');
    }

    /**
     * Tampilkan Halaman Register.
     */
    public function showRegister()
    {
        return view('auth.register');
    }

    /**
     * Proses Register Simulation.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        $name = $request->input('name');
        $email = strtolower(trim($request->input('email')));
        $password = $request->input('password');
        
        // Protect admin account from registration takeover
        if ($email === 'admin@perpus.id') {
            return redirect()->back()->withErrors(['email' => 'Alamat email admin terproteksi oleh sistem perpustakaan.'])->withInput();
        }

        $simulatedUsers = session('simulated_users', []);
        if (isset($simulatedUsers[$email])) {
            return redirect()->back()->withErrors(['email' => 'Alamat email ini sudah terdaftar sebagai Anggota!'])->withInput();
        }

        $generatedId = 'M-' . rand(100, 999);

        // Store user in session simulated database
        $simulatedUsers[$email] = [
            'name' => $name,
            'password' => $password,
            'id' => $generatedId
        ];
        session(['simulated_users' => $simulatedUsers]);

        // Flash simulation register success
        return redirect()->route('login')->with('success', 'Pendaftaran Anggota berhasil disimpan! ID Anggota Anda: ' . $generatedId . '. Silakan masuk.');
    }

    /**
     * Proses Logout.
     */
    public function logout()
    {
        session()->forget(['role', 'auth_name', 'auth_email', 'auth_id']);
        return redirect()->route('login')->with('success_auth', 'Anda berhasil keluar dari sesi sistem.');
    }
}
