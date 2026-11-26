export interface Business { registeredName: string; displayName: string | null; phones: readonly string[]; whatsapp: string; email: string; offices: readonly { label: string; address: string }[]; }
