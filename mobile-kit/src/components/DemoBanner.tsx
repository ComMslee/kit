import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

/**
 * 데모 모드 안내 배너
 * 백엔드 API 연동 전까지 표시 — 실제 서버 연동 후 제거하세요.
 */
export function DemoBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>🔧</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>데모 모드</Text>
        {'  '}서버 미연동 상태입니다. 로그인·데이터는 임시 값입니다.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
  },
})
