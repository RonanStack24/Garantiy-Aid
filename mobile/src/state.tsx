import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiRequestError, getCurrentBeneficiary, type Beneficiary } from './api';
import { clearStoredToken, getStoredToken, storeToken } from './session-storage';

type Language = 'en' | 'bs';
export type RegistrationInfo = {
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  sex: string;
  address: string;
  barangay: string;
  barangayId: string;
  city: string;
};
const emptyRegistration: RegistrationInfo = {
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  sex: '',
  address: '',
  barangay: '',
  barangayId: '',
  city: 'Cebu City',
};
type DemoState = {
  language: Language;
  setLanguage: (value: Language) => void;
  phone: string;
  setPhone: (value: string) => void;
  accessToken: string;
  authLoading: boolean;
  authError: boolean;
  startSession: (token: string, beneficiary: Beneficiary) => Promise<void>;
  restoreSession: () => Promise<void>;
  name: string;
  setName: (value: string) => void;
  registration: RegistrationInfo;
  setRegistration: (value: Partial<RegistrationInfo>) => void;
  faceEnrolled: boolean;
  setFaceEnrolled: (value: boolean) => void;
  consentGiven: boolean;
  setConsentGiven: (value: boolean) => void;
  claimCompleted: boolean;
  setClaimCompleted: (value: boolean) => void;
  readNotifications: string[];
  markRead: (id: string) => void;
  reset: () => Promise<void>;
  t: (english: string, bisaya: string) => string;
};
const Context = createContext<DemoState | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [phone, setPhone] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [name, setName] = useState('Maria Santos');
  const [registration, setRegistrationState] =
    useState<RegistrationInfo>(emptyRegistration);
  const [faceEnrolled, setFaceEnrolled] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [claimCompleted, setClaimCompleted] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const applyBeneficiary = (beneficiary: Beneficiary) => {
    setPhone(beneficiary.contactNumber.replace(/^\+63/, ''));
    setName(
      [beneficiary.firstName, beneficiary.middleName, beneficiary.lastName]
        .filter(Boolean)
        .join(' '),
    );
  };
  const restoreSession = async () => {
    setAuthLoading(true);
    setAuthError(false);
    try {
      const token = await getStoredToken();
      if (!token) {
        setAccessToken('');
        return;
      }
      const beneficiary = await getCurrentBeneficiary(token);
      setAccessToken(token);
      applyBeneficiary(beneficiary);
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        await clearStoredToken();
        setAccessToken('');
      } else {
        setAuthError(true);
      }
    } finally {
      setAuthLoading(false);
    }
  };
  useEffect(() => {
    void restoreSession();
  }, []);
  const startSession = async (token: string, beneficiary: Beneficiary) => {
    await storeToken(token);
    setAccessToken(token);
    applyBeneficiary(beneficiary);
  };
  const reset = async () => {
    setPhone('');
    setAccessToken('');
    setName('Maria Santos');
    setRegistrationState(emptyRegistration);
    setFaceEnrolled(false);
    setConsentGiven(false);
    setClaimCompleted(false);
    setReadNotifications([]);
    await clearStoredToken();
  };
  return (
    <Context.Provider
      value={{
        language,
        setLanguage,
        phone,
        setPhone,
        accessToken,
        authLoading,
        authError,
        startSession,
        restoreSession,
        name,
        setName,
        registration,
        setRegistration: (value) =>
          setRegistrationState((previous) => ({ ...previous, ...value })),
        faceEnrolled,
        setFaceEnrolled,
        consentGiven,
        setConsentGiven,
        claimCompleted,
        setClaimCompleted,
        readNotifications,
        markRead: (id) =>
          setReadNotifications((previous) =>
            previous.includes(id) ? previous : [...previous, id],
          ),
        reset,
        t: (en, bs) => (language === 'en' ? en : bs),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const state = useContext(Context);
  if (!state) throw new Error('DemoProvider is required');
  return state;
}

// Synthetic display data only. These are not government records or live appointments.
export const appointment = {
  program: '4Ps — Pantawid Pamilya',
  date: 'Thursday, July 10, 2025',
  dateBisaya: 'Huwebes, Hulyo 10, 2025',
  time: '9:00 AM – 10:00 AM',
  queue: '#047',
  venue: 'Barangay Punta Princesa Hall',
  amount: 1500,
  reference: 'GAI-2025-0612-047',
};
export const transactions = [
  {
    id: 'june',
    title: 'Aid received',
    date: 'June 12, 2025',
    reference: appointment.reference,
    amount: 1500,
    status: 'received',
  },
  {
    id: 'may',
    title: 'Aid received',
    date: 'May 28, 2025',
    reference: 'GAI-2025-0528-047',
    amount: 1500,
    status: 'received',
  },
];
export const notices = [
  {
    id: 'schedule',
    title: 'Claiming schedule confirmed',
    titleBs: 'Nakumpirma ang iskedyul',
    body: 'Your slot: July 10, 9:00–10:00 AM, Queue #047. Punta Princesa Hall.',
    bodyBs: 'Imong oras: Hulyo 10, 9:00–10:00 AM, Pila #047. Punta Princesa Hall.',
    date: 'July 2, 2025 · 10:00 AM',
    kind: 'schedule',
  },
  {
    id: 'claim',
    title: 'Claim successful',
    titleBs: 'Malampuson ang pag-claim',
    body: '₱1,500 from 4Ps was recorded on June 12. Check your wallet.',
    bodyBs: 'Narekord ang ₱1,500 gikan sa 4Ps niadtong Hunyo 12. Tan-awa ang wallet.',
    date: 'June 12, 2025 · 10:12 AM',
    kind: 'claim',
  },
  {
    id: 'reminder',
    title: 'Reminder: Claim this week',
    titleBs: 'Pahinumdom: Claim karong semanaha',
    body: 'Your claiming window is July 10, 9:00–10:00 AM. Don’t forget your QR pass.',
    bodyBs: 'Imong pag-claim kay Hulyo 10, 9:00–10:00 AM. Ayaw kalimti ang QR pass.',
    date: 'July 8, 2025 · 8:00 AM',
    kind: 'reminder',
  },
  {
    id: 'account',
    title: 'Account verified',
    titleBs: 'Naverify ang account',
    body: 'Welcome to GarantiyAid, Maria. Your registration is complete.',
    bodyBs: 'Maayong pag-abot sa GarantiyAid, Maria. Nahuman na ang pagparehistro.',
    date: 'May 20, 2025 · 2:30 PM',
    kind: 'account',
  },
];
export const peso = (amount: number) =>
  `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
