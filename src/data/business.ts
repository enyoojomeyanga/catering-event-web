import type { Business } from '../types/business';
export const business = {
  registeredName: 'Flourish Catering and Events Services', displayName: 'Flourish Catering and Events Services',
  phones: ['08137042824', '07052153205'],
  whatsapp: '2347052153205', email: 'flourishevents313@gmail.com',
  offices: [
    { label: 'Head office', address: 'Behind Omepa Primary School, Igalaogba, Idah LGA, Kogi State, Nigeria.' },
    { label: 'Branch office', address: 'Besides PAAU VC Lodge, Idah Road, Anyigba, Dekina LGA, Kogi State, Nigeria.' },
  ],
} satisfies Business;
