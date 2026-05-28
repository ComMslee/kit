import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { Colors } from '../constants/colors'
import { useAuth } from '../contexts/AuthContext'
import { DemoBanner } from '../components/DemoBanner'

function StatCard({
  title,
  value,
  description,
  emoji,
}: {
  title: string
  value: string
  description: string
  emoji: string
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statDesc}>{description}</Text>
    </View>
  )
}

const PROVIDER_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  kakao: { label: '카카오', color: '#3C1E1E', bg: Colors.kakao },
  naver: { label: '네이버', color: Colors.white, bg: Colors.naver },
  google: { label: 'Google', color: Colors.gray700, bg: Colors.gray100 },
}

export default function HomeScreen() {
  const { user } = useAuth()
  const badge = user ? PROVIDER_BADGE[user.provider] : null
  const initial = user?.name?.[0]?.toUpperCase() ?? 'U'

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 데모 모드 배너 */}
      <DemoBanner />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>안녕하세요, {user?.name ?? '사용자'}님 👋</Text>
            <Text style={styles.subGreeting}>오늘도 좋은 하루 되세요.</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </View>

        {/* 로그인 프로바이더 뱃지 */}
        {badge && (
          <View style={[styles.providerBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.providerText, { color: badge.color }]}>
              {badge.label} 계정으로 로그인됨
            </Text>
          </View>
        )}

        {/* 통계 카드 */}
        <Text style={styles.sectionTitle}>현황 요약</Text>
        <View style={styles.statGrid}>
          <StatCard title="전체 사용자" value="0" description="총 가입자 수" emoji="👥" />
          <StatCard title="오늘 방문자" value="0" description="24시간 기준" emoji="👁️" />
          <StatCard title="이번달 매출" value="₩0" description="결제 완료" emoji="💰" />
          <StatCard title="처리 대기" value="0" description="확인 필요" emoji="📋" />
        </View>

        {/* 빠른 메뉴 */}
        <Text style={styles.sectionTitle}>빠른 메뉴</Text>
        <View style={styles.quickMenu}>
          {['공지사항', '문의 관리', '통계 보기', '설정'].map((item, index, arr) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.quickMenuItem,
                index === arr.length - 1 && styles.lastItem,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.quickMenuText}>{item}</Text>
              <Text style={styles.quickMenuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 12,
  },
  greeting: { fontSize: 20, fontWeight: 'bold', color: Colors.gray900 },
  subGreeting: { fontSize: 14, color: Colors.gray500, marginTop: 2 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '600', color: Colors.primary },
  providerBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  providerText: { fontSize: 12, fontWeight: '600' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: 12,
    marginTop: 8,
  },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statEmoji: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: Colors.gray900, marginBottom: 2 },
  statTitle: { fontSize: 13, fontWeight: '600', color: Colors.gray700, marginBottom: 2 },
  statDesc: { fontSize: 11, color: Colors.gray400 },
  quickMenu: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 32,
  },
  quickMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  lastItem: { borderBottomWidth: 0 },
  quickMenuText: { fontSize: 14, color: Colors.gray700 },
  quickMenuArrow: { fontSize: 18, color: Colors.gray300 },
})
