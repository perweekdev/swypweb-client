'use client';

import type { ReactNode } from 'react';
import { Button } from '@components/ui/button';
import { CloseButton } from '@components/ui/close-button';
import { IconButton } from '@components/ui/icon-button';
import { LoginButton } from '@components/ui/login-button';
import { TabButton } from '@components/ui/tab-button';
import { ChevronLeftIcon } from '@components/icons';

/**
 * 공용 컴포넌트 카탈로그 (개발 확인용).
 * 도메인 화면과 무관하게 디자인 시스템 컴포넌트를 한눈에 확인한다.
 * 청크가 진행될 때마다 섹션을 추가한다.
 */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-secondary-50 py-8">
      <h2 className="mb-4 text-h3 text-secondary-900">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-body3 text-secondary-500">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function ComponentCatalogPage() {
  return (
    <main className="mx-auto max-w-[480px] px-5 py-6">
      <header className="pb-2">
        <h1 className="text-h1 text-secondary-900">컴포넌트 카탈로그</h1>
        <p className="mt-1 text-body3 text-secondary-500">
          공용 컴포넌트 라이브러리 확인용 · 청크별로 추가됨
        </p>
      </header>

      {/* ── 청크 1: 버튼/액션 atoms ─────────────────────────── */}
      <Section title="Button — CTA (shape=cta)">
        <Row label="primary · lg (하단 고정 full-width)">
          <div className="w-full">
            <Button variant="primary" size="lg">
              확인
            </Button>
          </div>
        </Row>
        <Row label="primary · lg · disabled">
          <div className="w-full">
            <Button variant="primary" size="lg" disabled>
              확인
            </Button>
          </div>
        </Row>
        <Row label="primary · md / sm">
          <Button variant="primary" shape="cta" size="md">
            Medium
          </Button>
          <Button variant="primary" shape="cta" size="sm">
            Small
          </Button>
        </Row>
      </Section>

      <Section title="Button — Pill (shape=pill)">
        <Row label="navy · lg / md / sm">
          <Button variant="navy" size="lg" shape="pill">
            교환 완료하기
          </Button>
          <Button variant="navy" size="md">
            완료
          </Button>
          <Button variant="navy" size="sm">
            로그인하기
          </Button>
        </Row>
        <Row label="navy · disabled">
          <Button variant="navy" size="md" disabled>
            완료
          </Button>
        </Row>
        <Row label="outline · lg / md / sm">
          <Button variant="outline" size="lg" shape="pill">
            상세 정보 보기
          </Button>
          <Button variant="outline" size="md">
            해제하기
          </Button>
          <Button variant="outline" size="sm">
            프로필 편집하기
          </Button>
        </Row>
        <Row label="primary · pill (예: 내교환 확인하기)">
          <Button variant="primary" size="sm">
            내교환 확인하기
          </Button>
        </Row>
      </Section>

      <Section title="LoginButton">
        <div className="w-full space-y-3">
          <LoginButton service="google" />
          <LoginButton service="naver" />
        </div>
      </Section>

      <Section title="TabButton / CloseButton / IconButton">
        <Row label="TabButton">
          <TabButton>추가하기</TabButton>
        </Row>
        <Row label="CloseButton (btn-close, 20px)">
          <CloseButton />
        </Row>
        <Row label="IconButton (touch-area 48 / 32)">
          <span className="bg-secondary-10">
            <IconButton aria-label="뒤로가기" area={48}>
              <ChevronLeftIcon className="size-6" />
            </IconButton>
          </span>
          <span className="bg-secondary-10">
            <IconButton aria-label="뒤로가기" area={32}>
              <ChevronLeftIcon className="size-4" />
            </IconButton>
          </span>
        </Row>
      </Section>
    </main>
  );
}
