import type { Business } from '../types/business';
// Display name remains unset until the naming correction is reconciled.
export const business = {
  registeredName: 'Flourish Catering and Events Services', displayName: null,
  motto: 'Integrity is our pride', phones: ['08137042824', '07052153205'],
  whatsapp: '2347052153205', email: 'flourishevents313@gmail.com',
  offices: [
    { label: 'Head office', address: 'Behind Omepa Primary School, Igalaogba, Idah LGA, Kogi State, Nigeria.' },
    { label: 'Branch office', address: 'Besides PAAU VC Lodge, Idah Road, Anyigba, Dekina LGA, Kogi State, Nigeria.' },
  ], coverage: 'Kogi State, Abuja and nationwide arrangements',
} satisfies Business;
