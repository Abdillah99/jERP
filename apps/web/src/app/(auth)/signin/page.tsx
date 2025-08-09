'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        if (res.ok) router.push('/');
      }}
      className="flex flex-col gap-2 max-w-xs mx-auto mt-20"
    >
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" className="border p-2" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="border p-2" />
      <button className="bg-blue-500 text-white p-2">Sign in</button>
    </form>
  );
}
