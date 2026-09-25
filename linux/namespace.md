# 리눅스 커널 Namespace 상세 분석

카카오페이 DevOps 이직 준비용으로 정리한 커널 Namespace 학습 노트입니다.
슬라이드 형태(발표 자료)는 [`namespace-slides/`](./namespace-slides) 폴더의
Node.js(PptxGenJS) 자동화 스크립트로 생성합니다 — 실행 방법은 해당 폴더의 README 참고.

## 목차

1. [개념](#1-개념)
2. [종류별 상세 분석](#2-종류별-상세-분석)
3. [커널 구현 관점](#3-커널-구현-관점)
4. [실습 및 실무 적용](#4-실습-및-실무-적용)
5. [한계와 보안, 결론](#5-한계와-보안-결론)

---

## 1. 개념

### Namespace란 무엇인가

커널이 제공하는 전역 시스템 자원을 파티셔닝하여, 각 프로세스 그룹이 자신만의 독립된
자원 뷰를 갖도록 만드는 커널 기능. 같은 물리 커널 위에서 실행되는 프로세스들이 마치
서로 다른 시스템에서 동작하는 것처럼 격리됨 — 컨테이너 기술의 근간.

> 참고: [man7.org — namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

### 왜 필요한가

- **격리(Isolation)**: 한 프로세스의 장애가 다른 프로세스 자원에 영향을 주지 않도록 경계를 만듦
- **멀티 테넌시**: 여러 팀·애플리케이션이 같은 포트, 같은 호스트명을 독립적으로 사용
- **경량 가상화**: 하이퍼바이저 없이 커널 레벨 격리로 부팅 속도·오버헤드에서 유리

### 격리 기술의 발전 — chroot에서 Namespace로

| 시기 | 사건 |
|---|---|
| 1979 | chroot 등장 — 루트 디렉토리만 격리, 네트워크·PID·사용자는 공유 |
| 2002 (2.4.19) | Mount Namespace 최초 구현 |
| 2006 (2.6.19) | UTS, IPC Namespace |
| 2008 (2.6.24) | PID Namespace |
| 2009 (2.6.29) | Network Namespace |
| 2013 (3.8) | User Namespace 안정화 (Rootless 컨테이너의 토대) |
| 2016 (4.6) | Cgroup Namespace |
| 2020 (5.6) | Time Namespace |
| 2013~ | Docker/OCI가 Namespace + cgroup + UnionFS를 조합해 표준 컨테이너 런타임 확립 |

컨테이너는 새로운 가상화 기술이 아니라, 커널이 이미 갖고 있던 격리 기능들을 잘 엮은
결과물이다.

### 핵심 원리 — Namespace vs cgroup

| 구분 | Namespace | cgroup |
|---|---|---|
| 목적 | 무엇을 볼 수 있는가 (가시성 격리) | 얼마나 쓸 수 있는가 (사용량 제한) |
| 대상 | PID · 네트워크 · 마운트 등 뷰 | CPU · 메모리 · I/O 등 수치 |
| 구현 위치 | `task_struct → nsproxy` | cgroupfs 기반 계층 구조 |

> 참고: [man7.org — cgroups(7)](https://man7.org/linux/man-pages/man7/cgroups.7.html)

---

## 2. 종류별 상세 분석

| 종류 | 격리 대상 | 도입 커널 | 플래그 |
|---|---|---|---|
| PID | 프로세스 ID 공간 | 2.6.24 | `CLONE_NEWPID` |
| Network | 인터페이스 · 라우팅 · 포트 | 2.6.29 | `CLONE_NEWNET` |
| Mount | 마운트 포인트 | 2.4.19 | `CLONE_NEWNS` |
| UTS | 호스트명 · 도메인명 | 2.6.19 | `CLONE_NEWUTS` |
| IPC | 세마포어 · 메시지큐 · 공유메모리 | 2.6.19 | `CLONE_NEWIPC` |
| User | UID/GID 매핑 | 3.8 | `CLONE_NEWUSER` |
| Cgroup | cgroup 계층 구조 뷰 | 4.6 | `CLONE_NEWCGROUP` |
| Time | 부팅/단조 시계 오프셋 | 5.6 | `CLONE_NEWTIME` |

### PID Namespace

프로세스 ID 공간 격리. 새 네임스페이스의 첫 프로세스는 항상 PID 1이 된다.
PID 1이 종료되면 네임스페이스 내 모든 프로세스가 SIGKILL로 정리된다. 좀비
프로세스 수거(reap) 책임이 PID 1에 위임되므로, 컨테이너 init 설계 시 중요하다
(tini 같은 경량 init을 쓰는 이유).

> 참고: [pid_namespaces(7)](https://man7.org/linux/man-pages/man7/pid_namespaces.7.html)

### Network Namespace

네트워크 인터페이스, IP, 라우팅 테이블, 포트 공간을 독립적으로 보유한다.
`veth` pair로 네임스페이스 간 가상 링크를 만들어 브리지에 연결한다. Kubernetes
Pod는 컨테이너 간 Network Namespace를 공유해 `localhost` 통신이 가능하다.

> 참고: [network_namespaces(7)](https://man7.org/linux/man-pages/man7/network_namespaces.7.html)

### Mount Namespace

2002년 가장 먼저 구현되었다. 프로세스마다 독립된 마운트 테이블을 보유하며,
`pivot_root`로 컨테이너 rootfs를 교체한다. 전파 방식(`shared`/`private`/`slave`/
`unbindable`)을 이해하고 있어야 하며, Docker는 기본적으로 `private`를 쓴다.

> 참고: [mount_namespaces(7)](https://man7.org/linux/man-pages/man7/mount_namespaces.7.html)

### UTS Namespace & IPC Namespace

- **UTS**: 호스트명 · 도메인명 격리 → 컨테이너마다 독립된 hostname
- **IPC**: System V IPC(세마포어, 메시지 큐, 공유 메모리) 격리

> 참고: [uts_namespaces(7)](https://man7.org/linux/man-pages/man7/uts_namespaces.7.html) ·
> [ipc_namespaces(7)](https://man7.org/linux/man-pages/man7/ipc_namespaces.7.html)

### User Namespace

2013년 안정화된, 가장 강력한 Namespace. UID/GID를 네임스페이스별로 매핑한다.
컨테이너 내부 UID 0(root)이 호스트에서는 일반 사용자로 매핑될 수 있는데, 이것이
Rootless 컨테이너의 핵심이다. `/proc/[pid]/uid_map`, `gid_map` 파일로 매핑
규칙을 정의한다.

> 참고: [user_namespaces(7)](https://man7.org/linux/man-pages/man7/user_namespaces.7.html)

### Cgroup Namespace & Time Namespace

- **Cgroup(2016)**: `/proc/self/cgroup`이 자기 cgroup을 루트처럼 보이게 해 호스트 구조 정보 유출 방지
- **Time(2020)**: 부팅 시각 · 단조 시계에 오프셋 적용 — 라이브 마이그레이션 시 uptime 불일치 방지

> 참고: [cgroup_namespaces(7)](https://man7.org/linux/man-pages/man7/cgroup_namespaces.7.html) ·
> [time_namespaces(7)](https://man7.org/linux/man-pages/man7/time_namespaces.7.html)

---

## 3. 커널 구현 관점

### 커널 자료구조 — nsproxy

```c
struct nsproxy {
    atomic_t count;
    struct uts_namespace *uts_ns;
    struct ipc_namespace *ipc_ns;
    struct mnt_namespace *mnt_ns;
    struct pid_namespace *pid_ns_for_children;
    struct net *net_ns;
    struct time_namespace *time_ns;
    struct cgroup_namespace *cgroup_ns;
};
```

- `task_struct` 안의 `nsproxy` 포인터 하나로 네임스페이스 집합을 참조한다.
- User · Cgroup Namespace는 `nsproxy`가 아닌 별도 필드로 관리된다.
- 참조 카운트(`count`) 기반이라 여러 프로세스가 공유하다가, `unshare` 등으로
  하나가 분리되는 순간 nsproxy 전체가 복제된다.

> 참고: [elixir.bootlin.com — nsproxy.h (v5.14.8)](https://elixir.bootlin.com/linux/v5.14.8/source/include/linux/nsproxy.h)

### 관련 시스템 콜 3가지

- **`clone()`**: 새 프로세스 생성 + `CLONE_NEW*` 플래그로 새 네임스페이스 배정
- **`unshare()`**: 새 프로세스 없이 현재 프로세스를 새 네임스페이스로 분리
- **`setns()`**: 기존 네임스페이스에 현재 프로세스를 합류 — `nsenter`, `docker exec`의 기반

> 참고: [clone(2)](https://man7.org/linux/man-pages/man2/clone.2.html) ·
> [unshare(2)](https://man7.org/linux/man-pages/man2/unshare.2.html) ·
> [setns(2)](https://man7.org/linux/man-pages/man2/setns.2.html)

### /proc/[pid]/ns/ 인터페이스

각 심볼릭 링크는 `네임스페이스 종류:[inode 번호]` 형태이며, inode 번호가 같으면
같은 네임스페이스 소속이라는 뜻이다. 파일을 `open()`해서 얻은 fd를 열어두면
프로세스가 죽어도 네임스페이스가 유지되며, 이 fd를 `setns()`에 전달할 수 있다.

> 참고: [namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

### Namespace 생명주기

생성(`clone`/`unshare`) → 공유(`fork` 시 참조 카운트 증가) → 유지(fd/바인드
마운트로 pin) → 해제(참조 카운트 0).

**운영 팁**: `docker exec`로 네임스페이스 fd를 오래 열어두면, 컨테이너가 죽어도
네임스페이스가 회수되지 않는 누수가 발생할 수 있다.

> 참고: [namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

---

## 4. 실습 및 실무 적용

```bash
# 새로 격리된 네임스페이스에서 셸 실행
unshare --pid --net --mount --uts --fork bash

# 실행 중인 프로세스(컨테이너)의 네임스페이스에 진입
nsenter -t <PID> -n -m bash
```

실무에서는 컨테이너 네트워크 트러블슈팅할 때 `nsenter`로 들어가서 `tcpdump`를
붙이는 방식을 자주 쓴다.

> 참고: [unshare(1)](https://man7.org/linux/man-pages/man1/unshare.1.html) ·
> [nsenter(1)](https://man7.org/linux/man-pages/man1/nsenter.1.html)

### Docker · Kubernetes에서의 Namespace

- Docker/containerd: `runc`가 `clone()` 플래그로 여러 Namespace를 한 번에 생성하고
  cgroup으로 자원을 제한한다. `docker run --network host`는 Network Namespace
  생성을 건너뛴다.
- Kubernetes: Pod 내 컨테이너들이 Network·IPC Namespace를 공유하며, 이를 담당하는
  것이 **pause 컨테이너(infra container)**다.
- `shareProcessNamespace: true`로 PID Namespace도 공유할 수 있다.

> 참고: [docs.docker.com — Host network driver](https://docs.docker.com/engine/network/drivers/host/) ·
> [kubernetes.io — Share Process Namespace](https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/)

---

## 5. 한계와 보안, 결론

### 운영에서 겪는 이슈와 근본적 한계

- **PID Namespace 고갈**: 좀비 프로세스가 많은 노드에서 새 컨테이너 생성이 실패할
  수 있다 (PID 최대값은 전역 자원).
- **Network Namespace 누수**: CNI 플러그인의 veth/netns 정리 실패로 IP가 고갈될
  수 있다.
- **근본 한계**: Namespace는 뷰의 격리일 뿐 커널 코드 자체는 공유된다. 커널
  취약점은 모든 컨테이너에 영향을 준다.

> 참고: [namespaces(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html) (`/proc/sys/user` 한도)

### 보안 고려사항

- User Namespace와 권한 상승: `CAP_SYS_ADMIN`을 가진 컨테이너가 새 User ns로
  호스트 권한 우회를 시도한 사례가 보고된 바 있다.
- **CVE-2019-5736 (runc)**: `/proc/self/exe` 조작으로 호스트 runc 바이너리를 덮어씀
- **CVE-2022-0185**: 커널 Filesystem Context 힙 오버플로로 Mount ns 경계를 넘는 권한 상승
- 방어: `seccomp` + AppArmor/SELinux + non-root 컨테이너 + 최소 Capability를
  Namespace와 함께 적용해야 실질적인 격리 효과를 얻는다.

> 참고: [nvd.nist.gov — CVE-2019-5736](https://nvd.nist.gov/vuln/detail/cve-2019-5736) ·
> [CVE-2022-0185](https://nvd.nist.gov/vuln/detail/CVE-2022-0185)

### 핵심 요약

1. Namespace는 뷰를 격리하고, cgroup은 사용량을 제한한다.
2. 8종의 Namespace가 `nsproxy`를 통해 프로세스에 연결되며, `clone`·`unshare`·`setns`로 제어된다.
3. 커널을 공유한다는 근본적 한계가 있으므로, 추가 보안 계층과 함께 적용해야 실질적인 격리가 완성된다.
