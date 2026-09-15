import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import QRCode from 'react-native-qrcode-svg';
import {
  Bell,
  CalendarDays,
  Check,
  CircleCheck,
  CircleHelp,
  Clock3,
  FileText,
  Info,
  MapPin,
  MessageCircle,
  QrCode,
  ScanFace,
  ShieldCheck,
  Users,
} from 'lucide-react-native';
import {
  Badge,
  BottomLinks,
  Button,
  Card,
  DetailRow,
  Field,
  flow,
  go,
  Logo,
  Notice,
  Page,
  PhoneField,
  styles,
  Txt,
} from '../components';
import { appointment as a, notices, peso, transactions, useDemo } from '../state';
import { colors as c, fonts } from '../theme';
import { s as mainStyles } from './main';

export function DetailScreen() {
  const { page: screen } = useLocalSearchParams<{ page: string }>();
  const { t } = useDemo();
  const definitions: Record<
    string,
    { title: string; content: React.ReactNode; active?: string }
  > = {
    schedule: {
      title: t('Claiming schedule', 'Iskedyul sa pag-claim'),
      content: <Schedule />,
    },
    'qr-pass': {
      title: t('My QR claim pass', 'Akong QR claim pass'),
      content: <ClaimPass />,
    },
    transactions: {
      title: t('Transaction history', 'Kasaysayan sa transaksyon'),
      content: <Transactions />,
      active: 'wallet',
    },
    receipt: { title: t('Receipt', 'Resibo'), content: <Receipt />, active: 'wallet' },
    notifications: {
      title: t('Notifications', 'Mga pahibalo'),
      content: <Notifications />,
    },
    'notification-details': {
      title: t('Notification details', 'Detalye sa pahibalo'),
      content: <NotificationDetails />,
    },
    'reset-password': {
      title: t('Reset password', 'Ireset ang password'),
      content: <Recovery />,
      active: 'profile',
    },
    'edit-profile': {
      title: t('Edit my details', 'Usba akong detalye'),
      content: <EditProfile />,
      active: 'profile',
    },
    'change-password': {
      title: t('Change password', 'Usba ang password'),
      content: <Password />,
      active: 'profile',
    },
    'notification-settings': {
      title: t('Notification settings', 'Mga setting sa pahibalo'),
      content: <NotificationSettings />,
      active: 'profile',
    },
    'enrollment-status': {
      title: t('Enrollment status', 'Kahimtang sa enrollment'),
      content: <EnrollmentStatus />,
    },
    'enrollment-documents': {
      title: t('Enrollment status', 'Kahimtang sa enrollment'),
      content: <EnrollmentDocuments />,
    },
    'security-privacy': {
      title: t('Security & Privacy', 'Seguridad ug Privacy'),
      content: <Privacy />,
      active: 'profile',
    },
    'schedule-update': {
      title: t('Schedule update', 'Nausab nga iskedyul'),
      content: <Exception kind="schedule" />,
    },
    'qr-expired': {
      title: t('QR verification', 'QR verification'),
      content: <Exception kind="expired" />,
    },
    'claim-review': {
      title: t('Claim verification', 'Pagverify sa claim'),
      content: <Exception kind="review" />,
    },
    support: {
      title: t('Talk to staff', 'Pakigsulti sa staff'),
      content: <Support />,
      active: 'help',
    },
    'face-login': {
      title: t('Login with Face', 'Log in pinaagi sa Nawong'),
      content: <FaceLogin />,
    },
    'verify-identity': {
      title: t('Verify identity', 'Iverify ang pagkatawo'),
      content: <VerifyClaim />,
    },
  };
  if (screen === 'claim-success') return <ClaimSuccess />;
  const entry = definitions[screen];
  if (!entry)
    return (
      <Page title="GarantiyAid">
        <Txt variant="title">{t('Screen unavailable', 'Dili magamit nga screen')}</Txt>
        <Button onPress={() => router.replace('/(tabs)/home')}>
          {t('Return to Home', 'Balik sa Home')}
        </Button>
      </Page>
    );
  return (
    <View style={{ flex: 1 }}>
      <Page tabs title={entry.title}>
        {entry.content}
      </Page>
      <BottomLinks active={entry.active} />
    </View>
  );
}

function Schedule() {
  const { language, claimCompleted, t } = useDemo();
  return (
    <>
      <Badge tone={claimCompleted ? 'success' : 'warning'}>
        {claimCompleted
          ? t('Claimed in preview', 'Naclaim sa preview')
          : t('Upcoming', 'Umaabot')}
      </Badge>
      <Card>
        <DetailRow
          icon={ShieldCheck}
          label={t('Program', 'Programa')}
          value={a.program}
        />
        <DetailRow
          icon={CalendarDays}
          label={t('Date', 'Petsa')}
          value={language === 'en' ? a.date : a.dateBisaya}
        />
        <DetailRow icon={Clock3} label={t('Time slot', 'Oras')} value={a.time} />
        <DetailRow
          icon={Users}
          label={t('Queue number', 'Numero sa pila')}
          value={a.queue}
        />
        <DetailRow icon={MapPin} label={t('Venue', 'Lugar')} value={a.venue} />
      </Card>
      <Notice>
        {t(
          'Sample schedule for the frontend preview. Offline caching will be added when the scheduling API is connected.',
          'Sample nga iskedyul alang sa preview. Idugang ang offline caching kon konektado na ang API.',
        )}
      </Notice>
      <Button icon={QrCode} onPress={() => go('qr-pass')}>
        {t('View my QR pass', 'Tan-awa akong QR pass')}
      </Button>
      <Button variant="outline" onPress={() => go('schedule-update')}>
        {t('Preview a schedule update', 'Tan-awa ang nausab nga iskedyul')}
      </Button>
    </>
  );
}

function ClaimPass() {
  const { claimCompleted, t } = useDemo();
  return (
    <>
      <Card style={{ alignItems: 'center' }}>
        <Txt variant="label" style={{ textAlign: 'center', color: c.primary }}>
          {a.program}
        </Txt>
        <Txt variant="small">{a.date}</Txt>
        <View
          style={{ padding: 12, backgroundColor: c.card }}
          accessibilityLabel="Demo QR code; invalid for real claims"
        >
          <QRCode
            value="GARANTIYAID-DEMO-047-NOT-VALID-FOR-CLAIM"
            size={220}
            color={c.navy}
            backgroundColor={c.card}
          />
        </View>
        <Txt variant="number">{a.queue}</Txt>
        <Txt variant="small">{a.time}</Txt>
        <Txt variant="label" style={{ textAlign: 'center' }}>
          {a.venue}
        </Txt>
        <Badge tone={claimCompleted ? 'success' : 'warning'}>
          {claimCompleted
            ? t('Used in preview', 'Nagamit sa preview')
            : t('Demo pass', 'Demo pass')}
        </Badge>
      </Card>
      <Notice>
        {t(
          'Present your QR pass to staff at the distribution center. This sample QR is invalid for actual claims.',
          'Ipakita ang QR pass sa staff sa distribution center. Dili balido kini nga sample QR alang sa tinuod nga claim.',
        )}
      </Notice>
      <Button disabled={claimCompleted} onPress={() => go('verify-identity')}>
        {claimCompleted
          ? t('Already claimed in preview', 'Naclaim na sa preview')
          : t('Preview identity verification', 'Tan-awa ang pagverify')}
      </Button>
      <Button variant="outline" onPress={() => go('qr-expired')}>
        {t('Preview expired pass', 'Tan-awa ang expired nga pass')}
      </Button>
    </>
  );
}

function Transactions() {
  const { claimCompleted, t } = useDemo();
  const [selected, setSelected] = useState('june');
  const entries = claimCompleted
    ? [
        {
          id: 'demo-claim',
          title: 'Aid received',
          date: 'July 10, 2025',
          reference: 'DEMO-CLAIM-047',
          amount: 1500,
          status: 'received',
        },
        ...transactions,
      ]
    : transactions;
  return (
    <>
      <Notice>
        {t(
          'SIMULATED WALLET · No real money is transferred.',
          'SIMULATED WALLET · Walay tinuod nga kuwarta ibalhin.',
        )}
      </Notice>
      <View style={mainStyles.balanceCard}>
        <Txt variant="small" style={mainStyles.cardCaption}>
          {t('AVAILABLE BALANCE', 'MAGAMIT NGA BALANSE')}
        </Txt>
        <Txt variant="heading" style={{ fontSize: 26, color: c.card }}>
          {peso(claimCompleted ? 4500 : 3000)}
        </Txt>
      </View>
      <Txt variant="small" style={{ fontFamily: fonts.semibold }}>
        {t('RECENT TRANSACTIONS', 'BAG-ONG MGA TRANSAKSYON')}
      </Txt>
      <Card style={{ gap: 0, paddingVertical: 4 }}>
        {entries.map((entry, index) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selected === entry.id }}
            onPress={() => setSelected(entry.id)}
            key={entry.id}
            style={[
              mainStyles.transaction,
              index > 0 && { borderTopWidth: 1, borderTopColor: c.outline },
            ]}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <Txt variant="label">{t('Aid received', 'Nadawat nga ayuda')}</Txt>
              <Txt variant="small">4Ps · {entry.date}</Txt>
              <Txt variant="small" style={{ fontSize: 10 }}>
                {entry.reference}
              </Txt>
            </View>
            <Txt variant="small" style={{ color: c.green, fontFamily: fonts.semibold }}>
              +{peso(entry.amount)}
            </Txt>
            {selected === entry.id && <Check size={18} color={c.primary} />}
          </Pressable>
        ))}
        {!claimCompleted && (
          <View style={mainStyles.transaction}>
            <View style={{ flex: 1 }}>
              <Txt variant="label">{t('Scheduled credit', 'Gikatakdang credit')}</Txt>
              <Txt variant="small">4Ps · July 10, 2025</Txt>
            </View>
            <Txt variant="small" style={{ color: c.amber }}>
              {peso(1500)}
            </Txt>
          </View>
        )}
      </Card>
      <Button variant="outline" onPress={() => go('receipt', { id: selected })}>
        {t('View selected receipt', 'Tan-awa ang napiling resibo')}
      </Button>
    </>
  );
}
function Receipt() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { claimCompleted, t } = useDemo();
  const entry =
    id === 'demo-claim' && claimCompleted
      ? { date: 'July 10, 2025', reference: 'DEMO-CLAIM-047', amount: 1500 }
      : transactions.find((item) => item.id === id);
  if (!entry)
    return (
      <Notice tone="warning">
        {t(
          'Receipt unavailable. Select a transaction in your history.',
          'Dili magamit ang resibo. Pagpili og transaksyon sa kasaysayan.',
        )}
      </Notice>
    );
  return (
    <>
      <View style={styles.row}>
        <CircleCheck color={c.green} size={40} />
        <View>
          <Txt variant="label">{t('Aid received', 'Nadawat nga ayuda')}</Txt>
          <Txt variant="title" style={{ color: c.green }}>
            +{peso(entry.amount)}
          </Txt>
        </View>
      </View>
      <Card>
        <DetailRow label={t('Program', 'Programa')} value={a.program} />
        <DetailRow label={t('Date', 'Petsa')} value={entry.date} />
        <DetailRow
          label={t('Reference No.', 'Numero sa reperensya')}
          value={entry.reference}
        />
      </Card>
      <Notice tone="warning">
        {t(
          'This is a simulated receipt, with no actual disbursement.',
          'Simulated nga resibo kini. Walay tinuod nga disbursement.',
        )}
      </Notice>
      <Button onPress={() => router.back()}>{t('Close', 'Sirad-i')}</Button>
    </>
  );
}

function Notifications() {
  const { readNotifications, markRead, t } = useDemo();
  const icons: Record<string, typeof Bell> = {
    schedule: CalendarDays,
    claim: CircleCheck,
    reminder: Bell,
    account: Info,
  };
  return (
    <>
      <Notice>
        {t(
          'Sample notifications · No SMS or push service is connected.',
          'Sample nga pahibalo · Wala pay SMS o push service.',
        )}
      </Notice>
      {notices.map((notice) => {
        const Icon = icons[notice.kind];
        return (
          <Pressable
            accessibilityRole="button"
            key={notice.id}
            onPress={() => {
              markRead(notice.id);
              go('notification-details', { id: notice.id });
            }}
          >
            <Card style={{ padding: 16, gap: 8 }}>
              <View style={[styles.row, { alignItems: 'flex-start' }]}>
                <Icon
                  size={19}
                  color={
                    notice.kind === 'claim'
                      ? c.green
                      : notice.kind === 'reminder'
                        ? c.amber
                        : c.primary
                  }
                />
                <View style={{ flex: 1, gap: 6 }}>
                  <View style={styles.row}>
                    <Txt variant="label" style={{ flex: 1 }}>
                      {t(notice.title, notice.titleBs)}
                    </Txt>
                    {!readNotifications.includes(notice.id) && (
                      <View
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 4,
                          backgroundColor: c.primary,
                        }}
                      />
                    )}
                  </View>
                  <Txt variant="small">{t(notice.body, notice.bodyBs)}</Txt>
                  <Txt variant="small" style={{ fontSize: 10 }}>
                    {notice.date}
                  </Txt>
                </View>
              </View>
            </Card>
          </Pressable>
        );
      })}
    </>
  );
}
function NotificationDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useDemo();
  const notice = notices.find((item) => item.id === id);
  if (!notice)
    return (
      <Notice>{t('Notification unavailable.', 'Dili magamit nga pahibalo.')}</Notice>
    );
  return (
    <>
      <Badge>{t('Sample notification', 'Sample nga pahibalo')}</Badge>
      <Txt variant="title">{t(notice.title, notice.titleBs)}</Txt>
      <Txt variant="small">{notice.date}</Txt>
      <Card>
        <Txt>{t(notice.body, notice.bodyBs)}</Txt>
      </Card>
      <Button
        onPress={() =>
          notice.kind === 'claim' ? router.replace('/(tabs)/wallet') : go('schedule')
        }
      >
        {notice.kind === 'claim'
          ? t('View my wallet', 'Tan-awa akong wallet')
          : t('View claiming schedule', 'Tan-awa ang iskedyul')}
      </Button>
    </>
  );
}

function Recovery() {
  const { phone, t } = useDemo();
  const [value, setValue] = useState(phone);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <>
      <View style={{ alignItems: 'center', gap: 12, paddingVertical: 12 }}>
        <ShieldCheck size={34} color={c.primary} />
        <Txt variant="heading">
          {t('Recover your account', 'Irecover ang imong account')}
        </Txt>
        <Txt variant="small" style={{ textAlign: 'center' }}>
          {t(
            'Enter the mobile number linked to your beneficiary account.',
            'Isulod ang numero nga nalambigit sa imong beneficiary account.',
          )}
        </Txt>
      </View>
      <PhoneField
        value={value}
        onChangeText={(s) => {
          setValue(s);
          setError('');
          setSent(false);
        }}
        error={error}
      />
      <Notice>
        {sent
          ? t(
              'Preview only: your request was validated. No recovery code was sent.',
              'Preview lamang: naverify ang request. Walay recovery code gipadala.',
            )
          : t(
              'When connected, a 6-digit verification code will be sent to your registered contact.',
              'Kon konektado na, ipadala ang 6 ka numero nga code sa imong rehistradong numero.',
            )}
      </Notice>
      <Button
        onPress={() => {
          if (!/^9\d{9}$/.test(value)) {
            setError(
              t(
                'Enter a 10-digit number starting with 9.',
                'Isulod ang 10 ka numero nga nagsugod sa 9.',
              ),
            );
            return;
          }
          setSent(true);
        }}
      >
        {t('Send verification code', 'Ipadala ang verification code')}
      </Button>
      <Button variant="outline" onPress={() => router.replace('/flow/login')}>
        {t('Back to login', 'Balik sa login')}
      </Button>
      <Txt variant="small" style={{ textAlign: 'center' }}>
        {t(
          'Account recovery requires the authentication backend.',
          'Kinahanglan ang authentication backend aron marecover ang account.',
        )}
      </Txt>
    </>
  );
}
function EditProfile() {
  const { name, setName, t } = useDemo();
  const [value, setValue] = useState(name);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  return (
    <>
      <Field
        label={t('Full name', 'Kompletong ngalan')}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          setSaved(false);
        }}
        error={error}
      />
      <Notice>
        {t(
          'Changes apply only to this preview session. Official beneficiary records are managed by authorized staff.',
          'Ang kausaban alang lamang niining preview. Ang opisyal nga rekord gidumala sa awtorisadong staff.',
        )}
      </Notice>
      {saved && (
        <Notice tone="success">
          {t(
            'Your preview profile has been updated.',
            'Nausab na ang profile sa preview.',
          )}
        </Notice>
      )}
      <Button
        onPress={() => {
          if (value.trim().length < 2) {
            setError(t('Enter your full name.', 'Isulod imong kompletong ngalan.'));
            return;
          }
          setName(value.trim());
          setError('');
          setSaved(true);
        }}
      >
        {t('Save details', 'Isave ang detalye')}
      </Button>
    </>
  );
}
function Password() {
  const { t } = useDemo();
  return (
    <>
      <Logo size={38} />
      <Txt variant="title">{t('Secure your account', 'Siguroha ang imong account')}</Txt>
      <Notice>
        {t(
          'This design uses phone-number login codes. Password changes will be available if your team adds password authentication to the backend.',
          'Kini nga design naggamit sa phone login codes. Magamit ang pag-usab sa password kon idugang sa backend.',
        )}
      </Notice>
      <Button onPress={() => go('reset-password')}>
        {t('Recover my account', 'Irecover akong account')}
      </Button>
    </>
  );
}
function NotificationSettings() {
  const { t } = useDemo();
  const [sms, setSms] = useState(true);
  const [push, setPush] = useState(true);
  return (
    <>
      <Card>
        {[
          {
            label: t('SMS schedule reminders', 'SMS nga pahinumdom'),
            value: sms,
            set: setSms,
          },
          {
            label: t('App notifications', 'Mga pahibalo sa app'),
            value: push,
            set: setPush,
          },
        ].map(({ label, value, set }) => (
          <View key={label} style={[styles.row, { justifyContent: 'space-between' }]}>
            <Txt variant="label" style={{ flex: 1 }}>
              {label}
            </Txt>
            <Switch
              accessibilityLabel={label}
              value={value}
              onValueChange={set}
              trackColor={{ false: c.outline, true: c.primary }}
              thumbColor={c.card}
            />
          </View>
        ))}
      </Card>
      <Notice>
        {t(
          'Preview preferences only. No notifications are sent, and settings reset when this screen closes.',
          'Mga gusto sa preview lamang. Walay pahibalo ipadala; mareset kon sirad-an ang screen.',
        )}
      </Notice>
    </>
  );
}

function EnrollmentStatus() {
  const { name, t } = useDemo();
  return (
    <>
      <Card>
        <View
          style={[
            styles.row,
            { justifyContent: 'space-between', alignItems: 'flex-start' },
          ]}
        >
          <Txt variant="label" style={{ flex: 1 }}>
            4Ps Program
          </Txt>
          <Badge>{t('Pending approval', 'Naghulat og pag-apruba')}</Badge>
        </View>
        <Txt variant="small">
          {name} · {t('Pending 3 days', 'Naghulat 3 ka adlaw')}
        </Txt>
        <Txt variant="small">{t('Submitted May 20, 2025', 'Gisumite Mayo 20, 2025')}</Txt>
      </Card>
      <Txt variant="small" style={{ fontFamily: fonts.semibold }}>
        {t('APPLICATION PROGRESS', 'PROGRESO SA APLIKASYON')}
      </Txt>
      <Card>
        {[
          {
            label: t('Account', 'Account'),
            value: t('Registered', 'Narehistro'),
            done: true,
          },
          {
            label: t('Documents', 'Mga dokumento'),
            value: t('Verified by facilitator', 'Naverify sa facilitator'),
            done: true,
          },
          {
            label: t('DSWD approval', 'Pag-apruba sa DSWD'),
            value: t('Currently under review', 'Gisusi pa karon'),
            done: false,
          },
        ].map((item) => (
          <View key={item.label} style={styles.row}>
            <CircleCheck size={20} color={item.done ? c.green : c.amber} />
            <View style={{ gap: 4 }}>
              <Txt variant="small">{item.label}</Txt>
              <Txt variant="label">{item.value}</Txt>
            </View>
          </View>
        ))}
      </Card>
      <Notice>
        {t(
          'Sample approval status. Documents are validated by an authorized DSWD facilitator.',
          'Sample nga status. Ang mga dokumento givalidate sa awtorisadong DSWD facilitator.',
        )}
      </Notice>
      <Button variant="outline" onPress={() => go('support')}>
        {t('Contact DSWD', 'Kontaka ang DSWD')}
      </Button>
      <Button variant="outline" onPress={() => go('enrollment-documents')}>
        {t('Preview missing documents', 'Tan-awa ang kulang nga dokumento')}
      </Button>
    </>
  );
}
function EnrollmentDocuments() {
  const { t } = useDemo();
  const [file, setFile] = useState('');
  const [error, setError] = useState('');
  const pick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        const selected = result.assets[0];
        if ((selected.size || 0) > 10 * 1024 * 1024) {
          setError(
            t('Choose a file smaller than 10 MB.', 'Pagpili og file nga ubos sa 10 MB.'),
          );
          return;
        }
        setFile(selected.name);
        setError('');
      }
    } catch {
      setError(
        t(
          'Could not select a file. Try again.',
          'Dili makapili og file. Sulayi pag-usab.',
        ),
      );
    }
  };
  return (
    <>
      <Badge>{t('Needs documents', 'Kinahanglan og dokumento')}</Badge>
      <Txt variant="heading">
        {t('Your application needs attention', 'Kinahanglan og pagtagad ang aplikasyon')}
      </Txt>
      <Txt variant="small">
        {t(
          'A facilitator must validate the missing requirement before approval.',
          'Kinahanglan ivalidate sa facilitator ang kulang sa dili pa aprubahan.',
        )}
      </Txt>
      <Card>
        <DetailRow
          icon={FileText}
          label={t('Proof of residence', 'Pamatuod sa pinuy-anan')}
          value={t('Status: Missing or unreadable', 'Kahimtang: Kulang o dili mabasa')}
        />
        <Txt variant="small">
          {t(
            'Bring the original document to your barangay or assigned DSWD facilitator.',
            'Dad-a ang orihinal nga dokumento sa barangay o sa DSWD facilitator.',
          )}
        </Txt>
      </Card>
      <Notice>
        {t(
          'Local file selection is available for this preview. Files are not uploaded or submitted to staff.',
          'Makapili og lokal nga file sa preview. Dili i-upload o isumite sa staff.',
        )}
      </Notice>
      {error ? <Notice tone="error">{error}</Notice> : null}
      {file ? (
        <Notice tone="success">
          {t('Selected locally: ', 'Napili sa lokal: ')}
          {file}
        </Notice>
      ) : null}
      <Button icon={FileText} onPress={pick}>
        {t('Choose sample document', 'Pagpili og sample nga dokumento')}
      </Button>
      <Button variant="outline" onPress={() => go('support')}>
        {t('Contact facilitator', 'Kontaka ang facilitator')}
      </Button>
      <Button variant="outline" onPress={() => go('enrollment-status')}>
        {t('View application status', 'Tan-awa ang kahimtang')}
      </Button>
    </>
  );
}
function Privacy() {
  const { consentGiven, setConsentGiven, setFaceEnrolled, t } = useDemo();
  const [revoked, setRevoked] = useState(false);
  return (
    <>
      <Card>
        <DetailRow
          icon={ShieldCheck}
          label={t('Face verification consent', 'Pagtugot sa face verification')}
          value={
            consentGiven
              ? t('Given in this preview', 'Gihatag sa preview')
              : t('Not given', 'Wala gihatag')
          }
        />
        <Txt variant="small">
          {t(
            'Face verification is optional. You may continue with your phone number.',
            'Opsyonal ang face verification. Pwede mopadayon gamit ang numero.',
          )}
        </Txt>
      </Card>
      <Notice>
        {t(
          'This preview keeps profile changes in memory and does not upload face photos. A production privacy notice and retention policy must be supplied before connecting the biometric service.',
          'Ang preview nagtipig sa kausaban sa memory ug dili mo-upload sa nawong. Kinahanglan ang privacy notice sa dili pa ikonektar ang biometric service.',
        )}
      </Notice>
      {revoked && (
        <Notice tone="success">
          {t(
            'Your preview consent has been withdrawn.',
            'Nabawi na ang pagtugot sa preview.',
          )}
        </Notice>
      )}
      <Button
        variant="outline"
        disabled={!consentGiven}
        onPress={() => {
          setConsentGiven(false);
          setFaceEnrolled(false);
          setRevoked(true);
        }}
      >
        {t('Withdraw face consent', 'Bawion ang pagtugot')}
      </Button>
      <Button onPress={() => flow('consent')}>
        {t('Review consent notice', 'Basaha ang pagtugot')}
      </Button>
    </>
  );
}

function Exception({ kind }: { kind: 'schedule' | 'expired' | 'review' }) {
  const { t } = useDemo();
  const definitions = {
    schedule: {
      badge: t('Rescheduled', 'Nausab ang iskedyul'),
      title: t('Your claiming schedule changed', 'Nausab ang iskedyul sa pag-claim'),
      body: t(
        'This sample shows how a schedule update will appear. Your assigned time is displayed below.',
        'Kini nga sample nagpakita sa nausab nga iskedyul. Tan-awa ang oras sa ubos.',
      ),
      tone: 'warning' as const,
    },
    expired: {
      badge: t('EXPIRED', 'EXPIRED'),
      title: t('This QR pass has expired', 'Na-expire na ang QR pass'),
      body: t(
        'Request a new pass or ask staff for help. This is a preview of the expired state.',
        'Paghangyo og bag-ong pass o tabang sa staff. Preview kini sa expired nga pass.',
      ),
      tone: 'error' as const,
    },
    review: {
      badge: t('NEEDS REVIEW', 'KINAHANGLAN SUSIHON'),
      title: t('Your claim needs staff review', 'Kinahanglan susihon sa staff ang claim'),
      body: t(
        'A verification issue or repeat attempt needs review. No assistance has been released by this preview.',
        'Kinahanglan susihon ang problema sa pagverify o balik nga claim. Walay ayuda gipagawas sa preview.',
      ),
      tone: 'warning' as const,
    },
  };
  const item = definitions[kind];
  return (
    <>
      <Badge tone={item.tone}>{item.badge}</Badge>
      <Txt variant="title">{item.title}</Txt>
      <Notice tone={item.tone}>{item.body}</Notice>
      {kind === 'schedule' && (
        <Card>
          <DetailRow icon={CalendarDays} label={t('Date', 'Petsa')} value={a.date} />
          <DetailRow icon={Clock3} label={t('Time', 'Oras')} value={a.time} />
          <DetailRow icon={MapPin} label={t('Venue', 'Lugar')} value={a.venue} />
        </Card>
      )}
      <Button onPress={() => (kind === 'schedule' ? go('schedule') : go('support'))}>
        {kind === 'schedule'
          ? t('View updated schedule', 'Tan-awa ang iskedyul')
          : t('Contact staff', 'Kontaka ang staff')}
      </Button>
      <Button variant="outline" onPress={() => go('qr-pass')}>
        {t('Back to QR pass', 'Balik sa QR pass')}
      </Button>
    </>
  );
}
function Support() {
  const { t } = useDemo();
  return (
    <>
      <View style={{ alignItems: 'center', paddingVertical: 16, gap: 14 }}>
        <MessageCircle size={46} color={c.primary} />
        <Txt variant="title">
          {t('Get help from staff', 'Pangayo og tabang sa staff')}
        </Txt>
      </View>
      <Card>
        <Txt variant="label">{a.venue}</Txt>
        <Txt>
          {t(
            'Visit your barangay facilitator for schedule, enrollment, or verification concerns.',
            'Duola ang barangay facilitator bahin sa iskedyul, enrollment, o pagverify.',
          )}
        </Txt>
      </Card>
      <Notice>
        {t(
          'Support preview only. No message or request has been sent. Staff contact details and escalation need the team’s backend.',
          'Support preview lamang. Walay mensahe o request gipadala. Kinahanglan ang backend alang sa staff contact ug escalation.',
        )}
      </Notice>
      <Button onPress={() => router.replace('/(tabs)/help')}>
        {t('Back to Help', 'Balik sa Tabang')}
      </Button>
    </>
  );
}
function FaceLogin() {
  const { t } = useDemo();
  return (
    <>
      <View style={{ alignItems: 'center', gap: 20, paddingVertical: 24 }}>
        <ScanFace size={72} color={c.primary} />
        <Txt variant="title">{t('Login with Face', 'Log in pinaagi sa Nawong')}</Txt>
      </View>
      <Notice>
        {t(
          'Face login requires the biometric service and authentication API. Use the demo phone login to explore the app.',
          'Kinahanglan ang biometric service ug authentication API. Gamita ang demo phone login aron masulayan ang app.',
        )}
      </Notice>
      <Button onPress={() => router.replace('/flow/login')}>
        {t('Use phone number', 'Gamita ang numero')}
      </Button>
    </>
  );
}
function VerifyClaim() {
  const { claimCompleted, setClaimCompleted, t } = useDemo();
  return (
    <>
      <View style={{ alignItems: 'center', gap: 16, paddingVertical: 12 }}>
        <ScanFace size={80} color={c.primary} />
        <Txt variant="title" style={{ textAlign: 'center' }}>
          {t('Verify your identity', 'Iverify imong pagkatawo')}
        </Txt>
        <Txt style={{ textAlign: 'center', color: c.muted }}>
          {t(
            'Staff confirm your identity at the distribution center before assistance is recorded.',
            'Iverify sa staff imong pagkatawo sa distribution center sa dili pa irekord ang ayuda.',
          )}
        </Txt>
      </View>
      <Card>
        <DetailRow label={t('Program', 'Programa')} value={a.program} />
        <DetailRow label={t('Queue number', 'Numero sa pila')} value={a.queue} />
      </Card>
      <Notice>
        {t(
          'This button demonstrates the successful screen only. No real biometric verification or claim approval occurs.',
          'Kini nga button nagpakita lamang sa success screen. Walay tinuod nga biometric verification o pag-apruba.',
        )}
      </Notice>
      <Button
        variant="green"
        onPress={() => {
          if (claimCompleted) {
            go('claim-review');
            return;
          }
          setClaimCompleted(true);
          router.replace('/claim-success');
        }}
      >
        {t('Preview successful claim', 'Tan-awa ang malampusong claim')}
      </Button>
      <Button variant="outline" onPress={() => go('claim-review')}>
        {t('Preview verification issue', 'Tan-awa ang problema sa pagverify')}
      </Button>
    </>
  );
}
function ClaimSuccess() {
  const { claimCompleted, t } = useDemo();
  if (!claimCompleted)
    return (
      <Page title={t('Claim confirmation', 'Kumpirmasyon sa claim')}>
        <Notice>
          {t(
            'Complete the preview claim flow to see this confirmation.',
            'Kompletoha ang preview claim aron makita ang kumpirmasyon.',
          )}
        </Notice>
        <Button onPress={() => router.replace('/qr-pass')}>
          {t('Open QR pass', 'Ablihi ang QR pass')}
        </Button>
      </Page>
    );
  return (
    <Page header={false} contentStyle={{ padding: 0 }}>
      <View style={s.claimSuccess}>
        <Logo size={28} />
        <View style={s.bigCheck}>
          <Check size={66} color={c.card} />
        </View>
        <Txt variant="title" style={{ color: c.card, textAlign: 'center' }}>
          {t('Claim successful!', 'Malampuson ang claim!')}
        </Txt>
        <Txt style={{ color: '#D5F1E7', textAlign: 'center' }}>
          {t('Your demo aid has been recorded.', 'Narekord na ang demo nga ayuda.')}
        </Txt>
        <View style={s.received}>
          <Txt variant="small" style={{ color: '#D5F1E7', letterSpacing: 1 }}>
            {t('YOU RECEIVED', 'IMONG NADAWAT')}
          </Txt>
          <Txt variant="number" style={{ color: c.card }}>
            {peso(1500)}
          </Txt>
          <Txt variant="small" style={{ color: '#D5F1E7' }}>
            {a.program}
          </Txt>
        </View>
        <Txt variant="small" style={{ color: '#D5F1E7' }}>
          {t('Added to your simulated wallet', 'Nadugang sa simulated wallet')}
        </Txt>
        <Button
          variant="white"
          style={{ width: '100%' }}
          onPress={() => router.replace('/(tabs)/home')}
        >
          {t('Done', 'Nahuman')}
        </Button>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Notice tone="warning">
          {t(
            'Prototype simulation — no actual aid or money was released.',
            'Prototype simulation — walay tinuod nga ayuda o kuwarta gipagawas.',
          )}
        </Notice>
      </View>
    </Page>
  );
}
const s = StyleSheet.create({
  claimSuccess: {
    backgroundColor: c.green,
    padding: 24,
    alignItems: 'center',
    gap: 20,
  },
  bigCheck: {
    height: 106,
    width: 106,
    borderRadius: 53,
    backgroundColor: '#32917C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  received: {
    padding: 22,
    borderRadius: 14,
    backgroundColor: '#32917C',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
});
