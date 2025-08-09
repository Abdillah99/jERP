import React from 'react';

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`px-2 py-1 border ${props.className ?? ''}`} />;
}
