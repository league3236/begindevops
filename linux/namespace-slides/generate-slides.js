/**
 * generate-slides.js
 *
 * 리눅스 커널 Namespace 상세 분석 — 발표 슬라이드 자동 생성 스크립트
 *
 * 오픈소스 PptxGenJS(Node.js 기반, MIT License)를 사용해
 * .pptx(PowerPoint) 파일을 코드로부터 재현 가능하게 생성합니다.
 * https://github.com/gitbrent/PptxGenJS
 *
 * 사용법:
 *   npm install
 *   node generate-slides.js
 *   -> dist/namespace-slides.pptx 생성
 *
 * CI에서는 .github/workflows/build-namespace-slides.yml 이 push마다
 * 이 스크립트를 실행해 pptx를 빌드 아티팩트로 올려줍니다.
 */

const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");

// ---------------------------------------------------------------------------
// 디자인 토큰 (원본 발표 슬라이드 디자인과 동일한 팔레트)
// ---------------------------------------------------------------------------
const COLOR = {
  bg: "0B1220",
  card: "141F36",
  cardAlt: "10192B",
  border: "223049",
  text: "EEF2F7",
  muted: "9AA7B8",
  accent: "4FD8C4",
  blue: "5B8DEF",
};

const FONT = "Malgun Gothic"; // Windows 기본 한글 고딕. macOS/Linux에서는 Noto Sans KR 등으로 대체됨
const MONO = "Consolas";

// ---------------------------------------------------------------------------
// 슬라이드 데이터 정의 — 발표자료 원본 21장과 1:1 대응
// ---------------------------------------------------------------------------
const SLIDES = [
  {
    type: "title",
    eyebrow: "KERNEL DEEP DIVE",
    title: "리눅스 커널\nNamespace 상세 분석",
    subtitle: "프로세스 격리의 핵심 메커니즘 — 커널 내부 구조부터 컨테이너 실무 적용까지",
    footerLeft: "DevOps Engineering Deep Dive",
    footerRight: "2026",
  },
  {
    type: "content",
    section: "01 · 개념",
    title: "Namespace란 무엇인가",
    bullets: [
      "커널이 제공하는 전역 시스템 자원을 파티셔닝하여, 각 프로세스 그룹이 자신만의 독립된 자원 뷰를 갖도록 만드는 커널 기능",
      "같은 물리 커널 위에서 실행되는 프로세스들이 마치 서로 다른 시스템에서 동작하는 것처럼 격리됨 — 컨테이너 기술의 근간",
    ],
    ref: "man7.org/linux/man-pages/man7/namespaces.7.html",
  },
  {
    type: "content",
    section: "01 · 개념",
    title: "왜 Namespace가 필요한가",
    bullets: [
      "격리(Isolation): 한 프로세스의 장애가 다른 프로세스 자원에 영향을 주지 않도록 경계를 만듦",
      "멀티 테넌시: 여러 팀·애플리케이션이 같은 포트, 같은 호스트명을 독립적으로 사용",
      "경량 가상화: 하이퍼바이저 없이 커널 레벨 격리로 부팅 속도·오버헤드에서 유리",
    ],
    ref: "man7.org/linux/man-pages/man7/namespaces.7.html",
  },
  {
    type: "content",
    section: "01 · 개념",
    title: "격리 기술의 발전 — chroot에서 Namespace로",
    bullets: [
      "1979년 chroot: 루트 디렉토리만 격리, 네트워크·PID·사용자는 공유",
      "2002~2013년: Mount(2.4.19) → UTS/IPC(2.6.19) → PID(2.6.24) → Network(2.6.29) → User(3.8) → Cgroup(4.6) → Time(5.6) 순으로 커널 병합",
      "2013년 이후: Docker/OCI가 Namespace + cgroup + UnionFS를 조합해 표준 컨테이너 런타임 확립",
    ],
    ref: "man7.org/linux/man-pages/man7/namespaces.7.html",
  },
  {
    type: "table",
    section: "01 · 개념",
    title: "핵심 원리 — Namespace vs cgroup",
    headers: ["구분", "Namespace", "cgroup"],
    rows: [
      ["목적", "무엇을 볼 수 있는가 (가시성 격리)", "얼마나 쓸 수 있는가 (사용량 제한)"],
      ["대상", "PID · 네트워크 · 마운트 등 뷰", "CPU · 메모리 · I/O 등 수치"],
      ["구현 위치", "task_struct → nsproxy", "cgroupfs 기반 계층 구조"],
    ],
    ref: "man7.org/linux/man-pages/man7/cgroups.7.html",
  },
  {
    type: "table",
    section: "02 · 종류별 상세 분석",
    title: "커널이 제공하는 8가지 Namespace",
    headers: ["종류", "격리 대상", "도입 커널", "플래그"],
    rows: [
      ["PID", "프로세스 ID 공간", "2.6.24", "CLONE_NEWPID"],
      ["Network", "인터페이스 · 라우팅 · 포트", "2.6.29", "CLONE_NEWNET"],
      ["Mount", "마운트 포인트", "2.4.19", "CLONE_NEWNS"],
      ["UTS", "호스트명 · 도메인명", "2.6.19", "CLONE_NEWUTS"],
      ["IPC", "세마포어 · 메시지큐 · 공유메모리", "2.6.19", "CLONE_NEWIPC"],
      ["User", "UID/GID 매핑", "3.8", "CLONE_NEWUSER"],
      ["Cgroup", "cgroup 계층 구조 뷰", "4.6", "CLONE_NEWCGROUP"],
      ["Time", "부팅/단조 시계 오프셋", "5.6", "CLONE_NEWTIME"],
    ],
    ref: "man7.org/linux/man-pages/man7/namespaces.7.html",
  },
  {
    type: "content",
    section: "02 · 종류별 상세 분석",
    title: "PID Namespace",
    bullets: [
      "프로세스 ID 공간 격리. 새 네임스페이스의 첫 프로세스는 항상 PID 1",
      "PID 1이 종료되면 네임스페이스 내 모든 프로세스가 SIGKILL로 정리됨",
      "좀비 프로세스 수거(reap) 책임이 PID 1에 위임 — 컨테이너 init 설계 시 중요",
    ],
    ref: "man7.org/linux/man-pages/man7/pid_namespaces.7.html",
  },
  {
    type: "content",
    section: "02 · 종류별 상세 분석",
    title: "Network Namespace",
    bullets: [
      "네트워크 인터페이스, IP, 라우팅 테이블, 포트 공간을 독립적으로 보유",
      "veth pair로 네임스페이스 간 가상 링크를 만들어 브리지에 연결",
      "Kubernetes Pod는 컨테이너 간 Network Namespace를 공유해 localhost 통신 가능",
    ],
    ref: "man7.org/linux/man-pages/man7/network_namespaces.7.html",
  },
  {
    type: "content",
    section: "02 · 종류별 상세 분석",
    title: "Mount Namespace",
    bullets: [
      "2002년 가장 먼저 구현. 프로세스마다 독립된 마운트 테이블 보유",
      "pivot_root로 컨테이너 rootfs 교체",
      "전파 방식(shared/private/slave/unbindable) — Docker는 기본 private",
    ],
    ref: "man7.org/linux/man-pages/man7/mount_namespaces.7.html",
  },
  {
    type: "content",
    section: "02 · 종류별 상세 분석",
    title: "UTS Namespace & IPC Namespace",
    bullets: [
      "UTS: 호스트명 · 도메인명 격리 → 컨테이너마다 독립된 hostname",
      "IPC: System V IPC(세마포어, 메시지 큐, 공유 메모리) 격리",
    ],
    ref: "man7.org/linux/man-pages/man7/uts_namespaces.7.html · ipc_namespaces.7.html",
  },
  {
    type: "content",
    section: "02 · 종류별 상세 분석",
    title: "User Namespace",
    bullets: [
      "2013년 안정화, 가장 강력한 Namespace. UID/GID를 네임스페이스별로 매핑",
      "컨테이너 내부 UID 0(root)이 호스트에서는 일반 사용자로 매핑 가능 → Rootless 컨테이너의 핵심",
      "/proc/[pid]/uid_map, gid_map 파일로 매핑 규칙 정의",
    ],
    ref: "man7.org/linux/man-pages/man7/user_namespaces.7.html",
  },
  {
    type: "content",
    section: "02 · 종류별 상세 분석",
    title: "Cgroup Namespace & Time Namespace",
    bullets: [
      "Cgroup(2016): /proc/self/cgroup을 자기 cgroup이 루트처럼 보이게 해 호스트 구조 정보 유출 방지",
      "Time(2020): 부팅 시각 · 단조 시계에 오프셋 적용 — 라이브 마이그레이션 시 uptime 불일치 방지",
    ],
    ref: "man7.org/linux/man-pages/man7/cgroup_namespaces.7.html · time_namespaces.7.html",
  },
  {
    type: "code",
    section: "03 · 커널 구현 관점",
    title: "커널 자료구조 — nsproxy",
    code: [
      "struct nsproxy {",
      "    atomic_t count;",
      "    struct uts_namespace *uts_ns;",
      "    struct ipc_namespace *ipc_ns;",
      "    struct mnt_namespace *mnt_ns;",
      "    struct pid_namespace *pid_ns_for_children;",
      "    struct net *net_ns;",
      "    struct time_namespace *time_ns;",
      "    struct cgroup_namespace *cgroup_ns;",
      "};",
    ],
    bullets: [
      "task_struct 안의 nsproxy 포인터 하나로 네임스페이스 집합 참조",
      "User · Cgroup Namespace는 nsproxy가 아닌 별도 필드로 관리",
      "참조 카운트 기반 — 여러 프로세스가 공유하다 unshare 시 전체 복제",
    ],
    ref: "elixir.bootlin.com/linux/v5.14.8/source/include/linux/nsproxy.h",
  },
  {
    type: "content",
    section: "03 · 커널 구현 관점",
    title: "관련 시스템 콜 3가지",
    bullets: [
      "clone(): 새 프로세스 생성 + CLONE_NEW* 플래그로 새 네임스페이스 배정",
      "unshare(): 새 프로세스 없이 현재 프로세스를 새 네임스페이스로 분리",
      "setns(): 기존 네임스페이스에 현재 프로세스를 합류 — nsenter, docker exec의 기반",
    ],
    ref: "man7.org/linux/man-pages/man2/clone.2.html · unshare.2.html · setns.2.html",
  },
  {
    type: "content",
    section: "03 · 커널 구현 관점",
    title: "/proc/[pid]/ns/ 인터페이스",
    bullets: [
      '각 심볼릭 링크는 "네임스페이스 종류:[inode 번호]" 형태',
      "inode 번호가 같으면 같은 네임스페이스 소속",
      "파일 open()으로 얻은 fd를 열어두면 프로세스가 죽어도 네임스페이스 유지 → setns()에 전달 가능",
    ],
    ref: "man7.org/linux/man-pages/man7/namespaces.7.html",
  },
  {
    type: "content",
    section: "03 · 커널 구현 관점",
    title: "Namespace 생명주기",
    bullets: [
      "생성(clone/unshare) → 공유(fork 시 참조 카운트 증가) → 유지(fd/바인드 마운트로 pin) → 해제(참조 카운트 0)",
      "운영 팁: docker exec로 네임스페이스 fd를 오래 열어두면 컨테이너가 죽어도 네임스페이스가 회수되지 않는 누수 발생 가능",
    ],
    ref: "man7.org/linux/man-pages/man7/namespaces.7.html",
  },
  {
    type: "code",
    section: "04 · 실습 및 실무 적용",
    title: "직접 만들어보는 Namespace",
    code: [
      "$ unshare --pid --net --mount --uts --fork bash",
      "$ nsenter -t <PID> -n -m bash",
    ],
    bullets: [
      "unshare: 새로 격리된 네임스페이스에서 셸 실행",
      "nsenter: 실행 중인 프로세스(컨테이너)의 네임스페이스에 진입",
      "실무 팁: 컨테이너 네트워크 트러블슈팅 시 nsenter로 들어가 tcpdump를 붙이는 방식을 자주 사용",
    ],
    ref: "man7.org/linux/man-pages/man1/unshare.1.html · nsenter.1.html",
  },
  {
    type: "content",
    section: "04 · 실습 및 실무 적용",
    title: "Docker · Kubernetes에서의 Namespace",
    bullets: [
      "Docker/containerd: runc가 clone() 플래그로 여러 Namespace를 한 번에 생성, cgroup으로 자원 제한. docker run --network host는 Network Namespace 생성을 건너뜀",
      "Kubernetes: Pod 내 컨테이너가 Network·IPC Namespace를 공유, 담당은 pause 컨테이너(infra container)",
      "shareProcessNamespace: true 로 PID Namespace도 공유 가능",
    ],
    ref: "docs.docker.com/engine/network/drivers/host/ · kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/",
  },
  {
    type: "content",
    section: "05 · 한계와 보안, 결론",
    title: "운영에서 겪는 이슈와 근본적 한계",
    bullets: [
      "PID Namespace 고갈: 좀비 프로세스가 많은 노드에서 새 컨테이너 생성 실패 가능 (PID 최대값은 전역 자원)",
      "Network Namespace 누수: CNI 플러그인의 veth/netns 정리 실패로 IP 고갈",
      "근본 한계: Namespace는 뷰의 격리일 뿐 커널 코드 자체는 공유 → 커널 취약점은 모든 컨테이너에 영향",
    ],
    ref: "man7.org/linux/man-pages/man7/namespaces.7.html",
  },
  {
    type: "content",
    section: "05 · 한계와 보안, 결론",
    title: "보안 고려사항",
    bullets: [
      "User Namespace와 권한 상승: CAP_SYS_ADMIN을 가진 컨테이너가 새 User ns로 호스트 권한 우회 시도 사례",
      "CVE-2019-5736 (runc): /proc/self/exe 조작으로 호스트 runc 바이너리 덮어쓰기",
      "CVE-2022-0185: 커널 Filesystem Context 힙 오버플로로 Mount ns 경계를 넘는 권한 상승",
      "방어: seccomp + AppArmor/SELinux + non-root 컨테이너 + 최소 Capability를 Namespace와 함께 적용",
    ],
    ref: "nvd.nist.gov/vuln/detail/CVE-2019-5736 · nvd.nist.gov/vuln/detail/CVE-2022-0185",
  },
  {
    type: "summary",
    section: "05 · 결론",
    title: "핵심 요약",
    bullets: [
      "Namespace는 뷰를 격리, cgroup은 사용량을 제한",
      "8종의 Namespace가 nsproxy를 통해 프로세스에 연결, clone·unshare·setns로 제어",
      "커널 공유라는 근본적 한계 → 추가 보안 계층과 함께 적용해야 실질적 격리 완성",
    ],
  },
];

// ---------------------------------------------------------------------------
// 렌더링
// ---------------------------------------------------------------------------
function renderTitleSlide(pptx, s) {
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bg };

  slide.addText(s.eyebrow, {
    x: 0.6, y: 0.6, w: 6, h: 0.4,
    fontFace: MONO, fontSize: 14, color: COLOR.accent, bold: true,
  });
  slide.addText(s.title, {
    x: 0.6, y: 2.3, w: 11.5, h: 2.2,
    fontFace: FONT, fontSize: 40, color: COLOR.text, bold: true,
  });
  slide.addText(s.subtitle, {
    x: 0.6, y: 4.5, w: 10.5, h: 0.8,
    fontFace: FONT, fontSize: 16, color: COLOR.muted,
  });
  slide.addText(s.footerLeft, {
    x: 0.6, y: 6.9, w: 6, h: 0.35,
    fontFace: MONO, fontSize: 11, color: COLOR.blue,
  });
  slide.addText(s.footerRight, {
    x: 11.5, y: 6.9, w: 1.3, h: 0.35,
    fontFace: MONO, fontSize: 11, color: COLOR.blue, align: "right",
  });
}

function addHeader(slide, s) {
  slide.addText(s.section, {
    x: 0.6, y: 0.35, w: 8, h: 0.3,
    fontFace: MONO, fontSize: 12, color: COLOR.accent, bold: true,
  });
  slide.addText(s.title, {
    x: 0.6, y: 0.65, w: 12, h: 0.7,
    fontFace: FONT, fontSize: 26, color: COLOR.text, bold: true,
  });
}

function addFooter(slide, s, pageNum) {
  if (s.ref) {
    slide.addText(`참고: ${s.ref}`, {
      x: 0.6, y: 7.05, w: 11, h: 0.3,
      fontFace: MONO, fontSize: 9, color: COLOR.muted,
    });
  }
  slide.addText(String(pageNum).padStart(2, "0"), {
    x: 12.4, y: 7.05, w: 0.6, h: 0.3,
    fontFace: MONO, fontSize: 10, color: COLOR.muted, align: "right",
  });
}

function renderContentSlide(pptx, s, pageNum) {
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bg };
  addHeader(slide, s);

  slide.addText(
    s.bullets.map((b) => ({ text: b, options: { bullet: { code: "2022" }, breakLine: true } })),
    {
      x: 0.7, y: 1.8, w: 11.9, h: 4.6,
      fontFace: FONT, fontSize: 16, color: COLOR.text,
      lineSpacingMultiple: 1.4, valign: "top",
    }
  );
  addFooter(slide, s, pageNum);
}

function renderTableSlide(pptx, s, pageNum) {
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bg };
  addHeader(slide, s);

  const headerRow = s.headers.map((h) => ({
    text: h,
    options: { fill: { color: COLOR.card }, color: COLOR.accent, bold: true },
  }));
  const bodyRows = s.rows.map((row) =>
    row.map((cell, i) => ({
      text: cell,
      options: {
        fill: { color: COLOR.cardAlt },
        color: i === 0 ? COLOR.text : COLOR.muted,
        bold: i === 0,
      },
    }))
  );

  slide.addTable([headerRow, ...bodyRows], {
    x: 0.6, y: 1.7, w: 12.1,
    fontFace: FONT, fontSize: 13,
    border: { type: "solid", color: COLOR.border, pt: 0.5 },
    autoPage: false,
  });
  addFooter(slide, s, pageNum);
}

function renderCodeSlide(pptx, s, pageNum) {
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bg };
  addHeader(slide, s);

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: 1.75, w: 6.0, h: 4.5,
    fill: { color: COLOR.cardAlt },
    line: { color: COLOR.border, width: 1 },
    rectRadius: 0.08,
  });
  slide.addText(s.code.join("\n"), {
    x: 0.9, y: 1.95, w: 5.5, h: 4.1,
    fontFace: MONO, fontSize: 12, color: COLOR.blue, valign: "top",
  });

  slide.addText(
    s.bullets.map((b) => ({ text: b, options: { bullet: { code: "2022" }, breakLine: true } })),
    {
      x: 6.9, y: 1.95, w: 5.7, h: 4.3,
      fontFace: FONT, fontSize: 14, color: COLOR.text,
      lineSpacingMultiple: 1.4, valign: "top",
    }
  );
  addFooter(slide, s, pageNum);
}

function renderSummarySlide(pptx, s) {
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.bg };
  addHeader(slide, s);

  s.bullets.forEach((b, i) => {
    const y = 2.0 + i * 1.5;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.7, y, w: 11.9, h: 1.2,
      fill: { color: COLOR.card },
      line: { color: COLOR.border, width: 1 },
      rectRadius: 0.06,
    });
    slide.addText(String(i + 1), {
      x: 0.95, y: y + 0.15, w: 0.6, h: 0.6,
      fontFace: MONO, fontSize: 20, color: COLOR.accent, bold: true,
    });
    slide.addText(b, {
      x: 1.7, y: y + 0.1, w: 10.6, h: 0.9,
      fontFace: FONT, fontSize: 15, color: COLOR.text, valign: "middle",
    });
  });
}

// ---------------------------------------------------------------------------
// 메인
// ---------------------------------------------------------------------------
function main() {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
  pptx.layout = "WIDE";
  pptx.author = "league3236";
  pptx.title = "리눅스 커널 Namespace 상세 분석";

  let pageNum = 1;
  for (const s of SLIDES) {
    if (s.type === "title") {
      renderTitleSlide(pptx, s);
    } else if (s.type === "table") {
      pageNum += 1;
      renderTableSlide(pptx, s, pageNum);
    } else if (s.type === "code") {
      pageNum += 1;
      renderCodeSlide(pptx, s, pageNum);
    } else if (s.type === "summary") {
      renderSummarySlide(pptx, s);
    } else {
      pageNum += 1;
      renderContentSlide(pptx, s, pageNum);
    }
  }

  const outDir = path.join(__dirname, "dist");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "namespace-slides.pptx");

  pptx.writeFile({ fileName: outFile }).then(() => {
    console.log(`Generated: ${outFile}`);
  });
}

main();
