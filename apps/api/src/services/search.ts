// 검색 서비스 — mock 구현 (Prisma LIKE)
// 실제 연동 시 이 파일만 교체: Algolia / Elasticsearch / Typesense
// 도메인 모델 추가 시 results 배열에 해당 엔티티 검색 결과 추가

import { prisma } from '../lib/prisma'
import type { SearchResult } from '@kit/types'

export async function search(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { id: true, name: true, email: true },
    take: 20,
  })

  return users.map((u: { id: string; name: string | null; email: string }) => ({
    type: 'user',
    id: u.id,
    label: u.name ?? u.email,
    sub: u.email,
  }))
}
