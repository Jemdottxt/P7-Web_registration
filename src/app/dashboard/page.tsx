"use client";
import { getToken } from '@/lib/auth';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent } from '@/components/ui/card'; 
import React, { useEffect } from 'react';

interface JwtPayload {
    sub: number; username: string; role: string; exp: number; iat: number;
}

export default function DashboardHome() {

    const token = getToken();
    let username = 'Guest';

    if (token) {
        try{
            const decoded = jwtDecode<JwtPayload>(token);

            if (decoded.username){
                username = decoded.username;
            }
            }catch (e) {
                console.error("Token decoding failed:", e);
            }
        }

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <Card className="w-full max-w-3xl p-10 bg-black bg-opacity-90 rounded-3xl shadow-2xl border-blue-700">
            <CardContent>
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-900">
        Welcome to the Dashboard, <span className="text-stone-900">{username}</span>
      </h2>
      {token && (
        <>
          <p className="text-blue-900 font-semibold mb-2">Your Bearer token:</p>
          <pre className="p-5 bg-blue-600 rounded-lg text-s text-white break-all whitespace-pre-wrap">
            {token}
          </pre>
        </>
      )}
    </CardContent>
  </Card>
</div>
    );
}

