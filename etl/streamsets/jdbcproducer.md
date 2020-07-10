# jdbc 프로듀서

jdbc comsumer의 내용을 최종적으로 저장하는 역할을 하는 것을 jdbc 프로듀서라고 한다. jdbc consumer 대상을 사용하여 mssql server 변경 로그에서 변경 캡처 데이터를 쓸 수 있다.

jdbc consumer는 일치하는 field name으로 테이블에 데이터를 기록한다. mapping은 재정의가 가능하다.

배치를 쓰는 동안 오류가 발생하면 전체 배치를 롤백하는 스테이지를 구성할 수 있다. 

JDBC consumer는 sdc.operation.type 레코드 헤더 속성에 정의된 CRUD 조작을 사용하여 데이터를 쓸 수 있다. 
