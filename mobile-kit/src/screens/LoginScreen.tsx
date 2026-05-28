import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { Colors } from '../constants/colors'
import { useAuth, AuthUser } from '../contexts/AuthContext'

// 프로바이더별 목업 유저 (실제 OAuth 연동 전까지 사용)
const MOCK_USERS: Record<string, AuthUser> = {
  kakao: {
    id: 'kakao_001',
    name: '카카오 사용자',
    email: 'user@kakao.com',
    provider: 'kakao',
  },
  naver: {
    id: 'naver_001',
    name: '네이버 사용자',
    email: 'user@naver.com',
    provider: 'naver',
  },
  google: {
    id: 'google_001',
    name: 'Google 사용자',
    email: 'user@gmail.com',
    provider: 'google',
  },
}

export default function LoginScreen() {
  const { login } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleLogin = async (provider: 'kakao' | 'naver' | 'google') => {
    setLoading(provider)
    try {
      // TODO: 실제 OAuth 흐름으로 교체
      // 현재는 1초 딜레이 후 목업 유저로 로그인
      await new Promise((r) => setTimeout(r, 1000))
      await login(MOCK_USERS[provider])
    } finally {
      setLoading(null)
    }
  }

  const isAnyLoading = loading !== null

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 로고 영역 */}
        <View style={styles.logoArea}>
          <Text style={styles.logo}>🚀</Text>
          <Text style={styles.appName}>Launch Kit</Text>
          <Text style={styles.tagline}>간편하게 시작하세요</Text>
        </View>

        {/* 소셜 로그인 버튼 */}
        <View style={styles.buttonArea}>
          {/* 카카오 */}
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: Colors.kakao }, isAnyLoading && styles.disabled]}
            onPress={() => handleLogin('kakao')}
            activeOpacity={0.8}
            disabled={isAnyLoading}
          >
            {loading === 'kakao' ? (
              <ActivityIndicator color="#3C1E1E" />
            ) : (
              <Text style={styles.kakaoText}>카카오로 시작하기</Text>
            )}
          </TouchableOpacity>

          {/* 네이버 */}
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: Colors.naver }, isAnyLoading && styles.disabled]}
            onPress={() => handleLogin('naver')}
            activeOpacity={0.8}
            disabled={isAnyLoading}
          >
            {loading === 'naver' ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.naverText}>네이버로 시작하기</Text>
            )}
          </TouchableOpacity>

          {/* 구글 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton, isAnyLoading && styles.disabled]}
            onPress={() => handleLogin('google')}
            activeOpacity={0.8}
            disabled={isAnyLoading}
          >
            {loading === 'google' ? (
              <ActivityIndicator color={Colors.gray700} />
            ) : (
              <View style={styles.googleInner}>
                <GoogleIcon />
                <Text style={styles.googleText}>Google로 시작하기</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          로그인 시 서비스 이용약관 및 개인정보처리방침에{'\n'}동의하게 됩니다.
        </Text>
      </View>
    </SafeAreaView>
  )
}

function GoogleIcon() {
  return (
    <Text style={{ fontSize: 16, marginRight: 4 }}>G</Text>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 56,
  },
  logo: {
    fontSize: 64,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.gray900,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: Colors.gray500,
  },
  buttonArea: {
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  googleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabled: {
    opacity: 0.7,
  },
  kakaoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3C1E1E',
  },
  naverText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
  googleText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.gray700,
  },
  footer: {
    fontSize: 12,
    color: Colors.gray400,
    textAlign: 'center',
    lineHeight: 18,
  },
})
