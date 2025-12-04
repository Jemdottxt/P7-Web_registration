'use client';
import React from 'react';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import { API_BASE } from '@/lib/config';

import { FormEvent } from 'react';

export default function RegisterPage() {

    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleRegister(e: FormEvent) {
        e.preventDefault();
        setError('');

        const res = await fetch (`${API_BASE}/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
            if (!res.ok) {
            setError(data.message || 'Register failed');
            return;
        }

        router.push('/login');
    }

        return (

        <div className="flex items-center justify-center min-h-screen bg-linear-to-bl from-stone-950 via-gray-900 to-blue-800 p-6">
            <Card className="w-full max-w-lg p-10 bg-white rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <CardContent>
                    <h1 className="text-5xl font-extrabold mb-12 text-center text-gradient bg-clip-text text-transparent bg-linear-to-r from-blue-950 to-sky-500">Register</h1>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <Input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <Button className="w-full bg-linear-to-r from-blue-700 to-sky-500 hover:from-sky-500 hover:to-blue-700 text-white font-extrabold py-4 rounded-xl shadow-lg transition" type="submit">Register</Button>
                    </form>
                    <Button variant="link" className="mt-6 block w-full text-center text-blue-600 hover:text-blue-800 font-semibold transition" onClick={() => router.push('/login')}> Already have an account? Login </Button>
                </CardContent>
            </Card>
        </div>
    );
}