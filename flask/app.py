from flask import Flask, jsonify, request
from sqlalchemy import create_engine, text

app = Flask(__name__)
app.config.from_pyfile('config.py')

database = create_engine(app.config['DB_URL'], encoding = "utf-8")
app.database = database


@app.route("/professor", methods = ['POST'])
def insertdb():
    professor = request.json
    professor = app.database.execute(text("""
                                            INSERT INTO professor (
                                            name,
                                            belong,
                                            phone
                                           ) VALUES (
                                            :name,
                                            :belong,
                                            :phone
                                           )
                                            """), professor).lastrowid
    return "<h1>Insert DB POST API</h1>"

@app.route("/professor", methods = ['GET'])
def getinsertdb():
    return "<h1>Insert DB GET API</h1>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="8080")