type IconProps = { className?: string };

// Google 멀티컬러 'G' 로고
export function GoogleIcon({ className }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.64 12.2045c0-.6381-.0573-1.2518-.1636-1.8409H12v3.4814h6.5382c-.2818 1.5182-1.1382 2.8045-2.4245 3.6668v3.0477h3.9245c2.2959-2.1141 3.6218-5.2268 3.6218-8.955z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.9564-1.0745 7.9418-2.9082l-3.9245-3.0477c-1.0864.7282-2.4764 1.1591-4.0173 1.1591-3.0873 0-5.7018-2.0855-6.6355-4.8873H1.2736v3.1418C3.2482 21.3232 7.3091 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.3645 14.3159c-.24-.7282-.3764-1.5054-.3764-2.3159s.1364-1.5877.3764-2.3159V6.5382H1.2736C.4636 8.1382 0 9.9518 0 12s.4636 3.8618 1.2736 5.4618l4.0909-3.1459z"
      />
      <path
        fill="#EA4335"
        d="M12 4.7727c1.7455 0 3.3109.6 4.5436 1.7782l3.4818-3.4818C17.9564 1.0454 15.2364 0 12 0 7.3091 0 3.2482 2.6768 1.2736 6.5382l4.0909 3.1459C6.2982 6.8582 8.9127 4.7727 12 4.7727z"
      />
    </svg>
  );
}

// Naver 'N' 로고 (currentColor → 부모 text 색상 상속)
export function NaverIcon({ className }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"
      />
    </svg>
  );
}
