import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Colors } from '../constants/colors'
import { useAuth } from '../contexts/AuthContext'

function MenuItem({
  label,
  value,
  onPress,
  danger = false,
}: {
  label: string
  value?: string
  onPress: () => void
  danger?: boolean
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.menuLabel, danger && styles.dangerLabel]}>{label}</Text>
      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        {!danger && <Text style={styles.arrow}>›</Text>}
      </View>
    </TouchableOpacity>
  )
}

const PROVIDER_LABEL: Record<string, string> = {
  kakao: '카카오',
  naver: '네이버',
  google: 'Google',
}

export default function ProfileScreen() {
  const { user, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const initial = user?.name?.[0]?.toUpperCase() ?? 'U'

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true)
          await logout()
          // navigation은 AuthContext 상태 변경으로 자동 처리됨
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 프로필 영역 */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.userName}>{user?.name ?? '사용자'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          {user?.provider && (
            <View style={styles.providerTag}>
              <Text style={styles.providerTagText}>
                {PROVIDER_LABEL[user.provider]} 계정
              </Text>
            </View>
          )}
        </View>

        {/* 계정 */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>계정</Text>
          <View style={styles.menuGroup}>
            <MenuItem label="이름" value={user?.name} onPress={() => {}} />
            <MenuItem label="이메일" value={user?.email} onPress={() => {}} />
            <MenuItem label="알림 설정" onPress={() => {}} />
          </View>
        </View>

        {/* 앱 정보 */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>앱 정보</Text>
          <View style={styles.menuGroup}>
            <MenuItem label="버전" value="1.0.0" onPress={() => {}} />
            <MenuItem label="개인정보처리방침" onPress={() => {}} />
            <MenuItem label="이용약관" onPress={() => {}} />
            <MenuItem label="문의하기" onPress={() => {}} />
          </View>
        </View>

        {/* 로그아웃 */}
        <View style={[styles.menuSection, styles.lastSection]}>
          <View style={styles.menuGroup}>
            {loggingOut ? (
              <View style={styles.menuItem}>
                <ActivityIndicator color={Colors.error} />
              </View>
            ) : (
              <MenuItem label="로그아웃" onPress={handleLogout} danger />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: Colors.white,
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: Colors.primary },
  userName: { fontSize: 20, fontWeight: 'bold', color: Colors.gray900, marginBottom: 4 },
  userEmail: { fontSize: 14, color: Colors.gray400, marginBottom: 8 },
  providerTag: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  providerTagText: { fontSize: 12, color: Colors.gray500 },
  menuSection: { paddingHorizontal: 20, marginBottom: 20 },
  lastSection: { marginBottom: 40 },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray400,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuGroup: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    minHeight: 52,
  },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  menuLabel: { fontSize: 14, color: Colors.gray700 },
  menuValue: { fontSize: 14, color: Colors.gray400 },
  dangerLabel: {
    color: Colors.error,
    textAlign: 'center',
    flex: 1,
    fontWeight: '500',
  },
  arrow: { fontSize: 18, color: Colors.gray300 },
})
