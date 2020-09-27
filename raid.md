## ref
- https://harryp.tistory.com/806

# raid

RAID는 Redundant Array of Independent Disk(독립된 디스크의 복수 배열)
혹은 Redundant Array of Inexpensive Disk (저렴한 디스크의 복수 배열)의 약자이다.
말 그대로 RAID는 여러개의 디스크를 묶어 하나의 디스크처럼 사용하는 기술이다.

RAID를 사용하였을때 기대 효과는 

- 대용량의 단일 볼륨을 사용하는 효과
- 디스크 I/O 병렬화로 인한 성능 향상(RAID 0, RAID 5, RAID 6 등)
- 데이터 복제로 인한 안정성 향상 (RAID 1 등)

이 있다.

RAID는 컴퓨터를 구성하는 여러 부품(구성품) 중 기계적인 특성 때문에 상대적으로 속도가 느린 하드디스크를 보완하기 위해 만든 기술이다.

RAID를 구성하는 디스크의 개수가 같아도 , RAID의 구성 방식에 따라 성능, 용량이 바뀌게 된다. 이 구성 방식을 RAID Level (레이드 레벨) 이라고 부른다.

# Standard RAID Level

기본적인 RAID Level은 RAID 0 ~ RAID 6 까지 있지만, 최근 출시되는 RAID 컨트롤러에서 사용 가능한 RAID Level은 RAID 0, RAID 1, RAID 5, RAID 6 이다.

- RAID 0

Striping (스트라이핑) 이라고도 부르는 방식이다. RAID 0을 구성하기 위해서는 최소 2개의 디스크가 필요하다. (min(N) == 2) RAID를 구성하는 모든 디스크에 데이터를 분할하여 저장한다. 전체 디스크를 모두 동시에 사용하기 때문에 성능은 단일 디스크의 성능의 N배이다. 마찬가지로 용량 역시 단일 디스크의 용량의 N배가 된다. 