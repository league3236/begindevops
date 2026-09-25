# namespace-slides

리눅스 커널 **Namespace** 발표 슬라이드를, 손으로 만든 `.pptx` 파일이 아니라
**코드로부터 생성**되도록 만든 자동화 스크립트입니다.

- 오픈소스 라이브러리 [PptxGenJS](https://github.com/gitbrent/PptxGenJS) (Node.js, MIT License) 사용
- 슬라이드 내용은 `generate-slides.js` 안의 `SLIDES` 배열에 데이터로 정의되어 있어서,
  내용을 고치고 싶으면 슬라이드 데이터만 수정하면 됩니다 (PowerPoint를 직접 열어 편집할 필요 없음)
- 학습 노트 원문은 [`../namespace.md`](../namespace.md) 참고

## 로컬 실행

```bash
npm install
npm run build
# -> dist/namespace-slides.pptx 생성됨
```

## CI (GitHub Actions)

`.github/workflows/build-namespace-slides.yml` 이 이 폴더에 변경이 생길 때마다
자동으로 `npm ci && npm run build`를 실행하고, 결과 `.pptx`를 워크플로 아티팩트로
업로드합니다. Actions 탭 → 해당 워크플로 실행 → Artifacts에서 다운로드 가능합니다.

## 슬라이드 구성 (21장)

1. 개념 — Namespace란 무엇인가, 필요성, 컨테이너와의 관계, 핵심 원리 (chroot → Namespace 역사, Namespace vs cgroup)
2. 종류별 상세 분석 — PID / Network / Mount / UTS / IPC / User / Cgroup / Time
3. 커널 구현 관점 — `nsproxy` 자료구조, `clone`/`unshare`/`setns`, `/proc/[pid]/ns/`, 생명주기
4. 실습 및 실무 적용 — `unshare`/`nsenter`, Docker·Kubernetes(pause 컨테이너)
5. 한계와 보안, 결론 — 운영 이슈, CVE-2019-5736 / CVE-2022-0185, 핵심 요약

모든 슬라이드의 출처는 man7.org(Linux man-pages), kernel.org(elixir.bootlin.com 소스),
docs.docker.com, kubernetes.io, nvd.nist.gov(CVE)입니다.
