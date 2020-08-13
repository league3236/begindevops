
# flask

설치
```
$ pip install flask

or

$ pip3 install flask
```

app.py 만들기
```
from flask import Flask

app = Flask(__name__)
@app.route("/")
def hello():                           
    return "<h1>Hello World!</h1>"

@app.route("/hello")
def hello_flask():
    return "<h1>Hello Flash!</h1>"

@app.route("/first")
def hello_first():
    return "<h3>Hello First</h3>"

if __name__ == "__main__":              
    app.run(host="0.0.0.0", port="8080")
```

실행
```
$ python3 app.py

 * Serving Flask app "app" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://0.0.0.0:8080/ (Press CTRL+C to quit)
```

각 resource로 접근 테스트
- localhost:8080
- localhost:8080/hello
- localhost:8080/first


## flask 와 mysql 연동 테스트


## mysql on docker

docker file
```
FROM oraclelinux:7-slim
ENV PACKAGE_URL https://repo.mysql.com/yum/mysql-8.0-community/docker/x86_64/mysql-community-server-minimal-8.0.2-0.1.dmr.el7.x86_64.rpm

# Install server
RUN rpmkeys --import http://repo.mysql.com/RPM-GPG-KEY-mysql \
  && yum install -y $PACKAGE_URL \
  && yum install -y libpwquality \
  && rm -rf /var/cache/yum/*
RUN mkdir /docker-entrypoint-initdb.d

VOLUME /var/lib/mysql

COPY docker-entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 3306 33060
CMD ["mysqld"]
```

version 8.0
```
$ docker run --name=mymysql -v ./{mydatadirectory}:/var/lib/mysql -p 3306:3306 -d mysql/mysql-server:8.0
```

log check
```
$ docker logs mymysql
```

password check

아래의 password는 W3lUMk3s9eNmInyb4lyw.YS1iq0
```
$ docker logs mymysql 2>&1 | grep GENERATED

example)
[Entrypoint] GENERATED ROOT PASSWORD: W3lUMk3s9eNmInyb4lyw.YS1iq0
```

container 안에 있는 mysql 접근
```
$ docker exec -it mymysql mysql -uroot -p
```

비밀번호 초기화

password대신에 원하는 비밀번호를 넣어주면된다
다시 나갔다 들어오면 저장했던 데이터로 접근 가능하다

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```

### 테스트 db 생성

```
mysql> CREATE DATABASE study_db default CHARACTER SET UTF8;
Query OK, 1 row affected, 1 warning (0.00 sec)
```

```
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| study_db           |
| sys                |
+--------------------+
5 rows in set (0.00 sec)
```

### 데이터 베이스를 사용할 사용자 추가
study_db의 모든 권한을 leaguecat이라는 사용자에게 넘겨준다.
leaguecat의 사용자는 password에 정의한다.
해당 user는 아래 {ip} 에서만 연동 가능하다.
```
GRANT ALL PRIVILEGES ON study_db.* TO leaguecat@{ip} IDENTIFIED BY 'password';
```
- 슈퍼유저로 권한 할당
```
GRANT ALL PRIVILEGES on  *.*  to leaguecat@"%" IDENTIFIED BY '1234' WITH GRANT OPTION;
```


그런데 8.0 부터는 위의 방식이 아래와 같은 에러가 난다.
```
You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'IDENTIFIED BY '1234' WITH GRANT OPTION' at line 1
```
아래 내용을 참고하자 

[참고](https://ma.ttias.be/mysql-8-removes-shorthand-creating-user-permissions/)

- user 생성
id = leaguecat / password = 1234
```
CREATE USER 'leaguecat'@'%' IDENTIFIED BY '1234';

Query OK, 0 rows affected (0.01 sec)
```

- 권할 할당
```
GRANT ALL ON *.* TO 'leaguecat'@'%';

Query OK, 0 rows affected (0.01 sec)
```

- 컨테이너를 빠져나간뒤 ctrl+p+q or exit host os에서 진행
```
mysql> exit
Bye
```

- 접근 테스트(호스트에 mysql 이 설치되어 있어야함)
이때 localhost 대신에 나의 localhost ip를 할당해야함
```
mysql -u leaguecat -h {localhost ip} -p

example
$ mysql -u leaguecat -h 123.123.123.123 -p
Enter password:

Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 14
Server version: 8.0.21 MySQL Community Server - GPL
```

- db 접근
```
mysql> USE study_db;
```

- 테이블 생성
```
mysql> CREATE TABLE professor ( _id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(32) NOT NULL, belong VARCHAR(12) DEFAULT 'FOO', phone VARCHAR(12) ) ENGINE=INNODB; DESCRIBE professor;
```

- 데이터 삽입
```
mysql> INSERT INTO professor (name, belong, phone) VALUES('유재석', 'IDE','01112345678');

mysql> INSERT INTO professor (name, belong, phone) VALUES('황영조', 'MSE', '01121342443');
```

- 삽입된 데이터 확인
```
mysql> select * from professor;

+-----+-----------+--------+-------------+
| _id | name      | belong | phone       |
+-----+-----------+--------+-------------+
|   1 | 유재석    | IDE    | 01112345678 |
|   2 | 황영조    | MSE    | 01121342443 |
+-----+-----------+--------+-------------+
```

## app.py를 수정하여 데이터를 삽입하는 flask 만들기

## REF

- https://futurists.tistory.com/11 [미래학자]
- https://velog.io/@sungjun-jin/TIL-0524-Flask-mysql-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0