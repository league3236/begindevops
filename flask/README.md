
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


### mysql on docke

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
$ docker run --name=mymysql -d mysql/mysql-server:8.0
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
```
GRANT ALL PRIVILEGES ON study_db.* TO study_user@localhost IDENTIFIED BY 'study';
```


## REF

- 출처: https://futurists.tistory.com/11 [미래학자]