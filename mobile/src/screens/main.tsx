import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  Clock3,
  FileText,
  History,
  MapPin,
  ScanFace,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react-native';
import {
  Badge,
  Button,
  Card,
  DetailRow,
  flow,
  go,
  LanguageToggle,
  Logo,
  MenuRow,
  Notice,
  Page,
  styles,
  Txt,
} from '../components';
import { appointment as a, peso, transactions, useDemo } from '../state';
import { ApiRequestError, logout } from '../api';
import { formatDate, formatQueueNumber, formatStatus, formatTimeSlot } from '../format';
import { colors as c, fonts } from '../theme';

export function HomeScreen() {
  const {
    name,
    faceEnrolled,
    overview,
    overviewLoading,
    overviewError,
    refreshOverview,
    readNotifications,
    t,
  } = useDemo();
  const schedule = overview?.nextSchedule;
  return (
    <Page tabs header={false}>
      <View style={[styles.row, { flexWrap: 'wrap', gap: 8 }]}>
        <View style={[styles.row, { flex: 1, minWidth: 128, gap: 8 }]}>
          <Logo size={28} />
          <View style={{ flex: 1, gap: 2 }}>
            <Txt variant="small">{t('Good morning,', 'Maayong buntag,')}</Txt>
            <Txt variant="heading">{name}</Txt>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('Open notifications', 'Ablihi ang pahibalo')}
          onPress={() => go('notifications')}
          style={styles.iconButton}
        >
          <Bell size={22} color={c.muted} />
          {readNotifications.length < 4 && <View style={s.unreadDot} />}
        </Pressable>
        <View style={{ marginLeft: 'auto' }}>
          <LanguageToggle />
        </View>
      </View>
      {overviewLoading ? (
        <Card>
          <Txt variant="label">{t('Loading your schedule…', 'Nag-load sa imong iskedyul…')}</Txt>
        </Card>
      ) : overviewError ? (
        <>
          <Notice tone="error">
            {t(
              'Your enrollment and schedule could not be loaded.',
              'Wala ma-load ang imong enrollment ug iskedyul.',
            )}
          </Notice>
          <Button variant="outline" onPress={() => void refreshOverview()}>
            {t('Try again', 'Sulayi pag-usab')}
          </Button>
        </>
      ) : schedule ? (
        <View style={s.scheduleCard}>
          <View
            style={[
              styles.row,
              { justifyContent: 'space-between', alignItems: 'flex-start' },
            ]}
          >
            <Txt variant="small" style={s.cardCaption}>
              {t('YOUR NEXT CLAIMING\nSCHEDULE', 'IMONG SUNOD NGA\nISKEDYUL SA CLAIM')}
            </Txt>
            <Badge>{formatStatus(schedule.status)}</Badge>
          </View>
          <View style={s.cardDetails}>
            {[
              { Icon: ShieldCheck, value: schedule.program.name },
              { Icon: CalendarDays, value: formatDate(schedule.date) },
              { Icon: Clock3, value: formatTimeSlot(schedule.slotStart, schedule.slotEnd) },
            ].map(({ Icon, value }) => (
              <View key={value} style={[styles.row, { gap: 8 }]}>
                <Icon size={15} color="#C7E1FF" />
                <Txt variant="small" style={{ color: c.card, flex: 1 }}>
                  {value}
                </Txt>
              </View>
            ))}
          </View>
          <View style={s.queuePanel}>
            <View>
              <Txt variant="small" style={s.cardCaption}>
                {t('QUEUE NUMBER', 'NUMERO SA PILA')}
              </Txt>
              <Txt variant="number" style={{ color: c.card }}>
                {formatQueueNumber(schedule.queueNumber)}
              </Txt>
            </View>
            <View style={{ maxWidth: 135, flex: 1, gap: 4 }}>
              <Txt variant="small" style={[s.cardCaption, { textAlign: 'right' }]}>
                {t('VENUE', 'LUGAR')}
              </Txt>
              <Txt variant="small" style={{ color: c.card, textAlign: 'right' }}>
                {schedule.location}
              </Txt>
            </View>
          </View>
          <Button
            icon={CalendarDays}
            style={{ backgroundColor: '#3572AE' }}
            onPress={() => go('schedule')}
          >
            {t('View schedule details', 'Tan-awa ang detalye sa iskedyul')}
          </Button>
        </View>
      ) : (
        <Card>
          <CalendarDays size={28} color={c.primary} />
          <Txt variant="heading">{t('No claiming schedule yet', 'Wala pay iskedyul sa claim')}</Txt>
          <Txt variant="small">
            {t(
              'Your assigned schedule will appear here after your enrollment is approved.',
              'Makita dinhi ang imong iskedyul human maaprubahan ang enrollment.',
            )}
          </Txt>
        </Card>
      )}
      {!faceEnrolled && (
        <Pressable accessibilityRole="button" onPress={() => flow('consent')}>
          <Notice tone="warning">
            {t(
              'Action needed\nComplete your biometric enrollment for faster claiming.',
              'Kinahanglan og aksyon\nKompletoha ang face enrollment alang sa mas paspas nga claim.',
            )}
          </Notice>
        </Pressable>
      )}
      <Txt variant="label">{t('Quick actions', 'Dali nga mga aksyon')}</Txt>
      <View style={s.quickActions}>
        {[
          {
            label: t('Schedule', 'Iskedyul'),
            Icon: CalendarDays,
            onPress: () => go('schedule'),
            color: c.primary,
            bg: c.primarySoft,
          },
          {
            label: t('Ask for help', 'Mangayo og tabang'),
            Icon: CircleHelp,
            onPress: () => router.navigate('/(tabs)/help'),
            color: c.green,
            bg: c.greenSoft,
          },
          {
            label: t('Notifications', 'Mga pahibalo'),
            Icon: Bell,
            onPress: () => go('notifications'),
            color: c.amber,
            bg: c.amberSoft,
          },
        ].map(({ label, Icon, onPress, color, bg }) => (
          <Pressable
            accessibilityRole="button"
            key={label}
            onPress={onPress}
            style={s.quickAction}
          >
            <View style={[s.quickIcon, { backgroundColor: bg }]}>
              <Icon size={21} color={color} />
            </View>
            <Txt variant="small" style={{ textAlign: 'center', color: c.text }}>
              {label}
            </Txt>
          </Pressable>
        ))}
      </View>
      <Notice>
        {t(
          'Enrollment and schedule data come from your saved account. QR passes, claims, and wallet entries remain previews.',
          'Ang enrollment ug iskedyul gikan sa imong account. Preview pa ang QR pass, claims, ug wallet.',
        )}
      </Notice>
    </Page>
  );
}

export function WalletScreen() {
  const { claimCompleted, t } = useDemo();
  const [selected, setSelected] = useState<(typeof transactions)[number] | null>(null);
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
    <Page tabs title={t('My Wallet', 'Akong Wallet')} back={false}>
      <Notice tone="warning">
        {t(
          'Simulated wallet — no real money is transferred.',
          'Simulated wallet — walay tinuod nga kuwarta ibalhin.',
        )}
      </Notice>
      <View style={s.balanceCard}>
        <Txt variant="small" style={s.cardCaption}>
          {t('WALLET BALANCE', 'BALANSE SA WALLET')}
        </Txt>
        <Txt variant="number" style={{ color: c.card, fontSize: 34 }}>
          {peso(claimCompleted ? 4500 : 3000)}
        </Txt>
      </View>
      <Notice tone="warning">
        {t(
          'This is a simulated wallet. It records aid disbursements but does not hold or transfer real money.',
          'Simulated wallet kini. Nagrekord kini sa ayuda apan dili magkupot o magbalhin og tinuod nga kuwarta.',
        )}
      </Notice>
      <View style={[styles.row, { justifyContent: 'space-between' }]}>
        <Txt variant="label">{t('Recent transactions', 'Bag-ong mga transaksyon')}</Txt>
        <Pressable
          accessibilityRole="button"
          style={styles.iconButton}
          accessibilityLabel={t('View transaction history', 'Tan-awa ang kasaysayan')}
          onPress={() => go('transactions')}
        >
          <History size={20} color={c.primary} />
        </Pressable>
      </View>
      <Card style={{ gap: 0, paddingVertical: 4 }}>
        {entries.map((entry, index) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t('Open receipt', 'Ablihi ang resibo')}: ${entry.date}`}
            key={entry.id}
            style={[
              s.transaction,
              index > 0 && { borderTopWidth: 1, borderTopColor: c.outline },
            ]}
            onPress={() => setSelected(entry)}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <Txt variant="label">{t(entry.title, 'Nadawat nga ayuda')}</Txt>
              <Txt variant="small">4Ps · {entry.date}</Txt>
              <Txt variant="small" style={{ fontSize: 10 }}>
                {entry.reference}
              </Txt>
            </View>
            <Txt variant="label" style={{ color: c.green, fontSize: 13 }}>
              +{peso(entry.amount)}
            </Txt>
            <ChevronRight size={16} color={c.muted} />
          </Pressable>
        ))}
      </Card>
      <Button variant="outline" icon={FileText} onPress={() => go('transactions')}>
        {t('View transaction history', 'Tan-awa ang kasaysayan')}
      </Button>
      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={s.modalShade}>
          <View accessibilityViewIsModal style={s.receipt}>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <Txt variant="heading">{t('Receipt', 'Resibo')}</Txt>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('Close receipt', 'Sirad-i ang resibo')}
                onPress={() => setSelected(null)}
                style={styles.iconButton}
              >
                <X size={20} color={c.muted} />
              </Pressable>
            </View>
            <View style={styles.row}>
              <CircleCheck size={36} color={c.green} />
              <View>
                <Txt variant="label">{t('Aid received', 'Nadawat nga ayuda')}</Txt>
                <Txt variant="heading" style={{ color: c.green }}>
                  +{peso(selected?.amount || 0)}
                </Txt>
              </View>
            </View>
            {[
              { label: t('Program', 'Programa'), value: a.program },
              { label: t('Date', 'Petsa'), value: selected?.date },
              {
                label: t('Reference No.', 'Numero sa reperensya'),
                value: selected?.reference,
              },
            ].map(({ label, value }) => (
              <View
                key={label}
                style={[
                  styles.row,
                  { justifyContent: 'space-between', alignItems: 'flex-start' },
                ]}
              >
                <Txt variant="small">{label}</Txt>
                <Txt
                  variant="small"
                  style={{ color: c.text, maxWidth: '65%', textAlign: 'right' }}
                >
                  {value}
                </Txt>
              </View>
            ))}
            <Notice tone="warning">
              {t(
                'Simulated receipt. No funds were transferred.',
                'Simulated nga resibo. Walay kuwarta gibalhin.',
              )}
            </Notice>
            <Button onPress={() => setSelected(null)}>{t('Close', 'Sirad-i')}</Button>
          </View>
        </View>
      </Modal>
    </Page>
  );
}

export function ProfileScreen() {
  const { name, phone, beneficiary, accessToken, faceEnrolled, t, reset } = useDemo();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  return (
    <Page tabs title={t('My Profile', 'Akong Profile')} back={false}>
      <Card>
        <View style={styles.row}>
          <View style={s.avatar}>
            <Txt variant="heading" style={{ color: c.card }}>
              {name
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')}
            </Txt>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Txt variant="heading">{name}</Txt>
            <Txt variant="small">{beneficiary?.contactNumber ?? `+63${phone}`}</Txt>
          </View>
        </View>
        <Badge tone={beneficiary?.isVerified ? 'success' : 'warning'}>
          {beneficiary?.isVerified
            ? t('Verified account', 'Naverify nga account')
            : t('Verification pending', 'Naghulat sa verification')}
        </Badge>
      </Card>
      {beneficiary ? (
        <Card>
          <DetailRow
            icon={MapPin}
            label={t('Saved address', 'Natipig nga adres')}
            value={beneficiary.address}
          />
          <DetailRow
            icon={ShieldCheck}
            label={t('Account status', 'Kahimtang sa account')}
            value={beneficiary.status.charAt(0).toUpperCase() + beneficiary.status.slice(1)}
          />
        </Card>
      ) : null}
      <Card style={{ paddingVertical: 8 }}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <Txt variant="label">{t('Language', 'Pinulongan')}</Txt>
          <LanguageToggle full />
        </View>
      </Card>
      <Card style={{ gap: 0, paddingVertical: 4 }}>
        <MenuRow
          title={t('My saved details', 'Akong natipig nga detalye')}
          icon={UserRound}
          onPress={() => go('edit-profile')}
        />
        <MenuRow
          title={t('Change password', 'Usba ang password')}
          icon={ShieldCheck}
          onPress={() => go('change-password')}
        />
        <MenuRow
          title={t('Notification settings', 'Mga setting sa pahibalo')}
          icon={Bell}
          onPress={() => go('notification-settings')}
        />
        <MenuRow
          title={t('Enrollment status', 'Kahimtang sa enrollment')}
          icon={FileText}
          onPress={() => go('enrollment-status')}
        />
        <MenuRow
          title={t('Security & Privacy', 'Seguridad ug Privacy')}
          icon={ShieldCheck}
          onPress={() => go('security-privacy')}
        />
      </Card>
      <Card>
        <View style={styles.row}>
          <ScanFace size={20} color={c.primary} />
          <Txt variant="label">
            {t('Face verification settings', 'Face verification settings')}
          </Txt>
        </View>
        <Badge tone={faceEnrolled ? 'success' : 'warning'}>
          {faceEnrolled
            ? t('Enrolled in preview', 'Naenroll sa preview')
            : t('Not enrolled', 'Wala pa naenroll')}
        </Badge>
        <Button onPress={() => flow('consent')}>
          {faceEnrolled
            ? t('Review face enrollment', 'Tan-awa ang face enrollment')
            : t('Enroll face', 'Ienroll ang nawong')}
        </Button>
      </Card>
      {logoutError ? <Notice tone="error">{logoutError}</Notice> : null}
      <Button
        variant="outline"
        loading={logoutLoading}
        onPress={async () => {
          setLogoutLoading(true);
          setLogoutError('');
          try {
            if (accessToken) await logout(accessToken);
            await reset();
            router.replace('/');
          } catch (error) {
            if (error instanceof ApiRequestError && error.status === 401) {
              await reset();
              router.replace('/');
              return;
            }
            setLogoutError(
              error instanceof ApiRequestError
                ? error.message
                : t('Could not log out. Try again.', 'Wala maka-log out. Sulayi pag-usab.'),
            );
          } finally {
            setLogoutLoading(false);
          }
        }}
      >
        {t('Log out', 'Log out')}
      </Button>
    </Page>
  );
}
export const s = StyleSheet.create({
  scheduleCard: { backgroundColor: c.primary, borderRadius: 22, padding: 18, gap: 16 },
  cardCaption: {
    color: '#D2E5FC',
    fontSize: 10,
    letterSpacing: 1,
    fontFamily: fonts.medium,
    lineHeight: 15,
  },
  cardDetails: { gap: 9 },
  queuePanel: {
    backgroundColor: '#2A69A7',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  unreadDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: c.primary,
    right: 13,
    top: 12,
  },
  quickActions: { flexDirection: 'row', gap: 8 },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    minHeight: 82,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: { backgroundColor: c.primary, borderRadius: 16, padding: 20, gap: 8 },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    minHeight: 72,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.primary,
  },
  modalShade: {
    flex: 1,
    backgroundColor: 'rgba(16,31,53,.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  receipt: {
    backgroundColor: c.card,
    borderRadius: 20,
    padding: 20,
    gap: 20,
    width: '100%',
    maxWidth: 370,
  },
});
